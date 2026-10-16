export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import {
  EtsyApiError,
  competitionLevel,
  estimateVolume,
  etsyFetch,
  isEtsyConfigured,
  kdFromCount,
  keywordSeed,
  opportunityFromKd,
  shopLocationName,
  type EtsyListing,
  type EtsyPaged,
} from "@/lib/etsy";
import type { IdeaSource, KeywordIdea } from "@/types";

/**
 * GET /api/expand?q=<seed>&country=<ISO-2>&limit=<n>
 *
 * Keyword IDEA EXPANSION — the discover flow eRank-style tools are built
 * around, which /api/keywords (one keyword per call) cannot do.
 *
 * Candidates come from two sources, labeled in the response:
 *  1. The seed's own top-50 competing listings (live Etsy data): recurring
 *     phrases in titles + tags that appear in 2+ top listings. This is real
 *     market phrasing — what sellers ranking for the seed actually call
 *     their products — not a thesaurus guess.
 *  2. Modifier combinations (seed + "printable"/"template"/"personalized"/
 *     "wedding"/…), the standard Etsy long-tail patterns.
 *
 * Each candidate is measured with ONE cheap count call
 * (`GET /listings/active?limit=1` → `count`), so a 15-idea expansion costs
 * ~16 Etsy calls total — versus ~12 calls per keyword for full detail.
 * Volume here is always the modeled estimate (see estimateVolume); full
 * detail (price, favorites, total sales) comes from /api/keywords when the
 * seller clicks an idea to measure it.
 *
 * Without Etsy credentials the route returns deterministic mock ideas from
 * the modifier list so local dev and the deployed demo keep working.
 */

/** Adjective-style prefixes: read naturally BEFORE the seed. */
const PREFIX_MODIFIERS = [
  "personalized",
  "custom",
  "funny",
  "vintage",
  "boho",
  "minimalist",
  "modern",
  "cute",
  "wedding",
  "birthday",
  "christmas",
  "baby shower",
  "bridal",
  "teacher",
  "mom",
];

/** Noun-style suffixes: read naturally AFTER the seed. */
const SUFFIX_MODIFIERS = [
  "printable",
  "template",
  "digital download",
  "svg",
  "clipart",
  "planner",
  "invitation",
  "wall art",
  "gift",
  "bundle",
  "pattern",
  "sticker",
  "poster",
  "card",
  "print",
  "download",
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function modifierCandidates(seed: string): string[] {
  const out: string[] = [];
  for (const m of PREFIX_MODIFIERS) out.push(`${m} ${seed}`);
  for (const m of SUFFIX_MODIFIERS) out.push(`${seed} ${m}`);
  return out;
}

/**
 * Recurring phrases from the seed's top listings. Titles yield 2–4 word
 * n-grams appearing in 2+ listings; tags must contain a seed word and
 * appear in 2+ listings. Sorted by frequency — most repeated first.
 */
function listingCandidates(
  listings: EtsyListing[],
  seedWords: string[]
): { phrase: string; source: IdeaSource }[] {
  const titleCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();

  for (const l of listings) {
    const clean = (l.title ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = clean.split(" ").filter(Boolean);
    const seenInTitle = new Set<string>();
    for (let n = 2; n <= 4; n++) {
      for (let i = 0; i + n <= words.length; i++) {
        const gram = words.slice(i, i + n).join(" ");
        if (!seenInTitle.has(gram)) {
          seenInTitle.add(gram);
          titleCounts.set(gram, (titleCounts.get(gram) ?? 0) + 1);
        }
      }
    }
    const seenTags = new Set<string>();
    for (const t of l.tags ?? []) {
      const tag = normalize(t);
      if (!tag || seenTags.has(tag)) continue;
      seenTags.add(tag);
      if (seedWords.some((w) => tag.split(" ").includes(w))) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
  }

  const phrases: { phrase: string; source: IdeaSource }[] = [];
  const byCount = (a: [string, number], b: [string, number]) => b[1] - a[1];
  for (const [phrase] of Array.from(titleCounts.entries()).sort(byCount).slice(0, 10)) {
    if (titleCounts.get(phrase)! >= 2) phrases.push({ phrase, source: "top-listings" });
  }
  for (const [phrase] of Array.from(tagCounts.entries()).sort(byCount).slice(0, 6)) {
    if (tagCounts.get(phrase)! >= 2) phrases.push({ phrase, source: "tags" });
  }
  return phrases;
}

async function measure(
  keyword: string,
  source: IdeaSource,
  country: string,
  live: boolean
): Promise<KeywordIdea | null> {
  try {
    let competition: number;
    if (live) {
      const shopLocation = shopLocationName(country);
      const params: Record<string, string | number> = { keywords: keyword, limit: 1 };
      if (shopLocation) params.shop_location = shopLocation;
      const data = await etsyFetch<EtsyPaged<unknown>>("/listings/active", params);
      competition = data.count ?? 0;
    } else {
      // Deterministic pseudo-competition so mock ideas are stable per keyword.
      competition = 500 + (keywordSeed(keyword) % 60000);
    }
    const kd = kdFromCount(competition);
    return {
      keyword,
      searchVolume: estimateVolume(keyword, competition),
      competition,
      competitionLevel: competitionLevel(competition),
      kd,
      opportunity: opportunityFromKd(kd),
      source,
    };
  } catch {
    // One failed candidate must never fail the whole expansion.
    return null;
  }
}

export async function GET(req: NextRequest) {
  const seed = normalize(req.nextUrl.searchParams.get("q") ?? "");
  const country = (req.nextUrl.searchParams.get("country") ?? "").trim().toUpperCase();
  const limit = Math.min(
    30,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") ?? "15", 10) || 15)
  );

  if (!seed) {
    return NextResponse.json({ data: [], mock: true, live: false });
  }

  const live = isEtsyConfigured();
  const seedWords = seed.split(" ").filter(Boolean);

  // Ordered candidates: real market phrasing first, modifiers after.
  const ordered: { phrase: string; source: IdeaSource }[] = [];
  const seen = new Set<string>([seed]);

  if (live) {
    try {
      const shopLocation = shopLocationName(country);
      const params: Record<string, string | number> = {
        keywords: seed,
        limit: 50,
        sort_on: "score",
        sort_order: "desc",
      };
      if (shopLocation) params.shop_location = shopLocation;
      const top = await etsyFetch<EtsyPaged<EtsyListing>>("/listings/active", params);
      for (const c of listingCandidates(top.results ?? [], seedWords)) {
        if (!seen.has(c.phrase) && c.phrase.split(" ").length <= 6) {
          seen.add(c.phrase);
          ordered.push(c);
        }
      }
    } catch (e) {
      // Top-listing mining is a bonus — modifiers still work without it.
      console.error(
        "Expand: top-listing mining failed, modifiers only:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }

  for (const m of modifierCandidates(seed)) {
    const phrase = normalize(m);
    if (!seen.has(phrase)) {
      seen.add(phrase);
      ordered.push({ phrase, source: "related" });
    }
  }

  const measured = (
    await Promise.all(
      ordered.slice(0, limit).map((c) => measure(c.phrase, c.source, country, live))
    )
  ).filter((m): m is KeywordIdea => m !== null);

  return NextResponse.json({ data: measured, mock: !live, live });
}
