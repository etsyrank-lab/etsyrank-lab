# EtsyRank Lab — MVP Scaffold

An Etsy SEO research toolkit (keyword research, competitor analysis, tag optimizer)
scaffolded with **Next.js 14 (App Router) + TypeScript + Tailwind CSS** and **mock data**.
Original branding and copy — a functional starting point, not a clone of any existing tool.

> **Disclaimer:** Demo project with fictional data. Not affiliated with or endorsed by
> Etsy, Inc. "Etsy" is a trademark of Etsy, Inc.

## What's built

**Landing page** (`/`)
- Navbar, hero with mock keyword snapshot card, feature grid, 3-step "how it works",
  pricing teaser (checkout not wired — Phase 2), footer.

**Dashboard** (`/dashboard`)
- `Sidebar` layout with Overview / Keyword research / Competition / Tag optimizer nav.
- **Overview** — mock stat cards, top keywords, Phase 2 checklist.
- **Keyword research** (`/dashboard/keywords`) — search box, results table
  (volume, competition, KD, CTR, opportunity badge), detail view with stat cards
  and a 12-month SVG demand-trend chart.
- **Competition** (`/dashboard/competition`) — market stat cards (avg price, listing
  age, top category), competitor shop table ranked by sales, top-listing cards with
  views/favorites/conversion, most-used-tags bars.
- **Tag optimizer** (`/dashboard/tags`) — paste up to 13 tags, get per-tag scores,
  overall score, and suggested replacement tags.

**API route stubs** (all return mock data today)
- `GET /api/keywords?q=` → keyword metrics / search list
- `GET /api/competition?q=` → shops + listings + market insight
- `POST /api/tags` → `{ keyword, tags[] }` → scored analysis

Each route file has a header comment with the exact **Etsy Open API v3** endpoints
to call in Phase 2.

**Data & schemas**
- `lib/mock-data.ts` — fictional keywords, listings, shops, tags, market insight.
- `lib/schema.ts` — Mongoose schemas for `User`, `KeywordCache` (24h TTL),
  `Credit` ledger. Defined but **not connected** in MVP.
- `types/index.ts` — shared TypeScript interfaces.

## How to run

```bash
cd etsy-seo-tool
npm install
npm run dev
```

Then open http://localhost:3000

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`.

## Env vars needed for Phase 2 (real integrations)

Copy `.env.example` to `.env` when you're ready:

| Variable | Used for |
|---|---|
| `ETSY_API_KEY` | Etsy Open API v3 (`x-api-key` header). Apply at developers.etsy.com |
| `ETSY_API_SHARED_SECRET` | Etsy OAuth (shop analytics) |
| `MONGODB_URI` | MongoDB Atlas connection string for caching + users |
| `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`) | AI title/tag/description generation |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | Auth sessions |

Phase 2 work items (see TODO comments in `app/api/*/route.ts`):
1. `lib/db.ts` — `mongoose.connect(process.env.MONGODB_URI)` helper.
2. Replace mock reads with cache-check → Etsy API → cache-write flow.
3. Search volume needs a keyword-data provider (Etsy doesn't expose it).
4. NextAuth + credit debit on each tool call (`Credit` ledger exists).
5. Stripe checkout for the pricing plans (currently teaser only).

## Deployment notes (Vercel)

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel: **Add New Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected). Build command `npm run build`.
4. Add environment variables in **Project Settings → Environment Variables**
   (only needed for Phase 2; MVP deploys with zero env vars).
5. Deploy. API routes run as serverless functions automatically.

No `vercel.json` needed for the MVP.

## Project structure

```
app/
  page.tsx                 landing page
  layout.tsx / globals.css
  dashboard/
    layout.tsx             sidebar shell
    page.tsx               overview
    keywords/page.tsx      keyword research tool
    competition/page.tsx   competitor analysis tool
    tags/page.tsx          tag optimizer tool
  api/
    keywords/route.ts      GET stub (mock)
    competition/route.ts   GET stub (mock)
    tags/route.ts          POST stub (mock)
components/
  ui.tsx                   Card, Button, Input, Badge primitives
  landing/                 Navbar, Hero, Features, Pricing, Footer
  dashboard/               Sidebar, Widgets (StatCard, TrendsChart),
                           Tables (Keyword/Competitor/Listing), TagOptimizer
lib/
  mock-data.ts             fictional dataset + analyzeTags()
  schema.ts                Mongoose: User, KeywordCache, Credit
types/index.ts             shared interfaces
```

## What's mock vs real

| Area | MVP status |
|---|---|
| All keyword/listing/shop/tag numbers | **Mock** (`lib/mock-data.ts`) |
| API routes | **Mock** — real Etsy call sites marked with TODOs |
| Database | **Schemas only** — no connection, no auth |
| Auth / credits / billing | **Not built** — UI placeholders |
| Chrome extension | **Not built** — out of MVP scope |
| UI, routing, charts, scoring logic | **Real, working** |
