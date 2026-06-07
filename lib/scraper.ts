import axios from "axios";
import * as cheerio from "cheerio";
import type { CompanyData, CompanyProfile, TechStack, GrowthSignals, SocialLinks, StockData } from "@/lib/types";

// Realistic Chrome browser headers — avoids basic bot detection
const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

// Detect Cloudflare challenges, 403s, and empty/useless bot-block pages
function isBlockedPage(html: string, status: number): boolean {
  if (status === 403 || status === 429 || status === 503) return true;
  const lower = html.toLowerCase();
  if (html.length < 1200 && (lower.includes("access denied") || lower.includes("403 forbidden"))) return true;
  if (lower.includes("cf-browser-verification")) return true;
  if (lower.includes("cloudflare ray id")) return true;
  if (lower.includes("checking your browser before accessing")) return true;
  if (lower.includes("enable javascript and cookies to continue") && html.length < 8000) return true;
  if (lower.includes("just a moment") && lower.includes("cloudflare") && html.length < 8000) return true;
  return false;
}

// Try several URL variants — bare domain, www prefix, and common paths
async function fetchBestPage(domain: string): Promise<{ html: string; resolvedUrl: string }> {
  const candidates = [
    `https://${domain}`,
    `https://www.${domain}`,
    `http://${domain}`,
    `http://www.${domain}`,
  ];

  // If domain already starts with www., skip adding it again
  const urls = domain.startsWith("www.")
    ? [`https://${domain}`, `http://${domain}`]
    : candidates;

  for (const url of urls) {
    try {
      const res = await axios.get(url, {
        timeout: 15000,
        headers: BROWSER_HEADERS,
        maxRedirects: 10,
        // Accept any status — we'll inspect the body ourselves
        validateStatus: (s) => s < 600,
      });
      const body = String(res.data || "");
      if (!isBlockedPage(body, res.status) && body.length > 500) {
        return { html: body, resolvedUrl: url };
      }
    } catch {
      // Try next candidate
    }
  }

  // All attempts blocked or failed — return empty so we still get Wikipedia/stock data
  return { html: "", resolvedUrl: `https://${domain}` };
}

const TECH_FINGERPRINTS: Record<keyof TechStack, Record<string, string[]>> = {
  frontend: {
    "React": ["react", "reactdom", "_next", "__react"],
    "Next.js": ["_next/static", "__next", "next/dist"],
    "Vue.js": ["vue.min.js", "vue@", "__vue__"],
    "Angular": ["ng-version", "angular.min.js", "ng-app"],
    "Svelte": ["svelte", "__svelte"],
    "Tailwind CSS": ["tailwindcss", "tw-"],
    "Bootstrap": ["bootstrap.min.css", "bootstrap.bundle"],
    "Alpine.js": ["alpine.js", "x-data"],
    "Remix": ["remix-utils", "__remixContext"],
    "Nuxt": ["nuxt", "_nuxt"],
  },
  backend: {
    "Node.js": ["express", "nodejs", "node.js"],
    "Django": ["csrfmiddlewaretoken", "django"],
    "Rails": ["rails-ujs", "actioncable"],
    "Laravel": ["laravel", "csrf-token"],
    "WordPress": ["wp-content", "wp-json", "wordpress"],
    "Shopify": ["shopify.com", "myshopify", "cdn.shopify"],
    "Webflow": ["webflow.com", "wf-form"],
    "Framer": ["framer.com", "framerusercontent"],
  },
  analytics: {
    "Google Analytics": ["google-analytics.com", "gtag", "ga("],
    "Segment": ["cdn.segment.com", "analytics.js"],
    "Mixpanel": ["mixpanel", "cdn.mxpnl.com"],
    "Amplitude": ["amplitude.com", "amplitude.getInstance"],
    "PostHog": ["posthog.com", "posthog.init"],
    "Heap": ["heap.io", "heapanalytics"],
    "Hotjar": ["hotjar.com", "hjid"],
    "Plausible": ["plausible.io"],
    "Fathom": ["usefathom.com"],
  },
  marketing: {
    "HubSpot": ["hubspot.com", "hs-scripts", "hsforms"],
    "Intercom": ["intercomcdn.com", "intercom.io"],
    "Drift": ["drift.com", "js.driftt.com"],
    "Zendesk": ["zendesk.com", "zdassets.com"],
    "Mailchimp": ["mailchimp.com", "list-manage.com"],
    "ActiveCampaign": ["activecampaign.com"],
    "Customer.io": ["customer.io", "csdn.io"],
  },
  infrastructure: {
    "Vercel": ["vercel.com", "_vercel"],
    "Cloudflare": ["cloudflare.com", "__cfRocketStorage"],
    "AWS": ["amazonaws.com", "cloudfront.net"],
    "Google Cloud": ["googlecloud.com", "storage.googleapis"],
    "Fastly": ["fastly.net"],
    "Netlify": ["netlify.app", "netlify.com"],
    "Firebase": ["firebase", "firebaseapp"],
  },
  payments: {
    "Stripe": ["stripe.com", "js.stripe.com"],
    "Paddle": ["paddle.com", "checkout.paddle"],
    "Chargebee": ["chargebee.com"],
    "Recurly": ["recurly.com"],
    "Braintree": ["braintreepayments.com"],
    "PayPal": ["paypal.com", "paypalobjects"],
    "Square": ["squareup.com"],
  },
  other: {},
};

const HIRING_KEYWORDS = [
  "we're hiring", "we are hiring", "join our team", "open positions",
  "careers", "job openings", "work with us", "jobs", "now hiring",
  "apply now", "open roles", "come build with us",
];

// ─── JSON-LD parser ───────────────────────────────────────────────────────────

function parseJsonLd($: cheerio.CheerioAPI): CompanyProfile {
  const profile: CompanyProfile = {};

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html() || "";
      const parsed = JSON.parse(raw);
      const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const obj = item as Record<string, unknown>;
        const type = obj["@type"] as string | undefined;
        if (!type) continue;
        const isOrg = ["Organization", "Corporation", "LocalBusiness", "Company"].includes(type);
        if (!isOrg) continue;

        if (obj.name && !profile.displayName) {
          profile.displayName = String(obj.name);
        }

        if (obj.foundingDate && !profile.founded) {
          profile.founded = String(obj.foundingDate).slice(0, 4);
        }

        if (obj.numberOfEmployees && !profile.employeeCount) {
          const emp = obj.numberOfEmployees as Record<string, unknown>;
          if (emp.value) {
            profile.employeeCount = Number(emp.value).toLocaleString();
          } else if (emp.minValue && emp.maxValue) {
            profile.employeeCount = `${emp.minValue}–${emp.maxValue}`;
          }
        }

        if (obj.address && !profile.address) {
          const addr = obj.address as Record<string, unknown>;
          if (typeof addr === "string") {
            profile.address = addr;
          } else {
            const parts = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode, addr.addressCountry]
              .filter(Boolean).map(String);
            if (parts.length) profile.address = parts.join(", ");
            if (addr.addressLocality && !profile.headquarters) {
              profile.headquarters = [addr.addressLocality, addr.addressCountry || addr.addressRegion]
                .filter(Boolean).map(String).join(", ");
            }
          }
        }

        if (obj.location && !profile.locations) {
          const locs = Array.isArray(obj.location) ? obj.location : [obj.location];
          const names = locs
            .map((l: unknown) => {
              if (!l || typeof l !== "object") return null;
              const lo = l as Record<string, unknown>;
              if (lo.name) return String(lo.name);
              const a = lo.address as Record<string, unknown> | undefined;
              return a?.addressLocality ? String(a.addressLocality) : null;
            })
            .filter((x): x is string => !!x);
          if (names.length) profile.locations = names;
        }
      }
    } catch { /* ignore malformed JSON-LD */ }
  });

  return profile;
}

// ─── Text-based extraction ────────────────────────────────────────────────────

function extractHeadquarters(text: string): string | undefined {
  const patterns = [
    /(?:headquartered|headquarters)\s+(?:is\s+)?(?:in|at)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/,
    /(?:based\s+in|located\s+in|offices?\s+in)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/,
    /([A-Z][a-z]+(?:,\s*[A-Z][A-Z])?),?\s+(?:CA|NY|TX|WA|MA|IL|CO|GA|FL|UK|US|USA)/,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m?.[1]) {
      const loc = m[1].trim().replace(/\.$/, "");
      if (loc.length > 2 && loc.length < 60) return loc;
    }
  }
  return undefined;
}

function extractOfficeLocations(text: string): string[] {
  const found = new Set<string>();
  const patterns = [
    /(?:offices?\s+in|locations?\s+in|teams?\s+in|present\s+in|operating\s+in)\s+([^.!?\n]{5,120})/gi,
    /(?:with\s+offices?\s+(?:across|in|throughout))\s+([^.!?\n]{5,120})/gi,
  ];
  for (const pat of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pat.exec(text)) !== null) {
      const parts = m[1].split(/,|\band\b/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
      parts.forEach(p => found.add(p));
    }
  }
  return [...found].slice(0, 8);
}

function extractEmployeeCount(text: string): string | undefined {
  const m = text.match(/(\d[\d,]+)\s*(?:\+)?\s*(?:employees|people|team\s+members|staff)/i);
  if (!m) return undefined;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  if (isNaN(n) || n > 1_000_000) return undefined;
  return n.toLocaleString();
}

// ─── Wikipedia profile enrichment ────────────────────────────────────────────

async function fetchWikipediaProfile(companyName: string): Promise<Partial<CompanyProfile>> {
  try {
    const searchRes = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(companyName + " company")}&srlimit=1&format=json`,
      { timeout: 4000, headers: { "User-Agent": "LeadScan/1.0" } },
    );
    const pageTitle: string | undefined = searchRes.data.query?.search?.[0]?.title;
    if (!pageTitle) return {};

    const contentRes = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvslots=main&rvprop=content&format=json`,
      { timeout: 4000, headers: { "User-Agent": "LeadScan/1.0" } },
    );
    const pages = contentRes.data.query?.pages ?? {};
    const page = Object.values(pages)[0] as Record<string, unknown> | undefined;
    type WikiRevision = { slots?: { main?: { "*"?: string } } };
    const revisions = page?.revisions as WikiRevision[] | undefined;
    const wikitext: string = revisions?.[0]?.slots?.main?.["*"] ?? "";
    if (!wikitext) return {};

    const profile: Partial<CompanyProfile> = {};

    const foundedM = wikitext.match(/\|\s*(?:foundation|founded)\s*=[^|]*?(\d{4})/i);
    if (foundedM) profile.founded = foundedM[1];

    const hqM = wikitext.match(/\|\s*(?:headquarters|location)\s*=([^\n|]{3,120})/i);
    if (hqM) {
      const hq = hqM[1]
        .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
        .replace(/\{\{[^}]+\}\}/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/[']{2,3}/g, "")
        .trim().split(/\n/)[0].trim();
      if (hq.length > 2) profile.headquarters = hq;
    }

    const empM = wikitext.match(/\|\s*(?:num_employees|employees|num_staff)\s*=([^\n|]{1,80})/i);
    if (empM) {
      const raw = empM[1]
        .replace(/\{\{[^}]+\}\}/g, "")
        .replace(/<!--[^>]*-->/g, "")
        .replace(/\[\[[^\]]*\]\]/g, "")
        .replace(/[^\d,+\-–]/g, "")
        .trim();
      if (raw && raw !== "0") profile.employeeCount = raw;
    }

    return profile;
  } catch {
    return {};
  }
}

// ─── Yahoo Finance stock data ─────────────────────────────────────────────────

async function fetchStockData(companyName: string): Promise<StockData | undefined> {
  const YF_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
  };
  try {
    const q = encodeURIComponent(companyName.replace(/[,.'"-]/g, "").trim());
    const searchRes = await axios.get(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=5&newsCount=0`,
      { timeout: 5000, headers: YF_HEADERS },
    );
    const quotes: Array<{ symbol: string; quoteType: string; exchange?: string }> =
      searchRes.data.quotes ?? [];
    const equity = quotes.find(q => q.quoteType === "EQUITY");
    if (!equity) return undefined;

    const summaryRes = await axios.get(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${equity.symbol}?modules=price,financialData`,
      { timeout: 5000, headers: YF_HEADERS },
    );
    const result = summaryRes.data.quoteSummary?.result?.[0];
    const price = result?.price;
    const fin = result?.financialData;
    if (!price?.regularMarketPrice?.raw) return undefined;

    return {
      ticker: equity.symbol,
      exchange: price.exchangeName,
      price: Math.round(price.regularMarketPrice.raw * 100) / 100,
      currency: price.currency ?? "USD",
      changePercent: Math.round((price.regularMarketChangePercent?.raw ?? 0) * 10000) / 100,
      marketCap: price.marketCap?.raw ? Math.round(price.marketCap.raw / 1e6) : undefined,
      revenue: fin?.totalRevenue?.raw ? Math.round(fin.totalRevenue.raw / 1e6) : undefined,
    };
  } catch {
    return undefined;
  }
}

// ─── Tech / signal / social helpers ──────────────────────────────────────────

function detectTechStack(html: string, scripts: string[]): TechStack {
  const source = (html + " " + scripts.join(" ")).toLowerCase();
  const stack: TechStack = { frontend: [], backend: [], analytics: [], marketing: [], infrastructure: [], payments: [], other: [] };
  for (const [category, techs] of Object.entries(TECH_FINGERPRINTS)) {
    const key = category as keyof TechStack;
    for (const [tech, fps] of Object.entries(techs)) {
      if (fps.some(fp => source.includes(fp.toLowerCase()))) stack[key].push(tech);
    }
  }
  return stack;
}

function detectGrowthSignals(html: string, $: cheerio.CheerioAPI, links: string[]): GrowthSignals {
  const text = html.toLowerCase();
  const linkText = links.join(" ").toLowerCase();
  const hiringKeywords = HIRING_KEYWORDS.filter(kw => text.includes(kw));
  const isHiring = hiringKeywords.length > 0 || linkText.includes("careers") || linkText.includes("/jobs");

  const employeeMatch = text.match(/(\d[\d,]+)\s*(employees|people|team members)/);
  let estimatedSize: GrowthSignals["estimatedSize"] = "unknown";
  if (employeeMatch) {
    const n = parseInt(employeeMatch[1].replace(/,/g, ""));
    if (n < 10) estimatedSize = "solo";
    else if (n < 50) estimatedSize = "small";
    else if (n < 500) estimatedSize = "mid";
    else if (n < 5000) estimatedSize = "large";
    else estimatedSize = "enterprise";
  } else if (text.includes("fortune 500") || text.includes("enterprise")) {
    estimatedSize = "enterprise";
  } else if (text.includes("startup") || text.includes("seed") || text.includes("series a")) {
    estimatedSize = "small";
  }

  return {
    isHiring, hiringKeywords,
    hasPricing: text.includes("pricing") || text.includes("/pricing"),
    hasAPIDoc: text.includes("api docs") || text.includes("api reference") || linkText.includes("/docs") || linkText.includes("/api"),
    hasChangelog: text.includes("changelog") || text.includes("release notes") || linkText.includes("/changelog"),
    hasBlog: text.includes("/blog") || linkText.includes("/blog"),
    hasInvestors: text.includes("investors") || text.includes("backed by") || text.includes("series") || text.includes("funding"),
    estimatedSize,
  };
}

function extractSocialLinks(links: string[]): SocialLinks {
  const socials: SocialLinks = {};
  for (const link of links) {
    if (link.includes("linkedin.com/company")) socials.linkedin = link;
    else if ((link.includes("twitter.com") || link.includes("x.com")) && !socials.twitter) socials.twitter = link;
    else if (link.includes("github.com") && !link.includes("github.com/pricing")) socials.github = link;
    else if (link.includes("crunchbase.com")) socials.crunchbase = link;
    else if (link.includes("facebook.com") && !link.includes("facebook.com/sharer") && !link.includes("facebook.com/policy")) socials.facebook = link;
    else if (link.includes("youtube.com") && !link.includes("youtube.com/watch")) socials.youtube = link;
    else if (link.includes("instagram.com") && !link.includes("instagram.com/p/")) socials.instagram = link;
  }
  return socials;
}

function extractEmails(text: string): string[] {
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ?? [];
  return [...new Set(matches)]
    .filter(e => !e.includes("example.") && !e.includes("placeholder") && !e.includes("your@"))
    .slice(0, 5);
}

// ─── Main scraper ─────────────────────────────────────────────────────────────

export async function scrapeCompany(domain: string): Promise<CompanyData> {
  // Normalize: strip protocol, www, trailing slashes and paths
  const normalizedDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .toLowerCase();

  const { html, resolvedUrl: url } = await fetchBestPage(normalizedDomain);
  const $ = cheerio.load(html);

  // Metadata
  const title = $("title").first().text().trim();
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") || "";

  const metaTags: Record<string, string> = {};
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property") || "";
    const content = $(el).attr("content") || "";
    if (name && content) metaTags[name] = content;
  });

  // Scripts/links for tech detection
  const scripts: string[] = [];
  $("script[src]").each((_, el) => { scripts.push($(el).attr("src") || ""); });
  $("link[href]").each((_, el) => { scripts.push($(el).attr("href") || ""); });

  // All page links
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("http") || href.startsWith("/")) links.push(href);
  });

  // ── Parse JSON-LD before removing scripts ──
  const jsonLdProfile = parseJsonLd($);

  // Strip scripts/nav/footer, get body text
  $("script, style, nav, footer, header").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);

  // ── Enrich profile from text if JSON-LD was sparse ──
  const profile: CompanyProfile = { ...jsonLdProfile };

  if (!profile.headquarters) {
    profile.headquarters = extractHeadquarters(bodyText);
  }
  if (!profile.locations || profile.locations.length === 0) {
    const locs = extractOfficeLocations(bodyText);
    if (locs.length > 0) profile.locations = locs;
  }
  if (!profile.employeeCount) {
    profile.employeeCount = extractEmployeeCount(bodyText);
  }

  // ── Wikipedia enrichment + stock data in parallel ──
  // Map well-known domains whose homepage title doesn't match their company name
  const DOMAIN_TO_COMPANY: Record<string, string> = {
    "chatgpt.com": "OpenAI",
    "claude.ai": "Anthropic",
    "gemini.google.com": "Google DeepMind",
    "bard.google.com": "Google",
    "copilot.microsoft.com": "Microsoft",
    "notion.so": "Notion",
    "figma.com": "Figma",
    "linear.app": "Linear",
    "vercel.com": "Vercel",
    "x.com": "X Corp",
  };
  const companyName =
    DOMAIN_TO_COMPANY[normalizedDomain] ||
    profile.displayName ||
    title.split(/[|–\-]/)[0].trim() ||
    normalizedDomain;
  const [wikiProfile, stockData] = await Promise.allSettled([
    fetchWikipediaProfile(companyName),
    fetchStockData(companyName),
  ]);

  if (wikiProfile.status === "fulfilled") {
    const w = wikiProfile.value;
    if (!profile.headquarters  && w.headquarters)  profile.headquarters  = w.headquarters;
    if (!profile.employeeCount && w.employeeCount) profile.employeeCount = w.employeeCount;
    if (!profile.founded       && w.founded)       profile.founded       = w.founded;
  }
  if (stockData.status === "fulfilled" && stockData.value) {
    profile.stock = stockData.value;
  }

  return {
    domain: normalizedDomain,
    url,
    title,
    description,
    bodyText,
    techStack: detectTechStack(html, scripts),
    signals: detectGrowthSignals(html, $, links),
    metaTags,
    links: [...new Set(links)].slice(0, 50),
    emails: extractEmails(html),
    socialLinks: extractSocialLinks(links),
    profile,
  };
}
