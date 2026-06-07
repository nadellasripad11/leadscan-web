import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "LeadScan — Company Intelligence in Seconds",
  description: "AI-powered company intelligence. Tech stack, growth signals, conviction score, and personalized outreach in seconds. Free, no account required.",
  openGraph: {
    title: "LeadScan — Company Intelligence in Seconds",
    description: "Scan any company in 5 seconds. Tech stack, growth signals, AI outreach. Free, no account needed.",
    siteName: "LeadScan",
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
