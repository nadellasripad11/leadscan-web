import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { domain, title, description, bodyText, profile } = await req.json();

  if (!domain) return NextResponse.json({ error: "domain required" }, { status: 400 });
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Build context from whatever we already know
  const existing = [
    profile?.founded     && `Founded: ${profile.founded}`,
    profile?.founders    && `Founders: ${profile.founders}`,
    profile?.headquarters && `HQ: ${profile.headquarters}`,
    profile?.employeeCount && `Employees: ${profile.employeeCount}`,
    profile?.industry    && `Industry: ${profile.industry}`,
  ].filter(Boolean).join("\n");

  const prompt = `You are a business intelligence analyst. Based on the domain name, title, page content, and your knowledge, provide accurate details about this company.

Domain: ${domain}
Title: ${title ?? ""}
Description: ${description ?? ""}
Body snippet: ${(bodyText ?? "").slice(0, 600)}
${existing ? `\nAlready known:\n${existing}` : ""}

Return ONLY this JSON (no markdown, no extra text). Use null for fields you don't know:
{
  "founded": "year as string, e.g. '2010', or null",
  "founders": "comma-separated names, or null",
  "headquarters": "City, State/Country, e.g. 'San Francisco, CA', or null",
  "employeeCount": "range or number, e.g. '50,000+' or '11-50', or null",
  "industry": "concise industry label, or null",
  "description": "2-3 sentence plain-English description of what the company does and who it serves",
  "keyProducts": "comma-separated list of 2-4 main products or services, or null",
  "revenueEstimate": "annual revenue estimate like '$2.5B' or '$50M', or null if unknown",
  "businessType": "B2B, B2C, B2B2C, Marketplace, etc., or null"
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content ?? "{}";
    let parsed: Record<string, string | null> = {};
    try { parsed = JSON.parse(raw); } catch { /* ignore */ }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
