import { useEffect, useState } from "react";

import useAudioLevels from "@/hooks/use-audio-levels";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./userAudioFeedback.module.css";

const minLevels: number = 16;
const scale: number = 200;

const UserAudioFeedback = () => {
  const { isListening } = useIrmaiStore((s) => s);
  const [numLevels, setNumLevels] = useState<number>(16);

  const audioLevels: Uint8Array | null = useAudioLevels({
    isOn: isListening,
    numLevels: numLevels,
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
    <div className={s.audioFeedback}>
      <div className={s.userAudioLevels} data-is-listening={isListening}>
        {reverseAudioLevels &&
          [...Array(numLevels - 1)].map((_, i): any => (
            <span
              key={i}
              style={{
                transform: reverseAudioLevels?.[i]
                  ? `scaleY(${reverseAudioLevels[i] / scale})`
                  : `scaleY(0)`,
              }}
            />
          ))}
        {audioLevels &&
          [...Array(numLevels)].map((_, i) => (
            <span
              key={i}
              style={{
                transform: audioLevels?.[i]
                  ? `scaleY(${audioLevels[i] / scale})`
                  : `scaleY(0)`,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default UserAudioFeedback;
