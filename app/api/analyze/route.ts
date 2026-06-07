import { NextRequest, NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { buildIntelReport } from "@/lib/scorer";
import { analyzeCompany } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { domain, ai } = await req.json();
  if (!domain || typeof domain !== "string") {
    return NextResponse.json({ error: "domain required" }, { status: 400 });
  }

  const clean = domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  try {
    const data = await scrapeCompany(clean);
    let aiSummary;
    // Run AI analysis when key is available — `ai` flag still respected for CLI opt-out
    if ((ai !== false) && process.env.GROQ_API_KEY) {
      try { aiSummary = await analyzeCompany(data); } catch {}
    }
    const report = buildIntelReport(data, aiSummary);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to scan domain";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
