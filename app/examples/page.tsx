import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Examples — LeadScan",
  description: "See LeadScan in action on real companies. Conviction scores, tech stacks, and growth signals for Stripe, Linear, Vercel, Notion, and more.",
};

type Company = {
  domain: string;
  name: string;
  score: number;
  size: string;
  tech: string[];
  signals: { label: string; on: boolean }[];
  summary: string;
  tag: string;
  tagColor: string;
};

const companies: Company[] = [
  {
    domain: "stripe.com", name: "Stripe", score: 78, size: "1k–5k employees",
    tech: ["React", "Next.js", "AWS", "Go"],
    signals: [{ label: "Hiring", on: true }, { label: "API docs", on: true }, { label: "Blog", on: true }, { label: "Pricing", on: true }],
    summary: "Global payments infrastructure for the internet. Powers millions of businesses.",
    tag: "Fintech", tagColor: "#3b82f6",
  },
  {
    domain: "linear.app", name: "Linear", score: 84, size: "50–200 employees",
    tech: ["React", "TypeScript", "Electron", "GraphQL"],
    signals: [{ label: "Hiring", on: true }, { label: "Changelog", on: true }, { label: "API docs", on: true }, { label: "Blog", on: true }],
    summary: "The issue tracker built for high-performance teams. Remarkably fast.",
    tag: "Dev Tools", tagColor: "#93c5fd",
  },
  {
    domain: "vercel.com", name: "Vercel", score: 86, size: "200–500 employees",
    tech: ["Next.js", "React", "Node.js", "Rust"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Changelog", on: true }],
    summary: "Frontend cloud platform. Deploy and scale web applications globally.",
    tag: "Infra", tagColor: "#22c55e",
  },
  {
    domain: "notion.so", name: "Notion", score: 72, size: "200–500 employees",
    tech: ["React", "Amplitude", "Intercom", "AWS"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "Pricing", on: true }, { label: "API docs", on: true }],
    summary: "All-in-one workspace for notes, docs, databases, and wikis.",
    tag: "Productivity", tagColor: "#fbbf24",
  },
  {
    domain: "figma.com", name: "Figma", score: 81, size: "500–1k employees",
    tech: ["React", "WebGL", "C++", "TypeScript"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Pricing", on: true }],
    summary: "Collaborative design tool for building products. Browser-native, real-time.",
    tag: "Design", tagColor: "#f472b6",
  },
  {
    domain: "retool.com", name: "Retool", score: 77, size: "200–500 employees",
    tech: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Pricing", on: true }],
    summary: "Build internal tools remarkably fast. Drag-and-drop UI on top of any data.",
    tag: "Dev Tools", tagColor: "#93c5fd",
  },
  {
    domain: "resend.com", name: "Resend", score: 76, size: "10–50 employees",
    tech: ["React", "Next.js", "TypeScript", "Node.js"],
    signals: [{ label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Changelog", on: true }, { label: "Hiring", on: true }],
    summary: "Email API built for developers. Send transactional email with React components.",
    tag: "Dev Tools", tagColor: "#93c5fd",
  },
  {
    domain: "planetscale.com", name: "PlanetScale", score: 79, size: "50–200 employees",
    tech: ["React", "Go", "MySQL", "Vitess"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Changelog", on: true }],
    summary: "MySQL-compatible serverless database platform built on Vitess.",
    tag: "Infra", tagColor: "#22c55e",
  },
  {
    domain: "cal.com", name: "Cal.com", score: 68, size: "10–50 employees",
    tech: ["Next.js", "React", "TypeScript", "Prisma"],
    signals: [{ label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Hiring", on: false }, { label: "Pricing", on: true }],
    summary: "Open-source scheduling infrastructure. The Calendly alternative.",
    tag: "Productivity", tagColor: "#fbbf24",
  },
  {
    domain: "clerk.com", name: "Clerk", score: 74, size: "10–50 employees",
    tech: ["React", "Next.js", "Node.js", "TypeScript"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "API docs", on: true }, { label: "Changelog", on: true }],
    summary: "Authentication and user management for modern web apps.",
    tag: "Dev Tools", tagColor: "#93c5fd",
  },
  {
    domain: "loom.com", name: "Loom", score: 65, size: "200–500 employees",
    tech: ["React", "AWS", "Segment", "Intercom"],
    signals: [{ label: "Hiring", on: false }, { label: "Blog", on: true }, { label: "Pricing", on: true }, { label: "API docs", on: true }],
    summary: "Async video messaging for work. Record and share videos in seconds.",
    tag: "Productivity", tagColor: "#fbbf24",
  },
  {
    domain: "raycast.com", name: "Raycast", score: 71, size: "10–50 employees",
    tech: ["React", "TypeScript", "Swift", "Electron"],
    signals: [{ label: "Hiring", on: true }, { label: "Blog", on: true }, { label: "Changelog", on: true }, { label: "API docs", on: true }],
    summary: "Supercharged productivity tool for Mac. Extensions, AI, and automation.",
    tag: "Productivity", tagColor: "#fbbf24",
  },
];

function scoreColor(n: number) {
  if (n >= 75) return "#22c55e";
  if (n >= 60) return "#fbbf24";
  return "#f87171";
}

function CompanyCard({ c }: { c: Company }) {
  const color = scoreColor(c.score);
  return (
    <Link
      href={`/r/${c.domain}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div className="feature-card" style={{ height: "100%", cursor: "pointer" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
              width={28} height={28} alt=""
              style={{ borderRadius: 7, flexShrink: 0 }}
            />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#f1f5f9", letterSpacing: "-0.01em" }}>{c.name}</p>
              <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>{c.domain}</p>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 22, fontWeight: 900, margin: 0, color, lineHeight: 1, letterSpacing: "-0.03em" }}>{c.score}</p>
            <p style={{ fontSize: 10, color: "#52525b", margin: 0 }}>/100</p>
          </div>
        </div>

        {/* Tag + size */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.tagColor, background: `${c.tagColor}14`, border: `1px solid ${c.tagColor}28`, padding: "2px 8px", borderRadius: 99 }}>{c.tag}</span>
          <span style={{ fontSize: 11, color: "#52525b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 8px", borderRadius: 99 }}>{c.size}</span>
        </div>

        {/* Summary */}
        <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 14px", lineHeight: 1.6 }}>{c.summary}</p>

        {/* Tech */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {c.tech.map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 500, color: "#3b82f6", background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)", padding: "2px 8px", borderRadius: 99 }}>{t}</span>
          ))}
        </div>

        {/* Signals */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {c.signals.map(s => (
            <span key={s.label} style={{ fontSize: 11, color: s.on ? "#22c55e" : "#52525b", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontWeight: 700 }}>{s.on ? "✓" : "✗"}</span> {s.label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

const tags = ["All", "Fintech", "Dev Tools", "Infra", "Productivity", "Design"];

export default function ExamplesPage() {
  const sorted = [...companies].sort((a, b) => b.score - a.score);

  return (
    <>
      <Navbar active="examples" />
      <main style={{ minHeight: "calc(100vh - 62px)", padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#3b82f6", textTransform: "uppercase", margin: "0 0 14px" }}>Examples</p>
            <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 900, letterSpacing: "-0.035em", margin: "0 0 16px", lineHeight: 1.08 }}>
              See LeadScan in action.
            </h1>
            <p style={{ fontSize: 17, color: "#71717a", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.65 }}>
              Real companies. Real scores. Click any card to run a live scan and get the full report.
            </p>

            {/* Tag filters — decorative, shows the variety */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {tags.map((t, i) => (
                <span key={t} style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 99, background: i === 0 ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`, color: i === 0 ? "#3b82f6" : "#71717a" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="stagger">
            {sorted.map(c => <CompanyCard key={c.domain} c={c} />)}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, textAlign: "center", padding: "48px 32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20 }}>
            <p style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Scan any company in seconds.</p>
            <p style={{ fontSize: 14, color: "#71717a", margin: "0 0 24px" }}>Not just the ones listed here. Any domain, instantly.</p>
            <Link href="/scan" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#3b82f6,#93c5fd)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Open Scanner →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
