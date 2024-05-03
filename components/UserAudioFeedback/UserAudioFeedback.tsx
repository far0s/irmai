import { useEffect } from "react";

import { useAudioLevels } from "@/hooks/use-audio-levels";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./userAudioFeedback.module.css";

const UserAudioFeedback = () => {
  const { isListening } = useIrmaiStore((s) => s);

  const audioLevels = useAudioLevels(isListening);

  useEffect(() => {
    const spans = document.querySelectorAll(`.${s.userAudioLevels} span`);
    if (audioLevels && spans.length) {
      spans.forEach((span: any) => {
        span.style.transform = `scaleY(${audioLevels / 50})`;
      });
    } else {
      spans.forEach((span: any) => {
        span.style.transform = `scaleY(0)`;
      });
    }
  }, [audioLevels]);

  return (
    <div className={s.audioFeedback}>
      <div className={s.userAudioLevels} data-is-listening={isListening}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default UserAudioFeedback;
