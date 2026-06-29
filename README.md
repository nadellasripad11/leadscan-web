<div align="center">

# LeadScan

**the sales intel tool i built because existing ones suck**

(or: how i stopped wasting 2 hours per lead on research)

[![Live Site](https://img.shields.io/badge/🌐_try_it-leadscan--web.vercel.app-3b82f6?style=for-the-badge)](https://leadscan-web.vercel.app)
&nbsp;
[![npm](https://img.shields.io/npm/v/leadscan?style=for-the-badge&color=3b82f6&label=npm)](https://www.npmjs.com/package/leadscan)
&nbsp;
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## just paste a domain. boom.

**→ [leadscan-web.vercel.app/scan](https://leadscan-web.vercel.app/scan)**

you get: founder names. founding year. how many employees. what tech they use. if they're hiring. their emails. revenue estimates. and an AI-written cold email you can actually send (not generic template garbage).

3 seconds. no login. no credit card.

try it: [stripe.com](https://leadscan-web.vercel.app/r/stripe.com) · [linear.app](https://leadscan-web.vercel.app/r/linear.app) · [your competitor](https://leadscan-web.vercel.app/r/example.com) · [that local dentist you're targeting](https://leadscan-web.vercel.app/scan)

---

## what actually comes back

every scan:

- **Conviction Score** — 0–100. high = "worth cold emailing". low = "ghost website". based on: do they have a tech team (modern stack)? are they growing (hiring signals)? are they real (pricing page, API docs)? can you actually contact them?
- **Founder names & founding year** — scraped from Wikipedia if they're any size. fills in the "who started this?" question fast.
- **Tech Stack** — React? Shopify? WordPress? 60+ tech fingerprints. tells you about their product quality + team size.
- **Are they hiring?** — looks at their jobs page + LinkedIn. if they're hiring engineers, they're growing.
- **Email addresses** — usually support@, hello@, or whatever's on the contact page. real emails, not newsletter signups.
- **Headquarters** — where they actually operate.
- **Revenue estimate** — if they're public, actual stock data. if private, AI takes a guess based on headcount + funding.
- **AI cold email** — you type "VP of Sales" + "sales automation platform". it writes back an email that doesn't sound like a bot.

---

## or use the CLI if you're building something

```bash
npx leadscan analyze stripe.com
```

```
✓ stripe.com

  Conviction:  78/100
  Founded:     2010
  Founders:    Patrick Collison, John Collison
  HQ:          San Francisco, CA
  Employees:   8,000+
  
  Tech:        React, Next.js, AWS, TypeScript
  Hiring:      ✓ yes
  Pricing:     ✓ yes
  API Docs:    ✓ yes
  Revenue:     private (but like... $2B+)
  
  Emails:      support@stripe.com, hello@stripe.com
  LinkedIn:    linkedin.com/company/stripe
```

### install it globally

```bash
npm install -g leadscan
leadscan analyze [domain]
```

### generate personalized cold emails

```bash
npx leadscan outreach stripe.com \
  --role "Head of Engineering" \
  --product "observability platform for teams"
```

you get 3 versions: cold email (send to inbox), LinkedIn message (under 280 chars), call opener (what to say when they pick up).

needs a free Groq API key: [console.groq.com](https://console.groq.com)

### batch scan a list

```bash
npx leadscan batch urls.txt --json > results.json
```

useful for: finding your ideal customer profile, ranking leads, bulk research.

### pipe to whatever

```bash
npx leadscan analyze stripe.com --json | jq '.techStack'
# outputs: { "frontend": ["React", "Next.js"], "infrastructure": ["AWS"] }
```

---

## web app has some nice extras

- **Batch tab** — paste 20 domains at once. get back ranked list sorted by conviction score. useful for finding your best targets.
- **Compare tab** — side-by-side two companies. stripe vs square? vercel vs netlify? see who's winning.
- **Ask AI button** — missing founder names or revenue? click the button. Groq's Llama looks at everything and fills in the blanks.
- **Shareable reports** — every scan gets a permanent URL. `/r/stripe.com` is yours forever. send it to your team.
- **Export to CSV** — dump it all into your CRM or spreadsheet.

---

## API (no auth required)

hit these endpoints if you're building something on top:

### analyze a domain

```bash
curl -X POST https://leadscan-web.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain": "stripe.com", "ai": true}'
```

response:
```json
{
  "domain": "stripe.com",
  "convictionScore": 78,
  "summary": "Stripe is a payment infrastructure company...",
  "industry": "FinTech",
  "techStack": {
    "frontend": ["React", "Next.js"],
    "infrastructure": ["AWS", "Vercel"],
    "payments": ["Stripe"]
  },
  "signals": {
    "isHiring": true,
    "hasPricing": true,
    "hasAPIDoc": true,
    "hasChangelog": true
  },
  "profile": {
    "headquarters": "San Francisco, CA",
    "founded": "2010",
    "founders": "Patrick Collison, John Collison",
    "employeeCount": "8,000+"
  },
  "emails": ["support@stripe.com", "hello@stripe.com"],
  "phones": ["+1-415-xxx-xxxx"],
  "socialLinks": {
    "linkedin": "linkedin.com/company/stripe",
    "twitter": "twitter.com/stripe",
    "github": "github.com/stripe"
  }
}
```

### generate outreach

```bash
curl -X POST https://leadscan-web.vercel.app/api/outreach \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "stripe.com",
    "role": "VP of Engineering",
    "product": "fraud detection platform"
  }'
```

response:
```json
{
  "domain": "stripe.com",
  "role": "VP of Engineering",
  "product": "fraud detection platform",
  "email": {
    "subject": "Fraud detection for Stripe partners",
    "body": "..."
  },
  "linkedin": "Hey! Came across Stripe's fraud work...",
  "callOpener": "Hi, this is... I noticed Stripe is..."
}
```

---

## run it locally

```bash
git clone https://github.com/nadellasripad11/leadscan-web.git
cd leadscan-web
npm install
echo "GROQ_API_KEY=gsk_..." > .env.local
npm run dev
# open http://localhost:3000/scan
```

no GROQ key? fine. basic scraping and rule-based industry detection still works.

### deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nadellasripad11/leadscan-web)

or use any Node.js host. just add GROQ_API_KEY to env vars and you're done.

---

## tech i used

- **Next.js 15 + TypeScript** — server components make this fast. type safety saves lives.
- **Cheerio** — parse HTML like jQuery. dead simple, works great.
- **Groq API** — llama 3.3 70B is insanely fast + cheap. overkill for most tasks but why not.
- **Vercel** — because deploying is boring and should be instant. it is.
- **Wikipedia parsing** — took way too long. wikitext templates are evil (`{{Unbulleted list|a|b}}` is hell).

---

## why i actually built this

i spent 2 years doing B2B sales and kept noticing:
- every "lead intelligence" tool costs $200+/month
- you click 3 times per domain to get anything useful
- data is outdated or wrong
- doesn't work for small businesses (your local dentist isn't in Clearbit)
- "AI outreach" means: "dear john at acme incorporated" template garbage

so one weekend i built: fetch their homepage, scrape their tech, pull Wikipedia data, find their emails, score them, generate actual personalized outreach.

3 seconds. free. works for tiny local businesses and $100B companies.

---

## the weird engineering

- **Wikipedia wikitext** — `{{Unbulleted list|a|b|c}}` and `{{nowrap|text}}` templates breaking the parser was the worst part. depth-aware extraction ftw.
- **Small business data** — startups leave fingerprints everywhere (api.stripe.com in your scripts, `/pricing` page, hiring signals). dentists? buried in schema.org + sub-pages.
- **Phone number extraction** — email is easy. actual phone numbers? contact forms, microdata, sometimes random footer text. regex + microdata parsing required.
- **AI hallucination** — Groq's good but still guesses sometimes. we score lower when AI fills in missing data so you know when to verify.

---

<div align="center">

**built by [sripad](https://github.com/nadellasripad11)** · full-stack builder · [portfolio](https://sripadnadella.com)

**if this saved you hours on research or got you a meeting → drop a ⭐**

that's all i ask

</div>
