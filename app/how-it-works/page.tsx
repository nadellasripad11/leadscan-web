import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "How it Works — LeadScan",
  description: "Learn how to use LeadScan on the web or in your terminal to turn any domain into company intelligence in seconds.",
};

function Step({ n, title, desc, children }: { n: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#93c5fd", fontFamily: "'SF Mono','Fira Code',monospace" }}>{n}</span>
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{title}</p>
        <p style={{ fontSize: 14, color: "#71717a", margin: "0 0 16px", lineHeight: 1.7 }}>{desc}</p>
        {children}
      </div>
    </div>
  );
}

function Terminal({ lines }: { lines: { color: string; text: string; prompt?: boolean }[] }) {
  return (
    <div style={{ background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ background: "#111113", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "11px 16px", display: "flex", alignItems: "center", gap: 6 }}>
        {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.6 }} />)}
        <span style={{ fontSize: 11, color: "#3f3f46", marginLeft: 8, fontFamily: "monospace" }}>zsh</span>
      </div>
      <div style={{ padding: "18px 20px", fontFamily: "'SF Mono','Fira Code',monospace" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", fontSize: 12.5, lineHeight: 1.9, color: line.color }}>
            {line.prompt && <span style={{ color: "#22c55e", marginRight: 10, flexShrink: 0 }}>$</span>}
            {!line.prompt && <span style={{ width: 20, flexShrink: 0 }} />}
            <span style={{ wordBreak: "break-all" }}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px", ...style }}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#93c5fd", textTransform: "uppercase", marginBottom: 14 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#93c5fd", display: "inline-block" }} />
      {children}
    </span>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 62px)" }}>

        {/* ── Hero ── */}
        <section style={{ position: "relative", textAlign: "center", padding: "80px 20px 60px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -300, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
            <Tag>How it works</Tag>
            <h1 style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, margin: "0 0 20px" }}>
              From domain to intelligence<br />
              <span style={{ background: "linear-gradient(135deg,#fff 0%,#93c5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                in 5 seconds.
              </span>
            </h1>
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#71717a", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 36px" }}>
              Use LeadScan on the web from any device, or run it directly in your terminal. Same intelligence, two ways to access it.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/scan" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Try it now — free
              </Link>
              <a href="#cli" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "#a1a1aa", fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.09)" }}>
                CLI reference ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── What you get ── */}
        <section style={{ padding: "0 20px 70px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              {[
                { title: "Conviction Score",    desc: "0–100 lead quality score across 4 weighted signals" },
                { title: "Tech Stack",           desc: "40+ technologies detected from public HTML & headers" },
                { title: "Growth Signals",       desc: "Hiring, blog, pricing, investors, changelog" },
                { title: "Company Intelligence", desc: "HQ, headcount, founding year, revenue, stock data" },
                { title: "AI Outreach",          desc: "Cold email, LinkedIn message, and call opener" },
              ].map(({ title, desc }) => (
                <Card key={title}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 5px" }}>{title}</p>
                  <p style={{ fontSize: 12, color: "#71717a", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Web app ── */}
        <section style={{ padding: "60px 20px", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Tag>Web app</Tag>
              <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px", lineHeight: 1.1 }}>
                Use it in your browser
              </h2>
              <p style={{ fontSize: 15, color: "#71717a", margin: 0, lineHeight: 1.7 }}>
                Works on any device. No account, no install, nothing to configure.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              <Step n="01" title="Go to the scanner" desc="Open leadscan.app/scan on any browser — phone, tablet, or laptop. No login required.">
                <Card style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#111113", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span style={{ fontSize: 12, color: "#52525b", fontFamily: "monospace" }}>leadscan.app/scan</span>
                  </div>
                </Card>
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="02" title="Enter any domain" desc="Paste a URL or type a company name. LeadScan strips the https:// and www. automatically — just the domain name is enough.">
                <Card style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#111113", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(59,130,246,0.3)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span style={{ fontSize: 13, color: "#fafafa", fontWeight: 500, flex: 1 }}>stripe.com</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#3b82f6", padding: "5px 14px", borderRadius: 8 }}>Scan →</span>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#52525b" }}>Try:</span>
                    {["linear.app", "notion.so", "vercel.com"].map(d => (
                      <span key={d} style={{ fontSize: 11, color: "#71717a", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 99, padding: "2px 10px" }}>{d}</span>
                    ))}
                  </div>
                </Card>
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="03" title="Read your full report" desc="In about 5 seconds you'll see the conviction score, tech stack, growth signals, company data, emails, and social links.">
                <Card>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 42, fontWeight: 900, color: "#22c55e", letterSpacing: "-0.04em", lineHeight: 1 }}>78</div>
                      <div style={{ fontSize: 10, color: "#52525b", fontWeight: 600 }}>/100</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", color: "#fafafa" }}>stripe.com</p>
                      {[
                        { label: "Tech modernity",  v: 85, c: "#93c5fd" },
                        { label: "Growth signals",  v: 80, c: "#93c5fd" },
                        { label: "Market presence", v: 72, c: "#3b82f6" },
                        { label: "Contactability",  v: 60, c: "#2563eb" },
                      ].map(b => (
                        <div key={b.label} style={{ marginBottom: 7 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: "#71717a" }}>{b.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: b.c }}>{b.v}</span>
                          </div>
                          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                            <div style={{ height: "100%", width: `${b.v}%`, background: b.c, borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="04" title="Generate AI outreach" desc="Scroll to the Outreach section. Enter the role you're targeting and what you're selling — LeadScan writes a cold email, LinkedIn message, and call opener tailored to that specific company.">
                <Card style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ background: "#111113", borderRadius: 9, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: 10, color: "#52525b", margin: "0 0 3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Role you&apos;re targeting</p>
                      <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0 }}>Head of Engineering</p>
                    </div>
                    <div style={{ background: "#111113", borderRadius: 9, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: 10, color: "#52525b", margin: "0 0 3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>What you&apos;re selling</p>
                      <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0 }}>Observability and monitoring tool</p>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", alignSelf: "flex-start" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#93c5fd" }}>Generate outreach →</span>
                    </div>
                  </div>
                </Card>
              </Step>

            </div>

            <div style={{ marginTop: 44, textAlign: "center" }}>
              <Link href="/scan" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 12, background: "#3b82f6", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}>
                Open the scanner →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CLI ── */}
        <section id="cli" style={{ padding: "70px 20px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Tag>Terminal</Tag>
              <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px", lineHeight: 1.1 }}>
                Use it in your terminal
              </h2>
              <p style={{ fontSize: 15, color: "#71717a", margin: 0, lineHeight: 1.7 }}>
                Same intelligence, right in your shell. Pipe into scripts, CRMs, or sales workflows.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              <Step n="01" title="Install or run with npx" desc="No install required — npx fetches and runs it instantly. Or install globally to use without the npx prefix.">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Terminal lines={[
                    { prompt: true,  color: "#93c5fd", text: "npx leadscan analyze stripe.com" },
                    { prompt: false, color: "#3f3f46", text: "" },
                    { prompt: false, color: "#22c55e", text: "✓  Fetching stripe.com..." },
                    { prompt: false, color: "#22c55e", text: "✓  stripe.com — Conviction: 78/100" },
                  ]} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <code style={{ fontSize: 13, color: "#a1a1aa", fontFamily: "monospace" }}>npm install -g leadscan</code>
                    <span style={{ fontSize: 12, color: "#52525b" }}>— to skip npx every time</span>
                  </div>
                </div>
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="02" title="Analyze any company" desc="Get a full company report directly in your terminal — tech stack, signals, score, emails, and social links.">
                <Terminal lines={[
                  { prompt: true,  color: "#93c5fd", text: "npx leadscan analyze stripe.com" },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#22c55e", text: "✓  stripe.com — Conviction: 78/100" },
                  { prompt: false, color: "#71717a", text: "   Tech:      React, Next.js, AWS, TypeScript" },
                  { prompt: false, color: "#71717a", text: "   HQ:        San Francisco, CA  ·  Founded: 2010" },
                  { prompt: false, color: "#71717a", text: "   Employees: 8,000+" },
                  { prompt: false, color: "#71717a", text: "   Signals:   ✓ Hiring  ✓ Blog  ✓ Pricing  ✓ API" },
                  { prompt: false, color: "#71717a", text: "   Email:     support@stripe.com" },
                  { prompt: false, color: "#71717a", text: "   LinkedIn:  linkedin.com/company/stripe" },
                ]} />
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="03" title="Generate AI outreach" desc="Pass your role and product to generate a tailored cold email, LinkedIn message, and call opener for any company.">
                <Terminal lines={[
                  { prompt: true,  color: "#93c5fd", text: 'npx leadscan outreach stripe.com --role "Head of Engineering" --product "observability tool"' },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#22c55e", text: "✓  Generating outreach for stripe.com..." },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#93c5fd", text: "  COLD EMAIL" },
                  { prompt: false, color: "#71717a", text: '  Subject: "Quick question about Stripe\'s infra"' },
                  { prompt: false, color: "#71717a", text: "  Body:    [3-paragraph personalized email]" },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#93c5fd", text: "  LINKEDIN" },
                  { prompt: false, color: "#71717a", text: "  [280-char connection message]" },
                  { prompt: false, color: "#3f3f46", text: "" },
                  { prompt: false, color: "#93c5fd", text: "  CALL OPENER" },
                  { prompt: false, color: "#71717a", text: "  [15-second phone opener]" },
                ]} />
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="04" title="Scan multiple domains at once" desc="Put a list of domains in a text file (one per line) and scan them all in one command. Results are ranked by conviction score.">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Card style={{ padding: "14px 18px" }}>
                    <p style={{ fontSize: 10, color: "#52525b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px", fontFamily: "monospace" }}>domains.txt</p>
                    <pre style={{ fontSize: 12, color: "#a1a1aa", margin: 0, fontFamily: "monospace", lineHeight: 1.8 }}>
{`stripe.com
linear.app
vercel.com
notion.so
figma.com`}
                    </pre>
                  </Card>
                  <Terminal lines={[
                    { prompt: true,  color: "#93c5fd", text: "npx leadscan batch domains.txt" },
                    { prompt: false, color: "#3f3f46", text: "" },
                    { prompt: false, color: "#22c55e", text: "  1.  stripe.com      78/100  ████████░░" },
                    { prompt: false, color: "#22c55e", text: "  2.  vercel.com      74/100  ███████░░░" },
                    { prompt: false, color: "#22c55e", text: "  3.  linear.app      71/100  ███████░░░" },
                    { prompt: false, color: "#f59e0b", text: "  4.  notion.so       65/100  ██████░░░░" },
                    { prompt: false, color: "#f59e0b", text: "  5.  figma.com       60/100  ██████░░░░" },
                  ]} />
                </div>
              </Step>

              <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.06)", marginLeft: 21, borderRadius: 1 }} />

              <Step n="05" title="Export as JSON" desc="Add --json to any command to get machine-readable output you can pipe, save, or feed into other tools.">
                <Terminal lines={[
                  { prompt: true,  color: "#93c5fd", text: "npx leadscan analyze stripe.com --json > stripe.json" },
                  { prompt: true,  color: "#93c5fd", text: "npx leadscan analyze stripe.com --json | jq '.convictionScore'" },
                  { prompt: false, color: "#22c55e", text: "78" },
                ]} />
              </Step>

            </div>

            <div style={{ marginTop: 44 }}>
              <Card style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>All CLI commands</p>
                  <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>Full reference with every flag and option.</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/docs#cli" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 99, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    CLI Docs →
                  </Link>
                  <a href="https://npmjs.com/package/leadscan" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    npm ↗
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "60px 20px 80px", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <Tag>FAQ</Tag>
              <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 900, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.1 }}>
                Common questions
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { q: "Is it really free?", a: "Yes. LeadScan is completely free — no account, no credit card, no rate limits. The web app and CLI both work without signing up." },
                { q: "How does tech detection work?", a: "LeadScan fetches the company's public homepage and reads the raw HTML, JavaScript bundle names, meta tags, and HTTP headers. Over 40 technology fingerprints are matched entirely client-side — no third-party APIs." },
                { q: "Does it work for any company?", a: "Any company with a publicly accessible website. If the site blocks scrapers, uses heavy client-side rendering only, or requires authentication, the scan may return limited data." },
                { q: "What's the conviction score?", a: "A 0–100 number that weights four dimensions: tech modernity (25%), growth signals (35%), market presence (20%), and contactability (20%). Higher = stronger sales target." },
                { q: "How does AI outreach work?", a: "Outreach is generated by Llama 3 via Groq. It uses the company's tech stack, growth signals, industry, and your target role to write a cold email, LinkedIn message, and call opener specific to that company." },
                { q: "Can I use the API directly?", a: "Yes. POST to /api/analyze with a domain field, or /api/outreach with domain, role, and product. No auth required. See the Docs page for the full schema." },
              ].map(({ q, a }) => (
                <div key={q} style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>{q}</p>
                  <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.7 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
