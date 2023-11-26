// useRecorder hook

import { useState, useEffect, useRef } from 'react'
import { useAudioLevels } from './useAudioLevels'

type RecordingStates = 'idle' | 'recording' | 'paused' | 'stopped'

interface Recorder {
  audioLevel: number
  startRecording: () => void
  pauseRecording?: () => void
  resumeRecording?: () => void
  stopRecording: () => void
  resetRecording?: () => void
  timeElapsed: number
  recordingState: RecordingStates
  isRecording: boolean
  audioURL?: string
  audioFile?: File | null
  audioBlob?: Blob | null
}

const useRecorder = (): Recorder => {
  const [recordingState, setRecordingState] = useState<RecordingStates>('idle')
  const [audioURL, setAudioURL] = useState<string>('')
  const [time, setTime] = useState<number>(0)
  const [blob, setBlob] = useState<Blob | null>(null)
  const timerRef = useRef<number>()
  const mediaRecorderRef = useRef<MediaRecorder>()
  const audioLevel = useAudioLevels(recordingState === 'recording')
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // Function to start recording
  const startRecording = async () => {
    setRecordingState('recording')
    setTime(0)
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setBlob(blob)
      setAudioURL(URL.createObjectURL(blob))

      // FIXME: on safari, the blob is not playable because of the codec, or a missin moov atom at the end, it's unclear why
      // some openai forum threads:
      // https://community.openai.com/t/whisper-api-cannot-read-files-correctly/93420/54?page=2
      // https://community.openai.com/t/whisper-api-is-not-able-to-transcribe-audios-created-on-ios/457325
      // https://community.openai.com/t/whisper-api-respnse-issue/81552
      // potential solution would be to use a polyfill, such as https://github.com/ai/audio-recorder-polyfill
      // or to reencode the audio file on the server, using ffmpeg
      // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

      const audioFile = new File([blob], 'recorded_audio.webm', {
        type: 'audio/webm',
      })
      setAudioFile(audioFile)

      mediaRecorderRef.current &&
        mediaRecorderRef.current.stream.getTracks().forEach((track:any) => track.stop());
    }

    mediaRecorderRef.current.start()
  }

  // Function to pause recording
  const pauseRecording = () => {
    setRecordingState('paused')
    clearInterval(timerRef.current)
    mediaRecorderRef.current?.pause()
  }

  // Function to stop recording
  const resumeRecording = () => {
    setRecordingState('recording')
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
    mediaRecorderRef.current?.resume()
  }

  // Add a function to reset recording
  const resetRecording = () => {
    setRecordingState('idle')
    setAudioURL('')
    setTime(0)
  }

  const stopRecording = () => {
    setRecordingState('stopped')
    clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
  }

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return {
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    timeElapsed: time,
    recordingState,
    isRecording: recordingState === 'recording',
    audioURL,
    audioFile,
    audioBlob: blob,
  }
}

export default useRecorder