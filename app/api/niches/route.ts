import { NextResponse } from "next/server";
import { MOCK_NICHES } from "@/lib/mock-data";

/**
 * GET /api/niches
 *
 * MVP: returns the curated mock niche list from lib/mock-data.ts.
 *
 * Phase 2 (real Etsy Open API v3 + keyword provider):
 *   1. Pull candidate niches from cached keyword research (KeywordCache).
 *   2. For each niche: competition = active-listing count via
 *      GET /v3/application/listings/active?q=<niche>&limit=1 (count field).
 *   3. Opportunity score = f(searchVolume, competition, price, trend slope).
 *   4. Cache the ranked list for 24h; debit 1 credit per refresh.
 */
export async function GET() {
  // TODO(phase-2): replace with the cached/computed flow above.
  return NextResponse.json({ data: MOCK_NICHES, mock: true });
}
