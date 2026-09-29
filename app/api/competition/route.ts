export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";


import { MOCK_COMPETITORS, MOCK_LISTINGS, MOCK_MARKET_INSIGHT } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  getTaxonomyName,
  isEtsyConfigured,
  moneyToNumber,
  type EtsyListing,
  type EtsyPaged,
  type EtsyShop,
} from "@/lib/etsy";
import type {
  CompetitorShop,
  ListingSnapshot,
  MarketInsight,
} from "@/types";

/**
 * GET /api/competition?q=<keyword>
 *
 * Phase 3 (live): top listings from `GET /listings/active` (sorted by score),
 * batched shop lookups for the distinct sellers (max 8), and taxonomy names
 * for the top categories (max 5, cached for the process lifetime).
 * Upstream budget per call: 1 + 8 + 5 = 14 requests max.
 *
 * Real from Etsy: listing titles/prices/tags/favorers/urls/ages, shop sales,
 * reviews, ratings, listing counts. Estimated: nothing here — views are simply
 * omitted (Etsy doesn't expose them) and the UI shows "—".
 *
 * Without credentials (or on upstream failure) → mock fallback.
 */

const MAX_LISTINGS = 12;
const MAX_SHOP_LOOKUPS = 8;
const MAX_TAXONOMY_LOOKUPS = 5;

function mapShop(s: EtsyShop): CompetitorShop {
  return {
    shopId: s.shop_id,
    shopName: s.shop_name,
    totalSales: s.transaction_sold_count ?? 0,
    reviews: s.review_count ?? 0,
    rating: s.review_average ?? 0,
    country: s.shop_location_country_iso || "—",
    yearOpened: s.creation_tsi
      ? new Date(s.creation_tsi * 1000).getFullYear()
      : 0,
    activeListings: s.listing_active_count ?? 0,
  };
}

async function liveCompetition(keyword: string) {
  const q = keyword || "personalized gift";
  const search = await etsyFetch<EtsyPaged<EtsyListing>>("/listings/active", {
    keywords: q,
    limit: 100,
    sort_on: "score",
    sort_order: "desc",
  });

  const top = search.results.slice(0, MAX_LISTINGS);

  // Batch shop lookups — the expensive part, so cap and cache aggressively.
  const shopIds = Array.from(
    new Set(top.map((l) => l.shop_id).filter(Boolean))
  ).slice(0, MAX_SHOP_LOOKUPS);
  const shopMap = new Map<number, EtsyShop>();
  await Promise.all(
    shopIds.map(async (id) => {
      try {
        const shop = await etsyFetch<EtsyShop>(`/shops/${id}`);
        shopMap.set(id, shop);
      } catch {
        /* skip shops that fail to resolve — listings still render */
      }
    })
  );

  const listings: ListingSnapshot[] = top.map((l) => ({
    listingId: l.listing_id,
    title: l.title,
    shopName: shopMap.get(l.shop_id)?.shop_name ?? `Shop ${l.shop_id}`,
    price: moneyToNumber(l.price),
    currency: l.price?.currency_code ?? "USD",
    favorites: l.num_favorers ?? 0,
    tags: l.tags ?? [],
    imageSeed: `live-${l.listing_id}`,
    url: l.url,
    ageDays: l.creation_tsi
      ? Math.max(1, Math.round((Date.now() / 1000 - l.creation_tsi) / 86400))
      : undefined,
    source: "live" as const,
  }));

  const shops: CompetitorShop[] = Array.from(shopMap.values()).map(mapShop);

  // Market insight from the real result set.
  const prices = top.map((l) => moneyToNumber(l.price)).filter((p) => p > 0);
  const avgPrice = prices.length
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 0;

  const tagFreq = new Map<string, number>();
  const taxFreq = new Map<number, number>();
  for (const l of top) {
    for (const t of l.tags ?? []) {
      const k = t.toLowerCase();
      tagFreq.set(k, (tagFreq.get(k) ?? 0) + 1);
    }
    if (l.taxonomy_id) taxFreq.set(l.taxonomy_id, (taxFreq.get(l.taxonomy_id) ?? 0) + 1);
  }
  const commonTags = Array.from(tagFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({
      tag,
      usage: top.length ? Math.round((count / top.length) * 100) : 0,
    }));

  const topTax = Array.from(taxFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAXONOMY_LOOKUPS);
  const taxNames = await Promise.all(topTax.map(([id]) => getTaxonomyName(id)));
  const topCategories = topTax.map(([id, count], i) => ({
    name: taxNames[i] ?? `Category ${id}`,
    share: top.length ? count / top.length : 0,
  }));

  const ages = listings
    .map((l) => l.ageDays)
    .filter((a): a is number => typeof a === "number");

  const market: MarketInsight = {
    keyword: q,
    avgPrice: Math.round(avgPrice * 100) / 100,
    priceRange: prices.length
      ? [Math.min(...prices), Math.max(...prices)]
      : [0, 0],
    topCategories,
    commonTags,
    avgListingAgeDays: ages.length
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
      : 0,
  };

  return { keyword: q, shops, listings, market };
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();

  if (isEtsyConfigured()) {
    try {
      const data = await liveCompetition(q);
      return NextResponse.json({ data, mock: false, live: true });
    } catch (e) {
      console.error(
        "Etsy /api/competition failed, falling back to mock:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }

  const listings =
    MOCK_LISTINGS[q] ?? MOCK_LISTINGS["personalized gold name necklace"];

  return NextResponse.json({
    data: {
      keyword: q || "personalized gold name necklace",
      shops: MOCK_COMPETITORS,
      listings,
      market: MOCK_MARKET_INSIGHT,
    },
    mock: true,
    live: false,
  });
}
