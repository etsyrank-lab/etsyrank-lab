export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";


import { getKeywordMetrics, searchKeywords, trend } from "@/lib/mock-data";
import {
  EtsyApiError,
  competitionLevel,
  estimateAdCompetition,
  etsyFetch,
  isEtsyConfigured,
  estimateVolume,
  kdFromCount,
  keywordSeed,
  moneyToNumber,
  opportunityFromKd,
  shopLocationName,
  type EtsyListing,
  type EtsyPaged,
  type EtsyShop,
} from "@/lib/etsy";
import { getGoogleSearchVolume, isGoogleAdsConfigured } from "@/lib/google-ads";
import type { CompetitionLevel, KeywordMetrics } from "@/types";

/** Where the search-volume figure came from: Google's Keyword Planner, or our model. */
export type VolumeSource = "google" | "estimated";

/**
 * GET /api/keywords?q=<keyword>&country=<ISO-2>
 *
 * Phase 3 (live): when ETSY_API_KEY + ETSY_SHARED_SECRET are set, competition
 * comes from the real Etsy Open API v3 (`GET /listings/active` → `count`).
 * `country` filters competing listings by seller country via Etsy's
 * `shop_location` filter (full country name, e.g. "United States").
 *
 * Search volume: when the Google Ads API is configured, it comes from the
 * real Keyword Planner (`generateKeywordIdeas`, geo-targeted to `country`) —
 * the same "Etsy + Google APIs" combination rankkw advertises. Otherwise it
 * falls back to the competition-anchored estimate (see estimateVolume).
 * Difficulty and CTR are always modeled — no API on earth exposes them.
 * Total sales is the sum of lifetime sales across the top 10 competing
 * shops (Etsy exposes sales per shop, not per keyword) — a demand proxy,
 * labeled as such in the UI.
 *
 * Without credentials (or on upstream failure) the route falls back to the
 * mock dataset so local dev and the deployed demo keep working.
 */
async function liveMetrics(
  keyword: string,
  country: string
): Promise<{ metrics: KeywordMetrics; volumeSource: VolumeSource }> {
  // Etsy filters competing listings by *seller* country via shop_location,
  // which takes the full country name ("United States"), not the ISO code.
  const shopLocation = shopLocationName(country);
  const params: Record<string, string | number> = { keywords: keyword, limit: 1 };
  if (shopLocation) params.shop_location = shopLocation;
  const data = await etsyFetch<EtsyPaged<unknown>>("/listings/active", params);
  const competition = data.count ?? 0;

  // Real Google volume when configured; otherwise the modeled estimate,
  // which is anchored to the real competition count (see estimateVolume).
  let searchVolume = estimateVolume(keyword, competition);
  let volumeSource: VolumeSource = "estimated";
  if (isGoogleAdsConfigured()) {
    try {
      const googleVolume = await getGoogleSearchVolume(keyword, country || undefined);
      if (googleVolume != null) {
        searchVolume = googleVolume;
        volumeSource = "google";
      }
    } catch (e) {
      // Never break keyword research because Google hiccuped — log and
      // keep the modeled estimate.
      console.error("Google Ads volume lookup failed, using estimate:", e);
    }
  }
  const kd = kdFromCount(competition);
  const seed = keywordSeed(keyword);

  // One extra request: top listings for real avg price + avg favorites.
  // Then capped shop lookups for total sales (sum of the top competing
  // shops' lifetime transaction counts — Etsy exposes sales per shop,
  // not per keyword, so this is a demand proxy, labeled as such in the UI).
  let avgPrice: number | undefined;
  let avgFavorites: number | undefined;
  let totalSales: number | undefined;
  try {
    const topParams: Record<string, string | number> = {
      keywords: keyword,
      limit: 50,
      sort_on: "score",
      sort_order: "desc",
    };
    if (shopLocation) topParams.shop_location = shopLocation;
    const top = await etsyFetch<EtsyPaged<EtsyListing>>("/listings/active", topParams);
    const listings = top.results ?? [];
    if (listings.length > 0) {
      // Median, not mean — a single mispriced $1.2M listing would wreck the average.
      const prices = listings
        .map((l) => moneyToNumber(l.price))
        .filter((p) => p > 0)
        .sort((a, b) => a - b);
      const favs = listings
        .map((l) => l.num_favorers ?? 0)
        .sort((a, b) => a - b);
      const median = (xs: number[]) =>
        xs.length % 2 === 1
          ? xs[(xs.length - 1) / 2]
          : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2;
      if (prices.length > 0) avgPrice = Math.round(median(prices) * 100) / 100;
      avgFavorites = Math.round(median(favs));

      const shopIds = Array.from(
        new Set(listings.map((l) => l.shop_id).filter(Boolean))
      ).slice(0, 10);
      let sales = 0;
      let resolved = 0;
      await Promise.all(
        shopIds.map(async (id) => {
          try {
            const shop = await etsyFetch<EtsyShop>(`/shops/${id}`);
            sales += shop.transaction_sold_count ?? 0;
            resolved += 1;
          } catch {
            /* skip shops that fail to resolve */
          }
        })
      );
      if (resolved > 0) totalSales = sales;
    }
  } catch {
    /* avg price/favorites/sales stay undefined — core metrics still render */
  }

  const level: CompetitionLevel = competitionLevel(competition);
  return {
    metrics: {
      keyword,
      searchVolume,
      competition,
      competitionLevel: level,
      kd,
      trend: trend(seed, Math.max(60, Math.round(searchVolume / 45)), Math.round(searchVolume / 130)),
      ctr: 0.03 + ((seed % 25) / 1000),
      opportunity: opportunityFromKd(kd),
      adCompetition: estimateAdCompetition(keyword, kd),
      avgPrice,
      avgFavorites,
      avgViews: null, // Etsy does not expose listing views
      favsPerView: null, // impossible without view data
      totalSales, // sum of top competing shops' lifetime sales (live)
      provenance: {
        volume: volumeSource === "google" ? "live" : "estimated",
        competition: "live",
        difficulty: "estimated",
      },
    },
    volumeSource,
  };
}

/** Fill the new optional fields on mock rows so the UI renders them in demo mode. */
function enrichMock(m: KeywordMetrics): KeywordMetrics {
  const seed = keywordSeed(m.keyword);
  return {
    ...m,
    competitionLevel: m.competitionLevel ?? competitionLevel(m.competition),
    adCompetition: m.adCompetition ?? estimateAdCompetition(m.keyword, m.kd),
    avgPrice: m.avgPrice ?? Math.round((18 + (seed % 4200) / 100) * 100) / 100,
    avgFavorites: m.avgFavorites ?? 20 + (seed % 900),
    totalSales: m.totalSales ?? 500 + (seed % 95000),
    avgViews: null,
    favsPerView: null,
  };
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const country = (req.nextUrl.searchParams.get("country") ?? "").trim().toUpperCase();

  if (q && isEtsyConfigured()) {
    try {
      const { metrics, volumeSource } = await liveMetrics(q, country);
      return NextResponse.json({ data: metrics, mock: false, live: true, volumeSource });
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
    return NextResponse.json({ data: enrichMock(exact), mock: true, live: false });
  }

  const results = searchKeywords(q).map(enrichMock);
  return NextResponse.json({ data: results, mock: true, live: false });
}
