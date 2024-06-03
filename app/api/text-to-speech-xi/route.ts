// ./app/api/text-to-speech-xi/route.ts
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

const model = "eleven_multilingual_v2";
const voice = "Sigrid - solemn, raspy, wise";

const getAudioBuffer = async (audio: Readable): Promise<Buffer> => {
  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    audio.on("data", (chunk: Buffer) => chunks.push(chunk));
    audio.on("end", () => resolve(Buffer.concat(chunks)));
    audio.on("error", reject);
  });
};

export async function GET() {
  const text = "Hi!, I'm irmai, and this is a test message";

  const audio = await client
    .generate({
      voice: voice,
      model_id: model,
      text,
    })
    .then((audio) => getAudioBuffer(audio));

  return new Response(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": audio.byteLength.toString(),
    },
  });
}

export async function POST(req: Request) {
  const { input } = await req.json();

  const audio = await client
    .generate({
      voice: voice,
      model_id: model,
      text: input,
    })
    .then((audio) => getAudioBuffer(audio));

  return new Response(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": audio.byteLength.toString(),
    },
  });
}
