<div align="center">

# LeadScan

**Company intelligence in seconds — free, no account required.**

[![Live Site](https://img.shields.io/badge/🌐_Try_it_live-leadscan--web.vercel.app-7c3aed?style=for-the-badge)](https://leadscan-web.vercel.app)
&nbsp;
[![npm](https://img.shields.io/npm/v/leadscan?style=for-the-badge&color=3b82f6&label=npm)](https://www.npmjs.com/package/leadscan)
&nbsp;
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## 🌐 Website — the fastest way to start

**→ [leadscan-web.vercel.app/scan](https://leadscan-web.vercel.app/scan)**

Open it, paste a domain, press enter. Full report in under 5 seconds. Nothing to install.

![LeadScan screenshot](https://raw.githubusercontent.com/nadellasripad11/leadscan-web/main/public/og.svg)

> **Try it now:** [stripe.com](https://leadscan-web.vercel.app/r/stripe.com) · [linear.app](https://leadscan-web.vercel.app/r/linear.app) · [vercel.com](https://leadscan-web.vercel.app/r/vercel.com) · [notion.so](https://leadscan-web.vercel.app/r/notion.so)

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

## CLI — for scripts and automation

If you prefer the terminal or want to pipe results into a CRM/script:

```bash
npx leadscan analyze stripe.com
```

```
✓  stripe.com — Conviction: 78/100

   Tech:      React, Next.js, AWS, TypeScript, Stripe
   HQ:        San Francisco, CA    Founded: 2010
   Employees: 8,000+              Size: enterprise
   Signals:   ✓ Hiring  ✓ Blog  ✓ Pricing  ✓ API Docs
   Email:     support@stripe.com
```

### Install globally

```bash
npm install -g leadscan
leadscan analyze stripe.com
```

### Generate AI outreach

```bash
npx leadscan outreach stripe.com \
  --role "Head of Engineering" \
  --product "observability tool"
```

> Requires `GROQ_API_KEY`. Get one free at [console.groq.com](https://console.groq.com).

### Batch scan

```bash
npx leadscan batch domains.txt
```

```
  1.  stripe.com      78/100  ████████░░
  2.  vercel.com      74/100  ███████░░░
  3.  linear.app      71/100  ███████░░░
  4.  notion.so       65/100  ██████░░░░
```

### JSON output

```bash
npx leadscan analyze stripe.com --json | jq '.convictionScore'
# → 78
```

---

## Web features

The website has a few extras over the CLI:

- **Batch tab** — paste up to 20 domains, all ranked by conviction score
- **Compare tab** — head-to-head analysis of two companies
- **AI Outreach modal** — generate cold email, LinkedIn note, and call opener in one click
- **Shareable links** — every scan gets a permanent URL like `/r/stripe.com`
- **CSV export** — download the full report as a spreadsheet

---

## API

No auth. Hit the endpoints directly if you want to build on top of LeadScan.

### `POST /api/analyze`

```bash
curl -X POST https://leadscan-web.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain": "stripe.com"}'
```

**Response:**
```json
{
  "domain": "stripe.com",
  "convictionScore": 78,
  "techStack": { "frontend": ["React", "Next.js"], "infrastructure": ["AWS"] },
  "signals": { "isHiring": true, "hasPricing": true, "hasAPIDoc": true },
  "profile": { "headquarters": "San Francisco, CA", "employeeCount": "8,000+" }
}
```

### `POST /api/outreach`

```bash
curl -X POST https://leadscan-web.vercel.app/api/outreach \
  -H "Content-Type: application/json" \
  -d '{"domain": "stripe.com", "role": "Head of Engineering", "product": "observability tool"}'
```

---

## Self-hosting

```bash
git clone https://github.com/nadellasripad11/leadscan-web
cd leadscan-web
npm install
echo "GROQ_API_KEY=gsk_..." > .env.local
npm run dev
```

One-click Vercel deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nadellasripad11/leadscan-web)

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Optional | AI summaries and outreach. Free at [console.groq.com](https://console.groq.com). Without it, AI features use templates. |

---

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Scraping:** Cheerio + Axios
- **AI:** Groq (Llama 3.1 8B Instant)
- **Hosting:** Vercel

---

<div align="center">

Built by [Sripad Nadella](https://github.com/nadellasripad11)

**If LeadScan saves you time, a ⭐ on this repo means a lot.**

</div>
