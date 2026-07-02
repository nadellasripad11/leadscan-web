import { NextRequest, NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { analyzeCompany, generateOutreach } from "@/lib/ai";
import { validateDomain, checkRateLimit } from "@/lib/validation";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { domain, role, product } = await req.json();

  // ── Validation ─────────────────────────────────────────────────────────
  if (!role || typeof role !== "string" || role.trim().length === 0) {
    return NextResponse.json({ error: "role is required" }, { status: 400 });
  }
  if (!product || typeof product !== "string" || product.trim().length === 0) {
    return NextResponse.json({ error: "product is required" }, { status: 400 });
  }

  const validation = validateDomain(domain);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || "Invalid domain" },
      { status: 400 }
    );
  }

  const cleanDomain = validation.domain!;

  // ── Rate limiting ──────────────────────────────────────────────────────
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const rateLimit = checkRateLimit(`outreach:${clientIp}`, 10, 60000); // 10 outreach requests per minute
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before generating more outreach." },
      { status: 429 }
    );
  }

  try {
    // Always scrape fresh data for outreach (cache contains IntelReport, we need CompanyData)
    const data = await scrapeCompany(cleanDomain);

    let aiSummary;
    if (process.env.GROQ_API_KEY) {
      try {
        aiSummary = await analyzeCompany(data);
      } catch (err) {
        console.error("AI analysis failed:", err);
      }
    }

    const result = await generateOutreach(data, role.trim(), product.trim(), aiSummary);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate outreach";
    console.error("Outreach error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
