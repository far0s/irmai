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
