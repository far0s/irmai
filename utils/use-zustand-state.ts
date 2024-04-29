import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export type TGlobalState =
  | "splash"
  | "landing"
  | "focus"
  | "tarot"
  | "question"
  | "reading"
  | "followup"
  | "outro";

interface IStore {
  debug: boolean;
  globalState: TGlobalState;
  setGlobalState: (state: TGlobalState) => void;
  hasSeenSplash: boolean;
  setHasSeenSplash: (hasSeenSplash: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isThinking: boolean;
  setIsThinking: (isThinking: boolean) => void;
  transcript: any[];
  setTranscript: (transcript: any[]) => void;
  focus: string;
  setFocus: (focus: string) => void;
  selectedCards: string[];
  setSelectedCards: (cards: string[]) => void;
  firstQuestion: string;
  setFirstQuestion: (question: string) => void;
  showTranscript: boolean;
  setShowTranscript: (showTranscript: boolean) => void;
  reset: () => void;
}

export type State = {
  debug: boolean;
  globalState: TGlobalState;
  hasSeenSplash: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  transcript: any[];
  focus: string;
  firstQuestion: string;
  showTranscript: boolean;
  selectedCards: any[];
};

export type Actions = {
  setGlobalState: (state: TGlobalState) => void;
  setHasSeenSplash: (hasSeenSplash: boolean) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  setIsThinking: (isThinking: boolean) => void;
  setTranscript: (transcript: any[]) => void;
  setFocus: (focus: string) => void;
  setFirstQuestion: (question: string) => void;
  setShowTranscript: (showTranscript: boolean) => void;
  setSelectedCards: (cards: string[]) => void;
  reset: () => void;
};

export type Store = State & Actions;

export const initStore = (): State => {
  return {
    debug: process.env.NODE_ENV === "development",
    globalState: "splash",
    hasSeenSplash: false,
    isSpeaking: false,
    isListening: false,
    isThinking: false,
    transcript: [],
    focus: "",
    firstQuestion: "",
    showTranscript: false,
    selectedCards: [],
  };
};

export const defaultInitState: State = {
  debug: process.env.NODE_ENV === "development",
  globalState: "splash",
  hasSeenSplash: false,
  isSpeaking: false,
  isListening: false,
  isThinking: false,
  transcript: [],
  focus: "",
  firstQuestion: "",
  showTranscript: false,
  selectedCards: [],
};

export const createZStore = (initState: State = defaultInitState) => {
  return createStore<IStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setGlobalState: (state: TGlobalState) => set({ globalState: state }),
          setHasSeenSplash: (hasSeenSplash: boolean) => set({ hasSeenSplash }),
          setIsSpeaking: (isSpeaking: boolean) => set({ isSpeaking }),
          setIsListening: (isListening: boolean) => set({ isListening }),
          setIsThinking: (isThinking: boolean) => set({ isThinking }),
          setTranscript: (transcript: any[]) => set({ transcript }),
          setFocus: (focus: string) => set({ focus }),
          setFirstQuestion: (question: string) =>
            set({ firstQuestion: question }),
          setShowTranscript: (showTranscript: boolean) =>
            set({ showTranscript }),
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
