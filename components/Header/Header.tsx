import TranscriptToggle from "@/components/TranscriptToggle/TranscriptToggle";
import Logo from "@/components/Logo/Logo";
import UserAudioFeedback from "@/components/UserAudioFeedback/UserAudioFeedback";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./header.module.css";

const Header = () => {
  const { globalState } = useIrmaiStore((s) => s);
  const isSplash = globalState === "splash";

  return (
    <header className={s.header} data-is-splash-active={isSplash}>
      <div className={s.headerRow}>
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
