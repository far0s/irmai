import { memo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Leva, useControls, button } from "leva";

import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

import s from "./debug.module.css";

const Debug = () => {
  const debugRef = useRef<HTMLDivElement | null>(null);
  const reset = useIrmaiStore((s) => s.reset);
  const debug = useIrmaiStore((s) => s.debug);
  const setDebug = useIrmaiStore((s) => s.setDebug);
  const setIsSpeaking = useIrmaiStore((s) => s.setIsSpeaking);
  const setIsListening = useIrmaiStore((s) => s.setIsListening);
  const setIsThinking = useIrmaiStore((s) => s.setIsThinking);
  const globalState = useIrmaiStore((s) => s.globalState);
  const setGlobalState = useIrmaiStore((s) => s.setGlobalState);
  const allCards = useIrmaiStore((s) => s.allCards);
  const setAllCards = useIrmaiStore((s) => s.setAllCards);
  const hideApp = useIrmaiStore((s) => s.hideApp);
  const setHideApp = useIrmaiStore((s) => s.setHideApp);
  const setAuraColors = useIrmaiStore((s) => s.setAuraColors);

  const searchParams = useSearchParams();
  const hasDebugParam = searchParams.get("debug") !== null;

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  useEffect(() => {
    fetch("/api/tarot")
      .then((res) => res.json())
      .then((data) => {
        setAllCards(data);
      });
  }, []);

  const handleSelectThreeRandomCards = async () => {
    const randomCards =
      allCards?.length > 0
        ? allCards.sort(() => 0.5 - Math.random()).slice(0, 3)
        : await fetch("/api/tarot?n=3").then((res) => res.json());
    setAuraColors({
      startColor: randomCards[0].color,
      midColor: randomCards[1].color,
      endColor: randomCards[2].color,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ["PageUp", "PageDown", "ArrowUp", "ArrowDown"];
      if (keys.includes(e.key)) {
        e.preventDefault();
        handleSelectThreeRandomCards();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setDebug(hasDebugParam && searchParams.get("debug") === "true");
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
    "Random Cards/Colors": button(() => handleSelectThreeRandomCards()),
    Screenshot: button(() => {
      // from <canvas> element already on the page
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "irmai-screenshot.png";
        a.click();
      }
    }),
  });

  return (
    <div ref={debugRef} className={s.debug}>
      <Leva flat collapsed hidden={!debug} />
    </div>
  );
};

export default memo(Debug);
