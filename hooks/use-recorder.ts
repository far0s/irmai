// useRecorder hook
import { useState, useEffect, useRef } from "react";

type RecordingStates = "idle" | "recording" | "paused" | "stopped";

interface Recorder {
  startRecording: () => void;
  pauseRecording?: () => void;
  resumeRecording?: () => void;
  stopRecording: () => void;
  resetRecording?: () => void;
  timeElapsed: number;
  recordingState: RecordingStates;
  isRecording: boolean;
  audioURL?: string;
  audioFile?: File | null;
  audioBlob?: Blob | null;
}

const useRecorder = (): Recorder => {
  const [recordingState, setRecordingState] = useState<RecordingStates>("idle");
  const [audioURL, setAudioURL] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const timerRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Function to start recording
  const startRecording = async () => {
    setRecordingState("recording");
    setTime(1000);
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    console.log("startRecording");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/mp3" });
      setBlob(blob);
      setAudioURL(URL.createObjectURL(blob));

      const audioFile = new File([blob], "recorded_audio.mp3", {
        type: "audio/mp3",
      });
      setAudioFile(audioFile);

      mediaRecorderRef.current &&
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track: any) => track.stop());
    };

    // Here we start at 1000ms to avoid the empty audio bug that happens on iOS
    // see https://community.openai.com/t/whisper-problem-with-audio-mp4-blobs-from-safari/322252
    // and https://community.openai.com/t/whisper-api-completely-wrong-for-mp4/289256 for more info
    mediaRecorderRef.current.start(1000);
  };

  // Function to pause recording
  const pauseRecording = () => {
    setRecordingState("paused");
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.pause();
  };

  // Function to stop recording
  const resumeRecording = () => {
    setRecordingState("recording");
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    mediaRecorderRef.current?.resume();
  };

  // Add a function to reset recording
  const resetRecording = () => {
    setRecordingState("idle");
    setAudioURL("");
    setTime(1000);
  };

  const stopRecording = () => {
    setRecordingState("stopped");
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    timeElapsed: time,
    recordingState,
    isRecording: recordingState === "recording",
    audioURL,
    audioFile,
    audioBlob: blob,
  };
};

export default useRecorder;
