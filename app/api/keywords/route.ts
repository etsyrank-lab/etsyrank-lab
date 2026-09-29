import { NextRequest, NextResponse } from "next/server";
import { getKeywordMetrics, searchKeywords, trend } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  isEtsyConfigured,
  estimateVolume,
  kdFromCount,
  keywordSeed,
  opportunityFromKd,
  type EtsyPaged,
} from "@/lib/etsy";
import type { KeywordMetrics } from "@/types";

/**
 * GET /api/keywords?q=<keyword>
 *
 * Phase 3 (live): when ETSY_API_KEY + ETSY_SHARED_SECRET are set, competition
 * comes from the real Etsy Open API v3 (`GET /listings/active` → `count`).
 * Search volume and difficulty are ALWAYS estimates — Etsy publishes no
 * search-volume endpoint — and are labeled as such in the UI.
 *
 * Without credentials (or on upstream failure) the route falls back to the
 * mock dataset so local dev and the deployed demo keep working.
 */
async function liveMetrics(keyword: string): Promise<KeywordMetrics> {
  const data = await etsyFetch<EtsyPaged<unknown>>("/listings/active", {
    keywords: keyword,
    limit: 1,
  });
  const competition = data.count ?? 0;
  const searchVolume = estimateVolume(keyword);
  const kd = kdFromCount(competition);
  const seed = keywordSeed(keyword);
  return {
    keyword,
    searchVolume,
    competition,
    kd,
    trend: trend(seed, Math.max(60, Math.round(searchVolume / 45)), Math.round(searchVolume / 130)),
    ctr: 0.03 + ((seed % 25) / 1000),
    opportunity: opportunityFromKd(kd),
    provenance: { volume: "estimated", competition: "live", difficulty: "estimated" },
  };
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();

  if (q && isEtsyConfigured()) {
    try {
      const data = await liveMetrics(q);
      return NextResponse.json({ data, mock: false, live: true });
    } catch (e) {
      // Fall through to mock data — never break the UI on an API hiccup.
      console.error(
        "Etsy /api/keywords failed, falling back to mock:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }

  // Mock path: exact match first (detail view), otherwise the search list.
  const exact = getKeywordMetrics(q);
  if (exact) {
    return NextResponse.json({ data: exact, mock: true, live: false });
  }

  const results = searchKeywords(q);
  return NextResponse.json({ data: results, mock: true, live: false });
}
