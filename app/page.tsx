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

const Home = () => {
  const { globalState, setShowTranscript, setIsThinking } = useIrmaiStore(
    (s) => s
  );

  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
    });

  const chatProps = {
    input,
    messages,
    isLoading,
    handleInputChange,
    handleSubmit,
  };

  useEffect(() => {
    setShowTranscript(false);
    const transcriptElem = document.querySelector("[class*='transcriptInner']");
    transcriptElem && transcriptElem.scrollTo(0, 0);
  }, []);

  useEffect(() => setIsThinking(isLoading), [isLoading]);

  return (
    <main className={s.page}>
      <Stage>
        {Object.entries(StageScreens).map(([key, Component]) => (
          <Component key={key} id={key} isActive={globalState === key} />
        ))}
      </Stage>
      <Header />
      <Transcript />
      <Debug />
    </main>
  );
};

export default Home;
