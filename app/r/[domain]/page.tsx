import { cache } from "react";
import type { Metadata } from "next";
import { scrapeCompany } from "@/lib/scraper";
import { buildIntelReport } from "@/lib/scorer";
import { analyzeCompany } from "@/lib/ai";
import type { IntelReport } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Report from "@/components/Report";
import { ScoreRing, ScoreBar } from "@/components/ui";

const getReport = cache(async (domain: string): Promise<IntelReport | null> => {
  try {
    const data = await scrapeCompany(domain);
    let aiSummary;
    if (process.env.GROQ_API_KEY) {
      try { aiSummary = await analyzeCompany(data); } catch {}
    }
    return buildIntelReport(data, aiSummary);
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw);
  const report = await getReport(domain);
  const title = `${domain} — LeadScan`;
  const desc = report?.summary
    ? report.summary.slice(0, 155)
    : `Tech stack, growth signals & conviction score for ${domain}.`;

  return {
    title,
    description: desc,
    openGraph: {
      title: report
        ? `${domain} — ${report.convictionScore}/100 conviction score`
        : title,
      description: desc,
      siteName: "LeadScan",
    },
    twitter: {
      card: "summary",
      title: report ? `${domain} scores ${report.convictionScore}/100 on LeadScan` : title,
      description: desc,
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: raw } = await params;
  const domain = decodeURIComponent(raw);
  const report = await getReport(domain);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 80px" }}>
        {!report ? (
          <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: 18, padding: 36, textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>🔍</p>
            <p style={{ color: "#f87171", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Couldn&apos;t scan {domain}</p>
            <p style={{ color: "#71717a", fontSize: 13, margin: "0 0 24px", lineHeight: 1.6 }}>
              The domain may be unreachable, blocking scrapers, or doesn&apos;t have a public homepage.
            </p>
            <a href="/" style={{ display: "inline-block", padding: "9px 22px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#a1a1aa", fontSize: 13, textDecoration: "none" }}>
              Try another domain
            </a>
          </div>
        ) : (
          <>
            {/* Company hero */}
            <div className="anim-fade-up" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.04),rgba(167,139,250,0.07))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 30px", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <ScoreRing score={report.convictionScore} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      width={22}
                      height={22}
                      alt=""
                      style={{ borderRadius: 5, flexShrink: 0 }}
                    />
                    <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>{domain}</h1>
                    {report.signals.estimatedSize !== "unknown" && (
                      <span style={{ fontSize: 12, color: "#71717a", background: "rgba(255,255,255,0.05)", padding: "2px 9px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.07)" }}>
                        {report.signals.estimatedSize}
                      </span>
                    )}
                  </div>
                  {report.summary && (
                    <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.65, margin: "0 0 18px" }}>
                      {report.summary}
                    </p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <ScoreBar label="Tech modernity"  value={report.scoreBreakdown.techModernity}  delay={0}   />
                    <ScoreBar label="Growth signals"  value={report.scoreBreakdown.growthSignals}  delay={80}  />
                    <ScoreBar label="Market presence" value={report.scoreBreakdown.marketPresence} delay={160} />
                    <ScoreBar label="Contactability"  value={report.scoreBreakdown.contactability} delay={240} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tech stack, signals, contacts, outreach */}
            <Report report={report} hideHeader />

            <div style={{ marginTop: 36, textAlign: "center" }}>
              <a href="/scan" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 99, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.22)", color: "#7c3aed", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                Scan another company →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
