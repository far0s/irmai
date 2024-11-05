import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadFontsOnTheEdge } from "@/utils/fonts";
import { ImageTemplateProps } from "@/utils/shared-types";
import DynamicImage from "@/components/DynamicImage/DynamicImage";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const firstQuestion = searchParams.get("firstQuestion") || "first question?";
  const conclusion = searchParams.get("conclusion") || "conclusion!";
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

export async function POST(request: NextRequest) {
  const body: ImageTemplateProps = await request.json();
  const fonts: any[] = await loadFontsOnTheEdge();
  const imageConfig = {
    width: 1080,
    height: 1920,
    fonts: fonts,
  };

  return new ImageResponse(DynamicImage({ ...body }), imageConfig);
}
