// ./app/api/tarot/route.ts
// '/api/tarot' returns all tarot cards
// '/api/tarot?n=all' returns all tarot cards
// '/api/tarot?n=3' returns 3 random tarot cards
import tarot from "./tarot-cards";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const n: string | null = url.searchParams.get("n");

  if (!n || n === "all") {
    return new Response(JSON.stringify(tarot.cards), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }

  // only cache this route if we need random cards
  req.headers.set("Cache-Control", "max-age=0, s-maxage=0");
  const nInt = parseInt(n);
  const { cards } = tarot;
  let randomCards: any[] = [];
  while (randomCards.length < nInt) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    if (!randomCards.includes(randomCard)) {
      randomCards.push(randomCard);
    }
  }

  return new Response(JSON.stringify(randomCards), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
