<div align="center">

# LeadScan

**turn any domain into company intelligence in 3 seconds**

i built this because i was spending 2+ hours per lead doing research. and existing tools sucked.

[![Live Site](https://img.shields.io/badge/try_it-leadscan--web.vercel.app-3b82f6?style=for-the-badge)](https://leadscan-web.vercel.app)
&nbsp;
[![npm](https://img.shields.io/npm/v/leadscan?style=for-the-badge&color=3b82f6&label=npm)](https://www.npmjs.com/package/leadscan)
&nbsp;
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## actually useful, not bloated

**→ [leadscan-web.vercel.app/scan](https://leadscan-web.vercel.app/scan)**

paste a domain. get back:
- **founder names & year they started** (from Wikipedia if they're big enough)
- **exact employee count** (not estimates)
- **their full tech stack** (60+ technologies)
- **hiring signals** (are they actually growing?)
- **real email addresses** (support@, contact@, etc — not newsletters)
- **headquarters location**
- **revenue** (real data if public, smart guesses if private)
- **personalized cold email** that doesn't sound like a template bot wrote it

no login. no credit card. 3 seconds flat.

see it in action: [stripe.com](https://leadscan-web.vercel.app/r/stripe.com) · [linear.app](https://leadscan-web.vercel.app/r/linear.app) · [vercel.com](https://leadscan-web.vercel.app/r/vercel.com) · [your competitor](https://leadscan-web.vercel.app/scan)

---

## what you actually get

**conviction score** (0–100)  
is this worth cold emailing? based on: modern tech stack? hiring signals? real pricing page? API docs? actual email? the number tells you fast.

**founder info**  
names, founding year, usually from Wikipedia. you know who actually runs the place.

**tech stack**  
react, stripe, aws, shopify, wordpress — 60+ technologies. tells you about product maturity and team size.

**growth signals**  
hiring engineers? have a pricing page? published API docs? changelog? we look for all of it. if they're hiring, they're growing.

**contact info**  
real emails (support@, hello@, contact@). we extract these from actual pages, not guesses. sometimes phone numbers too.

**location & size**  
headquarters, employee count, headcount range. real data.

**revenue**  
if they're public: actual stock data. if private: AI makes an educated guess based on headcount + funding rounds.

**personalized cold email**  
you say "VP of Sales at a fintech" → we write an email that references their specific tech, market, hiring situation. not "dear john" template garbage.

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

## how i actually built it

**next.js 15 + typescript**  
server components are insanely fast for scraping-heavy pages. type safety keeps the code from turning into spaghetti. runs everywhere.

**cheerio for html parsing**  
jquery for the backend. dead simple. i parse homepages, jobs pages, subpages in parallel. way faster than puppeteer for this use case.

**groq api (llama 3.3 70b)**  
fast + cheap. fill in missing founder names, estimate revenue, generate cold emails. it's not perfect (still hallucinates sometimes) but the conviction score warns you when to double-check.

**vercel for hosting**  
deploying should be boring. git push → live in 30 seconds. environment variables work. analytics are built-in. api routes just work.

**wikipedia parsing (the nightmare)**  
wikitext templates like `{{Unbulleted list|a|b|c}}` and `{{nowrap|x}}` broke my parser 3 times. ended up writing depth-aware extraction. regret nothing.

---

## why i built this

spent 2 years doing B2B sales. here's what broke:

**existing tools are trash:**
- clearbit, hunter.io, etc. cost $200+/month and it's STILL slow
- you click 3-4 times to get basic info
- data is stale or just wrong
- doesn't scale down (your local dentist isn't in their database)
- "AI outreach" is just template madlibs with [FIRST_NAME] inserted

**so i built the opposite:**
one domain. one click. everything comes back in 3 seconds. free. works whether you're targeting stripe or some 5-person startup in your town.

the scraping is dumb but it works — homepage HTML, Wikipedia, schema.org microdata, hiring signals, email extraction. then Groq's llama fills in the gaps. conviction scoring tells you if it's even worth the email.

no logins. no promises. just data.

---

## things that almost broke me

**wikipedia wikitext parsing**  
`{{Unbulleted list|a|b|c}}` and `{{nowrap|text}}` templates. this took 3 rewrites. learned depth-aware recursive extraction. never again.

**finding data for small businesses**  
stripe.com? easy. their tech is all over their own API docs. mom-and-pop dentist? buried in schema.org microdata, subpages, footer text. had to write separate paths for "obvious" vs "hidden" data.

**phone numbers**  
emails are everywhere. actual phone numbers? contact forms, microdata schemas, sometimes just... text in a footer. regex + schema.org parsing needed.

**ai getting too confident**  
groq's llama is fast but still hallucinates sometimes. solution: lower the conviction score when AI had to guess. you see "Founder: AI guess" on the report.

**rate limiting**  
people were hammering the free API. now we cache results for 30 days and do in-memory IP rate limiting. happy path works, abuse stops.

---

## what's next

working on:
- better Wikipedia extraction (seriously, templates are still evil)
- LinkedIn company data integration (hiring signals are gold)
- person-level lookups (if you have a founder name, find their email)
- batch analysis with CSV export (for sales teams doing 100+ at once)

ideas i'm sitting on:
- Chrome extension so you can scan right from any website
- Slack integration for quick lookups
- webhook notifications when companies start hiring

want something? [open an issue](https://github.com/nadellasripad11/leadscan/issues) or DM me.

---

<div align="center">

**made by [sripad](https://github.com/nadellasripad11)**  
CS student · full-stack builder · ships stuff that actually works

hit me up: [twitter](https://x.com/sripadnadella) · [email](mailto:nadellasripad11@gmail.com) · [portfolio](https://sripadnadella.com)

---

if this saved you hours on research or helped you land a meeting → drop a ⭐  
genuinely means something to me.

</div>
