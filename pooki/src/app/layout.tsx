import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pookidex",
  description: "A Pookidex ? 😍",
  openGraph: {
    title: "Pookidex",
    description: "Explore detailed information about your favorite Pookiemon",
    url: "https://pookiemon-delta.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://pookiemon-delta.vercel.app/og-image.png",
        width: 800,
        height: 600,
        alt: "Pokedex",
      },
    ],
    siteName: "Pookiedex",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rhysjosmin",
    title: "Pookiedex",
    description: "Explore detailed information about your favorite Pokemon",
    images: "https://pookiemon-delta.vercel.app/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white">{children}</body>
    </html>
  );
}
