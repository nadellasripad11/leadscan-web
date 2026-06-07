# LeadScan

Turn any domain into company intelligence in 5 seconds. Tech stack, growth signals, conviction score, and AI-written outreach — free, no account required.

**Live site:** [leadscan.app](https://leadscan-web.vercel.app)

---

## What you get from every scan

| Field | Description |
|-------|-------------|
| **Conviction Score** | 0–100 lead quality score across 4 weighted signals |
| **Tech Stack** | 40+ technologies detected from public HTML & headers |
| **Growth Signals** | Hiring, blog, pricing page, API docs, changelog, investors |
| **Company Intelligence** | HQ, headcount, founding year, revenue, stock price |
| **Contacts** | Emails and social links found on the public site |
| **AI Outreach** | Cold email, LinkedIn message, and call opener — personalized per company |

---

## Using the website

### 1. Open the scanner

Go to **[leadscan.app/scan](https://leadscan-web.vercel.app/scan)** — no login, no account needed.

### 2. Enter a domain

Type or paste any company domain into the search bar. LeadScan handles the rest — strips `https://`, `www.`, and trailing slashes automatically.

```
stripe.com
https://www.notion.so/
linear.app
```

### 3. Read the report

Your full report appears in ~5 seconds:

- **Conviction Score** — the overall 0–100 lead quality number
- **Score Breakdown** — tech modernity, growth signals, market presence, contactability
- **Company Intelligence** — HQ, employees, founded, revenue, stock price, hiring status
- **Tech Stack** — everything detected from the frontend, backend, analytics, payments, and infra
- **Growth Signals** — hiring, blog, pricing page, API docs, changelog, investor backing
- **Contacts & Social** — emails found on the site, LinkedIn, Twitter, GitHub, Crunchbase

### 4. Generate AI outreach

Scroll to the **Generate Outreach** card at the bottom of the report. Enter:

- **Role you're targeting** — e.g. "Head of Engineering", "VP of Sales"
- **What you're selling** — e.g. "observability tool", "recruitment software"

LeadScan writes three pieces of outreach specific to that company:
- A cold email with subject line
- A LinkedIn connection message (under 280 chars)
- A 15-second phone call opener

### 5. Export or share

- **Export CSV** — downloads a spreadsheet with every field from the report
- **Share** — copies a permanent link like `leadscan.app/r/stripe.com`

### Batch mode

Paste up to 20 domains at once into the **Batch** tab. All are scanned and ranked by conviction score — useful for prioritizing a prospecting list.

### Compare mode

Use the **Compare** tab to do a head-to-head analysis of two companies across every scoring dimension.

---

## Using the CLI

The `leadscan` CLI is published on npm. Run it instantly with `npx`, or install globally.

### Quick start

```bash
npx leadscan analyze stripe.com
```

### Install globally

```bash
npm install -g leadscan
# then use without npx:
leadscan analyze stripe.com
```

### Commands

#### `analyze` — full company report

```bash
npx leadscan analyze stripe.com
```

Output:
```
✓  stripe.com — Conviction: 78/100

   Tech:      React, Next.js, AWS, TypeScript, Stripe
   HQ:        San Francisco, CA    Founded: 2010
   Employees: 8,000+              Size: enterprise
   Signals:   ✓ Hiring  ✓ Blog  ✓ Pricing  ✓ API Docs
   Email:     support@stripe.com
   LinkedIn:  linkedin.com/company/stripe
   Twitter:   twitter.com/stripe
```

#### `outreach` — AI-generated sales copy

```bash
npx leadscan outreach stripe.com \
  --role "Head of Engineering" \
  --product "observability tool"
```

Generates a cold email, LinkedIn message, and call opener tailored to that company.

> Requires `GROQ_API_KEY` environment variable. Get one free at [console.groq.com](https://console.groq.com).

```bash
GROQ_API_KEY=gsk_... npx leadscan outreach stripe.com \
  --role "Head of Engineering" \
  --product "observability tool"
```

#### `batch` — scan multiple domains

Create a text file with one domain per line:

```
# domains.txt
stripe.com
linear.app
vercel.com
notion.so
figma.com
```

Then run:

```bash
npx leadscan batch domains.txt
```

Results are printed ranked by conviction score:

```
  1.  stripe.com      78/100  ████████░░
  2.  vercel.com      74/100  ███████░░░
  3.  linear.app      71/100  ███████░░░
  4.  notion.so       65/100  ██████░░░░
  5.  figma.com       60/100  ██████░░░░
```

#### JSON output

Add `--json` to any command to get machine-readable output:

```bash
# Print JSON to stdout
npx leadscan analyze stripe.com --json

# Save to file
npx leadscan analyze stripe.com --json > stripe.json

# Pipe into jq
npx leadscan analyze stripe.com --json | jq '.convictionScore'
# → 78

# Extract tech stack
npx leadscan analyze stripe.com --json | jq '.techStack.frontend'
# → ["React", "Next.js"]
```

---

## API

The web app exposes two JSON endpoints. No auth required.

### `POST /api/analyze`

Scrape and score a company domain.

**Request:**
```json
{
  "domain": "stripe.com",
  "ai": true
}
```

`ai: true` enables the AI summary (requires `GROQ_API_KEY` on the server).

**Response:**
```json
{
  "domain": "stripe.com",
  "convictionScore": 78,
  "summary": "Stripe builds financial infrastructure for the internet...",
  "industry": "FinTech",
  "scoreBreakdown": {
    "techModernity": 85,
    "growthSignals": 80,
    "marketPresence": 72,
    "contactability": 60
  },
  "techStack": {
    "frontend": ["React", "Next.js"],
    "backend": [],
    "analytics": ["Amplitude"],
    "infrastructure": ["AWS", "Cloudflare"],
    "payments": ["Stripe"],
    "other": []
  },
  "signals": {
    "isHiring": true,
    "hasPricing": true,
    "hasAPIDoc": true,
    "hasBlog": true,
    "hasChangelog": false,
    "hasInvestors": false,
    "estimatedSize": "enterprise"
  },
  "emails": ["support@stripe.com"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/stripe",
    "twitter": "https://twitter.com/stripe",
    "github": "https://github.com/stripe"
  },
  "profile": {
    "headquarters": "San Francisco, CA",
    "employeeCount": "8,000+",
    "founded": "2010"
  }
}
```

### `POST /api/outreach`

Generate AI outreach for a company.

**Request:**
```json
{
  "domain": "stripe.com",
  "role": "Head of Engineering",
  "product": "observability tool"
}
```

**Response:**
```json
{
  "domain": "stripe.com",
  "role": "Head of Engineering",
  "product": "observability tool",
  "email": {
    "subject": "Quick question about Stripe's infrastructure",
    "body": "..."
  },
  "linkedin": "Hi — I came across Stripe's engineering blog...",
  "callOpener": "Hi, I'm calling because Stripe is scaling fast..."
}
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Optional | Enables AI summaries and outreach generation. Get one free at [console.groq.com](https://console.groq.com). Without it, the scanner still works — AI features return template-based output. |

---

## Self-hosting

```bash
git clone https://github.com/nadellasripad11/leadscan-web
cd leadscan-web
npm install

# Optional: add your Groq key for AI features
echo "GROQ_API_KEY=gsk_..." > .env.local

npm run dev
# → http://localhost:3000
```

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nadellasripad11/leadscan-web)

---

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Scraping:** Cheerio + Axios
- **AI:** Groq (Llama 3.1 8B Instant)
- **Hosting:** Vercel

---

Built by [Sripad Nadella](https://github.com/nadellasripad11)
