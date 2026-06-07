import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "LeadScan — Company Intelligence in Seconds",
  description: "AI-powered company intelligence. Tech stack, growth signals, conviction score, and personalized outreach in seconds. Free, no account required.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "LeadScan — Company Intelligence in Seconds",
    description: "Scan any company in 5 seconds. Tech stack, growth signals, AI outreach. Free, no account needed.",
    siteName: "LeadScan",
    images: [{ url: "/favicon.svg", width: 32, height: 32 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
