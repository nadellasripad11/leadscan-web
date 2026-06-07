import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Docs — LeadScan",
  description: "How LeadScan works: conviction scoring, tech fingerprinting, growth signals, CLI usage, and API reference.",
};

const techList = [
  { cat: "Frontend", color: "#7c3aed", items: ["React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Remix", "Astro", "HTMX", "Alpine.js", "jQuery"] },
  { cat: "Backend", color: "#a78bfa", items: ["Node.js", "Django", "Laravel", "Rails", "FastAPI", "Spring", "ASP.NET", "Phoenix", "Express"] },
  { cat: "Infrastructure", color: "#22c55e", items: ["AWS", "Cloudflare", "Vercel", "Netlify", "GCP", "Azure", "Fly.io", "Railway", "Heroku"] },
  { cat: "Analytics", color: "#fbbf24", items: ["Segment", "Amplitude", "Mixpanel", "Heap", "PostHog", "Plausible", "Google Analytics", "Hotjar"] },
  { cat: "Marketing", color: "#f472b6", items: ["HubSpot", "Intercom", "Drift", "Marketo", "Salesforce", "Zendesk", "Crisp"] },
  { cat: "Payments", color: "#fb923c", items: ["Stripe", "Paddle", "Chargebee", "Braintree", "Square"] },
];

const signals = [
  { label: "Actively hiring", icon: "💼", desc: "Detects /careers, /jobs pages with open listings and recent postings." },
  { label: "Has pricing page", icon: "💳", desc: "Looks for /pricing or pricing-related anchors — signals commercial maturity." },
  { label: "Has API / docs", icon: "📖", desc: "Checks for /docs, /api, /developers, or developer portal links." },
  { label: "Has a blog", icon: "📝", desc: "Finds /blog, /news, /articles — signals active content marketing." },
  { label: "Has a changelog", icon: "📋", desc: "Looks for /changelog, /releases, /whats-new — signals shipping velocity." },
  { label: "Funded / investors", icon: "💰", desc: "Scans for investor logos, 'backed by', Series A/B/C mentions on the homepage." },
];

const cliCommands = [
  { cmd: "npx leadscan analyze stripe.com", desc: "Full company report in the terminal." },
  { cmd: "npx leadscan analyze stripe.com --json", desc: "Output as JSON (pipe to jq, save to file, etc.)." },
  { cmd: "npx leadscan outreach stripe.com", desc: "Generate AI cold email, LinkedIn message, and call opener." },
  { cmd: "npx leadscan batch domains.txt", desc: "Scan every domain in a text file (one per line), ranked by score." },
];

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return <section id={id} style={{ paddingTop: 72, marginTop: -48 }}>{children}</section>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.025em", margin: "0 0 6px", lineHeight: 1.2 }}>{children}</h2>;
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: "#71717a", margin: "0 0 28px", lineHeight: 1.7 }}>{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 13, background: "rgba(124,58,237,0.08)", color: "#7c3aed", padding: "2px 7px", borderRadius: 5 }}>
      {children}
    </code>
  );
}

export default function DocsPage() {
  const navLinks = [
    { id: "overview",  label: "Overview" },
    { id: "score",     label: "Conviction Score" },
    { id: "tech",      label: "Tech Detection" },
    { id: "signals",   label: "Growth Signals" },
    { id: "cli",       label: "CLI Reference" },
    { id: "api",       label: "API Reference" },
  ];

  return (
    <>
      <Navbar active="docs" />
      <main style={{ minHeight: "calc(100vh - 62px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 120px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 60, alignItems: "start" }}>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 82 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#52525b", textTransform: "uppercase", margin: "0 0 14px" }}>On this page</p>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`} style={{ fontSize: 14, color: "#71717a", textDecoration: "none", padding: "6px 12px", borderRadius: 8, transition: "color 0.15s, background 0.15s" }}>
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 40, padding: "18px 16px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", margin: "0 0 6px" }}>Quick start</p>
              <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 12px", lineHeight: 1.6 }}>No account needed. Just paste a domain.</p>
              <Link href="/scan" style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>Open Scanner →</Link>
            </div>
          </aside>

          {/* Content */}
          <div>

            {/* Overview */}
            <Section id="overview">
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#7c3aed", textTransform: "uppercase", margin: "0 0 12px" }}>Documentation</p>
              <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>How LeadScan works</h1>
              <Lead>
                LeadScan fetches any company&apos;s public website, parses the HTML and HTTP headers, fingerprints the technology stack, reads growth signals, and produces a structured intelligence report — all in under 5 seconds. No API key, no account, no rate limits.
              </Lead>
              <div style={{ background: "#080f1f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 22px", marginBottom: 40, fontFamily: "monospace", fontSize: 13 }}>
                <div style={{ color: "#52525b", marginBottom: 6 }}>{"// What happens when you scan stripe.com"}</div>
                {[
                  ["1.", "Fetch stripe.com (follows redirects, 10s timeout)", "#71717a"],
                  ["2.", "Parse HTML → detect 40+ tech fingerprints", "#71717a"],
                  ["3.", "Read page links → detect growth signals", "#71717a"],
                  ["4.", "Score across 4 dimensions → 0–100 conviction", "#71717a"],
                  ["5.", "Run Llama 3.3 AI summary + outreach (optional)", "#71717a"],
                  ["→", "Return structured IntelReport JSON", "#7c3aed"],
                ].map(([n, t, color]) => (
                  <div key={String(n)} style={{ display: "flex", gap: 12, lineHeight: 1.9 }}>
                    <span style={{ color: "#27272a", flexShrink: 0 }}>{n}</span>
                    <span style={{ color: color as string }}>{t}</span>
                  </div>
                ))}
              </div>
            </Section>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 0" }} />

            {/* Conviction Score */}
            <Section id="score">
              <H2>Conviction Score</H2>
              <Lead>
                A single 0–100 number that reflects how strong of a sales target this company is. Four signals, each weighted differently.
              </Lead>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {[
                  { label: "Tech Modernity", pct: 25, color: "#7c3aed", desc: "How modern and well-maintained their stack is. Points for React, Next.js, TypeScript, cloud-native infra. Deductions for jQuery, Flash-era tech, or missing HTTPS." },
                  { label: "Growth Signals", pct: 35, color: "#a78bfa", desc: "The heaviest weight. Hiring, changelog, blog, investors, and recent job posts all indicate active growth. A company scaling fast is more receptive to new tools." },
                  { label: "Market Presence", pct: 20, color: "#22c55e", desc: "Presence of a pricing page, API docs, and developer portal indicates a product-led, commercially mature company." },
                  { label: "Contactability", pct: 20, color: "#fbbf24", desc: "Can you actually reach them? Presence of business emails, LinkedIn, Twitter, and GitHub links on their public site." },
                ].map(({ label, pct, color, desc }) => (
                  <div key={label} style={{ background: "#080f1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>{label}</p>
                      <span style={{ fontSize: 13, fontWeight: 800, color, background: `${color}12`, border: `1px solid ${color}28`, padding: "2px 10px", borderRadius: 99 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct * 2.5}%`, background: color, borderRadius: 99 }} />
                    </div>
                    <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.65 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 0" }} />

            {/* Tech Detection */}
            <Section id="tech">
              <H2>Tech Stack Detection</H2>
              <Lead>
                LeadScan scans the raw HTML, JavaScript bundle filenames, meta tags, and HTTP response headers for known technology fingerprints. No third-party APIs — it reads what&apos;s publicly visible in the browser.
              </Lead>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
                {techList.map(({ cat, color, items }) => (
                  <div key={cat}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color, textTransform: "uppercase", margin: "0 0 10px" }}>{cat}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {items.map(t => (
                        <span key={t} style={{ fontSize: 12, fontWeight: 500, color, background: `${color}0d`, border: `1px solid ${color}22`, padding: "3px 10px", borderRadius: 99 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 0" }} />

            {/* Growth Signals */}
            <Section id="signals">
              <H2>Growth Signals</H2>
              <Lead>
                Six binary signals detected from the company&apos;s public site. Each one is weighted in the Growth Signals component of the conviction score.
              </Lead>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                {signals.map(({ label, icon, desc }) => (
                  <div key={label} style={{ display: "flex", gap: 16, padding: "18px 20px", background: "#080f1f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#f1f5f9" }}>{label}</p>
                      <p style={{ fontSize: 13, color: "#71717a", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 0" }} />

            {/* CLI */}
            <Section id="cli">
              <H2>CLI Reference</H2>
              <Lead>
                Install once, use anywhere. The <Code>leadscan</Code> CLI is published on npm and works with <Code>npx</Code> — no install needed.
              </Lead>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {cliCommands.map(({ cmd, desc }) => (
                  <div key={cmd} style={{ background: "#040914", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "monospace", fontSize: 13, color: "#7c3aed", display: "flex", gap: 10 }}>
                      <span style={{ color: "#22c55e" }}>$</span> {cmd}
                    </div>
                    <div style={{ padding: "10px 18px" }}>
                      <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "18px 20px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, marginBottom: 40 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", margin: "0 0 6px" }}>Install globally</p>
                <code style={{ fontFamily: "monospace", fontSize: 13, color: "#a1a1aa" }}>npm install -g leadscan</code>
                <p style={{ fontSize: 13, color: "#71717a", margin: "8px 0 0" }}>Then use <Code>leadscan analyze stripe.com</Code> directly from any terminal, no npx prefix needed.</p>
              </div>
            </Section>

            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 0" }} />

            {/* API */}
            <Section id="api">
              <H2>API Reference</H2>
              <Lead>
                The web app exposes two JSON endpoints used internally. You can call them directly from scripts or other tools — no auth required.
              </Lead>

              {[
                {
                  method: "POST", path: "/api/analyze",
                  desc: "Scrape and score a company. Returns a full IntelReport.",
                  body: `{ "domain": "stripe.com", "ai": true }`,
                  response: `{
  "domain": "stripe.com",
  "convictionScore": 78,
  "summary": "Global payments infrastructure...",
  "scoreBreakdown": {
    "techModernity": 85,
    "growthSignals": 72,
    "marketPresence": 80,
    "contactability": 65
  },
  "techStack": { "frontend": ["React","Next.js"], ... },
  "signals": { "isHiring": true, "hasPricing": true, ... },
  "emails": ["support@stripe.com"],
  "socialLinks": { "twitter": "...", "linkedin": "..." }
}`,
                },
                {
                  method: "POST", path: "/api/outreach",
                  desc: "Generate AI outreach for a company.",
                  body: `{
  "domain": "stripe.com",
  "role": "Head of Engineering",
  "product": "observability tool"
}`,
                  response: `{
  "domain": "stripe.com",
  "email": { "subject": "...", "body": "..." },
  "linkedin": "...",
  "callOpener": "..."
}`,
                },
              ].map(({ method, path, desc, body, response }) => (
                <div key={path} style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", padding: "3px 10px", borderRadius: 6, fontFamily: "monospace" }}>{method}</span>
                    <code style={{ fontFamily: "monospace", fontSize: 14, color: "#f1f5f9" }}>{path}</code>
                  </div>
                  <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[{ label: "Request body", code: body }, { label: "Response", code: response }].map(({ label, code }) => (
                      <div key={label}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#52525b", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
                        <pre style={{ background: "#040914", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "#a1a1aa", fontFamily: "monospace", margin: 0, overflow: "auto", lineHeight: 1.7 }}>
                          {code}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Section>

          </div>
        </div>
      </main>
    </>
  );
}
