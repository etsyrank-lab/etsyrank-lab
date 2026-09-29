# Project Resume Notes — Etsy SEO Toolkit ("EtsyRank Lab")

Saved: 2026-09-28. Updated: 2026-09-29 (Phase 2: rankkw-parity tools + UI upgrade). Pick up here after a break.

## What this is
An Etsy SEO toolkit with a similar feature set to rankkw.com, built with original branding (not a copy).
Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS. Location: `~/workspace/etsy-seo-tool/`

## What's done
- MVP scaffold complete (2026-09-28), typecheck + production build verified.
- **Deployed 2026-09-29**: live at https://etsyrank-lab.vercel.app (Vercel Hobby, free). Repo: github.com/etsyrank-lab/etsyrank-lab, branch `main`. Vercel auto-deploys on push to main.
- Landing page (`/`): Navbar, Hero (gradient mesh + CSS dashboard preview + animated counters), 9-tool Features grid, HowItWorks, Testimonials, PricingTeaser, FAQ accordion, CTA panel, rich Footer
- Dashboard (`/dashboard`): Overview with welcome strip + all-9-tools grid; Topbar with global search + mock user chip; grouped Sidebar (Research / Optimize / Track) with icons; mobile scroll nav
  - `/dashboard/keywords` — search + stat cards + SVG trend chart
  - `/dashboard/competition` — market stats, competitor table, listing cards
  - `/dashboard/tags` — interactive 13-tag scorer
  - `/dashboard/niches` — Niche Opportunity Explorer: 12 niches, category filter, sort, sparklines, deep-link to keywords
  - `/dashboard/shop` — Shop Analyzer: health score ring, strengths/weaknesses, stats, top listings
  - `/dashboard/audit` — Listing Auditor: paste title/tags/description/attributes/images → 0–100 grade + section scores + quick wins
  - `/dashboard/ai-writer` — AI Listing Writer (mock templates): title + 13 tags + description, copy buttons, GPT-5 mini TODO in route
  - `/dashboard/calculator` — Fee & Profit Calculator: 100% client-side Etsy fee math (6.5% / $0.20 / 3%+$0.25 / Offsite Ads 12–15%)
  - `/dashboard/rank-tracker` — Rank Tracker: table with 7-day change badges + 30-day SVG history, add/remove (local state)
- Mock data: `lib/mock-data.ts` — 8 keywords, listings, 6 shops, tag maps, `analyzeTags()` + Phase 2: `MOCK_NICHES`, `MOCK_TRACKED`, `auditListing()`, `generateListingDraft()`, `getShopAnalysis()`
- Types: `types/index.ts` — KeywordMetrics, ListingSnapshot, CompetitorShop, TagAnalysisResult, MarketInsight + Phase 2: AuditReport, NicheOpportunity, TrackedKeyword, ShopAnalysis, GeneratedListing
- UI primitives: `components/ui.tsx` — Card, Button (gradient), Input/Textarea/Select, Badge, PageHeader, ScoreRing, Sparkline, EmptyState, SkeletonBlock, Stat
- Design tokens: `tailwind.config.ts` (deepened brand indigo scale, warm accent scale, soft/lift/glow shadows), `app/globals.css` (mesh-bg, mesh-dark, text-gradient, fade-up/float/shimmer, card-lift, skeleton)
- DB schemas: `lib/schema.ts` (User, KeywordCache with TTL, Credit ledger)
- API stubs returning `{ mock: true }`: keywords, competition, tags, audit, niches, rank-tracker, shop, ai-writer — each has TODO comments for real Etsy Open API v3 endpoints + caching/credit flow (ai-writer has the GPT-5 mini plan)
- `.env.example` + README with run + Vercel deploy notes

## What's mock vs real
- Real: all UI, routing, search, charts, tag scoring, audit heuristics, fee math, API shapes
- Mock: every number (from `lib/mock-data.ts`)
- Not built: DB connection, auth, credit wiring, Stripe, Chrome extension, real Etsy API, real LLM

## API pricing (verified 2026-09-28)
- Etsy Open API v3: $0 — free tier 10k req/day, ~5-10 req/sec. Needs app approval + OAuth.
- AI (recommended): GPT-5 mini $0.20/$0.80 per 1M tokens, or Claude Haiku 4.5 $1/$5 per 1M. ~$2.60 per 10k title+tag generations on GPT-5 mini.
- Running costs: ~$150-700/mo (Vercel + MongoDB Atlas + AI usage)

## Next steps (pick one when resuming)
1. Wire real AI generation (GPT-5 mini) into `/api/ai-writer` — needs OpenAI API key (TODO already in route)
2. Wire real Etsy data — needs approved `ETSY_API_KEY` + `MONGODB_URI`, implement cache via `KeywordCache` (TODOs in each route)
3. Auth + credit ledger + Stripe billing

## Related work
- SEO fix pack for aiambigramgenerator.com: `~/workspace/your_files/ambigram-seo-fix-pack/ambigram-seo-fix-pack.pdf` (25 pages, not applied to live site)
