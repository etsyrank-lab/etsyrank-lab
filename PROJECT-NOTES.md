# Project Resume Notes — Etsy SEO Toolkit ("EtsyRank Lab")

Saved: 2026-09-28. Pick up here after a break.

## What this is
An Etsy SEO toolkit with a similar feature set to rankkw.com, built with original branding (not a copy).
Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS. Location: `~/workspace/etsy-seo-tool/`

## What's done
- MVP scaffold complete, typecheck + production build verified.
- Landing page: Navbar, Hero, Features, HowItWorks, PricingTeaser, Footer (`/`)
- Dashboard: Overview, `/dashboard/keywords` (search + stat cards + SVG trend chart), `/dashboard/competition` (market stats, competitor table, listing cards), `/dashboard/tags` (interactive 13-tag scorer)
- Mock data: `lib/mock-data.ts` (8 keywords, listings, 6 shops, tag maps, `analyzeTags()`)
- DB schemas: `lib/schema.ts` (User, KeywordCache with TTL, Credit ledger)
- API stubs returning `{ mock: true }`: `app/api/keywords/route.ts`, `app/api/competition/route.ts`, `app/api/tags/route.ts` — each has TODO comments for real Etsy Open API v3 endpoints + caching/credit flow
- `.env.example` + README with run + Vercel deploy notes

## What's mock vs real
- Real: all UI, routing, search, charts, tag scoring, API shapes
- Mock: every number (from `lib/mock-data.ts`)
- Not built: DB connection, auth, credit wiring, Stripe, Chrome extension

## API pricing (verified 2026-09-28)
- Etsy Open API v3: $0 — free tier 10k req/day, ~5-10 req/sec. Needs app approval + OAuth.
- AI (recommended): GPT-5 mini $0.20/$0.80 per 1M tokens, or Claude Haiku 4.5 $1/$5 per 1M. ~$2.60 per 10k title+tag generations on GPT-5 mini.
- Running costs: ~$150-700/mo (Vercel + MongoDB Atlas + AI usage)

## Next steps (pick one when resuming)
1. Deploy MVP to Vercel (needs GitHub repo + Vercel account)
2. Wire real AI generation (GPT-5 mini) into `/api/tags` — needs OpenAI API key
3. Wire real Etsy data — needs approved `ETSY_API_KEY` + `MONGODB_URI`, implement 3-layer cache via `KeywordCache`

## Related work
- SEO fix pack for aiambigramgenerator.com: `~/workspace/your_files/ambigram-seo-fix-pack/ambigram-seo-fix-pack.pdf` (25 pages, not applied to live site)
