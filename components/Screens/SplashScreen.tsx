import { useEffect } from "react";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { Screen } from "@/components/Stage/Stage";

const SplashScreen = ({ isActive, id }: { isActive: boolean; id: string }) => {
  const {
    globalState,
    setGlobalState,
    isMicReady,
    hasSeenSplash,
    setHasSeenSplash,
  } = useIrmaiStore((s) => s);

  useEffect(() => {
    if (globalState !== "splash") return;
    if (!isMicReady) return;
    if (hasSeenSplash) return setGlobalState("landing");

    setHasSeenSplash(true);
    setTimeout(() => setGlobalState("landing"), 2400);
  }, [isMicReady, globalState]);

  return <Screen id={id} isActive={isActive}></Screen>;
};

export default SplashScreen;
