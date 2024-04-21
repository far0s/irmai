import s from "./stage.module.css";

const Screen = ({
  isActive,
  children,
}: {
  isActive: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={s.screen} data-is-active={isActive}>
      {children}
    </div>
  );
};

const SplashScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Splash</h2>
    </Screen>
  );
};

const LandingScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Landing</h2>
    </Screen>
  );
};

const Intro1Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Intro 1</h2>
    </Screen>
  );
};

const Intro2Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Intro 2</h2>
    </Screen>
  );
};

const Intro3Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Intro 3</h2>
    </Screen>
  );
};

const AskingFocusScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Asking Focus</h2>
    </Screen>
  );
};

const AskingTarotScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Asking Tarot</h2>
    </Screen>
  );
};

const AskingQuestionScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Asking Question</h2>
    </Screen>
  );
};

const AnsweringScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Answering</h2>
    </Screen>
  );
};

const AnsweringFollowupScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Answering Followup</h2>
    </Screen>
  );
};

const OutroScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Outro</h2>
    </Screen>
  );
};

const StageScreens = {
  splash: SplashScreen,
  landing: LandingScreen,
  intro1: Intro1Screen,
  intro2: Intro2Screen,
  intro3: Intro3Screen,
  "asking-focus": AskingFocusScreen,
  "asking-tarot": AskingTarotScreen,
  "asking-question": AskingQuestionScreen,
  answering: AnsweringScreen,
  "answering-followup": AnsweringFollowupScreen,
  outro: OutroScreen,
};

export default StageScreens;
