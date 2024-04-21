import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type TGlobalState = "idle" | "standby" | "initiated";

interface IStore {
  debug: boolean;
  globalState: TGlobalState;
  setGlobalState: (state: TGlobalState) => void;
  reset: () => void;
}

export type State = {
  debug: boolean;
  globalState: TGlobalState;
};

export type Actions = {
  setGlobalState: (state: TGlobalState) => void;
  reset: () => void;
};

export type Store = State & Actions;

export const initStore = (): State => {
  return {
    globalState: "idle",
    debug: process.env.NODE_ENV === "development",
  };
};

export const defaultInitState: State = {
  globalState: "idle",
  debug: process.env.NODE_ENV === "development",
};

export const createZStore = (initState: State = defaultInitState) => {
  return createStore<IStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setGlobalState: (state: TGlobalState) => set({ globalState: state }),
          reset: () => set(initState),
        }),
        {
          name: "genai-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
};
