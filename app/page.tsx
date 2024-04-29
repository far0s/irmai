"use client";
import { useEffect } from "react";
import Header from "@/components/Header/Header";
import s from "./page.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import StageScreens from "@/components/Stage/Stage.utils";
import Footer from "@/components/Footer/Footer";
import Debug from "@/components/Debug/Debug";
import Transcript from "@/components/Transcript/Transcript";

const Home = () => {
  const { globalState, setShowTranscript } = useIrmaiStore((s) => s);

  useEffect(() => {
    setShowTranscript(false);
  }, []);

  return (
    <main className={s.page}>
      <Stage>
        {Object.entries(StageScreens).map(([key, Component]) => (
          <Component key={key} id={key} isActive={globalState === key} />
        ))}
      </Stage>
      <Header />
      <Transcript />
      <Footer />
      <Debug />
    </main>
  );
};

export default Home;
