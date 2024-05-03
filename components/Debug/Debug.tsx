import { memo } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import s from "./debug.module.css";

const Debug = () => {
  const {
    reset,
    debug,
    isSpeaking,
    isListening,
    isThinking,
    globalState,
    setGlobalState,
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
          state:
          <select
            onChange={(e) => {
              setGlobalState(e.target.value as any);
            }}
            value={globalState}
          >
            <option value="splash">splash</option>
            <option value="landing">landing</option>
            <option value="focus">focus</option>
            <option value="question">question</option>
            <option value="outro">outro</option>
          </select>
        </p>
        {isSpeaking && <p>irmai isSpeaking</p>}
        {isListening && <p>irmai isListening</p>}
        {isThinking && <p>irmai isThinking</p>}
      </div>
    )
  );
};

export default memo(Debug);
