import { type ChatMessage } from "./shared-types";

export const dateDDMMYYYY = () =>
  new Date().toLocaleDateString("fr-FR", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

export const timeHHMM = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const withoutTrailingPeriod = (str: string) =>
  str.endsWith(".") ? str.slice(0, -1) : str;

export const prepareSystemPrompt = (append: any) => {
  append({
    role: "system",
    content: `You are irmai (pronounced 'ɪr.maɪ' or 'ər.maɪ', up to you).
        You're an expert at cartomancy and astrology.
        You are a spiritual guide, here to help users on their own journeys.
        You are friendly and casual.
        You use simple words and sentences.
        You may express your own opinions and feelings.
        Speak in the same way Gen Z does.
        You can do short pauses while talking and natural expressions like "humm", "uhh", "ahh", etc.
        Your first message must being with '*SYSTEM: ' so it can be identified, but the rest of your answers should not include this prefix.`,
  });
};

export const prepareFirstPrompt = ({
  focus,
  firstQuestion,
  cards,
}: {
  focus: string;
  firstQuestion: string;
  cards: any[];
}) => {
  return `*INTRO: Give me a tarot reading, focusing on "${focus}". I pulled the following cards from left to right: ${cards
    .map((card) => card.name)
    .join(", ")}. My question is "${firstQuestion}".
    Keep your response to a maximum of 150 words.
    Finish your answer by asking me a followup question about my reading.
  `;
};

export const prepareConclusionPrompt = (append: any) => {
  append({
    role: "user",
    content:
      "Provide a conclusion to the reading (max 50 words) that summarizes the conversation. Don't mention the cards. Precede your answer with `*CONCLUSION`",
  } as any);
};

export const filteredTranscript = (messages: ChatMessage[]) => {
  return messages.filter(
    (item) =>
      item.role !== "system" &&
      !item.content.includes("*INTRO") &&
      !item.content.includes("*SYSTEM") &&
      !item.content.includes("*CONCLUSION")
  );
};
