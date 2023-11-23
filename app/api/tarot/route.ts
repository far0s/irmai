
export async function GET(req: Request) {
  // never cache this route
  req.headers.set('Cache-Control', 'max-age=0, s-maxage=0');

  return await fetch("https://tarot-api-3hv5.onrender.com/api/v1/cards/random?n=3").then((response) => {
    return response.json();
  })
  .then((response) => {
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  })
  .catch((error) => {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  });
}