import React, { useEffect } from "react";
import useRecorder from "./useRecorder";

const Recorder = ({ setTranscript }: any) => {
  const {
    startRecording,
    stopRecording,
    resetRecording,
    audioURL,
    isRecording,
    audioFile,
  } = useRecorder();

  useEffect(() => {
    if (audioURL && audioFile) {
      convertAudioToTranscript(audioFile);
    }
  }, [audioURL, audioFile]);

  const convertAudioToTranscript = async (audioFile: any) => {
    const formData = new FormData();
    formData.append("file", audioFile);
    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => window.alert(err));
    if (response && response.text) {
      setTranscript(response.text);
    }
    if (resetRecording) {
      resetRecording();
    }
  };

  return (
    <div>
      {!isRecording && (
        <button
          className="w-full z-1 border border-gray-300 rounded-sm p-2 hover:bg-gray-100"
          onClick={startRecording}
        >
          Record
        </button>
      )}
      {isRecording && (
        <button
          className="w-full z-1 border border-gray-300 rounded-sm p-2 hover:bg-gray-100"
          onClick={stopRecording}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default Recorder;
