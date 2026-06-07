import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ScrollAnimator from "@/components/ScrollAnimator";

/* ─── Radar logo mark ─── */
function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), background: "linear-gradient(135deg,#5b21b6,#7c3aed 55%,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 20 20" fill="none">
        <circle cx="4" cy="16" r="2.3" fill="white"/>
        <path d="M4 11 A5 5 0 0 1 9 16"         stroke="white" strokeWidth="2.1" strokeLinecap="round"/>
        <path d="M4 6.5 A9.5 9.5 0 0 1 13.5 16" stroke="white" strokeWidth="2.1" strokeLinecap="round" opacity="0.6"/>
        <path d="M4 2 A14 14 0 0 1 18 16"        stroke="white" strokeWidth="2.1" strokeLinecap="round" opacity="0.3"/>
      </svg>
    </div>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <ScrollAnimator />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>

        {/* ─── Hero ─── */}
        <section style={{ padding: "96px 0 80px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 680 }}>

            <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 32, padding: "4px 12px 4px 8px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#71717a", fontWeight: 500 }}>Free forever · No account needed</span>
            </div>

            <h1 className="anim-fade-up" style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.04em", margin: "0 0 20px", color: "#fafafa", animationDelay: "0.06s" }}>
              Company intelligence<br />
              <span style={{ color: "#7c3aed" }}>for sales teams.</span>
            </h1>

            <p className="anim-fade-up" style={{ fontSize: 17, color: "#71717a", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 520, animationDelay: "0.12s" }}>
              Scan any domain and instantly get the tech stack, growth signals, conviction score, and AI-written outreach — in under 5 seconds.
            </p>

            <div className="anim-fade-up" style={{ animationDelay: "0.18s" }}>
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section style={{ padding: "48px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[
            { n: "40+",   label: "technologies detected" },
            { n: "< 5s",  label: "average scan time" },
            { n: "0–100", label: "conviction score" },
            { n: "Free",  label: "no account required" },
          ].map(({ n, label }) => (
            <div key={n}>
              <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 3px", color: "#f1f5f9" }}>{n}</p>
              <p style={{ fontSize: 13, color: "#52525b", margin: 0 }}>{label}</p>
            </div>
          ))}
        </section>

        {/* ─── What you get ─── */}
        <section style={{ padding: "80px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#7c3aed", textTransform: "uppercase", margin: "0 0 12px" }}>What you get</p>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 56px", lineHeight: 1.1, color: "#fafafa" }}>
            One URL. A complete picture.
          </h2>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>

            {/* Wide — Tech stack */}
            <div style={{ gridColumn: "span 8", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 30px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 14px" }}>Tech Stack Detection</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", margin: "0 0 8px", letterSpacing: "-0.01em" }}>See exactly what a company is built on.</p>
              <p style={{ fontSize: 13, color: "#52525b", margin: "0 0 20px", lineHeight: 1.7 }}>40+ technologies fingerprinted directly from HTML, scripts, and headers. No paid data sources.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["React","Next.js","TypeScript","AWS","Stripe","PostHog","HubSpot","Vercel"].map(t => (
                  <span key={t} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "rgba(124,58,237,0.08)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.15)", fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Tall — Score */}
            <div style={{ gridColumn: "span 4", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 14px" }}>Conviction Score</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Qualify leads in seconds.</p>
                <p style={{ fontSize: 13, color: "#52525b", margin: 0, lineHeight: 1.7 }}>0–100 score weighted across tech modernity, growth signals, market presence, and contactability.</p>
              </div>
              <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.05em", color: "#22c55e", lineHeight: 1 }}>78</span>
                <span style={{ fontSize: 16, color: "#3f3f46", fontWeight: 600 }}>/100</span>
              </div>
            </div>

            {/* AI Outreach */}
            <div style={{ gridColumn: "span 4", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 30px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 14px" }}>AI Outreach</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Skip the blank page.</p>
              <p style={{ fontSize: 13, color: "#52525b", margin: 0, lineHeight: 1.7 }}>Cold email, LinkedIn message, and call opener — written for that specific company.</p>
            </div>

            {/* Growth signals */}
            <div style={{ gridColumn: "span 4", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 30px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 14px" }}>Growth Signals</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Know before you call.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Actively hiring","Has pricing page","Has API docs","Investor-backed"].map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 12, color: "#a1a1aa" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company profile */}
            <div style={{ gridColumn: "span 4", background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 30px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 14px" }}>Company Profile</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Deep context, instantly.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Founders", "Patrick & John Collison"],
                  ["HQ", "San Francisco, CA"],
                  ["Employees", "8,000+"],
                  ["Founded", "2010"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#52525b" }}>{label}</span>
                    <span style={{ color: "#a1a1aa", fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── How it works ─── */}
        <section style={{ padding: "80px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="grid-cli">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#7c3aed", textTransform: "uppercase", margin: "0 0 12px" }}>How it works</p>
              <h2 style={{ fontSize: "clamp(24px,3.2vw,38px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 40px", lineHeight: 1.1, color: "#fafafa" }}>
                Paste a domain.<br />Get a full report.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { n: "01", title: "Enter any domain", desc: "No account, no API key, no setup required." },
                  { n: "02", title: "We scan in real time", desc: "Tech fingerprinting, signal detection, Wikipedia + stock enrichment, AI analysis." },
                  { n: "03", title: "Get your full report", desc: "Score, tech stack, signals, company profile, and AI-written outreach — ready in seconds." },
                ].map(({ n, title, desc }, i, arr) => (
                  <div key={n} style={{ display: "flex", gap: 20, paddingBottom: i < arr.length - 1 ? 28 : 0, borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", marginBottom: i < arr.length - 1 ? 28 : 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#3f3f46", fontFamily: "monospace", flexShrink: 0, marginTop: 3 }}>{n}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 5px", color: "#e4e4e7" }}>{title}</p>
                      <p style={{ fontSize: 13, color: "#52525b", margin: 0, lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div style={{ background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: "#111113", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 16px", display: "flex", alignItems: "center", gap: 7 }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.45 }} />)}
                <span style={{ fontSize: 11, color: "#3f3f46", marginLeft: 8, fontFamily: "monospace" }}>leadscan</span>
              </div>
              <div style={{ padding: "20px 22px", fontFamily: "'SF Mono','Fira Code',monospace" }}>
                {[
                  { prompt: true,  color: "#a78bfa", text: "npx leadscan analyze stripe.com" },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#22c55e", text: "✓  stripe.com — Conviction: 78/100" },
                  { prompt: false, color: "#71717a", text: "   Tech:      React, Next.js, AWS, Stripe" },
                  { prompt: false, color: "#71717a", text: "   HQ:        San Francisco, CA" },
                  { prompt: false, color: "#71717a", text: "   Employees: 8,000+   Founded: 2010" },
                  { prompt: false, color: "#71717a", text: "   Signals:   ✓ Hiring  ✓ Pricing  ✓ API" },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#7c3aed", text: "   leadscan outreach stripe.com →" },
                ].map((line, i) => (
                  <div key={i} style={{ fontSize: 12, lineHeight: 1.9, color: line.color, display: "flex" }}>
                    {line.prompt && <span style={{ color: "#22c55e", marginRight: 9, flexShrink: 0 }}>$</span>}
                    {!line.prompt && <span style={{ width: 21, flexShrink: 0 }} />}
                    <span>{line.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                  <span style={{ color: "#22c55e", marginRight: 9 }}>$</span>
                  <span style={{ display: "inline-block", width: 7, height: 14, background: "#7c3aed", borderRadius: 1, opacity: 0.5, animation: "pulseDot 1.1s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Also a CLI ─── */}
        <section style={{ padding: "64px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#fafafa", margin: "0 0 6px" }}>Also available as a CLI</p>
            <p style={{ fontSize: 13, color: "#52525b", margin: 0 }}>Pipe into scripts, CRMs, or sales workflows.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <code style={{ fontSize: 13, color: "#a78bfa", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 8, padding: "8px 16px", fontFamily: "monospace" }}>
              npx leadscan analyze stripe.com
            </code>
            <a href="https://npmjs.com/package/leadscan" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#71717a", textDecoration: "none", fontWeight: 500 }}>npm ↗</a>
            <a href="https://github.com/nadellasripad11/leadscan" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#71717a", textDecoration: "none", fontWeight: 500 }}>GitHub ↗</a>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ padding: "100px 0 80px" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.04, color: "#fafafa" }}>
            Start scanning your<br />leads for free.
          </h2>
          <p style={{ fontSize: 16, color: "#52525b", margin: "0 0 36px", lineHeight: 1.7 }}>No account. No credit card. Just a domain.</p>
          <Link href="/scan" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 10, background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 0 0 1px rgba(124,58,237,0.5) inset" }}>
            Open the scanner →
          </Link>
        </section>

      </main>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px" }}>
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LogoMark size={22} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#fafafa" }}>LeadScan</span>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {[
              { label: "Scanner",      href: "/scan" },
              { label: "How it works", href: "/how-it-works" },
              { label: "Examples",     href: "/examples" },
              { label: "Docs",         href: "/docs" },
              { label: "GitHub",       href: "https://github.com/nadellasripad11/leadscan" },
              { label: "npm",          href: "https://npmjs.com/package/leadscan" },
              { label: "Privacy",      href: "/privacy" },
              { label: "Terms",        href: "/terms" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="footer-link">{label}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#3f3f46", margin: 0 }}>Built by Sripad Nadella</p>
        </div>
      </footer>
    </>
  );
}
