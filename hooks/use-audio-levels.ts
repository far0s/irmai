import { useState, useEffect, useRef } from "react";

function useAudioLevels({
  isReady = false,
  isOn = false,
  audioRef,
  numLevels = 64,
  setIsMicReady,
}: {
  isReady?: boolean;
  isOn: boolean;
  audioRef?: MediaStreamAudioSourceNode | any;
  numLevels?: number;
  setIsMicReady?: (isReady: boolean) => void;
}) {
  const [audioLevels, setAudioLevels] = useState<Uint8Array | null>(
    new Uint8Array(numLevels)
  );
  const rafId = useRef<number | any>(null);
  const analyserNode = useRef<AnalyserNode | any>(null);
  const audioSource = useRef<MediaStreamAudioSourceNode | any>(null);

  useEffect(() => {
    if (!isReady) return;
    let cleanup = () => {};

    async function initAudioSource() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioSource.current = new MediaStreamAudioSourceNode(
          new AudioContext(),
          { mediaStream: stream }
        );
        analyserNode.current = audioSource.current.context.createAnalyser();
        analyserNode.current.fftSize = 256;
        audioSource.current.connect(analyserNode.current);
        setIsMicReady && setIsMicReady(true);

        cleanup = () => {
          rafId.current && cancelAnimationFrame(rafId.current);
          analyserNode.current &&
            audioSource.current?.disconnect(analyserNode.current);
          audioSource.current?.context.close();
          stream.getTracks().forEach((track) => track.stop());
          setIsMicReady && setIsMicReady(false);
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    if (audioRef?.current) {
      audioSource.current = audioRef.current;
      analyserNode.current = audioRef.current.context.createAnalyser();
      analyserNode.current.fftSize = 256;
      audioSource.current.connect(analyserNode.current);

      cleanup = () => {
        cancelAnimationFrame(rafId.current);
        audioSource.current.disconnect(analyserNode.current);
        audioSource.current.context.close();
      };
    } else {
      initAudioSource();
    }

    return cleanup;
  }, [isReady, isOn, audioRef, numLevels]);

  function updateAudioLevels() {
    const bufferLength = analyserNode.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.current.getByteFrequencyData(dataArray);

    const levels = new Uint8Array(numLevels);
    for (let i = 0; i < numLevels; i++) {
      const startIndex = (i * bufferLength) / numLevels;
      const endIndex = ((i + 1) * bufferLength) / numLevels;
      let max = 0;
      for (let j = startIndex; j < endIndex; j++) {
        max = Math.max(max, dataArray[Math.floor(j)]);
      }
      levels[i] = max;
    }
    setAudioLevels(levels);

    rafId.current = requestAnimationFrame(updateAudioLevels);
  }

  useEffect(() => {
    analyserNode.current && isOn && updateAudioLevels();
  }, [analyserNode.current, isOn]);

  return audioLevels;
}

export default useAudioLevels;
