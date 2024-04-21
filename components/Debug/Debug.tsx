import { useIrmaiStore } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import s from "./debug.module.css";

const Debug = () => {
  const { globalState, reset, debug } = useIrmaiStore((s) => s);

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
