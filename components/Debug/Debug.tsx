import { memo, useEffect } from "react";
import { Leva, useControls, button } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./debug.module.css";

const Debug = () => {
  const {
    reset,
    debug,
    isSpeaking,
    isListening,
    isThinking,
    setIsSpeaking,
    setIsListening,
    setIsThinking,
    globalState,
    setGlobalState,
    setSelectedCards,

    hideApp,
    setHideApp,
  } = useIrmaiStore((s) => s);

  const handleReset = () => {
    reset();
    window.location.reload();
  };
  useControls({
    reset: button(() => handleReset()),
    levaHideApp: {
      value: hideApp,
      label: "Hide App",
      onChange: (v) => setHideApp(v),
    },
    levaGlobalState: {
      value: globalState,
      label: "Global State",
      options: ["splash", "landing", "focus", "tarot", "question", "outro"],
      onChange: (v) => setGlobalState(v),
    },
    orbState: {
      value: "idle",
      label: "Orb State",
      options: ["idle", "listening", "thinking", "speaking"],
      onChange: (v) => {
        if (v === "listening") {
          setIsListening(true);
          setIsThinking(false);
          setIsSpeaking(false);
        } else if (v === "thinking") {
          setIsListening(false);
          setIsThinking(true);
          setIsSpeaking(false);
        } else if (v === "speaking") {
          setIsListening(false);
          setIsThinking(false);
          setIsSpeaking(true);
        } else {
          setIsListening(false);
          setIsThinking(false);
          setIsSpeaking(false);
        }
      },
    },
    resetCards: button(() => setSelectedCards([])),
  });

  useEffect(() => {
    const pageContainer = document.querySelector('[class*="pageContainer"]');
    if (pageContainer) {
      pageContainer?.classList.toggle(s.hide, hideApp);
    }
  }, [hideApp]);

  return debug && <Leva flat collapsed />;
};

export default memo(Debug);
