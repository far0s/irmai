import { type Message } from "ai/react";

export type ChatMessage = Message;

export interface IChatProps {
  input: string;
  isLoading: boolean;
  messages: Message[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
