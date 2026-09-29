import { NextRequest, NextResponse } from "next/server";
import { getShopAnalysis } from "@/lib/mock-data";

/**
 * GET /api/shop?shop=<shopName>
 *
 * MVP: returns a mock shop health analysis from lib/mock-data.ts.
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. GET /v3/application/shops?shop_name=<shopName> → shop_id.
 *   2. GET /v3/application/shops/:shop_id → sales, reviews, rating.
 *   3. GET /v3/application/shops/:shop_id/listings/active?limit=100 →
 *      catalog depth, pricing spread, top listings by views/favorites.
 *   4. Cache per shop for 24h (KeywordCache, tool: "shop-analyzer").
 *   5. Debit 2 credits per analysis.
 */
export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get("shop") ?? "";
  // TODO(phase-2): resolve via the live shop endpoints above.
  const analysis = getShopAnalysis(shop);
  if (!analysis) {
    return NextResponse.json(
      { data: null, mock: true, error: "Shop not found in mock data. Try: GildedLetter, AurumAtelier, InkAndOre." },
      { status: 404 }
    );
  }
  return NextResponse.json({ data: analysis, mock: true });
}
