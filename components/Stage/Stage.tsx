"use client";
import { IChatProps } from "@/utils/shared-types";

import SplashScreen from "@/components/Screens/SplashScreen";
import LandingScreen from "@/components/Screens/LandingScreen";
import FocusScreen from "@/components/Screens/FocusScreen";
import TarotScreen from "@/components/Screens/TarotScreen";
import QuestionScreen from "@/components/Screens/QuestionScreen";
import OutroScreen from "@/components/Screens/OutroScreen";

import s from "./stage.module.css";

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

export const StageScreens = {
  splash: SplashScreen,
  landing: LandingScreen,
  focus: FocusScreen,
  tarot: TarotScreen,
  question: QuestionScreen,
  outro: OutroScreen,
};

const Stage = ({ children }: { children: React.ReactNode }) => {
  return <div className={s.stage}>{children}</div>;
};

export default Stage;
