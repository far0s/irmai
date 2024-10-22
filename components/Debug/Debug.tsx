import { memo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Leva, useControls, button } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./debug.module.css";

const Debug = () => {
  const debugRef = useRef<HTMLDivElement | null>(null);
  const {
    reset,
    debug,
    setDebug,
    setIsSpeaking,
    setIsListening,
    setIsThinking,
    globalState,
    setGlobalState,
    hideApp,
    setHideApp,
  } = useIrmaiStore((s) => s);
  const searchParams = useSearchParams();
  const hasDebugParam = searchParams.get("debug") !== null;

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  useEffect(() => {
    setDebug(hasDebugParam);
  }, [searchParams]);

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
      options: ["splash", "intro", "chat", "outro"],
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
  });

  useEffect(() => {
    const pageContainer = document.querySelector('[class*="pageContainer"]');
    if (pageContainer) {
      pageContainer?.classList.toggle(s.hide, hideApp);
    }
  }, [hideApp]);

  return (
    <div ref={debugRef} className={s.debug}>
      <Leva flat collapsed hidden={!debug} />
    </div>
  );
};

export default memo(Debug);
