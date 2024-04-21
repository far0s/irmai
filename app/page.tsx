"use client";
import Header from "@/components/Header/Header";
import s from "./page.module.css";
import Stage from "@/components/Stage/Stage";
import StageScreens from "@/components/Stage/Stage.utils";
import Footer from "@/components/Footer/Footer";
import Debug from "@/components/Debug/Debug";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

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
                <button
                  key={key}
                  onClick={() => {
                    const keys = Object.keys(StageScreens);
                    const nextKey: any = keys[i + 1];
                    setGlobalState(nextKey || "splash");
                  }}
                >
                  go to next screen
                </button>
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
