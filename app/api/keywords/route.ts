import { NextRequest, NextResponse } from "next/server";
import { getKeywordMetrics, searchKeywords } from "@/lib/mock-data";

/**
 * GET /api/keywords?q=<keyword>
 *
 * MVP: returns mock keyword metrics from lib/mock-data.ts.
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. Check KeywordCache for key `kw:<normalized>` (tool: "keyword-research").
 *   2. On miss: GET https://openapi.etsy.com/v3/application/listings/active
 *      ?q=<keyword>&limit=100  with header `x-api-key: ${process.env.ETSY_API_KEY}`
 *      → competition = `count` from the response.
 *   3. Search volume: combine with a keyword-data provider (Google Keyword
 *      Planner API or third-party) — Etsy does not expose search volume.
 *   4. KD = heuristic from competition/searchVolume ratio.
 *   5. Trend: store monthly snapshots in KeywordCache to build the 12-month
 *      series over time.
 *   6. Write result to KeywordCache (24h TTL) and debit 1 credit.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  // Exact match first (detail view), otherwise return search list.
  // TODO(phase-2): replace both branches with the cached/API flow above.
  const exact = getKeywordMetrics(q);
  if (exact) {
    return NextResponse.json({ data: exact, mock: true });
  }

  const results = searchKeywords(q);
  return NextResponse.json({ data: results, mock: true });
}
