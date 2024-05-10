import { Vector3 } from "three";

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
      !item.content.includes("*SYSTEM") &&
      !item.content.includes("*CONCLUSION")
  );
};

export const convertHexToVec3 = (hex: string): Vector3 => {
  const color = new Vector3();
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  color.set(r, g, b);
  return color;
};

export const fetchGLSL = async (
  path: string,
  successCallback: (data: string) => void
) => {
  const response = await fetch(path);
  const data = await response.text();
  successCallback(data);
};

export const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;
