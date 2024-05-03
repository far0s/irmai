"use client";
import s from "./stage.module.css";
import { IChatProps } from "@/utils/shared-types";

import SplashScreen from "./Screens/SplashScreen";
import LandingScreen from "./Screens/LandingScreen";
import FocusScreen from "./Screens/FocusScreen";
import TarotScreen from "./Screens/TarotScreen";
import QuestionScreen from "./Screens/QuestionScreen";
import OutroScreen from "./Screens/OutroScreen";

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

const StageScreens = {
  splash: SplashScreen,
  landing: LandingScreen,
  focus: FocusScreen,
  tarot: TarotScreen,
  question: QuestionScreen,
  outro: OutroScreen,
};

export default StageScreens;
