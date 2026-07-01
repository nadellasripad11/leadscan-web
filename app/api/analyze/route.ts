import { NextRequest, NextResponse } from "next/server";
import { scrapeCompany } from "@/lib/scraper";
import { buildIntelReport } from "@/lib/scorer";
import { analyzeCompany } from "@/lib/ai";
import { validateDomain, checkRateLimit } from "@/lib/validation";
import { getFromCache, saveToCache } from "@/lib/cache";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  // ── Validation ─────────────────────────────────────────────────────────
  const { domain, ai } = await req.json();

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
  const rateLimit = checkRateLimit(clientIp, 20, 60000); // 20 requests per minute per IP
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before scanning again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // ── Check cache ────────────────────────────────────────────────────────
  try {
    const cached = await getFromCache(cleanDomain);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }
  } catch (err) {
    // Cache error shouldn't block the request
    console.error("Cache check failed:", err);
  }

  // ── Scrape & analyze ───────────────────────────────────────────────────
  try {
    const data = await scrapeCompany(cleanDomain);
    let aiSummary;
    if ((ai !== false) && process.env.GROQ_API_KEY) {
      try {
        aiSummary = await analyzeCompany(data);
      } catch (err) {
        console.error("AI analysis failed:", err);
        // continue without AI
      }
    }

    const report = buildIntelReport(data, aiSummary);

    // ── Save to cache ──────────────────────────────────────────────────
    try {
      await saveToCache(cleanDomain, report);
    } catch (err) {
      console.error("Cache save failed:", err);
      // don't fail the request if cache write fails
    }

    return NextResponse.json(report, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to scan domain";
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
