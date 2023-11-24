// 'use client';
import React, { useEffect } from 'react';
import useRecorder from './useRecorder';

const Recorder = ({ setTranscript }) => {
  const { startRecording, stopRecording, audioURL, isRecording, audioFile } = useRecorder();

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    if (audioURL && audioFile) {
      convertAudioToTranscript(audioFile);
    }
  }, [audioURL, audioFile])

  const convertAudioToTranscript = async (audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile);
    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => window.alert(err));
    setTranscript(response.text);
  };

  return (
    <div>
      {!isRecording && <button className="w-full z-1 border border-gray-300 rounded p-2 hover:bg-gray-100" onClick={handleStartRecording}>Record</button>}
      {isRecording && <button className="w-full z-1 border border-gray-300 rounded p-2 hover:bg-gray-100" onClick={handleStopRecording}>Stop</button>}
    </div>
  )
};

export default Recorder;