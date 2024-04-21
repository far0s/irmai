import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import s from "./debug.module.css";

const Debug = () => {
  const debug = useIrmaiStore((store) => store.globalState);
  const globalState = useIrmaiStore((store) => store.globalState);
  const reset = useIrmaiStore((store) => store.reset);

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
        <p>globalState: {globalState}</p>
      </div>
    )
  );
};

export default Debug;
