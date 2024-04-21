import "./globals.css";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/components/ZustandStoreProvider/ZustandStoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "irmai",
  description: "Ready to embark on a journey of self-discovery?",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/irmai-favicon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
