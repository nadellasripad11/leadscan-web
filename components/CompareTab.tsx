"use client";
import { useState } from "react";
import type { IntelReport } from "@/lib/types";
import { scoreColor, Card, CardTitle, inputStyle } from "./ui";

function DomainInput({ value, onChange, placeholder, disabled }: { value: string; onChange: (v: string) => void; placeholder: string; disabled?: boolean }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ ...inputStyle, flex: 1 }} />;
}

function CompareRing({ score, winner }: { score: number; winner: boolean }) {
  const size = 100;
  const r = size * 0.367, circ = 2 * Math.PI * r;
  const color = scoreColor(score);
  const prog = score;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {winner && <div style={{ position: "absolute", inset: -6, borderRadius: 99, border: "2px solid rgba(74,222,128,0.4)", boxShadow: "0 0 20px rgba(74,222,128,0.15)" }} />}
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.067} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.067} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (prog / 100) * circ}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "#71717a", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function BarRow({ label, a, b }: { label: string; a: number; b: number }) {
  const winner = a > b ? "a" : b > a ? "b" : "tie";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: 10, alignItems: "center", padding: "6px 0" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: winner === "a" ? 700 : 400, color: winner === "a" ? "#4ade80" : "#71717a" }}>{a}</span>
        <div style={{ width: 80, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", direction: "rtl" }}>
          <div style={{ height: "100%", width: `${a}%`, background: winner === "a" ? "#4ade80" : scoreColor(a), borderRadius: 99 }} />
        </div>
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", margin: 0 }}>{label}</p>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ width: 80, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${b}%`, background: winner === "b" ? "#4ade80" : scoreColor(b), borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: winner === "b" ? 700 : 400, color: winner === "b" ? "#4ade80" : "#71717a" }}>{b}</span>
      </div>
    </div>
  );
}

function SignalRow({ label, a, b }: { label: string; a: boolean; b: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: 10, alignItems: "center", padding: "4px 0" }}>
      <div style={{ textAlign: "right", fontSize: 13, color: a ? "#4ade80" : "#f87171", fontWeight: 700 }}>{a ? "✓" : "✗"}</div>
      <p style={{ fontSize: 11, color: "#71717a", textAlign: "center", margin: 0 }}>{label}</p>
      <div style={{ fontSize: 13, color: b ? "#4ade80" : "#f87171", fontWeight: 700 }}>{b ? "✓" : "✗"}</div>
    </div>
  );
}

export default function CompareTab() {
  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportA, setReportA] = useState<IntelReport | null>(null);
  const [reportB, setReportB] = useState<IntelReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function compare() {
    if (!domainA.trim() || !domainB.trim()) return;
    setLoading(true); setError(null); setReportA(null); setReportB(null);
    try {
      const [rA, rB] = await Promise.all([
        fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: domainA.trim() }) }).then(r => r.json()),
        fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: domainB.trim() }) }).then(r => r.json()),
      ]);
      if (rA.error) throw new Error(rA.error);
      if (rB.error) throw new Error(rB.error);
      setReportA(rA); setReportB(rB);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    } finally { setLoading(false); }
  }

  const winner = reportA && reportB ? (reportA.convictionScore > reportB.convictionScore ? "a" : reportB.convictionScore > reportA.convictionScore ? "b" : "tie") : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card delay={0}>
        <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>Head-to-Head Compare</p>
        <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 16px" }}>Compare two companies side by side to see which is the stronger lead.</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <DomainInput value={domainA} onChange={setDomainA} placeholder="stripe.com" disabled={loading} />
          <span style={{ color: "#71717a", fontWeight: 700, flexShrink: 0 }}>vs</span>
          <DomainInput value={domainB} onChange={setDomainB} placeholder="paddle.com" disabled={loading} />
        </div>
        <button onClick={compare} disabled={loading || !domainA.trim() || !domainB.trim()} style={{ marginTop: 12, width: "100%", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,197,253,0.2))", border: "1px solid rgba(59,130,246,0.3)", color: "#e4e4e7", opacity: (!domainA.trim() || !domainB.trim() || loading) ? 0.5 : 1 }}>
          {loading ? <><span className="spin" style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "#22d3ee", borderRadius: 99, display: "inline-block", marginRight: 8 }} />Comparing…</> : "Compare →"}
        </button>
        {error && <p style={{ color: "#f87171", fontSize: 13, margin: "12px 0 0", textAlign: "center" }}>{error}</p>}
      </Card>

      {reportA && reportB && (
        <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card delay={0.05}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <CompareRing score={reportA.convictionScore} winner={winner === "a"} />
                <p style={{ fontWeight: 700, fontSize: 14, margin: 0, textAlign: "center" }}>{reportA.domain}</p>
                {reportA.signals.estimatedSize !== "unknown" && <span style={{ fontSize: 11, color: "#71717a", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{reportA.signals.estimatedSize}</span>}
                {winner === "a" && <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(74,222,128,0.3)" }}>Winner</span>}
              </div>
              <div style={{ color: "#71717a", fontWeight: 800, fontSize: 18 }}>VS</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <CompareRing score={reportB.convictionScore} winner={winner === "b"} />
                <p style={{ fontWeight: 700, fontSize: 14, margin: 0, textAlign: "center" }}>{reportB.domain}</p>
                {reportB.signals.estimatedSize !== "unknown" && <span style={{ fontSize: 11, color: "#71717a", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{reportB.signals.estimatedSize}</span>}
                {winner === "b" && <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(74,222,128,0.3)" }}>Winner</span>}
              </div>
            </div>
          </Card>

          <Card delay={0.1}>
            <CardTitle>Score Breakdown</CardTitle>
            <BarRow label="Tech Modernity" a={reportA.scoreBreakdown.techModernity} b={reportB.scoreBreakdown.techModernity} />
            <BarRow label="Growth Signals" a={reportA.scoreBreakdown.growthSignals} b={reportB.scoreBreakdown.growthSignals} />
            <BarRow label="Market Presence" a={reportA.scoreBreakdown.marketPresence} b={reportB.scoreBreakdown.marketPresence} />
            <BarRow label="Contactability" a={reportA.scoreBreakdown.contactability} b={reportB.scoreBreakdown.contactability} />
          </Card>

          <Card delay={0.15}>
            <CardTitle>Signals</CardTitle>
            <SignalRow label="Actively hiring" a={reportA.signals.isHiring} b={reportB.signals.isHiring} />
            <SignalRow label="Has pricing page" a={reportA.signals.hasPricing} b={reportB.signals.hasPricing} />
            <SignalRow label="Has API / docs" a={reportA.signals.hasAPIDoc} b={reportB.signals.hasAPIDoc} />
            <SignalRow label="Has a blog" a={reportA.signals.hasBlog} b={reportB.signals.hasBlog} />
            <SignalRow label="Has a changelog" a={reportA.signals.hasChangelog} b={reportB.signals.hasChangelog} />
            <SignalRow label="Funded / investors" a={reportA.signals.hasInvestors} b={reportB.signals.hasInvestors} />
          </Card>
        </div>
      )}
    </div>
  );
}
