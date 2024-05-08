"use client";
import { useEffect } from "react";
import { useChat } from "ai/react";

import { prepareSystemPrompt } from "@/utils/prompts";
import { IChatProps } from "@/utils/shared-types";

import Header from "@/components/Header/Header";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import Debug from "@/components/Debug/Debug";
import Transcript from "@/components/Transcript/Transcript";
import SplashScreen from "@/components/Screens/SplashScreen";
import LandingScreen from "@/components/Screens/LandingScreen";
import FocusScreen from "@/components/Screens/FocusScreen";
import TarotScreen from "@/components/Screens/TarotScreen";
import QuestionScreen from "@/components/Screens/QuestionScreen";
import OutroScreen from "@/components/Screens/OutroScreen";
import Background from "@/components/Background/Background";

import s from "./page.module.css";

const Screens = {
  splash: SplashScreen,
  landing: LandingScreen,
  // focus: FocusScreen,
  // tarot: TarotScreen,
  // question: QuestionScreen,
  // outro: OutroScreen,
};

const IrmaiHome = () => {
  const { globalState, setIsThinking } = useIrmaiStore((s) => s);

  /* const chatProps: IChatProps = useChat({
    api: "/api/chat",
  });

  useEffect(
    () => setIsThinking(chatProps.isLoading || false),
    [chatProps.isLoading]
  ); */

  return (
    <main className={s.page}>
      <div className={s.pageContainer}>
        <Stage>
          {Object.entries(Screens).map(([key, Component]) => (
            <Component
              key={key}
              isActive={globalState === key}
              // chatProps={chatProps}
            />
          ))}
        </Stage>
        <Header />
        {/* <Transcript chatProps={chatProps} /> */}
      </div>

      <Debug />
      <Background />
    </main>
  );
};

export default IrmaiHome;
