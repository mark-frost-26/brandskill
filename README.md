# BrandSkill

**Turn any website URL into a Claude Skill file in 60 seconds.**

BrandSkill scrapes a brand's website, extracts its voice, colors, fonts, and content patterns, then uses Claude to generate a structured `.md` Skill file that any AI (Claude, Cursor, Copilot, Gemini CLI) can load to produce on-brand content automatically.

Free tier is permanently free. Premium is a $19 one-time purchase. Agency is $99/month.

---

## What It Does

Paste a URL → BrandSkill extracts brand signals (colors, fonts, copy, CTAs, navigation, meta) → Claude analyzes the signals → outputs a structured `.md` Skill file with voice rules, visual identity, content templates, anti-patterns, and image generation guidance → download and load into any AI tool.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Neon PostgreSQL via Prisma 5.17.0 |
| Auth | NextAuth.js (Google OAuth + magic link) |
| Scraping | Cheerio (HTML parsing + brand signal extraction) |
| AI Analysis | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Payments | Stripe (one-time $19 + $99/month subscription) |
| Email | Resend (magic links, receipts) |
| CRM | GoHighLevel (follow-up sequences, pipelines) |
| Deployment | Replit (dev) → Vercel (production) |

---

## Project Structure

```
brandskill/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── layout.tsx                      # Root layout
│   ├── globals.css
│   ├── providers.tsx
│   ├── generate/
│   │   └── page.tsx                    # Generator tool (no auth required)
│   ├── dashboard/
│   │   ├── page.tsx                    # Brand library (auth required)
│   │   └── brands/[id]/
│   │       └── page.tsx                # Skill file viewer + editor
│   ├── examples/
│   │   ├── page.tsx                    # Public gallery (SEO)
│   │   └── [slug]/
│   │       ├── page.tsx                # Server component — loads brand data
│   │       └── BrandPortfolio.tsx      # Client component — tabbed UI + animations
│   ├── login/
│   │   └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   └── api/
│       ├── generate/route.ts           # POST — scrape + analyze + return skill file
│       ├── scrape/route.ts             # POST — scrape URL, return raw signals
│       ├── brands/
│       │   ├── route.ts                # GET/POST — user's saved brands
│       │   └── [id]/route.ts           # GET/PATCH/DELETE — single brand
│       ├── checkout/route.ts           # POST — Stripe checkout session
│       ├── webhooks/
│       │   ├── stripe/route.ts         # checkout.session.completed + subscription.deleted
│       │   └── ghl/route.ts            # GoHighLevel event handler
│       └── auth/
│           └── [...nextauth]/route.ts
├── components/
│   └── layout/
│       └── Navbar.tsx
├── lib/
│   ├── scraper.ts                      # Cheerio brand signal extractor
│   ├── analyzer.ts                     # Claude API skill file generator
│   ├── ghl.ts                          # GoHighLevel API wrapper
│   ├── prisma.ts                       # Prisma client singleton
│   ├── auth.ts                         # NextAuth config
│   └── stripe.ts                       # Stripe client
├── prisma/
│   └── schema.prisma
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  image     String?
  plan      Plan      @default(FREE)
  ghlId     String?
  createdAt DateTime  @default(now())
  brands    Brand[]
  payments  Payment[]
  accounts  Account[]
  sessions  Session[]
}

model Brand {
  id            String   @id @default(cuid())
  userId        String?
  url           String
  name          String
  tier          Tier     @default(FREE)
  brandData     Json
  skillFile     String
  shareToken    String   @unique @default(cuid())
  downloadCount Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User?    @relation(fields: [userId], references: [id])
}

model Payment {
  id        String   @id @default(cuid())
  userId    String
  brandId   String
  stripeId  String   @unique
  amount    Int
  status    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

enum Plan { FREE PREMIUM AGENCY }
enum Tier { FREE PREMIUM }
```

---

## API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/generate` | POST | Optional | Scrape URL + analyze + return skill file |
| `/api/scrape` | POST | Optional | Scrape URL, return raw brand signals |
| `/api/brands` | GET | Required | List user's saved brands |
| `/api/brands` | POST | Required | Save a brand |
| `/api/brands/[id]` | GET | Required | Get single brand |
| `/api/brands/[id]` | PATCH | Required | Update brand |
| `/api/brands/[id]` | DELETE | Required | Delete brand |
| `/api/checkout` | POST | Required | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Stripe sig | Handle `checkout.session.completed` + `customer.subscription.deleted` |
| `/api/webhooks/ghl` | POST | GHL sig | Handle GoHighLevel events |

Rate limiting on `/api/generate`: 3 requests/hour (anonymous), 20/day (authenticated).

---

## Skill File Output Structure

Every generated file follows this exact format:

```markdown
---
name: [Brand] Brand Identity System
description: Apply [Brand]'s complete brand identity to all generated content.
---

## Brand overview
[2–3 sentences: what they sell, who for, positioning, tone]

## Voice & tone rules
### Rule 1 — [Title]
DO: "[correct brand voice example]"
DON'T: "[off-brand voice example]"
[3 rules free / 5 rules premium]

## Visual identity
### Colors
- Primary: #hex — [usage rule]
[+ 4 more colors with usage rules]

### Typography
- Headlines: [font] — [weight, style rules]
- Body: [font] — [size, line-height]

### Logo
- URL: [extracted logo URL]
- Usage: [spacing, placement, size rules]

## Content templates
### Social media posts
[IG, LinkedIn, X, TikTok formulas with char counts]

### Email [premium]
[Subject line formulas, preview text rules, CTA style]

### Ad creatives [premium]
[Headline formula, body copy structure, CTA patterns]

### Blog covers [premium]
[Title formulas, cover image direction, intro pattern]

## Anti-patterns [premium]
[5 things this brand must never do]

## Image generation guidance [premium]
[Mood, style, composition, palette, what to avoid]

## Brand positioning [premium]
[Target audience, value prop, differentiation — 3–4 sentences]

<!-- Generated by BrandSkill.com -->
```

---

## Scraper Specification

**File:** `lib/scraper.ts`  
**Timeout:** 10 seconds  
**User-Agent:** `Mozilla/5.0 (compatible; BrandSkillBot/1.0)`

**Extracted signals:**

```typescript
interface BrandSignals {
  url:        string
  domain:     string
  colors:     Array<{ hex: string; usage: number; label: string }>
  fonts:      { heading?: string; body?: string; accent?: string }
  logo?:      string
  ogImage?:   string
  copy:       string        // up to 3,000 chars from h1/h2/h3/p/button
  ctas:       string[]      // all button and prominent link text
  navigation: string[]      // top nav labels
  meta:       { title: string; description: string }
  partial?:   boolean
  error?:     string
}
```

Color extraction priority: CSS custom properties (`--color-*`) → `meta[name=theme-color]` → most-used hex/rgb/hsl in inline styles → computed stylesheet values. Returns top 5 by frequency with auto-assigned labels.

Premium additionally scrapes: `/about`, first `/blog` post, `/pricing`, competitor URL.

---

## Pricing

| Tier | Price | What's Included |
|---|---|---|
| Free | $0 | Homepage scan · 3 voice rules · 2 templates · instant download |
| Premium | $19 one-time | 10-page crawl · 5 voice rules · all 6 templates · anti-patterns · image guidance · competitor analysis |
| Agency | $99/month | Unlimited scans · team dashboard · white-label exports · API access · priority support |

---

## Stripe Integration

Uses only two webhook events:
- `checkout.session.completed` — upgrades `Brand.tier` to `PREMIUM`, re-runs analyzer with premium prompt, sends receipt via Resend
- `customer.subscription.deleted` — downgrades `User.plan` from `AGENCY` to `FREE`

**Setup:**
1. Create two products in Stripe Dashboard:
   - Premium: $19 one-time payment → copy price ID → `STRIPE_PREMIUM_PRICE_ID`
   - Agency: $99/month recurring → copy price ID → `STRIPE_AGENCY_PRICE_ID`
2. Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select only the two events above
4. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=                        # openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...       # $19 one-time
STRIPE_AGENCY_PRICE_ID=price_...        # $99/month

# Email
RESEND_API_KEY=
FROM_EMAIL=outreach@brandskill.com

# GoHighLevel (optional)
GHL_API_KEY=
GHL_LOCATION_ID=
GHL_FREE_USER_WORKFLOW_ID=
GHL_PREMIUM_WELCOME_WORKFLOW_ID=

# App
NEXT_PUBLIC_APP_URL=https://brandskill.com
```

---

## Local Development (Replit)

**Prerequisites:** Node.js 18+, npm, a Neon PostgreSQL database URL

```bash
# 1. Clone and install
git clone https://github.com/mark-frost-26/brandskill.git
cd brandskill
npm install

# 2. Set environment variables in Replit Secrets (or .env.local)
# Required minimum: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ANTHROPIC_API_KEY

# 3. Push database schema
npx prisma db push

# 4. Start dev server
npm run dev
```

App runs at `http://localhost:3000` (Replit: use the Webview preview URL).

**Troubleshooting port conflicts:**
```bash
pkill -f "next dev"
npm run dev
```

---

## Examples Gallery

Pre-built brand portfolios at `/examples/[slug]` for 12 brands:

`apple` · `stripe` · `linear` · `notion` · `figma` · `vercel` · `framer` · `loom` · `webflow` · `shopify` · `duolingo` · `superhuman`

Each page is a full interactive brand portfolio with 8 sections:
1. **Overview** — brand principle, voice, target, differentiator, positioning quote, color palette
2. **Voice & Tone** — numbered DO/DON'T rule cards with real copy examples
3. **Visual Identity** — color swatches with hex codes, typography showcase, image rules
4. **Social Media** — platform-specific post mockups with handles
5. **Email** — subject line examples + email opener formula
6. **Blog & Editorial** — opening line + editorial formula
7. **Ad Creative** — headline cards in brand colors
8. **Anti-Patterns** — what the brand never does, closed with brand principle hero

Architecture: `page.tsx` is a server component (fast initial load, only loads one brand's data). `BrandPortfolio.tsx` is the client component (tab switching, scroll animations).

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required Vercel environment variables:** All variables from the `.env` section above.

**Post-deploy checklist:**
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Update Stripe webhook endpoint URL in Stripe Dashboard
- [ ] Update GHL webhook URL if applicable
- [ ] Run `npx prisma db push` against production DB (or use Prisma Migrate)
- [ ] Verify Google OAuth redirect URIs include production domain
- [ ] Test full flow: free scan → download → premium checkout → upgrade

---

## GoHighLevel Integration (Optional)

**File:** `lib/ghl.ts`

Used for CRM follow-up, email sequences, and social posting automation.

**Scopes required:** `contacts.readonly`, `contacts.write`, `opportunities.write`

**Key functions:**
- `upsertContact(email, name, plan)` — create or update contact in GHL
- `enrollInWorkflow(contactId, workflowId)` — trigger automation sequence
- `updatePipelineStage(contactId, stage)` — move contact through pipeline

Webhook handler at `/api/webhooks/ghl` receives GHL events and updates local DB accordingly.

---

## Color Palette (UI)

The application uses a slate/teal palette throughout:

| Token | Value | Usage |
|---|---|---|
| Brand primary | `#0d9488` (teal-600) | CTAs, links, active states |
| Brand dark | `#0f766e` (teal-700) | Hover states |
| Background | `#f8fafc` (slate-50) | Page background |
| Surface | `#ffffff` | Cards, inputs |
| Border | `#e2e8f0` (slate-200) | Dividers |
| Text primary | `#0f172a` (slate-900) | Headings |
| Text secondary | `#64748b` (slate-500) | Body, labels |

---

## Known Issues & Notes

- **Port conflict on Replit:** If `npm run dev` fails with `EADDRINUSE`, run `pkill -f "next dev"` first.
- **Prisma version:** Pinned to `5.17.0` — do not upgrade without testing schema compatibility.
- **Next.js config:** Uses `serverExternalPackages` (not the deprecated `serverComponentsExternalPackages`).
- **Stripe secrets:** Must be set before server start — Replit Secrets are injected at boot, not at runtime.
- **`'use client'` boundary:** `BrandPortfolio.tsx` handles all interactive state. `page.tsx` files remain server components for fast initial paint.

---

## Roadmap

- [ ] White-label export (Agency tier)
- [ ] API access for Agency tier (`/api/v1/generate`)
- [ ] Skill file editor (inline editing in dashboard)
- [ ] Competitor analysis (paste competitor URL → differentiation rules baked in)
- [ ] Slack / Notion export integration
- [ ] `/examples` gallery expanded to 50 brands
- [ ] Programmatic SEO blog (`/blog/how-to-create-claude-skill-file-for-[industry]`)

---

## License

Private repository. All rights reserved.

Built by Boris Savransky. Generated skill files are the property of the user who created them.
