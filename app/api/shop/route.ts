import { NextRequest, NextResponse } from "next/server";
import { buildShopAnalysis, getShopAnalysis } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  isEtsyConfigured,
  moneyToNumber,
  type EtsyListing,
  type EtsyPaged,
  type EtsyShop,
} from "@/lib/etsy";
import type { CompetitorShop, ShopAnalysis } from "@/types";

/**
 * GET /api/shop?shop=<shopName>
 *
 * Phase 3 (live): resolves the shop via `GET /shops?shop_name=`, then pulls
 * its top active listings. Real: sales (transaction_sold_count), review count
 * and average, active listing count, country, age, top-listing titles/prices/
 * favorites. The health score itself stays our heuristic, computed from those
 * real inputs via the shared `buildShopAnalysis()`. Two upstream requests.
 *
 * Without credentials (or on upstream failure) → mock fallback.
 */
async function liveShopAnalysis(shopName: string): Promise<ShopAnalysis | null> {
  const found = await etsyFetch<EtsyPaged<EtsyShop>>("/shops", {
    shop_name: shopName,
  });
  const s = found.results[0];
  if (!s) return null;

  const listingsRes = await etsyFetch<EtsyPaged<EtsyListing>>(
    `/shops/${s.shop_id}/listings/active`,
    { limit: 25, sort_on: "score", sort_order: "desc" }
  );

  const shop: CompetitorShop = {
    shopId: s.shop_id,
    shopName: s.shop_name,
    totalSales: s.transaction_sold_count ?? 0,
    reviews: s.review_count ?? 0,
    rating: s.review_average ?? 0,
    country: s.shop_location_country_iso || "—",
    yearOpened: s.creation_tsi ? new Date(s.creation_tsi * 1000).getFullYear() : 0,
    activeListings: s.listing_active_count ?? 0,
  };

  const topListings: ShopAnalysis["topListings"] = listingsRes.results
    .slice(0, 5)
    .map((l) => ({
      listingId: l.listing_id,
      title: l.title,
      price: moneyToNumber(l.price),
      favorites: l.num_favorers ?? 0,
    }));

  return buildShopAnalysis(shop, topListings);
}

export async function GET(req: NextRequest) {
  const shop = (req.nextUrl.searchParams.get("shop") ?? "").trim();
  if (!shop) {
    return NextResponse.json({ error: "shop is required" }, { status: 400 });
  }

  if (isEtsyConfigured()) {
    try {
      const analysis = await liveShopAnalysis(shop);
      if (analysis) {
        return NextResponse.json({ data: analysis, mock: false, live: true });
      }
      return NextResponse.json(
        { data: null, mock: false, live: true, error: "Shop not found on Etsy." },
        { status: 404 }
      );
    } catch (e) {
      console.error(
        "Etsy /api/shop failed, falling back to mock:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }

  const analysis = getShopAnalysis(shop);
  if (!analysis) {
    return NextResponse.json(
      { data: null, mock: true, live: false, error: "Shop not found in mock data. Try: GildedLetter, AurumAtelier, InkAndOre." },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: analysis, mock: true, live: false });
}
