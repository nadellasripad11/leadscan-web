import type { CompanyData, IntelReport, ScoreBreakdown } from "@/lib/types";

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

  if (data.emails.length > 0) score += 40;
  if (data.socialLinks.linkedin) score += 30;
  if (data.signals.isHiring) score += 15; // hiring pages often have direct contacts
  if (data.emails.some((e) => e.includes("hello") || e.includes("hi") || e.includes("contact"))) {
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
    industry: aiSummary?.industry ?? "Unknown",
    targetCustomer: aiSummary?.targetCustomer ?? "Unknown",
    valueProposition: aiSummary?.valueProposition ?? "",
    techStack: data.techStack,
    signals: data.signals,
    socialLinks: data.socialLinks,
    emails: data.emails,
    convictionScore: total,
    scoreBreakdown: breakdown,
    aiEnabled: !!aiSummary,
    profile: data.profile,
  };
}
