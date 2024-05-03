"use client";
import { useEffect } from "react";
import Header from "@/components/Header/Header";
import s from "./page.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import StageScreens from "@/components/Stage/Stage.utils";
import Debug from "@/components/Debug/Debug";
import Transcript from "@/components/Transcript/Transcript";
import { useChat } from "ai/react";
import { IChatProps } from "@/utils/shared-types";
import { prepareSystemPrompt } from "@/utils/utils";

const Home = () => {
  const { globalState, setShowTranscript, setIsThinking } = useIrmaiStore(
    (s) => s
  );

  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    api: "/api/chat",
  });

  const chatProps: IChatProps = {
    input,
    messages,
    isLoading,
    handleInputChange,
    handleSubmit,
    append,
  };

  useEffect(() => {
    setShowTranscript(false);
    const transcriptElem = document.querySelector("[class*='transcriptInner']");
    transcriptElem && transcriptElem.scrollTo(0, 0);
  }, []);

  useEffect(() => setIsThinking(isLoading), [isLoading]);

  useEffect(() => {
    prepareSystemPrompt(append);
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

export default Home;
