import TranscriptToggle from "@/components/TranscriptToggle/TranscriptToggle";
import HideToggle from "@/components/HideToggle/HideToggle";
import Logo from "@/components/Logo/Logo";
import UserAudioFeedback from "@/components/UserAudioFeedback/UserAudioFeedback";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./header.module.css";

const Header = () => {
  const { globalState, isReadyToAskForMic, isMicReady, reset } = useIrmaiStore(
    (s) => s
  );
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

        <HideToggle />
        <TranscriptToggle />
      </div>
      {isReadyToAskForMic && <UserAudioFeedback />}
    </header>
  );
};

export default Header;
