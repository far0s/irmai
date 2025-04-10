"use client";
import { useEffect, Suspense, useState, useMemo, memo } from "react";
import { useAssistant } from "@ai-sdk/react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

import Header from "@/components/Header/Header";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import Transcript from "@/components/Transcript/Transcript";
import SplashScreen from "@/components/Screens/SplashScreen";
import IntroScreen from "@/components/Screens/IntroScreen";
import ChatScreen from "@/components/Screens/ChatScreen";
import OutroScreen from "@/components/Screens/OutroScreen";
import { CardDrawerProvider } from "@/components/CardDrawer/CardDrawer";

import useTranscript from "@/hooks/use-transcript";

import s from "./page.module.css";

// Dynamically import heavy components
const Background = dynamic(() => import("@/components/Background/Background"), {
  ssr: false,
});

const Debug = dynamic(() => import("@/components/Debug/Debug"), {
  ssr: false,
});

const Screens = {
  splash: SplashScreen,
  intro: IntroScreen,
  chat: ChatScreen,
  outro: OutroScreen,
};

// Pre-memoize screen components
const MemoizedScreens = Object.fromEntries(
  Object.entries(Screens).map(([key, Component]) => [key, memo(Component)])
);

const IrmaiHome = () => {
  const globalState = useIrmaiStore((s) => s.globalState);
  const setAllCards = useIrmaiStore((s) => s.setAllCards);
  const hideApp = useIrmaiStore((s) => s.hideApp);
  const setHideApp = useIrmaiStore((s) => s.setHideApp);

  const assistantProps = useAssistant({
    api: "/api/assistant",
  });

  useEffect(() => {
    fetchAllTarotCards();
  }, []);

  const fetchAllTarotCards = async () =>
    await fetch("/api/tarot?n=50")
      .then((res) => res.json())
      .then((data) => setAllCards(data))
      .catch((err) => console.error(err));

  const transcript = useTranscript(
    assistantProps.messages,
    globalState
      ? assistantProps.messages[assistantProps.messages.length - 1]
      : null
  );
  const [transcriptLength, setTranscriptLength] = useState<number>(0);

  useEffect(() => {
    transcript?.length > transcriptLength &&
      setTranscriptLength(transcript.length);
  }, [transcript]);

  // Memoize stage content to prevent unnecessary re-renders
  const stageContent = useMemo(
    () => (
      <Stage>
        {Object.entries(MemoizedScreens).map(([key, Component]) => (
          <Component
            key={key}
            isActive={globalState === key}
            assistantProps={assistantProps}
          />
        ))}
      </Stage>
    ),
    [globalState, assistantProps]
  );

  return (
    <CardDrawerProvider>
      <main className={s.page}>
        <Suspense>
          <motion.div
            className={s.pageContainer}
            animate={{
              opacity: hideApp ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 100,
            }}
            onClick={() => hideApp && setHideApp(false)}
          >
            {stageContent}
            <Header />
            <Transcript />
          </motion.div>

          {/* Separate suspense boundaries for non-critical components */}
          <Suspense fallback={null}>
            <Debug />
          </Suspense>
          <Suspense fallback={null}>
            <Background transcriptLength={transcriptLength} />
          </Suspense>
        </Suspense>
      </main>
    </CardDrawerProvider>
  );
};

export default memo(IrmaiHome);
