"use client";

export const prepareFirstPrompt = ({
  firstQuestion,
  cards,
}: {
  firstQuestion: string;
  cards: any[];
}) => {
  return `*INTRO: Give me a tarot reading. My question is "${firstQuestion}". I pulled the following cards from left to right: ${cards
    .map((card) => card.name)
    .join(", ")}.
    Keep your response to a maximum of 150 words.
    Finish your answer by asking me a followup question about my reading.
  `;
};

export const prepareConclusionPrompt = (append: any) => {
  append({
    role: "user",
    content:
      "Provide a conclusion to the reading (max 40 words) that summarizes the conversation. Don't mention the cards. Precede your answer with `*CONCLUSION`",
  } as any);
};
