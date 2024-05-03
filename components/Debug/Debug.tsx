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

  const handleReset = () => {
    reset();
    window.location.reload();
  };

  const handleChangeSelect = (e: any) => setGlobalState(e.target.value);

  return (
    debug && (
      <div className={s.debug}>
        <p>
          <button onClick={handleReset}>reload</button>
        </p>
        <p>
          state:
          <select onChange={handleChangeSelect} value={globalState}>
            <option value="splash">splash</option>
            <option value="landing">landing</option>
            <option value="focus">focus</option>
            <option value="tarot">tarot</option>
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
