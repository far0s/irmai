"use client";
import { useEffect } from "react";
import { useChat } from "ai/react";
import s from "./page.module.css";
import Header from "@/components/Header/Header";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage, { StageScreens } from "@/components/Stage/Stage";
import Debug from "@/components/Debug/Debug";
import Transcript from "@/components/Transcript/Transcript";
import { prepareSystemPrompt } from "@/utils";
import { IChatProps } from "@/utils/shared-types";

const IrmaiHome = () => {
  const { globalState, setShowTranscript, setIsThinking } = useIrmaiStore(
    (s) => s
  );

  const chatProps: IChatProps = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    setShowTranscript(false);
    const transcriptElem = document.querySelector("[class*='transcriptInner']");
    transcriptElem && transcriptElem.scrollTo(0, 0);
  }, []);

  useEffect(
    () => setIsThinking(chatProps.isLoading || false),
    [chatProps.isLoading]
  );

  useEffect(() => {
    prepareSystemPrompt(chatProps.append);
  }, []);

  return (
    <main className={s.page}>
      <Stage>
        {Object.entries(StageScreens).map(([key, Component]) => (
          <Component
            key={key}
            id={key}
            isActive={globalState === key}
            chatProps={chatProps}
          />
        ))}
      </Stage>
      <Header />
      <Transcript chatProps={chatProps} />
      <Debug />
    </main>
  );
};

export default IrmaiHome;
