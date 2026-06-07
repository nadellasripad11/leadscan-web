import Groq from "groq-sdk";
import type { CompanyData, OutreachResult } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AISummary = {
  summary: string;
  industry: string;
  targetCustomer: string;
  valueProposition: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function safeParse(raw: string): Record<string, string> {
  try { return JSON.parse(raw); } catch { return {}; }
}

// ─── analyzeCompany ───────────────────────────────────────────────────────────
// Returns an AI-generated summary, industry tag, target customer, and value prop.
// Only called when GROQ_API_KEY is set.

export async function analyzeCompany(data: CompanyData): Promise<AISummary> {
  const groq = getGroq();

  const tech = Object.values(data.techStack).flat().join(", ");
  const signals = [
    data.signals.isHiring && "actively hiring",
    data.signals.hasBlog && "has a blog",
    data.signals.hasPricing && "has pricing page",
    data.signals.hasAPIDoc && "has API docs",
    data.signals.hasInvestors && "funded",
  ].filter(Boolean).join(", ");

  const prompt = `Analyze this company and respond with JSON only.

Domain: ${data.domain}
Title: ${data.title}
Description: ${data.description}
Body (first 800 chars): ${data.bodyText.slice(0, 800)}
Tech stack: ${tech || "unknown"}
Signals: ${signals || "none detected"}

Return ONLY this JSON (no markdown, no extra text):
{
  "summary": "2-3 sentence plain-English description of what the company does and who it serves",
  "industry": "single concise industry label, e.g. FinTech, DevTools, E-commerce, SaaS, HealthTech, EdTech",
  "targetCustomer": "who buys from them, e.g. B2B SaaS startups, enterprise IT teams, individual developers",
  "valueProposition": "their core value proposition in one sentence"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 400,
    response_format: { type: "json_object" },
  });

  const parsed = safeParse(completion.choices[0].message.content ?? "{}");

  return {
    summary:          parsed.summary          ?? data.description ?? data.title,
    industry:         parsed.industry         ?? "Unknown",
    targetCustomer:   parsed.targetCustomer   ?? "Unknown",
    valueProposition: parsed.valueProposition ?? "",
  };
}

// ─── generateOutreach ─────────────────────────────────────────────────────────
// Generates cold email, LinkedIn message, and call opener for a company.
// Works with or without a GROQ key (template fallback when no key).

export async function generateOutreach(
  data: CompanyData,
  role: string,
  product: string,
  aiSummary?: AISummary,
): Promise<OutreachResult> {
  const companyName = data.profile?.displayName ?? data.domain;
  const tech = Object.values(data.techStack).flat().slice(0, 5).join(", ");
  const summary = aiSummary?.summary ?? data.description ?? "";
  const industry = aiSummary?.industry ?? "";
  const isHiring = data.signals.isHiring;

  // ── Template fallback (no API key) ──────────────────────────────────────────
  if (!process.env.GROQ_API_KEY) {
    const techMention = tech ? ` and your stack (${tech})` : "";
    return {
      domain:  data.domain,
      role,
      product,
      email: {
        subject: `Quick question for the ${role} at ${companyName}`,
        body: `I came across ${companyName}${techMention} and wanted to reach out.\n\nWe help ${industry ? industry + " companies" : "teams"} like yours with ${product} — and based on your ${isHiring ? "growth and hiring activity" : "setup"}, I think it could be a real fit for your ${role}.\n\nWould you be open to a 15-minute call this week to see if it makes sense?`,
      },
      linkedin: `Hi! I came across ${companyName} and was impressed by what you're building. We help ${role}s with ${product} — think there might be a fit. Would love to connect!`,
      callOpener: `Hi, this is [Name] — I'm calling because I noticed ${companyName} is ${isHiring ? "growing fast" : "doing great work"} and we help ${role}s with ${product}. Do you have 2 minutes to see if it's relevant?`,
    };
  }

  // ── AI-generated outreach ────────────────────────────────────────────────────
  const groq = getGroq();

  const prompt = `Write highly personalized B2B sales outreach. Be specific, concise, and human — never generic.

Company: ${companyName} (${data.domain})
What they do: ${summary}
Industry: ${industry}
Tech stack: ${tech || "not detected"}
Currently hiring: ${isHiring ? "yes" : "no"}

Seller's context:
- Target role: ${role}
- Product/service: ${product}

Return ONLY this JSON (no markdown):
{
  "emailSubject": "subject line under 55 chars — specific, no spam words",
  "emailBody": "3 short paragraphs, 110–140 words total. No greeting or sign-off. Hook on something specific about the company, connect to the product, clear ask.",
  "linkedin": "LinkedIn message under 280 chars — casual, specific, clear value, end with a question",
  "callOpener": "15-second phone opener that sounds natural and references something specific about the company"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.75,
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const parsed = safeParse(completion.choices[0].message.content ?? "{}");

  return {
    domain:  data.domain,
    role,
    product,
    email: {
      subject: parsed.emailSubject ?? `Quick question for ${companyName}`,
      body:    parsed.emailBody    ?? `I noticed ${companyName} and wanted to reach out about ${product}. Would love to connect.`,
    },
    linkedin:    parsed.linkedin    ?? `Hi! Came across ${companyName} — we help ${role}s with ${product}. Think there's a fit?`,
    callOpener:  parsed.callOpener  ?? `Hi, I'm calling about ${product} for ${role}s — do you have 2 minutes?`,
  };
}
