import { useEffect, useState } from "react";

const getAudioLevel = (analyser: AnalyserNode, setAudioLevel: any) => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const average = sum / dataArray.length;
  setAudioLevel(average);
  requestAnimationFrame(() => getAudioLevel(analyser, setAudioLevel));
};

export const useAudioLevels = (isRecording: boolean) => {
  const [audioLevel, setAudioLevel] = useState(0);
  let audioContext: AudioContext;
  let analyser: AnalyserNode;
  let source: MediaStreamAudioSourceNode;

  useEffect(() => {
    if (!isRecording) return;

    const handleSuccess = (stream: MediaStream) => {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      source.connect(analyser);

      getAudioLevel(analyser, setAudioLevel);
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);

    return () => {
      source?.disconnect();
      analyser?.disconnect();
      audioContext?.close();
    };
  }, [isRecording]);

  return audioLevel;
};
