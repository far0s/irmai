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
  image: string;
};
