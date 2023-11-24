// ./app/api/speech-to-text/route.ts
import OpenAI from "openai";
import { File } from "openai/_shims/auto/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const formData = await req.formData();
  const input:any = formData.get('file');
  console.log('📁', input.type);

  // get mimeType of input

  if (!input) {
    return new Response('Missing input', {
      status: 400,
    });
  }

  const res = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: input,
  });

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// This is just a test route to make sure the API is working
export async function GET(req: Request) {
  const input = await fetch('https://a.storyblok.com/f/75124/x/165f536c4b/sample.mp3')

  const res = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: input,
  });

  return new Response(JSON.stringify({
    ...res,
    input: 'https://a.storyblok.com/f/75124/x/165f536c4b/sample.mp3',
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
