import { NextRequest, NextResponse } from "next/server";
import { ITarotCard } from "@/utils/shared-types.js";
import tarot from "../tarot/tarot-cards.js";

function createImagePrompt(card: ITarotCard) {
  return `Create a detailed illustration for the tarot card "${card.name}" with the following description: ${card.desc} The image should be in a 7:12 aspect ratio, 230 by 394 pixels, and capture the essence and symbolism of the card. The images should be in a geometric stained glass style, similar to church windows. Make the whole image monochrome.`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cardPrompts = tarot.cards.map((card: any) => {
    return {
      id: card.name_short,
      prompt: createImagePrompt(card),
    };
  });

  return new NextResponse(JSON.stringify(cardPrompts), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
