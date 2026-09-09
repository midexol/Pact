import type { Metadata } from "next";
import { Manrope, Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PACT — Persistent Agent Commitment Tracking",
  description:
    "PACT gives autonomous agents persistent memory of promises, performance, and outcomes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${plexMono.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
