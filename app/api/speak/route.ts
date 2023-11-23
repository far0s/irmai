import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { input, voice = 'nova' } = await req.json();

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: input,
  });

  return new Response(Buffer.from(await mp3.arrayBuffer()), {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}


export async function GET(req: Request) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: "Hi!, I'm Nova, and this is a test message.",
  });

  return new Response(Buffer.from(await mp3.arrayBuffer()), {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}