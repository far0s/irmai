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
    Give me a tarot, focusing on "${focus}". I pulled the following cards from left to right: ${cards
    .map((card) => card.name)
    .join(", ")}. My question is "${firstQuestion}".
    Keep your response to a maximum of 150 words.
    At the end, please return 3 words that describe the overall energy of the reading.
  `;
};
