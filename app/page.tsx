import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import TechMarquee from "@/components/TechMarquee";
import { LandingPageBackground } from "@/components/LandingPageBackground";
import { TypingAnimation } from "@/components/TypingAnimation";

const NAV = [
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "CLI",          href: "/docs#cli" },
  { label: "Docs",         href: "/docs" },
];

export default function LandingPage() {
  const features = [
    { n: "01", title: "Tech stack detection",  desc: "40+ technologies fingerprinted directly from HTML, scripts, and response headers. No paid data sources." },
    { n: "02", title: "Growth signals",         desc: "Hiring activity, pricing page presence, API documentation, and funding data — pulled live from the domain." },
    { n: "03", title: "Conviction score",        desc: "0–100 score weighted across tech modernity, growth signals, market presence, and contactability." },
    { n: "04", title: "AI outreach",             desc: "Personalized cold email, LinkedIn message, and call opener written specifically for that company." },
  ];

  return (
    <>
      {/* ─── Full-viewport hero ─── */}
      <section style={{
        minHeight: "100svh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        overflow: "hidden",
      }}>

        {/* Animated dot field background */}
        <LandingPageBackground />
        {/* Dark overlay for text readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }} />

        {/* Top bar */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 40px 0",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}>
            LeadScan
          </span>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/docs" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.02em" }}>
              Docs
            </Link>
            <Link href="/scan" style={{
              fontSize: 13,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 99,
              padding: "8px 22px",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}>
              Scan →
            </Link>
          </div>
        </div>

        {/* Middle: hero text — centered */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2, padding: "0 40px" }}>

          {/* Headline — centered */}
          <div style={{
            textAlign: "center",
            maxWidth: "min(900px, 90vw)",
          }}>
            <h1 style={{
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(48px, 11vw, 120px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
              color: "#fff",
            }}>
              Company<br />
              intelligence
            </h1>

            <p style={{
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(40px, 9vw, 100px)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: "0 0 32px",
              color: "#fff",
            }}>
              <TypingAnimation text="in seconds." delay={300} />
            </p>

            <p style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Scan any domain. Get tech stack, growth signals, conviction score, and AI outreach — free, no account needed.
            </p>
          </div>

        </div>

        {/* Bottom bar: Terms · Privacy */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 40px 28px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/terms"   style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textDecoration: "none", letterSpacing: "0.06em" }}>Terms</Link>
            <Link href="/privacy" style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textDecoration: "none", letterSpacing: "0.06em" }}>Privacy</Link>
          </div>
        </div>

      </section>

      {/* ─── Below fold ─── */}
      <main style={{ background: "#000" }}>

        {/* Scan input */}
        <section style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "96px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            margin: "0 0 28px",
          }}>
            Try it now
          </p>
          <HeroSearch />
          <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>
            Free · No account · Results in under 5 seconds
          </p>
        </section>

        {/* Tech Marquee */}
        <TechMarquee />

        {/* Features */}
        <section
          id="features"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "96px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 4.5vw, 60px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            margin: "0 0 80px",
            lineHeight: 0.95,
            color: "#fff",
            fontStyle: "italic",
          }}>
            One URL.<br />A full picture.
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {features.map(({ n, title, desc }, i) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr",
                  gap: "0 48px",
                  alignItems: "start",
                  padding: "40px 0",
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
                className="feature-row"
              >
                <div>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "monospace",
                    letterSpacing: "0.06em",
                  }}>
                    {n}
                  </span>
                </div>
                <div>
                  <p style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}>
                    {title}
                  </p>
                  <p style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                    lineHeight: 1.8,
                    letterSpacing: "0.01em",
                    maxWidth: 500,
                  }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "96px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 96px",
            alignItems: "start",
          }}
            className="grid-cli"
          >
            <div>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                margin: "0 0 20px",
              }}>
                How it works
              </p>
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
                margin: 0,
                lineHeight: 1.05,
                color: "#fff",
                fontStyle: "italic",
              }}>
                Paste a domain.<br />Get a full report.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, width: "100%" }}>
              {[
                { n: "01", title: "Enter any domain",  desc: "No account, no API key, no setup. Type stripe.com and press enter." },
                { n: "02", title: "Real-time scan",    desc: "Tech fingerprinting, signal detection, company enrichment, AI analysis — all in parallel." },
                { n: "03", title: "Get your report",   desc: "Score, tech stack, signals, profile, and AI-written outreach — ready in under 5 seconds." },
              ].map(({ n, title, desc }) => (
                <div
                  key={n}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px",
                    padding: "32px",
                    backgroundColor: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "280px",
                  }}
                >
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    marginBottom: "16px",
                  }}>
                    {n}
                  </span>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.7, letterSpacing: "0.01em", flex: 1 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLI */}
        <section style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "44px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", margin: "0 0 10px" }}>Also a CLI</p>
            <code style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'SF Mono','Fira Code',monospace", letterSpacing: "0.02em" }}>
              npx leadscan analyze stripe.com
            </code>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { label: "npm",    href: "https://npmjs.com/package/leadscan" },
              { label: "GitHub", href: "https://github.com/nadellasripad11/leadscan" },
              { label: "Docs",   href: "/docs" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textDecoration: "none", letterSpacing: "0.04em" }}>
                {label} ↗
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "120px 40px 100px" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            margin: "0 0 20px",
            lineHeight: 0.95,
            color: "#fff",
          }}>
            Start scanning<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>for free.</em>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", margin: "0 0 44px", letterSpacing: "0.04em" }}>
            No account. No credit card. Just a domain.
          </p>
          <Link
            href="/scan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Open scanner →
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 40px",
      }}>
        <div style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>LeadScan</span>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
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
                style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none", letterSpacing: "0.04em" }}
              >
                {label}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", margin: 0, letterSpacing: "0.04em" }}>© 2025 Sripad Nadella</p>
        </div>
      </footer>
    </>
  );
}
