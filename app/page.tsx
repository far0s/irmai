"use client";
import Header from "@/components/Header/Header";
import s from "./page.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import StageScreens from "@/components/Stage/Stage.utils";
import Footer from "@/components/Footer/Footer";
import Debug from "@/components/Debug/Debug";

const Home = () => {
  const { globalState } = useIrmaiStore((s) => s);

  return (
    <main className={s.page}>
      <Stage>
        {Object.entries(StageScreens).map(([key, Component]) => (
          <Component key={key} id={key} isActive={globalState === key} />
        ))}
      </Stage>
      <Header />
      <Footer />
      <Debug />
    </main>
  );
};

export default Home;
