"use client";
import s from "./stage.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

import SplashScreen from "./Screens/SplashScreen";
import LandingScreen from "./Screens/LandingScreen";
import FocusScreen from "./Screens/FocusScreen";

export const Screen = ({
  isActive,
  id,
  children,
}: {
  isActive: boolean;
  id: string;
  children?: React.ReactNode;
}) => {
  return (
    <div id={id} className={s.screen} data-is-active={isActive}>
      {children}
    </div>
  );
};

const TarotScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Shuffle Cards + results</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("question")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const QuestionScreen = ({
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
        onEndPress={() => setGlobalState("reading")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const ReadingScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { setGlobalState } = useIrmaiStore((s) => s);

  return (
    <Screen id={id} isActive={isActive}>
      <h2>Answering...</h2>

      <PressAndHoldCTA
        onEndPress={() => setGlobalState("followup")}
        pressDuration={2000}
      />
    </Screen>
  );
};

const FollowupScreen = ({
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
  focus: FocusScreen,
  tarot: TarotScreen,
  question: QuestionScreen,
  reading: ReadingScreen,
  followup: FollowupScreen,
  outro: OutroScreen,
};

export default StageScreens;
