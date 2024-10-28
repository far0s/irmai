import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadFontsOnTheEdge } from "@/utils/fonts";
import { ImageTemplateProps } from "@/utils/shared-types";

export const runtime = "edge";

const imageTemplate = ({
  firstQuestion,
  conclusion,
  auraImage,
}: ImageTemplateProps) => {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#0b0216",
        color: "#fffbf2",
        fontFamily: "Poppins",
        width: "100%",
        height: "100%",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "nowrap",
      }}
    >
      {auraImage && (
        <img
          src={auraImage}
          alt="Aura background"
          style={{ position: "relative", width: "100%" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontFamily: "Cirka",
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            color: "white",
            marginTop: 30,
            padding: "0 10%",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          {firstQuestion?.length > 0 && firstQuestion}
        </div>
        <div
          style={{
            fontSize: 40,
            fontFamily: "Poppins",
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            color: "white",
            marginTop: 30,
            padding: "0 10%",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          {conclusion?.length > 0 && conclusion}
        </div>
      </div>
    </div>
  );
};

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const firstQuestion = searchParams.get("firstQuestion") || "";
  const conclusion = searchParams.get("conclusion") || "";

  const fonts: any[] = await loadFontsOnTheEdge();
  const imageConfig = {
    width: 1080,
    height: 1920,
    fonts: fonts,
  };

  return new ImageResponse(
    imageTemplate({
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

  return new ImageResponse(imageTemplate({ ...body }), imageConfig);
}
