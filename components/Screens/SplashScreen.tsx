import { useEffect, useState } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";

const SplashScreen = ({ isActive }: { isActive: boolean }) => {
  const {
    globalState,
    setGlobalState,
    setIsReadyToAskForMic,
    isMicReady,
    hasSeenSplash,
    setHasSeenSplash,
  } = useIrmaiStore((s) => s);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // this is called on load
    if (globalState !== "splash") return;
    if (hasSeenSplash) return setGlobalState("landing");
    setShowSplash(true);

    window.setTimeout(() => {
      setIsReadyToAskForMic(true);
    }, 4000);
  }, [globalState]);

  useEffect(() => {
    // this is called when ready
    if (globalState !== "splash") return;
    if (!isMicReady) return;

    window.setTimeout(() => {
      setShowSplash(false);
      setGlobalState("landing");
      setHasSeenSplash(true);
    }, 500);
  }, [isMicReady, globalState]);

  return (
    <Screen isActive={isActive}>
      <div className={s.splashCopy}>
        <TransitionWrapper
          show={showSplash && !hasSeenSplash}
          delay={1500}
          variant="fade"
        >
          <p>
            Irmai uses the microphone to <em>hear</em> and <em>speak</em> to
            you.
          </p>
        </TransitionWrapper>
        <TransitionWrapper
          show={showSplash && !hasSeenSplash}
          delay={2000}
          variant="fade"
        >
          <p>Please allow us to use it to proceed.</p>
        </TransitionWrapper>
      </div>
    </Screen>
  );
};

export default SplashScreen;
