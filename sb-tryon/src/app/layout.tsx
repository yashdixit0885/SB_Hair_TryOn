import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RootProviders } from "@/components/root-providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sally Beauty Hair Color Try-On",
  description:
    "Brand-neutral hair color try-on — see yourself in any color, with realistic fade, calibrated lighting, and outcome-anchored reviews from real customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Provider construction lives inside <RootProviders> (a Client Component)
  // because Next.js RSC serialization rejects class instances crossing the
  // Server→Client boundary. Server Components that need provider access call
  // `createProviders()` directly from `@/lib/providers` — they don't read
  // through the React context (architecture §4).
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
