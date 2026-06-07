"use client";

import { useState, useRef } from "react";
import { track } from "@vercel/analytics";
import type { IntelReport } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Report from "@/components/Report";
import { ReportSkeleton } from "@/components/ui";
import BatchTab from "@/components/BatchTab";
import CompareTab from "@/components/CompareTab";

type Tab = "analyze" | "batch" | "compare";

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="tab-btn"
      style={{ padding: "9px 22px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s", background: active ? "rgba(59,130,246,0.1)" : "transparent", border: `1px solid ${active ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`, color: active ? "#93c5fd" : "#71717a", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {children}
    </button>
  );
}

export default function ScanPage() {
  const [tab, setTab] = useState<Tab>("analyze");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IntelReport | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function analyze(d?: string) {
    const raw = (d ?? query).trim();
    if (!raw) return;
    const clean = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    setLoading(true); setError(""); setReport(null);
    const t0 = Date.now();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: clean }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
      window.history.pushState({}, "", `/r/${clean}`);
      track("scan_completed", {
        domain: clean,
        score: data.convictionScore,
        industry: data.industry ?? "unknown",
        ai_enabled: data.aiEnabled,
        duration_ms: Date.now() - t0,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      track("scan_failed", { domain: clean, error: msg });
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    if (t !== "analyze") { setReport(null); setError(""); }
    track("tab_switch", { tab: t });
  }

  const examples = ["stripe.com", "linear.app", "vercel.com", "notion.so"];

  return (
    <>
      <Navbar active="scan" />
      <main style={{ minHeight: "calc(100vh - 62px)" }}>

        {/* Search header */}
        <div className="dot-grid" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: report ? "28px 16px 20px" : "48px 16px 36px", transition: "padding 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {!report && tab === "analyze" && (
              <div className="anim-fade-up" style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px", lineHeight: 1.1 }}>
                  <span className="gradient-text">Company Intelligence</span>
                </h1>
                <p style={{ fontSize: 15, color: "#71717a", margin: 0 }}>
                  Tech stack · Growth signals · Conviction score · AI outreach
                </p>
              </div>
            )}

            {report && tab === "analyze" && (
              <div className="anim-fade-in" style={{ marginBottom: 14 }}>
                <button
                  onClick={() => { setReport(null); setQuery(""); window.history.pushState({}, "", "/scan"); setTimeout(() => inputRef.current?.focus(), 80); }}
                  style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 13, padding: 0, display: "flex", alignItems: "center", gap: 5 }}
                >
                  ← Scan another
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="tabs-row" style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
              <TabBtn active={tab === "analyze"} onClick={() => switchTab("analyze")}>Analyze</TabBtn>
              <TabBtn active={tab === "batch"}   onClick={() => switchTab("batch")}>Batch</TabBtn>
              <TabBtn active={tab === "compare"} onClick={() => switchTab("compare")}>Compare</TabBtn>
            </div>

            {tab === "analyze" && (
              <div>
                <div style={{ display: "flex", background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden", boxShadow: "0 16px 60px rgba(0,0,0,0.45)" }}>
                  <span style={{ display: "flex", alignItems: "center", paddingLeft: 16, color: "#52525b", fontSize: 16, flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && analyze()}
                    placeholder="stripe.com"
                    autoFocus
                    style={{ flex: 1, padding: "17px 12px", fontSize: 15, background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontWeight: 500, minWidth: 0 }}
                  />
                  <button
                    onClick={() => analyze()}
                    disabled={loading || !query.trim()}
                    style={{ padding: "0 20px", margin: 6, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", background: loading ? "rgba(255,255,255,0.04)" : "#3b82f6", border: "none", color: loading ? "#71717a" : "#fff", opacity: !query.trim() && !loading ? 0.45 : 1, transition: "opacity 0.2s", flexShrink: 0, whiteSpace: "nowrap", boxShadow: query.trim() && !loading ? "0 0 14px rgba(59,130,246,0.3)" : "none" }}
                  >
                    {loading
                      ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="anim-spin" style={{ display: "inline-block", width: 13, height: 13, border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "#a1a1aa", borderRadius: "50%" }} />Scanning</span>
                      : "Scan →"}
                  </button>
                </div>

                {!report && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#52525b" }}>Try:</span>
                    {examples.map(ex => (
                      <button key={ex} onClick={() => { setQuery(ex); analyze(ex); track("example_clicked", { domain: ex }); }} style={{ fontSize: 12, color: "#71717a", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 99, padding: "3px 12px", cursor: "pointer" }}>
                        {ex}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="anim-fade-up" style={{ marginTop: 14, padding: "12px 18px", borderRadius: 10, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: 13 }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 100px" }}>
          {tab === "analyze" && (
            <>
              {loading && <ReportSkeleton />}
              {report && !loading && <Report report={report} />}
              {!report && !loading && (
                <div className="anim-fade-up" style={{ animationDelay: "0.25s", marginTop: 40 }}>
                  <div className="grid-2col" style={{ gap: 14, marginBottom: 14 }}>
                    {[
                      { icon: "⚡", color: "#fbbf24", title: "Instant results", desc: "Full company report in under 5 seconds." },
                      { icon: "🔍", color: "#3b82f6", title: "Tech detection", desc: "40+ technologies detected from HTML. No API needed." },
                      { icon: "📊", color: "#93c5fd", title: "Conviction score", desc: "0–100 score from 4 weighted signals." },
                      { icon: "✉",  color: "#22c55e", title: "AI outreach", desc: "Personalized cold email, LinkedIn & call opener." },
                    ].map(({ icon, color, title, desc }) => (
                      <div key={title} className="feature-card">
                        <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
                        <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>{title}</p>
                        <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.55 }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "16px 18px", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
                    <p style={{ fontSize: 11, color: "#52525b", margin: "0 0 8px", fontWeight: 600, letterSpacing: "0.08em" }}>ALSO AVAILABLE AS CLI</p>
                    <code style={{ fontSize: 13, color: "#3b82f6" }}>npx leadscan analyze stripe.com</code>
                    <span style={{ fontSize: 12, color: "#27272a", marginLeft: 14 }}>
                      · <a href="/docs#cli" style={{ color: "#52525b", textDecoration: "none" }}>docs</a>
                      {" · "}
                      <a href="https://npmjs.com/package/leadscan" target="_blank" rel="noopener noreferrer" style={{ color: "#52525b", textDecoration: "none" }}>npm</a>
                      {" · "}
                      <a href="https://github.com/nadellasripad11/leadscan" target="_blank" rel="noopener noreferrer" style={{ color: "#52525b", textDecoration: "none" }}>GitHub</a>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "batch"   && <BatchTab />}
          {tab === "compare" && <CompareTab />}
        </div>
      </main>
    </>
  );
}
