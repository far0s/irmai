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
import FirstQuestionScreen from "@/components/Screens/FirstQuestionScreen";
import TarotScreen from "@/components/Screens/TarotScreen";
import DiscussionScreen from "@/components/Screens/DiscussionScreen";
import OutroScreen from "@/components/Screens/OutroScreen";

import s from "./page.module.css";

const Screens = {
  splash: SplashScreen,
  landing: LandingScreen,
  firstQuestion: FirstQuestionScreen,
  tarot: TarotScreen,
  discussion: DiscussionScreen,
  outro: OutroScreen,
};

const IrmaiHome = () => {
  const { globalState, setIsThinking, setAllCards } = useIrmaiStore((s) => s);

  const chatProps: IChatProps = useChat({
    api: "/api/chat",
  });

  useEffect(
    () => setIsThinking(chatProps.isLoading || false),
    [chatProps.isLoading]
  );

  useEffect(() => {
    prepareSystemPrompt(chatProps.append);
    fetchAllTarotCards();
  }, []);

  const fetchAllTarotCards = async () =>
    await fetch("/api/tarot")
      .then((res) => res.json())
      .then((data) => setAllCards(data))
      .catch((err) => console.error(err));

  return (
    <main className={s.page}>
      <div className={s.pageContainer}>
        <Stage>
          {Object.entries(Screens).map(([key, Component]) => (
            <Component
              key={key}
              isActive={globalState === key}
              chatProps={chatProps}
            />
          ))}
        </Stage>
        <Header />
        <Transcript chatProps={chatProps} />
      </div>

      <Debug />
    </main>
  );
};

export default IrmaiHome;
