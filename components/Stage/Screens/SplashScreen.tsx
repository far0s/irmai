"use client";
import { useEffect } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "../Stage.utils";

const SplashScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const { globalState, setGlobalState, hasSeenSplash, setHasSeenSplash } =
    useIrmaiStore((s) => s);

  useEffect(() => {
    if (globalState !== "splash") {
      return;
    }
    if (hasSeenSplash) {
      return setGlobalState("landing");
    }

    setHasSeenSplash(true);

    setTimeout(() => setGlobalState("landing"), 1800);
  }, [globalState]);

  return (
    <Screen id={id} isActive={isActive}>
      <span
        style={{
          display: "none",
          visibility: "hidden",
        }}
      >
        irmai welcomes you
      </span>
    </Screen>
  );
};

export default SplashScreen;
