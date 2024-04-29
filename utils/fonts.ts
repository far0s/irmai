import localFont from "next/font/local";

export const objectSans = localFont({
  src: [
    {
      path: "../public/fonts/subset-PPObjectSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/subset-PPObjectSans-Slanted.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/subset-PPObjectSans-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/subset-PPObjectSans-HeavySlanted.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-object-sans",
});

export const cirka = localFont({
  src: [
    {
      path: "../public/fonts/PPCirka.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/subset-PPCirka-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/subset-PPCirka-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-cirka",
});
