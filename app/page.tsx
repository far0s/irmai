"use client";
import Header from "@/components/Header/Header";
import s from "./page.module.css";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import Stage from "@/components/Stage/Stage";
import StageScreens from "@/components/Stage/Stage.utils";
import Footer from "@/components/Footer/Footer";
import Debug from "@/components/Debug/Debug";
import PressAndHoldCTA from "@/components/PressAndHoldCTA/PressAndHoldCTA";

const Home = () => {
  const { globalState, setGlobalState } = useIrmaiStore((s) => s);

  return (
    <main className={s.page}>
      <Header />
      <Stage>
        {Object.entries(StageScreens).map(([key, Component]) => (
          <Component key={key} isActive={globalState === key} />
        ))}

        <div>
          {Object.entries(StageScreens).map(
            ([key], i) =>
              globalState === key && (
                <PressAndHoldCTA
                  key={key}
                  onBeginPress={() => {
                    console.log("onBeginPress", key);
                  }}
                  onEndPress={() => {
                    const keys = Object.keys(StageScreens);
                    const nextKey: any = keys[i + 1];
                    setGlobalState(nextKey || "splash");
                  }}
                />
              )
          )}
        </div>
      </Stage>
      <Footer />
      <Debug />
    </main>
  );
};

export default Home;
