import { useEffect, useState } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";
import TransitionWrapper from "@/components/TransitionWrapper/TransitionWrapper";

import s from "./screens.module.css";

const SplashScreen = ({ isActive }: { isActive: boolean }) => {
  const globalState = useIrmaiStore((s) => s.globalState);
  const setGlobalState = useIrmaiStore((s) => s.setGlobalState);
  const setIsReadyToAskForMic = useIrmaiStore((s) => s.setIsReadyToAskForMic);
  const isMicReady = useIrmaiStore((s) => s.isMicReady);
  const hasSeenSplash = useIrmaiStore((s) => s.hasSeenSplash);
  const setHasSeenSplash = useIrmaiStore((s) => s.setHasSeenSplash);

  const [showSplash, setShowSplash] = useState(false);
  const [partToShow, setPartToShow] = useState<null | "intro" | "permissions">(
    null
  );

  useEffect(() => {
    // this is called on load
    if (globalState !== "splash") return;
    setHasSeenSplash(false);
    setShowSplash(true);
    setPartToShow("intro");

    window.setTimeout(() => {
      setPartToShow("permissions");
    }, 4000);

    window.setTimeout(() => {
      setIsReadyToAskForMic(true);
      setPartToShow(null);
    }, 7000);
  }, [globalState]);

  useEffect(() => {
    // this is called when ready
    if (globalState !== "splash") return;
    if (!isMicReady) return;

    window.setTimeout(() => {
      setShowSplash(true);
      setPartToShow("intro");

      window.setTimeout(() => {
        setPartToShow(null);
        setGlobalState("intro");
        setHasSeenSplash(true);
      }, 3000);
    }, 500);
  }, [isMicReady, globalState]);

  return (
    <Screen isActive={isActive}>
      <div className={s.splashCopy}>
        <div>
          <TransitionWrapper
            show={showSplash && partToShow === "intro"}
            delay={1500}
          >
            <p>
              irmai is your spiritual tarot guide, leading you on a journey of
              self-discovery and inner peace.
            </p>
          </TransitionWrapper>
        </div>
        <div>
          <TransitionWrapper
            show={showSplash && !hasSeenSplash && partToShow === "permissions"}
            delay={500}
          >
            <p>
              irmai uses the microphone to <em>hear</em> and <em>speak</em> to
              you.
            </p>
          </TransitionWrapper>
          <TransitionWrapper
            show={showSplash && !hasSeenSplash && partToShow === "permissions"}
            delay={1000}
          >
            <p>Please allow us to use it to proceed.</p>
          </TransitionWrapper>
        </div>
      </div>
    </Screen>
  );
};

export default SplashScreen;
