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

async function fetchPage(url: string, timeout = 8000): Promise<string> {
  try {
    const res = await axios.get(url, {
      timeout,
      headers: BROWSER_HEADERS,
      maxRedirects: 10,
      validateStatus: (s) => s < 400,
    });
    const body = String(res.data || "");
    if (isBlockedPage(body, res.status) || body.length <= 300) return "";
    return body;
  } catch {
    return "";
  }
}

// Try URL variants in parallel — first non-blocked result wins
async function fetchBestPage(domain: string): Promise<{ html: string; resolvedUrl: string }> {
  const urls = domain.startsWith("www.")
    ? [`https://${domain}`, `http://${domain}`]
    : [`https://${domain}`, `https://www.${domain}`];

  const attempts = urls.map(url =>
    axios.get(url, {
      timeout: 8000,
      headers: BROWSER_HEADERS,
      maxRedirects: 10,
      validateStatus: (s) => s < 600,
    }).then(res => {
      const body = String(res.data || "");
      if (isBlockedPage(body, res.status) || body.length <= 500) throw new Error("blocked_or_empty");
      return { html: body, resolvedUrl: url };
    })
  );

  try {
    return await Promise.any(attempts);
  } catch {
    return { html: "", resolvedUrl: `https://${domain}` };
  }
}

// Fetch sub-pages (contact, about) for extra info — especially critical for small businesses
async function fetchSubPages(domain: string): Promise<string> {
  const paths = ["/contact", "/about", "/about-us", "/contact-us", "/team", "/who-we-are"];
  const base = `https://${domain}`;

  const results = await Promise.allSettled(
    paths.map(p => fetchPage(base + p, 4000))
  );

  return results
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<string>).value)
    .filter(Boolean)
    .join(" ");
}

const TECH_FINGERPRINTS: Record<keyof TechStack, Record<string, string[]>> = {
  frontend: {
    "React":       ["react", "reactdom", "_next", "__react"],
    "Next.js":     ["_next/static", "__next", "next/dist"],
    "Vue.js":      ["vue.min.js", "vue@", "__vue__"],
    "Angular":     ["ng-version", "angular.min.js", "ng-app"],
    "Svelte":      ["svelte", "__svelte"],
    "Tailwind CSS":["tailwindcss", "tw-"],
    "Bootstrap":   ["bootstrap.min.css", "bootstrap.bundle"],
    "Alpine.js":   ["alpine.js", "x-data"],
    "Remix":       ["remix-utils", "__remixContext"],
    "Nuxt":        ["nuxt", "_nuxt"],
    "jQuery":      ["jquery.min.js", "jquery.js", "jquery/"],
  },
  backend: {
    "Node.js":     ["express", "nodejs", "node.js"],
    "Django":      ["csrfmiddlewaretoken", "django"],
    "Rails":       ["rails-ujs", "actioncable"],
    "Laravel":     ["laravel", "csrf-token"],
    "WordPress":   ["wp-content", "wp-json", "wordpress"],
    "WooCommerce": ["woocommerce", "woo-"],
    "Shopify":     ["shopify.com", "myshopify", "cdn.shopify"],
    "Wix":         ["wix.com", "wixstatic.com", "_wixCssModules", "wixcode"],
    "Squarespace": ["squarespace.com", "sqsp-", "squarespace-cdn", "static.squarespace"],
    "Webflow":     ["webflow.com", "wf-form", "webflow.js"],
    "Framer":      ["framer.com", "framerusercontent"],
    "Weebly":      ["weebly.com", "editmysite.com"],
    "GoDaddy":     ["secureserver.net", "godaddy.com/websites"],
    "Duda":        ["dudaone.com", "multiscreensite.com"],
    "BigCommerce": ["bigcommerce.com", "bcapp.dev"],
    "Magento":     ["magento", "mage/", "mage.js"],
    "Ghost":       ["ghost.io", "ghost/content"],
  },
  analytics: {
    "Google Analytics":  ["google-analytics.com", "gtag", "ga("],
    "Segment":           ["cdn.segment.com", "analytics.js"],
    "Mixpanel":          ["mixpanel", "cdn.mxpnl.com"],
    "Amplitude":         ["amplitude.com", "amplitude.getInstance"],
    "PostHog":           ["posthog.com", "posthog.init"],
    "Heap":              ["heap.io", "heapanalytics"],
    "Hotjar":            ["hotjar.com", "hjid"],
    "Plausible":         ["plausible.io"],
    "Fathom":            ["usefathom.com"],
    "Microsoft Clarity": ["clarity.ms", "microsoft/clarity"],
    "Facebook Pixel":    ["connect.facebook.net/en_US/fbevents", "fbq("],
  },
  marketing: {
    "HubSpot":        ["hubspot.com", "hs-scripts", "hsforms"],
    "Intercom":       ["intercomcdn.com", "intercom.io"],
    "Drift":          ["drift.com", "js.driftt.com"],
    "Zendesk":        ["zendesk.com", "zdassets.com"],
    "Mailchimp":      ["mailchimp.com", "list-manage.com"],
    "ActiveCampaign": ["activecampaign.com"],
    "Customer.io":    ["customer.io", "csdn.io"],
    "Klaviyo":        ["klaviyo.com", "klaviyoForms"],
    "Constant Contact":["constantcontact.com"],
    "ConvertKit":     ["convertkit.com", "ck.js"],
    "Crisp":          ["crisp.chat", "crisp-cdn"],
    "Tawk.to":        ["tawk.to", "tawkToApi"],
    "LiveChat":       ["livechatinc.com", "__lc_inited"],
  },
  infrastructure: {
    "Vercel":       ["vercel.com", "_vercel"],
    "Cloudflare":   ["cloudflare.com", "__cfRocketStorage"],
    "AWS":          ["amazonaws.com", "cloudfront.net"],
    "Google Cloud": ["googlecloud.com", "storage.googleapis"],
    "Fastly":       ["fastly.net"],
    "Netlify":      ["netlify.app", "netlify.com"],
    "Firebase":     ["firebase", "firebaseapp"],
    "Azure":        ["azurewebsites.net", "azure.com"],
  },
  payments: {
    "Stripe":     ["stripe.com", "js.stripe.com"],
    "Paddle":     ["paddle.com", "checkout.paddle"],
    "Chargebee":  ["chargebee.com"],
    "Recurly":    ["recurly.com"],
    "Braintree":  ["braintreepayments.com"],
    "PayPal":     ["paypal.com", "paypalobjects"],
    "Square":     ["squareup.com", "square.com/checkout"],
    "Venmo":      ["venmo.com"],
    "Apple Pay":  ["apple-pay-button"],
    "Google Pay": ["google.com/pay", "googlepay"],
  },
  other: {},
};

const HIRING_KEYWORDS = [
  "we're hiring", "we are hiring", "join our team", "open positions",
  "careers", "job openings", "work with us", "jobs", "now hiring",
  "apply now", "open roles", "come build with us", "current openings",
];

// ─── JSON-LD parser (handles org, local business, restaurant, medical, etc.) ──

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
        const type = (obj["@type"] as string | undefined) ?? "";
        if (!type) continue;

        const isOrg = [
          "Organization", "Corporation", "LocalBusiness", "Company",
          "Restaurant", "FoodEstablishment", "Store", "MedicalBusiness",
          "Dentist", "Physician", "LegalService", "FinancialService",
          "RealEstateAgent", "AutoDealer", "HardwareStore", "HomeAndConstructionBusiness",
          "SportsActivityLocation", "HealthAndBeautyBusiness", "EntertainmentBusiness",
          "TravelAgency", "LodgingBusiness", "Hotel",
        ].includes(type);
        if (!isOrg) continue;

        // Business type from schema
        if (!profile.businessType && type !== "Organization" && type !== "Corporation") {
          profile.businessType = type;
        }

        if (obj.name && !profile.displayName) profile.displayName = String(obj.name);
        if (obj.foundingDate && !profile.founded) profile.founded = String(obj.foundingDate).slice(0, 4);

        // Phone
        if (obj.telephone && !profile.phone) profile.phone = String(obj.telephone);

        // Business hours
        if (obj.openingHours && !profile.businessHours) {
          const hours = Array.isArray(obj.openingHours)
            ? (obj.openingHours as string[]).join(", ")
            : String(obj.openingHours);
          if (hours.length > 0 && hours.length < 200) profile.businessHours = hours;
        }
        if (obj.openingHoursSpecification && !profile.businessHours) {
          const specs = Array.isArray(obj.openingHoursSpecification)
            ? obj.openingHoursSpecification as Array<Record<string, unknown>>
            : [obj.openingHoursSpecification as Record<string, unknown>];
          const parts = specs.map(s => {
            const days = Array.isArray(s.dayOfWeek) ? (s.dayOfWeek as string[]).join(", ") : String(s.dayOfWeek ?? "");
            return `${days}: ${s.opens ?? ""}–${s.closes ?? ""}`;
          }).filter(p => p.length > 5);
          if (parts.length) profile.businessHours = parts.join(" | ");
        }

        // Employees
        if (obj.numberOfEmployees && !profile.employeeCount) {
          const emp = obj.numberOfEmployees as Record<string, unknown>;
          if (emp?.value) profile.employeeCount = Number(emp.value).toLocaleString();
          else if (emp?.minValue && emp?.maxValue) profile.employeeCount = `${emp.minValue}–${emp.maxValue}`;
        }

        // Address
        if (obj.address && !profile.address) {
          const addr = obj.address as Record<string, unknown>;
          if (typeof addr === "string") {
            profile.address = addr;
          } else {
            const parts = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode, addr.addressCountry]
              .filter(Boolean).map(String);
            if (parts.length) profile.address = parts.join(", ");
            if (addr.addressLocality && !profile.headquarters) {
              profile.headquarters = [addr.addressLocality, addr.addressRegion ?? addr.addressCountry]
                .filter(Boolean).map(String).join(", ");
            }
          }
        }

        // Geo / location from schema
        if (obj.location && !profile.locations) {
          const locs = Array.isArray(obj.location) ? obj.location : [obj.location];
          const names = locs.map((l: unknown) => {
            if (!l || typeof l !== "object") return null;
            const lo = l as Record<string, unknown>;
            if (lo.name) return String(lo.name);
            const a = lo.address as Record<string, unknown> | undefined;
            return a?.addressLocality ? String(a.addressLocality) : null;
          }).filter((x): x is string => !!x);
          if (names.length) profile.locations = names;
        }
      }
    } catch { /* ignore malformed JSON-LD */ }
  });

  return profile;
}

// ─── Text-based extraction helpers ───────────────────────────────────────────

function extractHeadquarters(text: string): string | undefined {
  const patterns = [
    /(?:headquartered|headquarters)\s+(?:is\s+)?(?:in|at)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/,
    /(?:based\s+in|located\s+in|offices?\s+in)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z][a-zA-Z\s]+)?)/,
    /([A-Z][a-z]+(?:,\s*[A-Z]{2})?),?\s+(?:CA|NY|TX|WA|MA|IL|CO|GA|FL|UK|US|USA|Australia|Canada|Germany|France|UK)/,
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

function extractAddress(text: string): string | undefined {
  // Match full street addresses like "123 Main St, Springfield, IL 62701"
  const m = text.match(/\d{2,5}\s+[A-Z][a-zA-Z\s]+(?:St|Ave|Blvd|Rd|Dr|Way|Ln|Court|Ct|Place|Pl|Suite|Ste)\.?\s*,?\s*[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}/i);
  if (m) return m[0].replace(/\s+/g, " ").trim();
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
  // Patterns: "2,400 employees", "a team of 12", "12-person team", "team of 5 people"
  const patterns = [
    /(\d[\d,]+)\s*(?:\+)?\s*(?:employees|people|team\s+members|staff|professionals|experts)/i,
    /(?:a\s+)?team\s+of\s+(\d+)\s*(?:\+)?\s*(?:people|employees|professionals|experts)?/i,
    /(\d+)-person\s+team/i,
    /(?:over|more\s+than|nearly|approximately|about)\s+(\d[\d,]+)\s+(?:employees|people|staff)/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m?.[1]) {
      const n = parseInt(m[1].replace(/,/g, ""), 10);
      if (!isNaN(n) && n >= 1 && n <= 1_000_000) return n.toLocaleString();
    }
  }
  return undefined;
}

function extractPhones(html: string): string[] {
  // Match common phone formats: (555) 123-4567, 555-123-4567, +1 555 123 4567, etc.
  const mailtoPhones: string[] = [];

  // tel: links are the most reliable
  const telMatches = html.match(/href=["']tel:([+\d\s().–\-]+)["']/gi) ?? [];
  for (const m of telMatches) {
    const num = m.replace(/href=["']tel:/i, "").replace(/["']/g, "").trim();
    if (num.length > 6) mailtoPhones.push(num);
  }

  // Text-based phone patterns
  const textPhones = html.match(
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/g
  ) ?? [];

  const all = [...mailtoPhones, ...textPhones]
    .map(p => p.trim())
    .filter(p => p.length > 6)
    .filter(p => !/\d{5,}-\d{4,}/.test(p)); // exclude zip+4 false positives

  return [...new Set(all)].slice(0, 3);
}

// ─── Wikipedia profile enrichment ────────────────────────────────────────────

function cleanWikiField(raw: string): string {
  let s = raw;

  // Expand list templates before stripping
  // {{Unbulleted list|a|b|c}} / {{ubl|a|b|c}} → "a, b, c"
  s = s.replace(/\{\{(?:[Uu]nbulleted\s*[Ll]ist|[Uu]bl)((?:\|[^|}]+)+)\}\}/g,
    (_, items: string) => items.split("|").map((i) => i.trim()).filter(Boolean).join(", "));
  // {{hlist|a|b|c}} → "a, b, c"
  s = s.replace(/\{\{[Hh]list((?:\|[^|}]+)+)\}\}/g,
    (_, items: string) => items.split("|").map((i) => i.trim()).filter(Boolean).join(", "));
  // {{nowrap|text}} → text
  s = s.replace(/\{\{[Nn]owrap\|([^}|]+)\}\}/g, "$1");
  // {{lang|code|text}} → text
  s = s.replace(/\{\{[Ll]ang[|-][^|]+\|([^}]+)\}\}/g, "$1");
  // {{as of|year|...}} → year
  s = s.replace(/\{\{[Aa]s[_ ]of\|(\d{4})[^}]*\}\}/g, "as of $1");
  // {{plainlist|* a\n* b}} → "a, b"
  s = s.replace(/\{\{[Pp]lainlist\s*\|([^}]*)\}\}/g,
    (_, content: string) => content.split(/[\n*]+/).map((i) => i.trim()).filter(Boolean).join(", "));

  // Strip remaining {{templates}} iteratively (handles nested)
  let prev = "";
  while (prev !== s) { prev = s; s = s.replace(/\{\{[^{}]*\}\}/g, ""); }

  // [[Link|text]] → text, [[Link]] → Link
  s = s.replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, "$1");

  s = s.replace(/<[^>]+>/g, "")      // HTML tags
       .replace(/[']{2,3}/g, "")      // wiki bold/italic
       .replace(/<!--[^>]*-->/g, "")  // HTML comments
       .replace(/\*\s*/g, "")         // list bullets
       .replace(/\s+/g, " ")
       .replace(/[,;]+$/, "")
       .trim();
  return s;
}

// Reads a wiki infobox field value, respecting {{ }} depth so pipes inside
// templates don't terminate the capture early (fixes {{Unbulleted list|a|b}})
function extractWikiFieldRaw(wikitext: string, fieldNames: string[]): string {
  for (const field of fieldNames) {
    const re = new RegExp(`\\|\\s*${field}\\s*=\\s*`, "i");
    const match = re.exec(wikitext);
    if (!match) continue;

    const startIdx = match.index + match[0].length;
    let depth = 0;
    let i = startIdx;

    while (i < Math.min(startIdx + 800, wikitext.length)) {
      if (wikitext[i] === "{" && wikitext[i + 1] === "{") { depth++; i += 2; continue; }
      if (wikitext[i] === "}" && wikitext[i + 1] === "}") {
        if (depth === 0) break;
        depth--; i += 2; continue;
      }
      if (depth === 0 && wikitext[i] === "\n") break;
      if (depth === 0 && wikitext[i] === "|" && i > startIdx) break;
      i++;
    }

    const raw = wikitext.slice(startIdx, i).trim();
    if (raw) return raw;
  }
  return "";
}

async function fetchWikipediaProfile(companyName: string): Promise<Partial<CompanyProfile>> {
  try {
    const searchRes = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(companyName + " company")}&srlimit=3&format=json`,
      { timeout: 5000, headers: { "User-Agent": "LeadScan/1.0 (https://leadscan.app)" } },
    );
    const results: Array<{ title: string }> = searchRes.data.query?.search ?? [];
    if (!results.length) return {};

    const pageTitle =
      results.find(r => r.title.toLowerCase() === companyName.toLowerCase())?.title ??
      results[0].title;

    const contentRes = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvslots=main&rvprop=content&format=json`,
      { timeout: 5000, headers: { "User-Agent": "LeadScan/1.0" } },
    );
    const pages = contentRes.data.query?.pages ?? {};
    const page = Object.values(pages)[0] as Record<string, unknown> | undefined;
    type WikiRevision = { slots?: { main?: { "*"?: string } } };
    const revisions = page?.revisions as WikiRevision[] | undefined;
    const wikitext: string = revisions?.[0]?.slots?.main?.["*"] ?? "";
    if (!wikitext) return {};

    const profile: Partial<CompanyProfile> = {};

    // Founded — search for 4-digit year in the field value
    const foundedRaw = extractWikiFieldRaw(wikitext, ["foundation", "founded", "formation", "founding_date"]);
    const foundedYear = foundedRaw.match(/(\d{4})/);
    if (foundedYear) profile.founded = foundedYear[1];

    // Headquarters
    const hqRaw = extractWikiFieldRaw(wikitext, ["headquarters", "location", "hq_location_city", "hq_location", "hq_city"]);
    if (hqRaw) {
      const hq = cleanWikiField(hqRaw).split("\n")[0].trim();
      if (hq.length > 2 && hq.length < 100) profile.headquarters = hq;
    }

    // Employee count
    const empRaw = extractWikiFieldRaw(wikitext, ["num_employees", "employees", "num_staff", "staff"]);
    if (empRaw) {
      const cleaned = cleanWikiField(empRaw);
      const numStr = cleaned.replace(/[^\d,]/g, "");
      if (numStr) {
        const n = parseInt(numStr.replace(/,/g, ""), 10);
        if (!isNaN(n) && n > 0 && n < 2_000_000) {
          profile.employeeCount = n.toLocaleString();
        }
      }
    }

    // Founders
    const foundersRaw = extractWikiFieldRaw(wikitext, ["founders", "founder", "key_people_names"]);
    if (foundersRaw) {
      const names = cleanWikiField(foundersRaw)
        .split(/[,;]+/).map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 60 && /[A-Z]/.test(s)).slice(0, 5);
      if (names.length) profile.founders = names.join(", ");
    }

    // Industry
    const industryRaw = extractWikiFieldRaw(wikitext, ["industry"]);
    if (industryRaw) {
      const ind = cleanWikiField(industryRaw).split(/[,;]/)[0].trim();
      if (ind.length > 2 && ind.length < 80) profile.industry = ind;
    }

    return profile;
  } catch {
    return {};
  }
}

// ─── Yahoo Finance stock data ─────────────────────────────────────────────────

const KNOWN_TICKERS: Record<string, string> = {
  "oracle.com": "ORCL", "apple.com": "AAPL", "microsoft.com": "MSFT",
  "google.com": "GOOGL", "alphabet.com": "GOOGL", "amazon.com": "AMZN",
  "meta.com": "META", "facebook.com": "META", "salesforce.com": "CRM",
  "adobe.com": "ADBE", "ibm.com": "IBM", "netflix.com": "NFLX",
  "tesla.com": "TSLA", "nvidia.com": "NVDA", "intel.com": "INTC",
  "cisco.com": "CSCO", "qualcomm.com": "QCOM", "amd.com": "AMD",
  "shopify.com": "SHOP", "spotify.com": "SPOT", "snap.com": "SNAP",
  "x.com": "X", "twitter.com": "X", "uber.com": "UBER", "lyft.com": "LYFT",
  "airbnb.com": "ABNB", "coinbase.com": "COIN", "paypal.com": "PYPL",
  "square.com": "SQ", "block.xyz": "SQ", "zoom.us": "ZM",
  "twilio.com": "TWLO", "mongodb.com": "MDB", "snowflake.com": "SNOW",
  "servicenow.com": "NOW", "workday.com": "WDAY", "zendesk.com": "ZEN",
  "hubspot.com": "HUBS", "cloudflare.com": "NET", "fastly.com": "FSLY",
  "datadog.com": "DDOG", "splunk.com": "SPLK", "crowdstrike.com": "CRWD",
  "okta.com": "OKTA", "atlassian.com": "TEAM", "sap.com": "SAP",
  "github.com": "MSFT", "veeva.com": "VEEV", "databricks.com": "DBRX",
};

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://finance.yahoo.com/",
};

async function fetchTickerData(ticker: string): Promise<StockData | undefined> {
  try {
    const res = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d&includePrePost=false`,
      { timeout: 6000, headers: { ...YF_HEADERS, "Accept": "application/json, */*", "Origin": "https://finance.yahoo.com" } },
    );
    const meta = res.data?.chart?.result?.[0]?.meta;
    if (meta?.regularMarketPrice) {
      return {
        ticker, exchange: meta.fullExchangeName ?? meta.exchangeName,
        price: Math.round(meta.regularMarketPrice * 100) / 100,
        currency: meta.currency ?? "USD",
        changePercent: Math.round((meta.regularMarketChangePercent ?? 0) * 10000) / 100,
        marketCap: meta.marketCap ? Math.round(meta.marketCap / 1e6) : undefined,
      };
    }
  } catch { /* fall through */ }

  try {
    const res = await axios.get(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,financialData`,
      { timeout: 6000, headers: YF_HEADERS },
    );
    const result = res.data.quoteSummary?.result?.[0];
    const price = result?.price;
    const fin = result?.financialData;
    if (!price?.regularMarketPrice?.raw) return undefined;
    return {
      ticker, exchange: price.exchangeName,
      price: Math.round(price.regularMarketPrice.raw * 100) / 100,
      currency: price.currency ?? "USD",
      changePercent: Math.round((price.regularMarketChangePercent?.raw ?? 0) * 10000) / 100,
      marketCap: price.marketCap?.raw ? Math.round(price.marketCap.raw / 1e6) : undefined,
      revenue: fin?.totalRevenue?.raw ? Math.round(fin.totalRevenue.raw / 1e6) : undefined,
    };
  } catch { return undefined; }
}

async function fetchStockData(domain: string, companyName: string): Promise<StockData | undefined> {
  const knownTicker = KNOWN_TICKERS[domain];
  if (knownTicker) {
    const data = await fetchTickerData(knownTicker);
    if (data) return data;
  }
  try {
    const q = encodeURIComponent(companyName.replace(/[,.'"-]/g, "").trim());
    const searchRes = await axios.get(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=5&newsCount=0`,
      { timeout: 6000, headers: YF_HEADERS },
    );
    const quotes: Array<{ symbol: string; quoteType: string }> = searchRes.data.quotes ?? [];
    const equity = quotes.find(q => q.quoteType === "EQUITY");
    if (!equity) return undefined;
    return await fetchTickerData(equity.symbol);
  } catch { return undefined; }
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
  const isHiring = hiringKeywords.length > 0 || linkText.includes("careers") || linkText.includes("/jobs") || linkText.includes("/careers");

  const employeeMatch = text.match(/(\d[\d,]+)\s*(employees|people|team members|staff)/);
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
  } else if (text.includes("family-owned") || text.includes("family owned") || text.includes("small business") || text.includes("locally owned")) {
    estimatedSize = "solo";
  }

  return {
    isHiring, hiringKeywords,
    hasPricing:   text.includes("pricing") || text.includes("/pricing") || text.includes("price list") || text.includes("rates"),
    hasAPIDoc:    text.includes("api docs") || text.includes("api reference") || linkText.includes("/docs") || linkText.includes("/api"),
    hasChangelog: text.includes("changelog") || text.includes("release notes") || linkText.includes("/changelog"),
    hasBlog:      text.includes("/blog") || linkText.includes("/blog") || text.includes("latest news") || text.includes("our blog"),
    hasInvestors: text.includes("investors") || text.includes("backed by") || text.includes("series") || text.includes("venture") || text.includes("raised"),
    estimatedSize,
  };
}

function extractSocialLinks(links: string[]): SocialLinks {
  const socials: SocialLinks = {};
  for (const link of links) {
    if (link.includes("linkedin.com/company") || link.includes("linkedin.com/in/")) {
      if (!socials.linkedin) socials.linkedin = link;
    } else if ((link.includes("twitter.com/") || link.includes("x.com/")) && !link.includes("/share") && !socials.twitter) {
      socials.twitter = link;
    } else if (link.includes("github.com/") && !link.includes("github.com/pricing") && !link.includes("github.com/login")) {
      if (!socials.github) socials.github = link;
    } else if (link.includes("crunchbase.com")) {
      if (!socials.crunchbase) socials.crunchbase = link;
    } else if (link.includes("facebook.com/") && !link.includes("facebook.com/sharer") && !link.includes("facebook.com/policy")) {
      if (!socials.facebook) socials.facebook = link;
    } else if (link.includes("youtube.com/") && !link.includes("youtube.com/watch")) {
      if (!socials.youtube) socials.youtube = link;
    } else if (link.includes("instagram.com/") && !link.includes("instagram.com/p/")) {
      if (!socials.instagram) socials.instagram = link;
    } else if (link.includes("tiktok.com/@")) {
      if (!socials.tiktok) socials.tiktok = link;
    }
  }
  return socials;
}

function extractEmails(html: string, $?: cheerio.CheerioAPI): string[] {
  const found = new Set<string>();

  // 1. mailto: href links — most reliable
  if ($) {
    $("a[href^='mailto:']").each((_, el) => {
      const href = ($)(el).attr("href") ?? "";
      const email = href.replace(/^mailto:/i, "").split("?")[0].trim().toLowerCase();
      if (email.includes("@")) found.add(email);
    });
  }

  // 2. Raw text regex — catches obfuscated and plain emails
  const matches = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) ?? [];
  for (const e of matches) {
    const lower = e.toLowerCase();
    if (!lower.includes("example.") && !lower.includes("placeholder") &&
        !lower.includes("your@") && !lower.includes("email@") &&
        !lower.includes("@sentry") && !lower.includes("@2x") &&
        !lower.endsWith(".png") && !lower.endsWith(".jpg") &&
        lower.split("@")[1]?.includes(".")) {
      found.add(lower);
    }
  }

  // Prioritise: contact/hello/info/support@ addresses
  const emails = [...found];
  emails.sort((a, b) => {
    const priority = ["contact@", "hello@", "info@", "hi@", "support@", "team@"];
    const aP = priority.findIndex(p => a.startsWith(p));
    const bP = priority.findIndex(p => b.startsWith(p));
    return (aP === -1 ? 99 : aP) - (bP === -1 ? 99 : bP);
  });

  return emails.slice(0, 6);
}

// ─── Main scraper ─────────────────────────────────────────────────────────────

export async function scrapeCompany(domain: string): Promise<CompanyData> {
  const normalizedDomain = domain
    .replace(/^https?:\/\//, "").replace(/^www\./, "")
    .split("/")[0].split("?")[0].toLowerCase();

  // Fetch homepage + sub-pages in parallel
  const [{ html, resolvedUrl: url }, subPageHtml] = await Promise.all([
    fetchBestPage(normalizedDomain),
    fetchSubPages(normalizedDomain),
  ]);

  const allHtml = html + " " + subPageHtml;
  const $ = cheerio.load(html); // parse main page DOM
  const $all = cheerio.load(allHtml); // parse all pages combined

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

  const scripts: string[] = [];
  $all("script[src]").each((_, el) => { scripts.push($all(el).attr("src") || ""); });
  $all("link[href]").each((_, el) => { scripts.push($all(el).attr("href") || ""); });

  const links: string[] = [];
  $all("a[href]").each((_, el) => {
    const href = $all(el).attr("href") || "";
    if (href.startsWith("http") || href.startsWith("/")) links.push(href);
  });

  // JSON-LD from both main page and sub-pages
  const jsonLdProfile = parseJsonLd($all);

  $all("script, style, nav, footer, header").remove();
  // Larger body text — more content for small businesses
  const bodyText = $all("body").text().replace(/\s+/g, " ").trim().slice(0, 12000);

  const techStack = detectTechStack(allHtml, scripts);
  const signals = detectGrowthSignals(allHtml, $all, links);

  const profile: CompanyProfile = { ...jsonLdProfile };

  // Enrich profile from text
  if (!profile.headquarters) profile.headquarters = extractHeadquarters(bodyText);
  if (!profile.address) profile.address = extractAddress(bodyText);
  if (!profile.address && profile.headquarters) {
    // Use HQ as fallback address display
  }
  if (!profile.locations?.length) {
    const locs = extractOfficeLocations(bodyText);
    if (locs.length > 0) profile.locations = locs;
  }
  if (!profile.employeeCount) profile.employeeCount = extractEmployeeCount(bodyText);

  // Extract phones from all HTML
  const phones = extractPhones(allHtml);
  if (phones.length > 0 && !profile.phone) profile.phone = phones[0];

  // Wikipedia + stock in parallel (only bother for non-tiny sites)
  const DOMAIN_TO_COMPANY: Record<string, string> = {
    "chatgpt.com": "OpenAI", "claude.ai": "Anthropic", "notion.so": "Notion",
    "figma.com": "Figma", "linear.app": "Linear", "vercel.com": "Vercel",
    "x.com": "X Corp", "oracle.com": "Oracle Corporation", "salesforce.com": "Salesforce",
    "servicenow.com": "ServiceNow", "workday.com": "Workday", "sap.com": "SAP",
    "ibm.com": "IBM", "cisco.com": "Cisco Systems", "intel.com": "Intel",
    "nvidia.com": "Nvidia", "amd.com": "AMD", "shopify.com": "Shopify",
    "spotify.com": "Spotify", "airbnb.com": "Airbnb", "uber.com": "Uber",
    "coinbase.com": "Coinbase", "stripe.com": "Stripe", "atlassian.com": "Atlassian",
    "mongodb.com": "MongoDB", "snowflake.com": "Snowflake", "cloudflare.com": "Cloudflare",
    "datadog.com": "Datadog", "crowdstrike.com": "CrowdStrike", "hubspot.com": "HubSpot",
    "twilio.com": "Twilio", "zoom.us": "Zoom Video Communications",
  };
  const companyName = DOMAIN_TO_COMPANY[normalizedDomain] || profile.displayName ||
    title.split(/[|–\-]/)[0].trim() || normalizedDomain;

  const [wikiProfile, stockData] = await Promise.allSettled([
    fetchWikipediaProfile(companyName),
    fetchStockData(normalizedDomain, companyName),
  ]);

  if (wikiProfile.status === "fulfilled") {
    const w = wikiProfile.value;
    if (!profile.headquarters  && w.headquarters)  profile.headquarters  = w.headquarters;
    if (!profile.employeeCount && w.employeeCount) profile.employeeCount = w.employeeCount;
    if (!profile.founded       && w.founded)       profile.founded       = w.founded;
    if (!profile.founders      && w.founders)      profile.founders      = w.founders;
    if (!profile.industry      && w.industry)      profile.industry      = w.industry;
  }
  if (stockData.status === "fulfilled" && stockData.value) {
    profile.stock = stockData.value;
  }

  // Patch signals with enriched data
  if (signals.estimatedSize === "unknown" && profile.employeeCount) {
    const n = parseInt(profile.employeeCount.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n)) {
      if      (n < 5)     signals.estimatedSize = "solo";
      else if (n < 50)    signals.estimatedSize = "small";
      else if (n < 500)   signals.estimatedSize = "mid";
      else if (n < 5_000) signals.estimatedSize = "large";
      else                signals.estimatedSize = "enterprise";
    }
  }
  if (!signals.isHiring && (signals.estimatedSize === "large" || signals.estimatedSize === "enterprise")) {
    signals.isHiring = true;
  }

  return {
    domain: normalizedDomain,
    url,
    title,
    description,
    bodyText,
    techStack,
    signals,
    metaTags,
    links: [...new Set(links)].slice(0, 80),
    emails: extractEmails(allHtml, $all),
    phones,
    socialLinks: extractSocialLinks(links),
    profile,
  };
}
