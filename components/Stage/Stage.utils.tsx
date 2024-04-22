"use client";
import s from "./stage.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

import SplashScreen from "./Screens/SplashScreen";
import LandingScreen from "./Screens/LandingScreen";

export const Screen = ({
  isActive,
  id,
  children,
}: {
  isActive: boolean;
  id: string;
  children: React.ReactNode;
}) => {
  return (
    <div id={id} className={s.screen} data-is-active={isActive}>
      {children}
    </div>
  );
};

const IntroScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <p>A reading starts with a small question to irmai.</p>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("asking-focus")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingFocusScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>What’s your focus of this conversation?</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("asking-tarot")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingTarotScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Shuffle Cards + results</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("asking-question")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AskingQuestionScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>What is your question?</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("answering")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AnsweringScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Answering...</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("answering-followup")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const AnsweringFollowupScreen = ({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Follow up question</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("outro")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const OutroScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2 className={s.heading}>
        I hope you gained some insights from our convo!
      </h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("landing")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const StageScreens = {
  splash: SplashScreen,
  landing: LandingScreen,
  intro: IntroScreen,
  "asking-focus": AskingFocusScreen,
  "asking-tarot": AskingTarotScreen,
  "asking-question": AskingQuestionScreen,
  answering: AnsweringScreen,
  "answering-followup": AnsweringFollowupScreen,
  outro: OutroScreen,
};

export default StageScreens;
