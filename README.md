# BrandSkill

> Turn any website URL into a Claude Skill file in 60 seconds.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL via Neon + Prisma ORM
- **Auth:** NextAuth.js (Google OAuth + magic link email)
- **AI:** Claude (claude-sonnet-4 via Anthropic SDK)
- **Payments:** Stripe (one-time + subscription)
- **Email:** Resend
- **CRM:** GoHighLevel (optional)
- **Hosting:** Replit

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `NEXTAUTH_URL` — Your Replit app URL (e.g. `https://brandskill.yourname.replit.app`)
- `NEXTAUTH_SECRET` — Random secret: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `ANTHROPIC_API_KEY` — From console.anthropic.com
- `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` — From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` — From Stripe webhook settings
- `STRIPE_PREMIUM_PRICE_ID` — Create a $19 one-time price in Stripe
- `STRIPE_AGENCY_PRICE_ID` — Create a $99/month recurring price in Stripe
- `RESEND_API_KEY` — From resend.com

Optional:
- `GHL_API_KEY` + `GHL_LOCATION_ID` — GoHighLevel CRM integration

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run locally

```bash
npm run dev
```

### 5. Set up Stripe webhook

In Stripe dashboard → Webhooks → Add endpoint:
- URL: `https://your-app.replit.app/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.deleted`

### 6. Deploy on Replit

1. Push code to your Repl
2. Add all env vars in Replit Secrets
3. Set run command: `npm run build && npm run start`
4. Deploy

## Stripe Products to Create

In your Stripe dashboard, create:

1. **BrandSkill Premium** — One-time price, $19 USD
   → Copy the price ID to `STRIPE_PREMIUM_PRICE_ID`

2. **BrandSkill Agency** — Recurring price, $99/month USD
   → Copy the price ID to `STRIPE_AGENCY_PRICE_ID`

## Architecture

```
/app
  /api
    /generate      → scrape + Claude analysis + save to DB
    /scrape        → scrape only (preview)
    /brands        → CRUD for saved brands
    /checkout      → Stripe checkout session creation
    /webhooks
      /stripe      → handle payment completion
      /ghl         → GoHighLevel inbound events
  /generate        → main generator page (URL input → result)
  /dashboard       → authenticated brand library
  /login           → Google OAuth + magic link
  /pricing         → pricing page with checkout
  /examples        → static SEO examples
  /share/[token]   → public share pages for skill files

/lib
  prisma.ts        → Prisma client singleton
  scraper.ts       → Cheerio-based web scraper
  analyzer.ts      → Claude skill file generator
  auth.ts          → NextAuth configuration
  stripe.ts        → Stripe client
  ghl.ts           → GoHighLevel API wrapper
```

## Business Model

| Tier    | Price       | What they get |
|---------|-------------|---------------|
| Free    | $0          | Homepage scan, 3 voice rules, 2 templates |
| Premium | $19 one-time| 10-page crawl, 5 rules, 6 templates, anti-patterns, image guidance, competitor analysis |
| Agency  | $99/month   | Unlimited brands, team dashboard, API access |
