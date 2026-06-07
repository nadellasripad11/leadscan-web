import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ScrollAnimator from "@/components/ScrollAnimator";

/* ─── Icons ─── */
function IconBolt()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function IconSearch()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function IconChart()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function IconMail()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function IconLayers()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>; }
function IconBalance() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>; }

/* ─── Radar logo mark (matches Navbar) ─── */
function LogoMark({ size = 24 }: { size?: number }) {
  const r = Math.round(size * 0.28);
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.28),
      background: "linear-gradient(135deg,#5b21b6,#7c3aed 55%,#a78bfa)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 20 20" fill="none">
        <circle cx="4" cy="16" r="2.3" fill="white"/>
        <path d="M4 11 A5 5 0 0 1 9 16"         stroke="white" strokeWidth="2.1" strokeLinecap="round"/>
        <path d="M4 6.5 A9.5 9.5 0 0 1 13.5 16" stroke="white" strokeWidth="2.1" strokeLinecap="round" opacity="0.6"/>
        <path d="M4 2 A14 14 0 0 1 18 16"        stroke="white" strokeWidth="2.1" strokeLinecap="round" opacity="0.3"/>
      </svg>
    </div>
  );
}

/* ─── Product Mockup ─── */
function ProductMockup() {
  const tech = [
    { name: "React",      color: "#60a5fa", bg: "rgba(96,165,250,0.09)"  },
    { name: "Next.js",    color: "#a1a1aa", bg: "rgba(161,161,170,0.07)" },
    { name: "TypeScript", color: "#a78bfa", bg: "rgba(167,139,250,0.09)" },
    { name: "AWS",        color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
    { name: "Stripe",     color: "#a78bfa", bg: "rgba(167,139,250,0.09)" },
  ];
  const signals = [
    { label: "Hiring",    on: true  },
    { label: "Blog",      on: true  },
    { label: "Pricing",   on: true  },
    { label: "API Docs",  on: true  },
    { label: "Investors", on: false },
  ];
  const bars = [
    { label: "Tech Modernity",  v: 85, c: "#a78bfa" },
    { label: "Growth Signals",  v: 80, c: "#a78bfa" },
    { label: "Market Presence", v: 72, c: "#7c3aed" },
    { label: "Contactability",  v: 60, c: "#6d28d9" },
  ];

  return (
    <div style={{ position: "relative", maxWidth: 660, margin: "56px auto 0" }}>
      {/* soft glow behind the card */}
      <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: "80%", height: 80, background: "rgba(124,58,237,0.18)", filter: "blur(50px)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{
        position: "relative",
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 100px rgba(0,0,0,0.65)",
      }}>
        {/* Browser chrome */}
        <div style={{ background: "#0d0d0f", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "11px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.5 }} />)}
          </div>
          <div style={{ flex: 1, margin: "0 10px", background: "#1a1a1f", borderRadius: 5, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6, maxWidth: 260 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize: 11, color: "#52525b", fontFamily: "monospace" }}>leadscan.app/r/stripe.com</span>
          </div>
        </div>

        {/* Report body */}
        <div style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0 }}>S</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "#fafafa" }}>stripe.com</div>
                <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>Financial infrastructure for the internet</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "#22c55e" }}>78</div>
              <div style={{ fontSize: 10, color: "#52525b", fontWeight: 600, letterSpacing: "0.05em" }}>/100</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 9, padding: "12px 14px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.05)" }}>
            {bars.map(b => (
              <div key={b.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#71717a" }}>{b.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.v}</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ height: "100%", width: `${b.v}%`, borderRadius: 2, background: b.c, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#0d0d0f", borderRadius: 9, padding: "11px 13px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#52525b", textTransform: "uppercase", marginBottom: 8 }}>Tech Stack</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {tech.map(t => <span key={t.name} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: t.bg, color: t.color, fontWeight: 600, border: `1px solid ${t.color}22` }}>{t.name}</span>)}
              </div>
            </div>
            <div style={{ background: "#0d0d0f", borderRadius: 9, padding: "11px 13px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#52525b", textTransform: "uppercase", marginBottom: 8 }}>Signals</div>
              {signals.map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 13, height: 13, borderRadius: 3, background: s.on ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${s.on ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.on && <span style={{ fontSize: 7, color: "#22c55e", fontWeight: 800, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 10, color: s.on ? "#a1a1aa" : "#3f3f46" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.22)", cursor: "default" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#a78bfa" }}>Generate AI Outreach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#7c3aed", textTransform: "uppercase", margin: "0 0 14px" }}>
      {children}
    </p>
  );
}

/* ─── Data ─── */
const features = [
  { Icon: IconBolt,    title: "Instant scanning",    desc: "Full company intelligence in under 5 seconds. No waiting, no queues, no account." },
  { Icon: IconSearch,  title: "Tech fingerprinting",  desc: "40+ technologies detected from HTML, JS bundles, and headers. Zero external APIs." },
  { Icon: IconChart,   title: "Conviction score",     desc: "0–100 score across tech modernity, growth signals, market presence, and contactability." },
  { Icon: IconMail,    title: "AI outreach",          desc: "Personalized cold email, LinkedIn message, and call opener — generated for each company." },
  { Icon: IconLayers,  title: "Batch mode",           desc: "Paste up to 20 domains at once. All scanned and ranked by conviction score." },
  { Icon: IconBalance, title: "Compare mode",         desc: "Head-to-head analysis of two companies across every scoring dimension." },
];

const steps = [
  { n: "01", title: "Enter any domain",         desc: "Paste a URL or type a company name. No account, no API key, no setup." },
  { n: "02", title: "We analyze in real time",  desc: "LeadScan fetches the site, fingerprints the stack, reads growth signals, and runs AI analysis." },
  { n: "03", title: "Get your full report",     desc: "Conviction score, tech breakdown, growth signals, contacts, stock data, and AI-written outreach." },
];

const terminalLines = [
  { prompt: true,  color: "#a78bfa", text: "npx leadscan analyze stripe.com" },
  { prompt: false, color: "#3f3f46", text: "" },
  { prompt: false, color: "#22c55e", text: "✓  stripe.com — Conviction: 78/100" },
  { prompt: false, color: "#71717a", text: "   Tech:      React, Next.js, AWS, TypeScript, Stripe" },
  { prompt: false, color: "#71717a", text: "   HQ:        San Francisco, CA    Founded: 2010" },
  { prompt: false, color: "#71717a", text: "   Employees: 8,000+              Size: enterprise" },
  { prompt: false, color: "#71717a", text: "   Signals:   ✓ Hiring  ✓ Blog  ✓ Pricing  ✓ API" },
  { prompt: false, color: "#71717a", text: "   Email:     support@stripe.com" },
  { prompt: false, color: "#3f3f46", text: "" },
  { prompt: false, color: "#7c3aed", text: "   Run `leadscan outreach stripe.com` for AI copy →" },
];

const techList = [
  "React","Next.js","Vue.js","Svelte","TypeScript","Tailwind CSS",
  "AWS","Vercel","Cloudflare","Stripe","PostHog","Segment","HubSpot",
  "Intercom","Amplitude","Linear","Figma","Webflow","Shopify","Framer",
];

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <ScrollAnimator />
      <main>

        {/* ─── Hero ─── */}
        <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px 0", textAlign: "center" }}>
          {/* Single static soft glow — no animation */}
          <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
            {/* Badge */}
            <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#a1a1aa", fontWeight: 500 }}>Free forever · No account needed</span>
            </div>

            <h1 className="anim-fade-up" style={{ fontSize: "clamp(44px,7vw,84px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.04em", margin: "0 0 22px", animationDelay: "0.07s" }}>
              Turn any domain into<br />
              <span className="gradient-text">sales intelligence.</span>
            </h1>

            <p className="anim-fade-up" style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "#71717a", maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.75, animationDelay: "0.14s" }}>
              Tech stack, growth signals, conviction score, and AI outreach for any company — in 5 seconds.
            </p>

            <div className="anim-fade-up" style={{ animationDelay: "0.21s" }}>
              <HeroSearch />
            </div>
          </div>

          {/* Flat product mockup — no 3D tilt, no float */}
          <div className="mockup-hide-mobile anim-fade-up" style={{ maxWidth: 780, margin: "0 auto", animationDelay: "0.3s" }}>
            <ProductMockup />
          </div>
        </section>

        {/* ─── Stats ─── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", marginTop: 80 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px" }} className="grid-stats">
            {[
              { n: "40+",  label: "Technologies detected" },
              { n: "4",    label: "Weighted score signals" },
              { n: "< 5s", label: "Average scan time" },
              { n: "Free", label: "No account required" },
            ].map(({ n, label }, i) => (
              <div key={n} className="stat-item" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 5px", color: "#f1f5f9" }}>{n}</p>
                <p style={{ fontSize: 12, color: "#52525b", margin: 0, fontWeight: 500, letterSpacing: "0.01em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Tech list ─── */}
        <div style={{ padding: "48px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ textAlign: "center", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#3f3f46", textTransform: "uppercase", marginBottom: 20 }}>
            Detects 40+ technologies including
          </p>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {techList.map(item => (
              <span key={item} style={{ fontSize: 12, fontWeight: 500, color: "#52525b", padding: "4px 14px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", whiteSpace: "nowrap" }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Features ─── */}
        <section style={{ padding: "88px 20px" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }} data-reveal>
              <SectionLabel>Features</SectionLabel>
              <h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1.1 }}>
                Everything you need to<br />qualify leads faster.
              </h2>
              <p style={{ fontSize: 15, color: "#71717a", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>One URL is all you need. LeadScan does the rest.</p>
            </div>
            <div className="grid-features">
              {features.map(({ Icon, title, desc }, i) => (
                <div key={title} className="feature-card" data-reveal data-delay={String((i % 3) + 1)}>
                  <div style={{ color: "#7c3aed", marginBottom: 16, opacity: 0.9 }}>
                    <Icon />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em", color: "#fafafa" }}>{title}</p>
                  <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.75 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "88px 20px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }} data-reveal>
              <SectionLabel>How it works</SectionLabel>
              <h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>
                Three steps.<br />One complete report.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.map(({ n, title, desc }, i) => (
                <div key={n} className="step-card" data-reveal data-delay={String(i + 1)}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", fontFamily: "'SF Mono','Fira Code',monospace", letterSpacing: "0.05em", padding: "8px 13px", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.16)", borderRadius: 8, flexShrink: 0, lineHeight: 1 }}>
                    {n}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{title}</p>
                    <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.75 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CLI ─── */}
        <section style={{ padding: "88px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }} className="grid-cli">
            <div data-reveal>
              <SectionLabel>CLI tool</SectionLabel>
              <h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>Power users<br />get a terminal too.</h2>
              <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.8, margin: "0 0 32px", maxWidth: 380 }}>
                Same intelligence, right in your shell. Pipe into scripts, CRMs, or sales workflows. Runs instantly with npx.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://npmjs.com/package/leadscan" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  npm ↗
                </a>
                <a href="https://github.com/nadellasripad11/leadscan" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  GitHub ↗
                </a>
              </div>
            </div>

            <div data-reveal data-delay="2" style={{ background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
              <div style={{ background: "#111113", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 7 }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.5 }} />)}
                <span style={{ fontSize: 11, color: "#3f3f46", marginLeft: 8, fontFamily: "monospace" }}>zsh — leadscan</span>
              </div>
              <div style={{ padding: "20px 22px", fontFamily: "'SF Mono','Fira Code',monospace" }}>
                {terminalLines.map((line, i) => (
                  <div key={i} style={{ fontSize: 12, lineHeight: 1.9, color: line.color, display: "flex" }}>
                    {line.prompt && <span style={{ color: "#22c55e", marginRight: 9, flexShrink: 0 }}>$</span>}
                    {!line.prompt && <span style={{ width: 21, flexShrink: 0 }} />}
                    <span>{line.text}</span>
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                  <span style={{ color: "#22c55e", marginRight: 9 }}>$</span>
                  <span style={{ display: "inline-block", width: 7, height: 14, background: "#7c3aed", borderRadius: 1, opacity: 0.6, animation: "pulseDot 1.1s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div data-reveal>
              <SectionLabel>Get started</SectionLabel>
            </div>
            <h2 data-reveal data-delay="1" style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, letterSpacing: "-0.035em", margin: "0 0 18px", lineHeight: 1.06 }}>
              Start scanning your<br />leads for free.
            </h2>
            <p data-reveal data-delay="2" style={{ fontSize: 15, color: "#71717a", margin: "0 0 40px", lineHeight: 1.7 }}>
              No account. No credit card. Just a domain.
            </p>
            <div data-reveal data-delay="3">
              <a href="/scan" className="btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Open the scanner
              </a>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px" }}>
          <div className="footer-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LogoMark size={24} />
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
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="footer-link">
                  {label}
                </a>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#3f3f46", margin: 0 }}>Built by Sripad Nadella</p>
          </div>
        </footer>

      </main>
    </>
  );
}
