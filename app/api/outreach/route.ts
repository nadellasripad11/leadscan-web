import { NextRequest, NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { analyzeCompany, generateOutreach } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { domain, role, product } = await req.json();
  if (!domain || !role || !product) {
    return NextResponse.json({ error: "domain, role, and product required" }, { status: 400 });
  }

  const clean = domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  try {
    const data = await scrapeCompany(clean);
    let aiSummary;
    if (process.env.GROQ_API_KEY) {
      try { aiSummary = await analyzeCompany(data); } catch {}
    }
    const result = await generateOutreach(data, role, product, aiSummary);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate outreach";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
