"use client";
import s from "./stage.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

import SplashScreen from "./Screens/SplashScreen";
import LandingScreen from "./Screens/LandingScreen";
import FocusScreen from "./Screens/FocusScreen";
import TarotScreen from "./Screens/TarotScreen";
import QuestionScreen from "./Screens/QuestionScreen";
import { IChatProps } from "@/utils/shared-types";

export const Screen = ({
  isActive,
  id,
  chatProps,
  children,
}: {
  isActive: boolean;
  id: string;
  chatProps?: IChatProps;
  children?: React.ReactNode;
}) => {
  return (
    <div id={id} className={s.screen} data-is-active={isActive}>
      {children}
    </div>
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
