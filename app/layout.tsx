import "@/styles/reset.css";
import "@/styles/globals.css";

import { type Viewport, Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { poppins, cirka } from "@/utils/fonts";

import { StoreProvider } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

export function generateMetadata(): Metadata {
  return {
    title: "irmai",
    description:
      "Ready to embark on a journey of self-discovery? irmai is your audio-visual spiritual guide, and will guide you on a journey of self discovery and inner peace.",
    icons: {
      icon: "/images/irmai-favicon.jpg",
      shortcut: "/images/irmai-favicon.jpg",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${cirka.variable}`}>
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
