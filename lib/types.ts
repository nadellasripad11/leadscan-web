export interface CompanyData {
  domain: string;
  url: string;
  title: string;
  description: string;
  bodyText: string;
  techStack: TechStack;
  signals: GrowthSignals;
  metaTags: Record<string, string>;
  links: string[];
  emails: string[];
  phones: string[];
  socialLinks: SocialLinks;
  profile: CompanyProfile;
}

export interface CompanyProfile {
  displayName?: string;
  headquarters?: string;       // "San Francisco, CA"
  locations?: string[];        // ["New York", "London", "Singapore"]
  address?: string;            // Full street address from schema.org
  phone?: string;              // Primary phone number
  businessHours?: string;      // "Mon–Fri 9am–6pm" or from JSON-LD
  businessType?: string;       // "Restaurant", "LocalBusiness", "MedicalClinic", etc.
  employeeCount?: string;      // "2,400" or "201–500"
  founded?: string;            // "2010"
  founders?: string;           // "Larry Ellison, Bob Miner, Ed Oates"
  industry?: string;           // "Enterprise Software"
  stock?: StockData;
}

export interface StockData {
  ticker: string;
  exchange?: string;
  price: number;
  currency: string;
  changePercent: number;       // e.g. 2.35 = +2.35%
  marketCap?: number;          // millions USD
  revenue?: number;            // annual revenue, millions USD
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  analytics: string[];
  marketing: string[];
  infrastructure: string[];
  payments: string[];
  other: string[];
}

export interface GrowthSignals {
  isHiring: boolean;
  hiringKeywords: string[];
  hasPricing: boolean;
  hasAPIDoc: boolean;
  hasChangelog: boolean;
  hasBlog: boolean;
  hasInvestors: boolean;
  estimatedSize: "solo" | "small" | "mid" | "large" | "enterprise" | "unknown";
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  crunchbase?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
}

export interface IntelReport {
  domain: string;
  scrapedAt: string;
  summary: string;
  industry: string;
  targetCustomer: string;
  valueProposition: string;
  techStack: TechStack;
  signals: GrowthSignals;
  socialLinks: SocialLinks;
  emails: string[];
  phones: string[];
  convictionScore: number;
  scoreBreakdown: ScoreBreakdown;
  aiEnabled: boolean;
  profile: CompanyProfile;
}

export interface ScoreBreakdown {
  techModernity: number;
  growthSignals: number;
  marketPresence: number;
  contactability: number;
  total: number;
}

export interface OutreachResult {
  domain: string;
  role: string;
  product: string;
  email: OutreachEmail;
  linkedin: string;
  callOpener: string;
}

export interface OutreachEmail {
  subject: string;
  body: string;
}
