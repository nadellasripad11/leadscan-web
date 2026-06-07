"use client";
import { useState } from "react";
import type { IntelReport, OutreachResult, StockData } from "@/lib/types";
import { ScoreRing, ScoreBar, TechBadge, Signal, Card, CardTitle, inputStyle } from "./ui";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n}M`;
}

const SOCIAL_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  linkedin:  { label: "LinkedIn",  color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.22)" },
  twitter:   { label: "Twitter/X", color: "#a1a1aa", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.18)" },
  github:    { label: "GitHub",    color: "#a1a1aa", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.18)" },
  crunchbase:{ label: "Crunchbase",color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.22)"  },
  facebook:  { label: "Facebook",  color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.22)"  },
  youtube:   { label: "YouTube",   color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)" },
  instagram: { label: "Instagram", color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.22)" },
};

// ─── sub-components ───────────────────────────────────────────────────────────

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#52525b", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", margin: 0 }}>{value}</p>
    </div>
  );
}

function DataRow({ fields }: { fields: { label: string; value: string; color?: string; mono?: boolean }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
      {fields.map(({ label, value, color, mono }) => (
        <div key={label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "11px 14px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: "#52525b", textTransform: "uppercase", margin: "0 0 5px" }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: color ?? "#e4e4e7", margin: 0, fontFamily: mono ? "'SF Mono','Fira Code',monospace" : undefined }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function StockCard({ stock }: { stock: StockData }) {
  const up = stock.changePercent >= 0;
  const changeColor = up ? "#22c55e" : "#f87171";
  return (
    <Card delay={0.22}>
      <CardTitle>Market Data</CardTitle>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f5f9" }}>
              {stock.currency === "USD" ? "$" : ""}{stock.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: changeColor }}>
              {up ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "2px 10px", borderRadius: 99 }}>
              {stock.ticker}
            </span>
            {stock.exchange && (
              <span style={{ fontSize: 12, color: "#52525b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 10px", borderRadius: 99 }}>
                {stock.exchange}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {stock.marketCap != null && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "#52525b", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Market Cap</p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#e4e4e7" }}>{fmt(stock.marketCap)}</p>
            </div>
          )}
          {stock.revenue != null && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "#52525b", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Revenue</p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#e4e4e7" }}>{fmt(stock.revenue)}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function OutreachModal({ outreach, onClose }: { outreach: OutreachResult; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  const sections = [
    { key: "email",    title: "Cold Email",        content: `Subject: ${outreach.email.subject}\n\n${outreach.email.body}` },
    { key: "linkedin", title: "LinkedIn Message",  content: outreach.linkedin },
    { key: "call",     title: "Call Opener",        content: outreach.callOpener },
  ];
  return (
    <div className="anim-fade-in" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0" }}>
      <div className="anim-fade-up outreach-modal-inner" onClick={e => e.stopPropagation()} style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "22px 22px 0 0", padding: 28, maxWidth: 620, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Outreach for {outreach.domain}</p>
          <button onClick={onClose} style={{ color: "#71717a", background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        {sections.map(({ key, title, content }) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#71717a", textTransform: "uppercase", margin: 0 }}>{title}</p>
              <button onClick={() => copy(content, key)} style={{ fontSize: 11, color: copied === key ? "#22c55e" : "#71717a", background: "none", border: "none", cursor: "pointer" }}>
                {copied === key ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 13, color: "#e4e4e7", whiteSpace: "pre-line", lineHeight: 1.7, margin: 0 }}>{content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportButton({ report }: { report: IntelReport }) {
  function exportCSV() {
    const allTech = Object.values(report.techStack).flat().join("; ");
    const p = report.profile;
    const rows = [
      ["Domain","Score","Tech Modernity","Growth Signals","Market Presence","Contactability","Tech Stack","Hiring","Has Pricing","Has API","Has Blog","Funded","Employees","HQ","Founded","Stock Ticker","Stock Price","Revenue","Emails","LinkedIn","Twitter","GitHub"],
      [
        report.domain, report.convictionScore,
        report.scoreBreakdown.techModernity, report.scoreBreakdown.growthSignals,
        report.scoreBreakdown.marketPresence, report.scoreBreakdown.contactability,
        allTech,
        report.signals.isHiring, report.signals.hasPricing, report.signals.hasAPIDoc,
        report.signals.hasBlog, report.signals.hasInvestors,
        p?.employeeCount ?? "", p?.headquarters ?? "", p?.founded ?? "",
        p?.stock?.ticker ?? "", p?.stock?.price ?? "", p?.stock?.revenue ? `$${p.stock.revenue}M` : "",
        report.emails.join("; "),
        report.socialLinks.linkedin ?? "", report.socialLinks.twitter ?? "", report.socialLinks.github ?? "",
      ],
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${report.domain}-leadscan.csv`; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa" }}>
      ↓ Export CSV
    </button>
  );
}

function ShareButton({ domain }: { domain: string }) {
  const [copied, setCopied] = useState(false);
  function share() {
    navigator.clipboard.writeText(`${window.location.origin}/r/${domain}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={share} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#22c55e" : "#a1a1aa", transition: "all 0.2s" }}>
      {copied ? "✓ Copied!" : "↗ Share"}
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Report({ report, hideHeader = false }: { report: IntelReport; hideHeader?: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [role, setRole]         = useState("");
  const [product, setProduct]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [outreach, setOutreach] = useState<OutreachResult | null>(null);

  const allTech = Object.entries(report.techStack)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => ({ cat: k.charAt(0).toUpperCase() + k.slice(1), items: v }));

  const signals: [string, boolean][] = [
    ["Actively hiring",   report.signals.isHiring],
    ["Has pricing page",  report.signals.hasPricing],
    ["Has API / docs",    report.signals.hasAPIDoc],
    ["Has a blog",        report.signals.hasBlog],
    ["Has a changelog",   report.signals.hasChangelog],
    ["Funded / investors",report.signals.hasInvestors],
  ];

  const p = report.profile ?? {};

  /* ── company info fields (always shown) ── */
  function sizeLabel(): string {
    if (p.employeeCount) return p.employeeCount;
    switch (report.signals.estimatedSize) {
      case "solo":       return "1–10";
      case "small":      return "10–50";
      case "mid":        return "50–500";
      case "large":      return "500–5,000";
      case "enterprise": return "5,000+";
      default:           return "—";
    }
  }
  function revenueLabel(): string {
    if (p.stock?.revenue != null) return fmt(p.stock.revenue) + " / yr";
    if (p.stock) return "—";
    return "Private";
  }
  function stockLabel(): string {
    if (!p.stock) return "Not listed";
    const sym = p.stock.currency === "USD" ? "$" : "";
    return `${sym}${p.stock.price.toLocaleString()} (${p.stock.ticker})`;
  }
  function stockColor(): string {
    if (!p.stock) return "#52525b";
    return p.stock.changePercent >= 0 ? "#22c55e" : "#f87171";
  }

  const infoRow1 = [
    { label: "Domain",       value: report.domain, mono: true },
    { label: "Industry",     value: report.industry !== "Unknown" && report.industry ? report.industry : "—" },
    { label: "Company Size", value: sizeLabel() },
    { label: "Headquarters", value: p.headquarters ?? "—" },
  ];
  const infoRow2 = [
    { label: "Founded",     value: p.founded ?? "—" },
    { label: "Revenue",     value: revenueLabel() },
    { label: "Stock Price", value: stockLabel(), color: stockColor() },
    { label: "Hiring",      value: report.signals.isHiring ? "Yes — actively hiring" : "No open roles detected", color: report.signals.isHiring ? "#22c55e" : "#71717a" },
  ];

  const allSocials = Object.entries(report.socialLinks).filter(([, v]) => !!v) as [string, string][];

  async function generate() {
    if (!role.trim() || !product.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: report.domain, role, product }),
      });
      setOutreach(await res.json());
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Score overview ── */}
      {!hideHeader && (
        <Card delay={0}>
          <div className="score-overview">
            <div className="score-ring-wrap">
              <ScoreRing score={report.convictionScore} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, wordBreak: "break-all" }}>{report.domain}</h2>
                {report.signals.estimatedSize !== "unknown" && (
                  <span style={{ fontSize: 12, color: "#71717a", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99, flexShrink: 0 }}>{report.signals.estimatedSize}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <ShareButton domain={report.domain} />
                <ExportButton report={report} />
              </div>
              {report.summary && (
                <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, margin: "0 0 14px" }}>
                  {report.summary.slice(0, 200)}{report.summary.length > 200 ? "…" : ""}
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
        </Card>
      )}

      {/* ── Company Intelligence (always shown) ── */}
      <Card delay={0.05}>
        <CardTitle>Company Intelligence</CardTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DataRow fields={infoRow1} />
          <DataRow fields={infoRow2} />
        </div>

        {/* Locations */}
        {p.locations && p.locations.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: "#52525b", textTransform: "uppercase", margin: "0 0 8px" }}>Office Locations</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.locations.map(loc => (
                <span key={loc} style={{ fontSize: 12, color: "#a1a1aa", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "3px 12px", borderRadius: 99 }}>
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Address */}
        {p.address && (
          <p style={{ fontSize: 12, color: "#71717a", margin: "12px 0 0", display: "flex", alignItems: "flex-start", gap: 6 } as React.CSSProperties}>
            <span>📍</span><span>{p.address}</span>
          </p>
        )}
      </Card>

      {/* ── Tech stack + Signals ── */}
      <div className="grid-2col">
        {allTech.length > 0 && (
          <Card delay={0.1}>
            <CardTitle>Tech Stack</CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allTech.map(({ cat, items }) => (
                <div key={cat}>
                  <p style={{ fontSize: 11, color: "#71717a", margin: "0 0 6px" }}>{cat}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((t: string) => <TechBadge key={t} name={t} />)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        <Card delay={0.15}>
          <CardTitle>Signals</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {signals.map(([l, v]) => <Signal key={l} label={l} value={v} />)}
          </div>
        </Card>
      </div>

      {/* ── Market Data (detailed, only for public companies) ── */}
      {p.stock && <StockCard stock={p.stock} />}

      {/* ── Contacts & Social (always shown) ── */}
      <Card delay={0.25}>
        <CardTitle>Contacts & Social Media</CardTitle>
        {(report.emails.length > 0 || allSocials.length > 0) ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {report.emails.map(e => (
              <a key={e} href={`mailto:${e}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 13, textDecoration: "none" }}>
                ✉ {e}
              </a>
            ))}
            {allSocials.map(([platform, url]) => {
              const meta = SOCIAL_META[platform] ?? { label: platform, color: "#a1a1aa", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };
              return (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontSize: 13, textDecoration: "none" }}>
                  ↗ {meta.label}
                </a>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#52525b", margin: 0 }}>No email addresses or social profiles detected on this page.</p>
        )}
      </Card>

      {/* ── AI Outreach ── */}
      <Card delay={0.3} style={{ border: "1px solid rgba(124,58,237,0.14)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showForm ? 20 : 0 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 3px" }}>Generate Outreach</p>
            <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>AI cold email, LinkedIn message & call opener</p>
          </div>
          <button onClick={() => setShowForm(p => !p)} style={{ padding: "8px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", background: showForm ? "rgba(255,255,255,0.05)" : "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed" }}>
            {showForm ? "Cancel" : "Generate ↗"}
          </button>
        </div>
        {showForm && (
          <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role you're targeting (e.g. Head of Engineering)" style={inputStyle} />
            <input value={product} onChange={e => setProduct(e.target.value)} placeholder="What you're selling (e.g. observability tool)" style={inputStyle} onKeyDown={e => e.key === "Enter" && generate()} />
            <button onClick={generate} disabled={loading || !role.trim() || !product.trim()} style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(167,139,250,0.2))", border: "1px solid rgba(124,58,237,0.3)", color: "#e4e4e7", opacity: (!role.trim() || !product.trim()) ? 0.5 : 1 }}>
              {loading ? "Generating…" : "Write my outreach →"}
            </button>
          </div>
        )}
      </Card>

      {outreach && <OutreachModal outreach={outreach} onClose={() => setOutreach(null)} />}
    </div>
  );
}
