import { type Message } from "ai/react";

export type ChatMessage = Message;

export type TGlobalState = "splash" | "intro" | "chat" | "outro";

export type ITarotCard = {
  type: string;
  name_short: string;
  name: string;
  value: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  image: string;
  reverse: boolean;
  color: string;
};

export type TConvertedSTTResponse = {
  task: string;
  language: "english" | string;
  text: string;
  duration: number;
  input?: string;
  words: {
    word: string;
    start: number;
    end: number;
  }[];
};

export interface ImageTemplateProps {
  firstQuestion: string;
  selectedCards?: ITarotCard[] | [];
  conclusion: string;
  auraImage?: string | null;
  debug?: boolean;
  [k: string]: any;
}
