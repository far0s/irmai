import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { TGlobalState, ITarotCard } from "@/utils/shared-types";

interface IStore {
  debug: boolean;
  globalState: TGlobalState;
  setGlobalState: (state: TGlobalState) => void;
  isReadyToAskForMic: boolean;
  setIsReadyToAskForMic: (isReadyToAskForMic: boolean) => void;
  isMicReady: boolean;
  setIsMicReady: (isMicReady: boolean) => void;
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
  allCards: ITarotCard[];
  setAllCards: (cards: string[]) => void;
  selectedCards: ITarotCard[];
  setSelectedCards: (cards: string[]) => void;
  firstQuestion: string;
  setFirstQuestion: (question: string) => void;
  showTranscript: boolean;
  setShowTranscript: (showTranscript: boolean) => void;
  conclusion: string;
  setConclusion: (conclusion: string) => void;
  reset: () => void;

  // Orb debugging
  hideApp: boolean;
  setHideApp: (hideApp: boolean) => void;
}

export type State = {
  debug: boolean;
  globalState: TGlobalState;
  isReadyToAskForMic: boolean;
  isMicReady: boolean;
  hasSeenSplash: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  transcript: any[];
  firstQuestion: string;
  showTranscript: boolean;
  allCards: ITarotCard[];
  selectedCards: any[];
  conclusion: string;

  hideApp: boolean;
};

export type Actions = {
  setGlobalState: (state: TGlobalState) => void;
  setIsReadyToAskForMic: (isReadyToAskForMic: boolean) => void;
  setIsMicReady: (isMicReady: boolean) => void;
  setHasSeenSplash: (hasSeenSplash: boolean) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setIsListening: (isListening: boolean) => void;
  setIsThinking: (isThinking: boolean) => void;
  setTranscript: (transcript: any[]) => void;
  setFirstQuestion: (question: string) => void;
  setShowTranscript: (showTranscript: boolean) => void;
  setAllCards: (cards: string[]) => void;
  setSelectedCards: (cards: string[]) => void;
  setConclusion: (conclusion: string) => void;
  reset: () => void;

  setHideApp: (hideApp: boolean) => void;
};

export type Store = State & Actions;

export const initStore = (): State => {
  return {
    debug: process.env.NODE_ENV === "development",
    globalState: "splash",
    isReadyToAskForMic: false,
    isMicReady: false,
    hasSeenSplash: false,
    isSpeaking: false,
    isListening: false,
    isThinking: false,
    transcript: [],
    firstQuestion: "",
    showTranscript: false,
    allCards: [],
    selectedCards: [],
    conclusion: "",

    hideApp: false,
  };
};

export const defaultInitState: State = {
  debug: process.env.NODE_ENV === "development",
  globalState: "splash",
  isReadyToAskForMic: false,
  isMicReady: false,
  hasSeenSplash: false,
  isSpeaking: false,
  isListening: false,
  isThinking: false,
  transcript: [],
  firstQuestion: "",
  showTranscript: false,
  allCards: [],
  selectedCards: [],
  conclusion: "",

  hideApp: false,
};

export const createZStore = (initState: State = defaultInitState) => {
  return createStore<IStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setGlobalState: (state: TGlobalState) => set({ globalState: state }),
          setIsReadyToAskForMic: (isReadyToAskForMic: boolean) =>
            set({ isReadyToAskForMic }),
          setIsMicReady: (isMicReady: boolean) => set({ isMicReady }),
          setHasSeenSplash: (hasSeenSplash: boolean) => set({ hasSeenSplash }),
          setIsSpeaking: (isSpeaking: boolean) => set({ isSpeaking }),
          setIsListening: (isListening: boolean) => set({ isListening }),
          setIsThinking: (isThinking: boolean) => set({ isThinking }),
          setTranscript: (transcript: any[]) => set({ transcript }),
          setFirstQuestion: (question: string) =>
            set({ firstQuestion: question }),
          setShowTranscript: (showTranscript: boolean) =>
            set({ showTranscript }),
          setAllCards: (cards: any[]) => set({ allCards: cards }),
          setSelectedCards: (cards: any[]) => set({ selectedCards: cards }),
          setConclusion: (conclusion: string) => set({ conclusion }),
          reset: () =>
            set({
              ...initState,
              globalState: "splash",
              hasSeenSplash: true,
              isReadyToAskForMic: true,
              isMicReady: true,
            }),

          setHideApp: (hideApp: boolean) => set({ hideApp }),
        }),
        {
          name: "irmai-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
};
