import s from "./stage.module.css";
import TextBubble from "@/components/TextBubble/TextBubble";

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
      <h2 className={s.heading}>
        Ready to embark on a journey of self-discovery?
      </h2>
    </Screen>
  );
};

const LandingScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <TextBubble symbol="*">There is power within your fingertips</TextBubble>
    </Screen>
  );
};

const Intro1Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <TextBubble symbol="&">
        Pressing, holding, and speaking, will let you connect with your
        spiritual guide
      </TextBubble>
    </Screen>
  );
};

const Intro2Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>A reading starts with a small question to Irmai.</h2>
    </Screen>
  );
};

const Intro3Screen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <TextBubble symbol="?">
        Lorem ipsum dolor sit amet consectetur. Eget urna viverra sem felis
        lectus nibh. Leo amet ornare tempor sit nibh tellus pharetra. Senectus
        ipsum purus purus felis. Nec nunc nisl gravida volutpat quisque in.
      </TextBubble>
    </Screen>
  );
};

const AskingFocusScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>What’s your focus of this conversation?</h2>
    </Screen>
  );
};

const AskingTarotScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Shuffle Cards + results</h2>
    </Screen>
  );
};

const AskingQuestionScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>What is your question?</h2>
    </Screen>
  );
};

const AnsweringScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Answering...</h2>
    </Screen>
  );
};

const AnsweringFollowupScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2>Follow up question</h2>
    </Screen>
  );
};

const OutroScreen = ({ isActive }: { isActive: boolean }) => {
  return (
    <Screen isActive={isActive}>
      <h2 className={s.heading}>
        I hope you gained some insights from our convo!
      </h2>
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
