import tarot from './tarot-cards';

export async function GET(req: Request) {
  // never cache this route
  req.headers.set('Cache-Control', 'max-age=0, s-maxage=0');

  const { cards } = tarot;
  let randomCards: any[] = [];
  while (randomCards.length < 3) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    if (!randomCards.includes(randomCard)) {
      randomCards.push(randomCard);
    }
  }

  return new Response(JSON.stringify(randomCards), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}