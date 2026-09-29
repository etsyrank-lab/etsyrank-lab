import { NextRequest, NextResponse } from "next/server";
import { analyzeTags } from "@/lib/mock-data";

/**
 * POST /api/tags
 * Body: { keyword: string, tags: string[] }  (tags = up to 13 Etsy tags)
 *
 * MVP: scores tags against mock "top tags" (lib/mock-data.ts).
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. GET /v3/application/listings/active?q=<keyword>&limit=100
 *      (needs ETSY_API_KEY header "x-api-key")
 *   2. Collect the `tags` arrays from the top 20 results by views/favorites.
 *   3. Count tag frequency → usageCount; score = frequency-weighted.
 *   4. Cache the frequency map in KeywordCache (tool: "tag-optimizer", 24h TTL).
 *   5. Debit 1 credit from the user (requires NextAuth session).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    keyword?: string;
    tags?: string[];
  };

  const keyword = (body.keyword ?? "").trim();
  const tags = Array.isArray(body.tags) ? body.tags.slice(0, 13) : [];

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  // TODO(phase-2): replace with real Etsy API aggregation (see header comment).
  const result = analyzeTags(keyword, tags);

  return NextResponse.json({ data: result, mock: true });
}
