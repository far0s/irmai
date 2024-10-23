import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadFontsOnTheEdge } from "@/utils/fonts";
import { ImageTemplateProps } from "@/utils/shared-types";

export const runtime = "edge";

const imageTemplate = ({ firstQuestion, conclusion }: ImageTemplateProps) => {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Vercel"
          height={200}
          src="data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
          style={{ margin: "0 30px" }}
          width={232}
        />
      </div>
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
