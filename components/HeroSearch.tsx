"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = ["stripe.com", "linear.app", "notion.so", "vercel.com"];

export default function HeroSearch() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function go(d?: string) {
    const raw = (d ?? domain).trim();
    if (!raw) return;
    const clean = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    setLoading(true);
    router.push(`/r/${clean}`);
  }

  return (
    <div className="anim-fade-up" style={{ animationDelay: "0.2s" }}>
      <div
        style={{
          maxWidth: 580,
          margin: "0 auto 14px",
          display: "flex",
          background: "#18181b",
          border: `1px solid ${focused ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.09)"}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: focused
            ? "0 0 0 3px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(0,0,0,0.35)",
          transition: "border-color 0.18s, box-shadow 0.18s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", paddingLeft: 18, color: focused ? "#a78bfa" : "#52525b", transition: "color 0.18s", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && go()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter any domain, e.g. stripe.com"
          autoFocus
          style={{
            flex: 1, padding: "17px 14px", fontSize: 15,
            background: "transparent", border: "none", outline: "none",
            color: "#fafafa", fontWeight: 500, minWidth: 0,
          }}
        />
        <button
          onClick={() => go()}
          disabled={!domain.trim() || loading}
          style={{
            padding: "11px 22px",
            margin: 6,
            borderRadius: 11,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            background: loading ? "rgba(255,255,255,0.04)" : "#7c3aed",
            border: "none",
            color: loading ? "#71717a" : "#fff",
            opacity: !domain.trim() && !loading ? 0.45 : 1,
            transition: "opacity 0.18s, background 0.18s, box-shadow 0.18s",
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxShadow: domain.trim() && !loading ? "0 0 14px rgba(124,58,237,0.3)" : "none",
          }}
        >
          {loading
            ? <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span className="anim-spin" style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(255,255,255,0.12)", borderTopColor: "#a78bfa", borderRadius: "50%" }} />
                Scanning
              </span>
            : "Scan →"
          }
        </button>
      </div>

      {/* Example pills */}
      <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#52525b", lineHeight: "26px" }}>Try:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => go(ex)}
            style={{
              fontSize: 12, color: "#71717a",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 99, padding: "3px 13px",
              cursor: "pointer", transition: "color 0.15s, border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#a78bfa"; el.style.borderColor = "rgba(124,58,237,0.3)"; el.style.background = "rgba(124,58,237,0.06)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#71717a"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.background = "rgba(255,255,255,0.03)"; }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
