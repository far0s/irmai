import { memo } from "react";
import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import s from "./debug.module.css";

const Debug = () => {
  const { reset, debug, isSpeaking, isListening, isThinking } = useIrmaiStore(
    (s) => s
  );

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
        {isSpeaking && <p>irmai isSpeaking</p>}
        {isListening && <p>irmai isListening</p>}
        {isThinking && <p>irmai isThinking</p>}
      </div>
    )
  );
};

export default memo(Debug);
