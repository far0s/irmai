// ./app/api/speech-to-text/route.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const input: any = formData.get("file");

  if (!input) {
    return new Response("Missing input", {
      status: 400,
    });
  }

  if (!(input.type === "audio/mpeg" || input.type === "audio/mp3")) {
    return new Response("Invalid input type", {
      status: 400,
    });
  }

  const res = await openai.audio.transcriptions.create({
    model: "whisper-1",
    language: "en",
    file: input,
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  return new Response(JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// This is just a test route to make sure the API is working
export async function GET(req: Request): Promise<Response> {
  if (req.headers.get("host") !== "localhost:3000") {
    return new Response(null, { status: 404 });
  }

  const input = await fetch(
    "https://a.storyblok.com/f/75124/x/165f536c4b/sample.mp3"
  );

  const res = await openai.audio.transcriptions.create({
    model: "whisper-1",
    language: "en",
    file: input,
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  return new Response(
    JSON.stringify({
      ...res,
      input: "https://a.storyblok.com/f/75124/x/165f536c4b/sample.mp3",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
