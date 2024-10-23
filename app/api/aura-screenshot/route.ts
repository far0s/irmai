import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://irmai.vercel.app/aura", {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1080, height: 1920 });

  // wait for the aura to load
  // await sleep(8000);

  const screenshot = await page.screenshot();
  await browser.close();

  // TODO: wait a few seconds for the aura to load correctly
  // or use params to already show the aura already ready

  return new NextResponse(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
