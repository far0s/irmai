import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadFontsOnTheEdge } from "@/utils/fonts";
import { ImageTemplateProps } from "@/utils/shared-types";
import DynamicImage from "@/components/DynamicImage/DynamicImage";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<ImageResponse> {
  if (request.headers.get("host") !== "localhost:3000") {
    return new Response(null, { status: 404 });
  }

  const searchParams = new URLSearchParams(request.nextUrl.search);
  const firstQuestion =
    searchParams.get("firstQuestion") ||
    "I want to know if I'm going to find a job that makes me happy next year";
  const conclusion =
    searchParams.get("conclusion") ||
    "If I keep my heart open and watch out for the signs around me, I will find a job that makes me happy next year.";
  const debug = searchParams.get("debug") === "true";

  const fonts: any[] = await loadFontsOnTheEdge();
  const imageConfig = {
    width: 1080,
    height: 1920,
    fonts: fonts,
    debug: debug,
  };

  return new ImageResponse(
    DynamicImage({
      firstQuestion: firstQuestion,
      conclusion: conclusion,
    }),
    imageConfig
  );
}

export async function POST(request: NextRequest): Promise<ImageResponse> {
  const body: ImageTemplateProps = await request.json();
  const fonts: any[] = await loadFontsOnTheEdge();
  const imageConfig = {
    width: 1080,
    height: 1920,
    fonts: fonts,
  };

  return new ImageResponse(DynamicImage({ ...body }), imageConfig);
}
