import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ScrollAnimator from "@/components/ScrollAnimator";

export default function LandingPage() {
  const features = [
    {
      n: "01",
      title: "Tech stack detection",
      desc: "40+ technologies fingerprinted directly from HTML, scripts, and response headers. No paid data sources.",
    },
    {
      n: "02",
      title: "Growth signals",
      desc: "Hiring activity, pricing page presence, API documentation, and funding data — pulled live from the domain.",
    },
    {
      n: "03",
      title: "Conviction score",
      desc: "0–100 score weighted across tech modernity, growth signals, market presence, and contactability.",
    },
    {
      n: "04",
      title: "AI outreach",
      desc: "Personalized cold email, LinkedIn message, and call opener written specifically for that company.",
    },
  ];

  return (
    <>
      <Navbar />
      <ScrollAnimator />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>

        {/* Hero */}
        <section style={{ padding: "110px 0 90px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 style={{
            fontSize: "clamp(48px,7.5vw,96px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            margin: "0 0 32px",
            color: "#fafafa",
          }}>
            Company<br />
            intelligence<br />
            <em style={{ fontStyle: "italic", color: "#71717a" }}>in seconds.</em>
          </h1>

          <p style={{
            fontSize: 18,
            color: "#52525b",
            lineHeight: 1.7,
            margin: "0 0 52px",
            maxWidth: 420,
          }}>
            Scan any domain. Get tech stack, growth signals, conviction score, and AI outreach — free, no account needed.
          </p>

          <HeroSearch />

          <p style={{ marginTop: 20, fontSize: 13, color: "#3f3f46" }}>
            Try:&nbsp;
            <a href="/r/stripe.com" style={{ color: "#52525b", textDecoration: "none" }}>stripe.com</a>
            {" · "}
            <a href="/r/linear.app" style={{ color: "#52525b", textDecoration: "none" }}>linear.app</a>
            {" · "}
            <a href="/r/vercel.com" style={{ color: "#52525b", textDecoration: "none" }}>vercel.com</a>
          </p>
        </section>

        {/* Numbers */}
        <section style={{ padding: "56px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 64, flexWrap: "wrap" }}>
          {[
            { n: "40+",   label: "technologies detected" },
            { n: "<5s",   label: "average scan time" },
            { n: "0–100", label: "conviction score" },
            { n: "Free",  label: "no account required" },
          ].map(({ n, label }) => (
            <div key={n}>
              <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 4px", color: "#fafafa" }}>{n}</p>
              <p style={{ fontSize: 13, color: "#3f3f46", margin: 0 }}>{label}</p>
            </div>
          ))}
        </section>

        {/* Features */}
        <section style={{ padding: "96px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{
            fontSize: "clamp(28px,4vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            margin: "0 0 72px",
            lineHeight: 1.05,
            color: "#fafafa",
          }}>
            One URL.<br />A full picture.
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {features.map(({ n, title, desc }, i) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr 1fr",
                  gap: "0 48px",
                  alignItems: "start",
                  padding: "36px 0",
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "#3f3f46", fontFamily: "monospace", paddingTop: 3 }}>{n}</span>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#e4e4e7", margin: 0, letterSpacing: "-0.02em" }}>{title}</p>
                <p style={{ fontSize: 14, color: "#52525b", margin: 0, lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "96px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 96px", alignItems: "start" }} className="grid-cli">

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 20px" }}>How it works</p>
              <h2 style={{
                fontSize: "clamp(26px,3.5vw,42px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: 0,
                lineHeight: 1.1,
                color: "#fafafa",
              }}>
                Paste a domain.<br />Get a full report.
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", paddingTop: 4 }}>
              {[
                { n: "01", title: "Enter any domain", desc: "No account, no API key, no setup. Type stripe.com and press enter." },
                { n: "02", title: "Real-time scan",   desc: "Tech fingerprinting, signal detection, company enrichment, AI analysis — all in parallel." },
                { n: "03", title: "Get your report",  desc: "Score, tech stack, signals, company profile, and AI-written outreach — ready in under 5 seconds." },
              ].map(({ n, title, desc }, i, arr) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    gap: 28,
                    paddingBottom: i < arr.length - 1 ? 32 : 0,
                    marginBottom: i < arr.length - 1 ? 32 : 0,
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#3f3f46", fontFamily: "monospace", flexShrink: 0, marginTop: 3 }}>{n}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", color: "#e4e4e7", letterSpacing: "-0.01em" }}>{title}</p>
                    <p style={{ fontSize: 13, color: "#52525b", margin: 0, lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CLI strip */}
        <section style={{ padding: "44px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#3f3f46", textTransform: "uppercase", margin: "0 0 8px" }}>Also a CLI</p>
            <code style={{ fontSize: 14, color: "#3b82f6", fontFamily: "'SF Mono','Fira Code',monospace" }}>
              npx leadscan analyze stripe.com
            </code>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <a href="https://npmjs.com/package/leadscan" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#3f3f46", textDecoration: "none" }}>npm ↗</a>
            <a href="https://github.com/nadellasripad11/leadscan" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#3f3f46", textDecoration: "none" }}>GitHub ↗</a>
            <a href="/docs" style={{ fontSize: 13, color: "#3f3f46", textDecoration: "none" }}>Docs ↗</a>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "120px 0 100px" }}>
          <h2 style={{
            fontSize: "clamp(36px,5.5vw,72px)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            margin: "0 0 20px",
            lineHeight: 0.97,
            color: "#fafafa",
          }}>
            Start scanning<br />
            <em style={{ fontStyle: "italic", color: "#71717a" }}>for free.</em>
          </h2>
          <p style={{ fontSize: 15, color: "#3f3f46", margin: "0 0 40px" }}>No account. No credit card. Just a domain.</p>
          <Link
            href="/scan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Open the scanner →
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#fafafa" }}>LeadScan</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Scanner",  href: "/scan" },
              { label: "Docs",     href: "/docs" },
              { label: "Examples", href: "/examples" },
              { label: "GitHub",   href: "https://github.com/nadellasripad11/leadscan" },
              { label: "Privacy",  href: "/privacy" },
              { label: "Terms",    href: "/terms" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: "#3f3f46", textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#27272a", margin: 0 }}>© 2025 Sripad Nadella</p>
        </div>
      </footer>
    </>
  );
}
