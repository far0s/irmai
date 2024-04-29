import { memo } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import s from "./debug.module.css";
import type { TGlobalState } from "@/utils/use-zustand-state";

const stateOptions = [
  "splash",
  "landing",
  "intro",
  "focus",
  "tarot",
  "question",
  "reading",
  "followup",
  "outro",
];

const Debug = () => {
  const {
    globalState,
    reset,
    debug,
    isSpeaking,
    isListening,
    isThinking,
    setGlobalState,
    showTranscript,
  } = useIrmaiStore((s) => s);

  return (
    debug && (
      <div className={s.debug}>
        <p>
          <button
            onClick={() => {
              reset();
              window.location.reload();
            }}
          >
            reload
          </button>
        </p>
        <p>
          globalState:{" "}
          <select
            onChange={(e) => setGlobalState(e.target.value as TGlobalState)}
            defaultValue={globalState}
          >
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </p>
        {isSpeaking && <p>irmai isSpeaking</p>}
        {isListening && <p>irmai isListening</p>}
        {isThinking && <p>irmai isThinking</p>}
        {showTranscript && <p>showTranscript</p>}
      </div>
    )
  );
};

export default memo(Debug);
