import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { siteUrl } from "@/lib/site";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeTerrain | Learn open-source architecture",
    template: "%s · CodeTerrain",
  },
  description:
    "Interactive maps show how open-source codebases work, with links to the exact source files.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CodeTerrain | Learn open-source architecture",
    description:
      "See how open-source codebases work, with links to the exact source files.",
    type: "website",
    url: "/",
    siteName: "CodeTerrain",
    locale: "en_US",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "CodeTerrain open-source architecture maps",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeTerrain | Learn open-source architecture",
    description:
      "See how open-source codebases work, with links to the exact source files.",
    images: [{
      url: "/og.png",
      alt: "CodeTerrain open-source architecture maps",
    }],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080a09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
