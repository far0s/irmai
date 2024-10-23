import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { loadFontsOnTheEdge } from "@/utils/fonts";

export const runtime = "edge";

const imageTemplate = async ({ title }: { title: string }) => {
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
          padding: "0 120px",
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
        }}
      >
        {`[${title}]`}
      </div>
    </div>
  );
};

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const title = searchParams.get("title") || "irmai";

  const fonts: any[] = await loadFontsOnTheEdge();

  return new ImageResponse(await imageTemplate({ title }), {
    width: 1080,
    height: 1920,
    // debug: true, // show outlines
    fonts: fonts,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = body.title || "irmai";

  const fonts: any[] = await loadFontsOnTheEdge();

  return new ImageResponse(await imageTemplate({ title }), {
    width: 1080,
    height: 1920,
    fonts: fonts,
  });
}
