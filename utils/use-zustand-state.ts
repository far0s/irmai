import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type TGlobalState = "idle" | "standby" | "initiated";

interface IStore {
  globalState: TGlobalState;
  setGlobalState: (state: TGlobalState) => void;
  reset: () => void;
}

export type State = {
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
  };
};

export const defaultInitState: State = {
  globalState: "idle",
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
