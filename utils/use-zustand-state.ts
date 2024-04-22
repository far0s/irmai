import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export type TGlobalState =
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
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;
  transcript: any[];
  setTranscript: (transcript: any[]) => void;
  selectedCards: string[];
  setSelectedCards: (cards: string[]) => void;
  reset: () => void;
}

export type State = {
  debug: boolean;
  globalState: TGlobalState;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  transcript: any[];
  selectedCards: any[];
};

export type Actions = {
  setGlobalState: (state: TGlobalState) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  setIsThinking: (isThinking: boolean) => void;
  setTranscript: (transcript: any[]) => void;
  setSelectedCards: (cards: string[]) => void;
  reset: () => void;
};

export type Store = State & Actions;

export const initStore = (): State => {
  return {
    debug: process.env.NODE_ENV === "development",
    globalState: "splash",
    isSpeaking: false,
    isListening: false,
    isThinking: false,
    transcript: [],
    selectedCards: [],
  };
};

export const defaultInitState: State = {
  debug: process.env.NODE_ENV === "development",
  globalState: "splash",
  isSpeaking: false,
  isListening: false,
  isThinking: false,
  transcript: [],
  selectedCards: [],
};

export const createZStore = (initState: State = defaultInitState) => {
  return createStore<IStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setGlobalState: (state: TGlobalState) => set({ globalState: state }),
          setIsSpeaking: (isSpeaking: boolean) => set({ isSpeaking }),
          setIsListening: (isListening: boolean) => set({ isListening }),
          setIsThinking: (isThinking: boolean) => set({ isThinking }),
          setTranscript: (transcript: any[]) => set({ transcript }),
          setSelectedCards: (cards: string[]) => set({ selectedCards: cards }),
          reset: () => set(initState),
        }),
        {
          name: "irmai-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
};
