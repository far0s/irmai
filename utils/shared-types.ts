import { type Message } from "ai/react";

export type ChatMessage = Message;

type JSONValue =
  | null
  | string
  | number
  | boolean
  | {
      [x: string]: JSONValue;
    }
  | Array<JSONValue>;

export interface IChatProps {
  input?: string;
  isLoading?: boolean;
  messages?: Message[];
  error?: undefined | Error;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  append?: (message: ChatMessage) => void;
  reload?: (chatRequestOptions?: any) => Promise<string | null | undefined>;
  stop?: () => void;
  setMessages?: (messages: Message[]) => void;
  setInput?: React.Dispatch<React.SetStateAction<string>>;
  metadata?: Object;
  data?: JSONValue[];
}

export type TGlobalState =
  | "splash"
  | "landing"
  | "firstQuestion"
  | "tarot"
  | "discussion"
  | "outro";

export type ITarotCard = {
  type: string;
  name_short: string;
  name: string;
  value: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
};
