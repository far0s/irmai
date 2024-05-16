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

export const filteredTranscript = (messages: ChatMessage[]) => {
  return messages.filter(
    (item) =>
      item.role !== "system" &&
      !item.content.includes("*INTRO") &&
      !item.content.includes("*CONCLUSION")
  );
};
