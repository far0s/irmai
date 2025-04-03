// ./app/api/text-to-speech/route.ts
import OpenAI from "openai";
import { TVoice } from "@/utils/shared-types";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const DEFAULT_VOICE: TVoice = "fable";

const INSTRUCTIONS: string = `
Voice Affect: Soft, gentle, soothing; embody tranquility.
Tone: Calm, reassuring, peaceful; convey genuine warmth and serenity.
Pacing: Natural, deliberate.
Emotion: Deeply soothing and comforting; express genuine kindness and care.
Pronunciation: Smooth, soft articulation, slightly elongating vowels to create a sense of ease.
`;

export async function POST(req: Request): Promise<Response> {
  const { input, voice = DEFAULT_VOICE } = await req.json();

  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice,
    input: input,
    instructions: INSTRUCTIONS,
  });

  const buffer = await Buffer.from(await mp3.arrayBuffer());

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.byteLength.toString(),
    },
  });
}

// This is just a test route to make sure the API is working
export async function GET(req: Request): Promise<Response> {
  if (req.headers.get("host") !== "localhost:3000") {
    return new Response(null, { status: 404 });
  }

  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: DEFAULT_VOICE,
    input:
      "Hi!, I'm irmai, and this is a test message. Beep! Sorry, I'm not a message machine. I'm a robot. I mean no, I'm not a robot, I'm an AI assistant. Anyway, talk to you soon!",
    instructions: INSTRUCTIONS,
  });

  const buffer = await Buffer.from(await mp3.arrayBuffer());

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.byteLength.toString(),
    },
  });
}
