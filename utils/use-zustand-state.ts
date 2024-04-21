import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type TGlobalState =
  | "splash"
  | "landing"
  | "intro1"
  | "intro2"
  | "intro3"
  | "asking-focus"
  | "asking-tarot"
  | "asking-question"
  | "answering"
  | "answering-followup"
  | "outro";

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
    debug: process.env.NODE_ENV === "development",
    globalState: "splash",
  };
};

export const defaultInitState: State = {
  debug: process.env.NODE_ENV === "development",
  globalState: "splash",
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
