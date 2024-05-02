export const withoutTrailingPeriod = (str: string) =>
  str.endsWith(".") ? str.slice(0, -1) : str;

export const prepareFirstPrompt = ({
  focus,
  firstQuestion,
  cards,
}: {
  focus: string;
  firstQuestion: string;
  cards: any[];
}) => {
  return `
    *INTRO: Give me a tarot reading, focusing on "${focus}". I pulled the following cards from left to right: ${cards
    .map((card) => card.name)
    .join(", ")}. My question is "${firstQuestion}".
    Keep your response to a maximum of 150 words.
    Finish your answer by asking me a followup question about my reading.
  `;
};
