import type { CompanyData, IntelReport, ScoreBreakdown } from "@/lib/types";

// Rule-based industry detection — used when AI is unavailable
function detectIndustry(data: CompanyData): string {
  // Profile's Wikipedia industry takes first priority
  if (data.profile?.industry) return data.profile.industry;

  const text = `${data.title} ${data.description} ${data.bodyText}`.toLowerCase();
  const tech = Object.values(data.techStack).flat().join(" ").toLowerCase();

  if (text.includes("artificial intelligence") || text.includes("machine learning") || (text.includes(" ai ") && (text.includes("model") || text.includes("inference")))) return "AI / Machine Learning";
  if (text.includes("cybersecurity") || text.includes("threat detection") || text.includes("zero trust") || text.includes("endpoint security")) return "Cybersecurity";
  if (text.includes("database") || text.includes("data warehouse") || text.includes("data platform") || text.includes("big data")) return "Data & Analytics";
  if (tech.includes("shopify") || text.includes("e-commerce") || text.includes("ecommerce") || text.includes("online store") || text.includes("shopping cart")) return "E-commerce";
  if (text.includes("payment") || text.includes("fintech") || text.includes("banking") || text.includes("financial services") || text.includes("financial technology")) return "FinTech";
  if ((text.includes("health") || text.includes("medical") || text.includes("clinical")) && (text.includes("care") || text.includes("patient") || text.includes("hospital"))) return "HealthTech";
  if (text.includes("education") || text.includes("e-learning") || text.includes("online learning") || text.includes("course") || text.includes("students")) return "EdTech";
  if (text.includes("real estate") || text.includes("property") || text.includes("mortgage") || text.includes("housing")) return "Real Estate";
  if (text.includes("logistics") || text.includes("supply chain") || text.includes("shipping") || text.includes("freight")) return "Logistics";
  if (text.includes("recruiting") || text.includes("talent acquisition") || text.includes("job board") || text.includes("workforce")) return "HR Tech";
  if (text.includes("marketing automation") || text.includes("email marketing") || text.includes("demand generation")) return "MarTech";
  if (text.includes("legal") && (text.includes("software") || text.includes("platform") || text.includes("technology"))) return "LegalTech";
  if (text.includes("insurance") || text.includes("insurtech")) return "InsurTech";
  if (text.includes("travel") && (text.includes("booking") || text.includes("hotel") || text.includes("flight"))) return "Travel Tech";
  if (text.includes("developer") || text.includes("devops") || text.includes("open source") || text.includes("sdk") || text.includes("api platform")) return "DevTools";
  if (text.includes("cloud") && (text.includes("infrastructure") || text.includes("computing") || text.includes("storage") || text.includes("platform"))) return "Cloud Infrastructure";
  if (text.includes("enterprise") && (text.includes("software") || text.includes("erp") || text.includes("crm") || text.includes("suite"))) return "Enterprise Software";
  if (text.includes("saas") || text.includes("software as a service") || text.includes("subscription software")) return "SaaS";
  if (text.includes("media") && (text.includes("streaming") || text.includes("content") || text.includes("video") || text.includes("entertainment"))) return "Media & Entertainment";
  if (text.includes("semiconductor") || text.includes("chip") || text.includes("processor") || text.includes("hardware")) return "Semiconductors";
  if (text.includes("telecom") || text.includes("wireless") || text.includes("5g") || text.includes("network operator")) return "Telecommunications";
  // ── Non-tech / small business industries ──
  if (text.includes("restaurant") || text.includes("menu") || text.includes("dining") || text.includes("cuisine") || text.includes("catering") || text.includes("bistro") || text.includes("eatery")) return "Restaurant & Food Service";
  if ((text.includes("dental") || text.includes("dentist")) && (text.includes("clinic") || text.includes("care") || text.includes("office"))) return "Dental Practice";
  if ((text.includes("doctor") || text.includes("physician") || text.includes("medical") || text.includes("clinic") || text.includes("patient")) && text.includes("care")) return "Healthcare";
  if (text.includes("law firm") || text.includes("attorney") || text.includes("lawyer") || text.includes("legal services") || text.includes("counsel")) return "Legal Services";
  if (text.includes("accounting") || text.includes("bookkeeping") || text.includes("cpa") || text.includes("tax preparation")) return "Accounting & Finance";
  if (text.includes("plumbing") || text.includes("electrician") || text.includes("hvac") || text.includes("roofing") || text.includes("contractor") || text.includes("home repair")) return "Home Services";
  if (text.includes("salon") || text.includes("spa") || text.includes("beauty") || text.includes("hair care") || text.includes("nail")) return "Beauty & Wellness";
  if (text.includes("gym") || text.includes("fitness") || text.includes("personal training") || text.includes("yoga") || text.includes("pilates")) return "Fitness & Health";
  if (text.includes("hotel") || text.includes("motel") || text.includes("inn") || text.includes("lodging") || text.includes("resort") || text.includes("bed and breakfast")) return "Hospitality";
  if (text.includes("retail") || text.includes("boutique") || (text.includes("shop") && !text.includes("workshop") && text.includes("buy"))) return "Retail";
  if (text.includes("auto") && (text.includes("dealer") || text.includes("repair") || text.includes("mechanic") || text.includes("body shop"))) return "Automotive";
  if (text.includes("construction") || text.includes("general contractor") || text.includes("building contractor")) return "Construction";
  if (text.includes("cleaning service") || text.includes("janitorial") || text.includes("maid service") || text.includes("pressure washing")) return "Cleaning Services";
  if (text.includes("photography") || text.includes("photographer") || text.includes("wedding photo") || text.includes("portrait")) return "Photography";
  if (text.includes("digital marketing") || text.includes("seo agency") || text.includes("marketing agency") || text.includes("ad agency") || text.includes("creative agency")) return "Marketing Agency";
  if (text.includes("consulting") && !text.includes("software")) return "Consulting";
  if (text.includes("non-profit") || text.includes("nonprofit") || text.includes("501(c)") || text.includes("charity") || text.includes("foundation")) return "Non-Profit";
  return "Technology";
}

const MODERN_TECH = new Set([
  "React", "Next.js", "Vue.js", "Svelte", "Remix", "Nuxt",
  "Tailwind CSS", "TypeScript",
  "Vercel", "Cloudflare", "AWS", "Google Cloud",
  "PostHog", "Segment", "Amplitude",
  "Stripe", "Paddle",
  "Intercom", "HubSpot",
]);

const LEGACY_TECH = new Set([
  "WordPress", "Bootstrap", "jQuery",
  "PayPal", "Mailchimp",
  "Zendesk",
]);

function scoreTechModernity(data: CompanyData): number {
  let score = 50; // baseline
  const allTech = [
    ...data.techStack.frontend,
    ...data.techStack.backend,
    ...data.techStack.analytics,
    ...data.techStack.marketing,
    ...data.techStack.infrastructure,
    ...data.techStack.payments,
  ];

  for (const tech of allTech) {
    if (MODERN_TECH.has(tech)) score += 5;
    if (LEGACY_TECH.has(tech)) score -= 5;
  }

  // Has an API = technical company
  if (data.signals.hasAPIDoc) score += 10;
  // Has changelog = actively shipped
  if (data.signals.hasChangelog) score += 8;
  // Has pricing = real product
  if (data.signals.hasPricing) score += 5;

  return Math.min(100, Math.max(0, score));
}

function scoreGrowthSignals(data: CompanyData): number {
  let score = 30;

  if (data.signals.isHiring) score += 25;
  if (data.signals.hasInvestors) score += 20;
  if (data.signals.hasBlog) score += 10;
  if (data.signals.hasPricing) score += 10;

  switch (data.signals.estimatedSize) {
    case "small": score += 15; break;  // startup — easiest to sell to
    case "mid": score += 10; break;
    case "solo": score += 5; break;
    case "large": score += 0; break;
    case "enterprise": score -= 10; break; // harder to close
  }

  return Math.min(100, Math.max(0, score));
}

function scoreMarketPresence(data: CompanyData): number {
  let score = 20;

  if (data.socialLinks.linkedin) score += 20;
  if (data.socialLinks.twitter) score += 15;
  if (data.socialLinks.github) score += 20;
  if (data.socialLinks.crunchbase) score += 15;
  if (data.description.length > 50) score += 10;

  return Math.min(100, Math.max(0, score));
}

function scoreContactability(data: CompanyData): number {
  let score = 10;

  if (data.emails.length > 0) score += 35;
  if (data.phones && data.phones.length > 0) score += 15; // phone = highly contactable
  if (data.socialLinks.linkedin) score += 25;
  if (data.signals.isHiring) score += 10;
  if (data.emails.some((e) => e.includes("hello") || e.includes("hi") || e.includes("contact") || e.includes("info"))) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

export function buildIntelReport(
  data: CompanyData,
  aiSummary?: { summary: string; industry: string; targetCustomer: string; valueProposition: string },
): IntelReport {
  const techModernity = scoreTechModernity(data);
  const growthSignals = scoreGrowthSignals(data);
  const marketPresence = scoreMarketPresence(data);
  const contactability = scoreContactability(data);

  const total = Math.round(
    techModernity * 0.25 +
    growthSignals * 0.35 +
    marketPresence * 0.2 +
    contactability * 0.2
  );

  const breakdown: ScoreBreakdown = {
    techModernity,
    growthSignals,
    marketPresence,
    contactability,
    total,
  };

  return {
    domain: data.domain,
    scrapedAt: new Date().toISOString(),
    summary: aiSummary?.summary ?? (data.description || data.title),
    industry: aiSummary?.industry ?? detectIndustry(data),
    targetCustomer: aiSummary?.targetCustomer ?? "Unknown",
    valueProposition: aiSummary?.valueProposition ?? "",
    techStack: data.techStack,
    signals: data.signals,
    socialLinks: data.socialLinks,
    emails: data.emails,
    phones: data.phones ?? [],
    convictionScore: total,
    scoreBreakdown: breakdown,
    aiEnabled: !!aiSummary,
    profile: data.profile,
  };
}
