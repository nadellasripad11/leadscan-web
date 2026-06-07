import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — LeadScan",
  description: "Privacy Policy for LeadScan — what data we collect, how we use it, and your rights.",
};

const LAST_UPDATED = "June 7, 2025";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.015em", margin: "0 0 14px", color: "#fafafa" }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.85 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 14px" }}>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 14px", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <li key={i} style={{ paddingLeft: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#71717a" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 62px)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "64px 20px 100px" }}>

          {/* Header */}
          <div style={{ marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#3b82f6", textTransform: "uppercase", margin: "0 0 14px" }}>Legal</p>
            <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 900, letterSpacing: "-0.035em", margin: "0 0 16px", lineHeight: 1.05 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: 14, color: "#52525b", margin: 0 }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 12, padding: "16px 20px", marginBottom: 44 }}>
            <p style={{ fontSize: 13, color: "#22c55e", margin: "0 0 4px", fontWeight: 700 }}>Short version</p>
            <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, lineHeight: 1.7 }}>
              We collect minimal data to operate the Service. We don&apos;t sell your data, don&apos;t run ads, and don&apos;t build profiles on you. LeadScan only scans <strong style={{ color: "#e4e4e7" }}>publicly available</strong> web pages — the same data anyone can see in a browser.
            </p>
          </div>

          <Section title="1. Who we are">
            <P>
              LeadScan (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a company intelligence tool operated by Sripad Nadella. This Privacy Policy explains how we handle information when you use leadscan.app, our API, or the <code style={{ fontFamily: "monospace", fontSize: 13, background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>leadscan</code> npm package.
            </P>
          </Section>

          <Section title="2. What data we collect">
            <P>We keep data collection to the absolute minimum needed to run the Service:</P>

            <div style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 20px 0", marginBottom: 14 }}>
              <TableRow label="Domain queries" value="The company domain you submit for scanning (e.g. stripe.com). Processed in real time to generate a report — not stored permanently." />
              <TableRow label="Outreach inputs" value="The role and product description you enter when generating outreach. Sent to our AI provider (Groq) and discarded after the response." />
              <TableRow label="Usage logs" value="Standard server logs: IP address, browser type, pages visited, and timestamp. Retained for up to 30 days for security and debugging." />
              <TableRow label="No account data" value="We don't require sign-up, so we never collect your name, email address, or payment information." />
            </div>

            <P>We do <strong style={{ color: "#e4e4e7" }}>not</strong> use cookies for tracking, run third-party advertising SDKs, or build behavioral profiles.</P>
          </Section>

          <Section title="3. How we use your data">
            <Ul items={[
              "To perform the scan you requested and return a report",
              "To generate AI outreach copy when you request it",
              "To monitor and improve the reliability of the Service",
              "To detect and prevent abuse or misuse",
            ]} />
            <P>We never use your data to train AI models, build advertising profiles, or share it with data brokers.</P>
          </Section>

          <Section title="4. Data we scan (third-party websites)">
            <P>
              When you submit a domain, LeadScan fetches that company&apos;s public website — the same request a browser would make. We only access data that is:
            </P>
            <Ul items={[
              "Publicly accessible without authentication",
              "Visible to any standard web crawler",
              "Not behind a login, paywall, or robots.txt exclusion",
            ]} />
            <P>
              We do not store scanned website content after a report is generated. Each scan is ephemeral.
            </P>
          </Section>

          <Section title="5. Third-party processors">
            <P>We share limited data with the following third parties to operate the Service:</P>

            <div style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 20px 0", marginBottom: 14 }}>
              <TableRow label="Vercel" value="Hosts the web application. Processes IP addresses and request logs. Privacy policy: vercel.com/legal/privacy-policy" />
              <TableRow label="Groq" value="Provides AI inference for company summaries and outreach generation. Your prompt inputs and the scanned page context are sent to Groq and subject to their Terms of Use at groq.com/terms-of-use. Groq does not use API inputs to train models." />
            </div>

            <P>
              We do not sell, rent, or share your data with any other third parties.
            </P>
          </Section>

          <Section title="6. Data retention">
            <Ul items={[
              "Scan requests and generated reports: not stored — processed in memory and discarded",
              "Outreach inputs: not stored — forwarded to Groq and discarded",
              "Server access logs: up to 30 days, then deleted",
            ]} />
          </Section>

          <Section title="7. Your rights">
            <P>Depending on where you are located, you may have rights including:</P>
            <Ul items={[
              "The right to know what data we hold about you",
              "The right to request deletion of your data",
              "The right to opt out of any data processing",
              "For EU/UK residents: rights under GDPR including data portability and the right to object",
              "For California residents: rights under CCPA including the right to know and the right to delete",
            ]} />
            <P>
              Because we collect minimal data and don&apos;t require accounts, in most cases we have nothing to delete. To submit a request or ask any questions, email us at{" "}
              <a href="mailto:privacy@leadscan.app" style={{ color: "#93c5fd", textDecoration: "none" }}>privacy@leadscan.app</a>.
            </P>
          </Section>

          <Section title="8. Children's privacy">
            <P>
              The Service is not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided personal information, contact us and we will delete it promptly.
            </P>
          </Section>

          <Section title="9. Security">
            <P>
              We use HTTPS for all data in transit. We don&apos;t store scan results or outreach content, which limits our exposure significantly. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </P>
          </Section>

          <Section title="10. Changes to this policy">
            <P>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top reflects the most recent revision. We encourage you to review this page periodically. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </P>
          </Section>

          <Section title="11. Contact">
            <P>
              Questions or concerns about this Privacy Policy?
            </P>
            <P>
              Email: <a href="mailto:privacy@leadscan.app" style={{ color: "#93c5fd", textDecoration: "none" }}>privacy@leadscan.app</a>
            </P>
          </Section>

          {/* Footer nav */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Link href="/terms" style={{ fontSize: 13, color: "#71717a", textDecoration: "none" }}>Terms of Service →</Link>
            <Link href="/" style={{ fontSize: 13, color: "#71717a", textDecoration: "none" }}>Back to LeadScan →</Link>
          </div>

        </div>
      </main>
    </>
  );
}
