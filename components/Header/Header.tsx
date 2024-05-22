import TranscriptToggle from "@/components/TranscriptToggle/TranscriptToggle";
import Logo from "@/components/Logo/Logo";
import UserAudioFeedback from "@/components/UserAudioFeedback/UserAudioFeedback";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./header.module.css";

const Header = () => {
  const { globalState, isReadyToAskForMic, isMicReady, reset } = useIrmaiStore(
    (s) => s
  );
  const isSplash = globalState === "splash";

  return (
    <header
      className={s.header}
      data-is-splash-active={isSplash}
      data-is-mic-ready={isMicReady}
    >
      <div className={s.headerRow}>
        <button className={s.logoShadow} onClick={reset}>
          shadow
        </button>
        <div className={s.logoWrapper}>
          <Logo />
        </div>
        <TranscriptToggle />
      </div>
      {isReadyToAskForMic && <UserAudioFeedback />}
    </header>
  );
};

export default Header;
