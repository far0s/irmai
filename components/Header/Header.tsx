import TranscriptToggle from "@/components/TranscriptToggle/TranscriptToggle";
import Logo from "@/components/Logo/Logo";
import UserAudioFeedback from "@/components/UserAudioFeedback/UserAudioFeedback";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./header.module.css";

const Header = () => {
  const { globalState, isMicReady, reset } = useIrmaiStore((s) => s);
  const isSplash = globalState === "splash";

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  return (
    <header
      className={s.header}
      data-is-splash-active={isSplash}
      data-is-mic-ready={isMicReady}
    >
      <div className={s.headerRow}>
        <button className={s.logoShadow} onClick={handleReset}>
          shadow
        </button>
        <div className={s.logoWrapper}>
          <Logo />
        </div>
        <TranscriptToggle />
      </div>
      <UserAudioFeedback />
    </header>
  );
};

export default Header;
