import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

export const cirka = localFont({
  src: [
    {
      path: "../public/fonts/PPCirka.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PPCirka-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/PPCirka-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-cirka",
});

export const loadFontsOnTheEdge = async (): Promise<
  {
    name: string;
    data: ArrayBuffer;
    style: "normal" | "italic";
    weight: "300" | "400" | "600";
  }[]
> => {
  const cirka = await fetch("https://irmai.vercel.app/fonts/PPCirka.woff").then(
    (res) => res.arrayBuffer()
  );

  const fetchWithCache = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "public, max-age=2592000", // Cache for 30 days
      },
    });
    return response.arrayBuffer();
  };

  const cirkaLight = await fetchWithCache(
    "https://irmai.vercel.app/fonts/PPCirka-Light.woff"
  );

  const cirkaBold = await fetchWithCache(
    "https://irmai.vercel.app/fonts/PPCirka-Bold.woff"
  );

  const poppins = await fetchWithCache(
    "https://irmai.vercel.app/fonts/Poppins-Regular.ttf"
  );

  const poppinsItalic = await fetchWithCache(
    "https://irmai.vercel.app/fonts/Poppins-Italic.ttf"
  );

  const poppinsLight = await fetchWithCache(
    "https://irmai.vercel.app/fonts/Poppins-Light.ttf"
  );

  const poppinsLightItalic = await fetchWithCache(
    "https://irmai.vercel.app/fonts/Poppins-LightItalic.ttf"
  );

  return [
    {
      name: "Cirka",
      data: cirka,
      style: "normal",
      weight: "400",
    },
    {
      name: "Cirka",
      data: cirkaLight,
      style: "normal",
      weight: "300",
    },
    {
      name: "Cirka",
      data: cirkaBold,
      style: "normal",
      weight: "600",
    },
    {
      name: "Poppins",
      data: poppins,
      style: "normal",
      weight: "400",
    },
    {
      name: "Poppins",
      data: poppinsItalic,
      style: "italic",
      weight: "400",
    },
    {
      name: "Poppins",
      data: poppinsLight,
      style: "normal",
      weight: "300",
    },
    {
      name: "Poppins",
      data: poppinsLightItalic,
      style: "italic",
      weight: "300",
    },
  ];
};
