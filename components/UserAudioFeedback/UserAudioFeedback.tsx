import { useEffect, useState } from "react";

import useAudioLevels from "@/hooks/use-audio-levels";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./userAudioFeedback.module.css";

const minLevels: number = 16;
const scale: number = 200;

const generateUserAudioLevels = (
  audioLevels: Uint8Array,
  numLevels: number
) => {
  return [...Array(numLevels)].map((_, i) => (
    <span
      key={i}
      style={{
        transform: audioLevels?.[i]
          ? `scaleY(${audioLevels[i] / scale})`
          : `scaleY(0)`,
      }}
    />
  ));
};

const UserAudioFeedback = () => {
  const { globalState, setIsMicReady, isListening } = useIrmaiStore((s) => s);
  const [numLevels, setNumLevels] = useState<number>(16);

  const isNotSplash = globalState !== "splash";

  const audioLevels: Uint8Array | null = useAudioLevels({
    isOn: isListening,
    numLevels: numLevels,
    setIsMicReady: setIsMicReady,
  });

  const reverseAudioLevels = audioLevels
    ? audioLevels.slice(1, numLevels).reverse()
    : null;

  useEffect(() => {
    const handleResize = () => {
      if (isListening) {
        const wrapper: HTMLDivElement | null = document.querySelector(
          `.${s.audioFeedback}`
        );
        const nums = wrapper
          ? Math.min(Math.floor(wrapper.offsetWidth / minLevels), 32)
          : minLevels;
        setNumLevels(nums);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={s.audioFeedback} data-is-not-splash-active={isNotSplash}>
      <div className={s.userAudioLevels} data-is-listening={isListening}>
        {reverseAudioLevels &&
          generateUserAudioLevels(reverseAudioLevels, numLevels - 1)}
        {audioLevels && generateUserAudioLevels(audioLevels, numLevels)}
      </div>
    </div>
  );
};

export default UserAudioFeedback;
