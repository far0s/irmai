import TranscriptToggle from "@/components/TranscriptToggle/TranscriptToggle";
import Logo from "@/components/Logo/Logo";
import UserAudioFeedback from "@/components/UserAudioFeedback/UserAudioFeedback";

import s from "./header.module.css";

const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.headerRow}>
        <Logo />
        <TranscriptToggle />
      </div>
      <UserAudioFeedback />
    </header>
  );
};

export default Header;
