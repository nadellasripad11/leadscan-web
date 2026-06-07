"use client";
import { useState, useRef } from "react";
import type { IntelReport } from "@/lib/types";
import { ScoreRing, scoreColor, Card, inputStyle } from "./ui";
import Report from "./Report";

type BatchItem = { domain: string; status: "pending" | "loading" | "done" | "error"; report?: IntelReport; error?: string };

function MiniResult({ item, onClick, selected }: { item: BatchItem; onClick: () => void; selected: boolean }) {
  const color = item.report ? scoreColor(item.report.convictionScore) : "#71717a";
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${selected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.2s" }}>
      <div style={{ width: 36, height: 36, borderRadius: 99, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
        {item.status === "loading" ? <span className="spin" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#22d3ee", borderRadius: 99, display: "inline-block" }} /> : item.status === "error" ? "!" : item.report?.convictionScore ?? "—"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.domain}</p>
        {item.status === "error" && <p style={{ fontSize: 11, color: "#f87171", margin: 0 }}>Failed to scan</p>}
        {item.report && <p style={{ fontSize: 11, color: "#71717a", margin: 0 }}>{item.report.signals.estimatedSize !== "unknown" ? item.report.signals.estimatedSize : "Unknown size"}</p>}
      </div>
      {item.report && <div style={{ fontSize: 11, fontWeight: 700, color, flexShrink: 0 }}>{item.report.convictionScore}/100</div>}
    </div>
  );
}

export default function BatchTab() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const abortRef = useRef(false);

  const done = items.filter(i => i.status === "done" || i.status === "error").length;
  const total = items.length;
  const progress = total ? (done / total) * 100 : 0;

  async function run() {
    const domains = text.split(/[\n,]+/).map(d => d.trim().replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0]).filter(Boolean);
    if (!domains.length) return;
    abortRef.current = false;
    const initial: BatchItem[] = domains.map(d => ({ domain: d, status: "pending" }));
    setItems(initial);
    setRunning(true);
    setSelected(null);

    for (let i = 0; i < domains.length; i++) {
      if (abortRef.current) break;
      setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "loading" } : it));
      try {
        const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: domains[i], ai: !!process.env.NEXT_PUBLIC_AI }) });
        const report: IntelReport = await res.json();
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "done", report } : it));
        if (i === 0) setSelected(domains[i]);
      } catch {
        setItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "error", error: "Scan failed" } : it));
      }
    }
    setRunning(false);
  }

  const sorted = [...items].filter(i => i.status === "done").sort((a, b) => (b.report?.convictionScore ?? 0) - (a.report?.convictionScore ?? 0));
  const selectedItem = items.find(i => i.domain === selected);

  if (items.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card delay={0}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>Batch Scanner</p>
          <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 16px" }}>Paste up to 20 domains — one per line or comma-separated. We'll scan and rank them by conviction score.</p>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"stripe.com\nnotion.so\nlinear.app\nvercel.com"} rows={7} style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", lineHeight: 1.7 }} />
          <button onClick={run} disabled={!text.trim()} style={{ marginTop: 12, width: "100%", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,197,253,0.2))", border: "1px solid rgba(59,130,246,0.3)", color: "#e4e4e7", opacity: text.trim() ? 1 : 0.5 }}>
            Scan all →
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card delay={0}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{running ? `Scanning… ${done}/${total}` : `${sorted.length} results ranked`}</p>
            <p style={{ fontSize: 12, color: "#71717a", margin: 0 }}>{running ? "Processing domains in sequence" : "Click a result to see full report"}</p>
          </div>
          {!running && (
            <button onClick={() => { setItems([]); setText(""); setSelected(null); }} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa" }}>
              New batch
            </button>
          )}
        </div>
        {running && (
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#22d3ee,#93c5fd)", borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(running ? items : [...sorted, ...items.filter(i => i.status === "error")]).map(item => (
            <MiniResult key={item.domain} item={item} selected={selected === item.domain} onClick={() => item.status === "done" && setSelected(item.domain)} />
          ))}
        </div>
      </Card>

      {selectedItem?.report && (
        <div className="anim-fade-up">
          <Report report={selectedItem.report} />
        </div>
      )}
    </div>
  );
}
