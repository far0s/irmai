import "./globals.css";
import { StoreProvider } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
import { type Viewport, Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";

export function generateMetadata(): Metadata {
  return {
    title: "irmai",
    description: "Ready to embark on a journey of self-discovery?",
    icons: {
      icon: "/images/irmai-favicon.png",
      shortcut: "/images/irmai-favicon.png",
    },
    appleWebApp: {
      title: "irmai",
      statusBarStyle: "black-translucent",
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    themeColor: "black",
    colorScheme: "dark",
  };
}

const objectSans = localFont({
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

const cirka = localFont({
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${objectSans.className} ${cirka.className}`}>
      <head>
        <link rel="icon" href="/images/irmai-favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/irmai-favicon.png" />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
