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
    allCards,
    setAllCards,
    setAuraColors,
  } = useIrmaiStore((s) => s);
  const searchParams = useSearchParams();
  const hasDebugParam = searchParams.get("debug") !== null;

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  const handleSelectThreeRandomCards = async () => {
    if (!(allCards && allCards.length > 0)) {
      await fetch("/api/tarot?n=50")
        .then((res) => {
          const cards: any = res.json();
          setAllCards(cards || []);
          return cards;
        })
        .then((data) => {
          const randomCards = data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setAuraColors({
            startColor: randomCards[0].color,
            midColor: randomCards[1].color,
            endColor: randomCards[2].color,
          });
        })
        .catch((err) => console.error(err));
    } else {
      const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 3);
      if (randomCards.length > 0) {
        setAuraColors({
          startColor: randomCards[0].color,
          midColor: randomCards[1].color,
          endColor: randomCards[2].color,
        });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      (e.key === "PageUp" || e.key === "PageDown") &&
        handleSelectThreeRandomCards();
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
  });

  return (
    <div ref={debugRef} className={s.debug}>
      <Leva flat collapsed hidden={!debug} />
    </div>
  );
};

export default memo(Debug);
