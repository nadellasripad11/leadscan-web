"use client";
import { useState, useEffect } from "react";

export function scoreColor(n: number) {
  if (n >= 75) return "#22c55e";
  if (n >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ScoreBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 100 + delay); return () => clearTimeout(t); }, [value, delay]);
  const color = scoreColor(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, minWidth: 0 }}>
      <span style={{ color: "#71717a", minWidth: 90, width: 110, flexShrink: 1, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div style={{ flex: 1, minWidth: 20, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 99, transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)", opacity: 0.9 }} />
      </div>
      <span style={{ color, fontWeight: 700, width: 26, textAlign: "right", flexShrink: 0, fontSize: 12 }}>{value}</span>
    </div>
  );
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const [prog, setProg] = useState(0);
  useEffect(() => { const t = setTimeout(() => setProg(score), 300); return () => clearTimeout(t); }, [score]);
  const r = size * 0.367, circ = 2 * Math.PI * r, color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.067} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.067} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (prog / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.233, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.092, color: "#52525b", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

export function TechBadge({ name }: { name: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      fontSize: 12, fontWeight: 500,
      background: "rgba(59,130,246,0.08)",
      color: "#93c5fd",
      border: "1px solid rgba(59,130,246,0.18)",
    }}>
      {name}
    </span>
  );
}

export function Signal({ label, value }: { label: string; value: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        background: value ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${value ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {value
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="8"  height="8"  viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        }
      </div>
      <span style={{ color: value ? "#e4e4e7" : "#71717a" }}>{label}</span>
    </div>
  );
}

export function Card({ children, style = {}, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <div className="anim-fade-up" style={{
      background: "#18181b",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: 24,
      minWidth: 0,
      overflow: "hidden",
      animationDelay: `${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
      color: "#52525b", textTransform: "uppercase", margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

export function Skeleton({ h = 20, w = "100%" }: { h?: number; w?: string }) {
  return <div className="shimmer" style={{ height: h, width: w, borderRadius: 6 }} />;
}

export function ReportSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <Skeleton h={11} w="70px" />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <Skeleton /><Skeleton w="80%" /><Skeleton w="55%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 9, fontSize: 13,
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  color: "#e4e4e7", outline: "none",
};
