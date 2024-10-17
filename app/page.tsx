"use client";
import { useEffect, Suspense, useState } from "react";
import { useAssistant } from "ai/react";

import Header from "@/components/Header/Header";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import Debug from "@/components/Debug/Debug";
import Transcript from "@/components/Transcript/Transcript";
import SplashScreen from "@/components/Screens/SplashScreen";
import IntroScreen from "@/components/Screens/IntroScreen";
import ChatScreen from "@/components/Screens/ChatScreen";
import OutroScreen from "@/components/Screens/OutroScreen";
import Background from "@/components/Background/Background";

import useTranscript from "@/hooks/use-transcript";

import s from "./page.module.css";

const Screens = {
  splash: SplashScreen,
  intro: IntroScreen,
  chat: ChatScreen,
  outro: OutroScreen,
};

const IrmaiHome = () => {
  const { globalState, setIsThinking, setAllCards } = useIrmaiStore((s) => s);

  const assistantProps = useAssistant({
    api: "/api/assistant",
  });

  useEffect(
    () => setIsThinking(assistantProps.status === "in_progress" || false),
    [assistantProps.status]
  );

  useEffect(() => {
    fetchAllTarotCards();
  }, []);

  const fetchAllTarotCards = async () =>
    await fetch("/api/tarot?n=50") // FIXME: above 50 cards, the page crashes after we select 3 cards
      .then((res) => res.json())
      .then((data) => setAllCards(data))
      .catch((err) => console.error(err));

  const transcript = useTranscript(assistantProps.messages);
  const [transcriptLength, setTranscriptLength] = useState<number>(0);

  useEffect(() => {
    transcript?.length > transcriptLength &&
      setTranscriptLength(transcript.length);
  }, [transcript]);

  return (
    <main className={s.page}>
      <Suspense>
        <div className={s.pageContainer}>
          <Stage>
            {Object.entries(Screens).map(([key, Component]) => (
              <Component
                key={key}
                isActive={globalState === key}
                assistantProps={assistantProps}
              />
            ))}
          </Stage>
          <Header />
          <Transcript assistantProps={assistantProps} />
        </div>

        <Debug />
        <Background transcriptLength={transcriptLength} />
      </Suspense>
    </main>
  );
};

export default IrmaiHome;
