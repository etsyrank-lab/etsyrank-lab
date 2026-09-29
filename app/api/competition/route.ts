import { NextRequest, NextResponse } from "next/server";
import { MOCK_COMPETITORS, MOCK_LISTINGS, MOCK_MARKET_INSIGHT } from "@/lib/mock-data";

/**
 * GET /api/competition?q=<keyword>
 *
 * MVP: returns mock competitor shops + top listings + market insight.
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. GET /v3/application/listings/active?q=<keyword>&limit=100&sort_on=score
 *      → top listings (map to ListingSnapshot; views/favorites come from
 *        the listing payload where available).
 *   2. For distinct shop_ids: GET /v3/application/shops/{shop_id}
 *      → totalSales = `transaction_sold_count`, reviews, rating, etc.
 *      (Batch + cache aggressively: shop lookups are the expensive part.)
 *   3. Market insight: aggregate price distribution, category mix and tag
 *      frequency from the listing result set.
 *   4. Cache everything in KeywordCache (tool: "competition", 24h TTL).
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();

  // TODO(phase-2): replace with the real aggregation flow described above.
  const listings =
    MOCK_LISTINGS[q] ??
    MOCK_LISTINGS["personalized gold name necklace"];

  return NextResponse.json({
    data: {
      keyword: q || "personalized gold name necklace",
      shops: MOCK_COMPETITORS,
      listings,
      market: MOCK_MARKET_INSIGHT,
    },
    mock: true,
  });
}
