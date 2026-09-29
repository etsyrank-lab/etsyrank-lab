import { NextResponse } from "next/server";
import { MOCK_TRACKED } from "@/lib/mock-data";

/**
 * GET /api/rank-tracker
 *
 * MVP: returns mock tracked keywords with 30-day rank histories.
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. Store tracked keywords per user in MongoDB (new TrackedKeyword schema).
 *   2. Daily cron: for each tracked keyword, page
 *      GET /v3/application/listings/active?q=<keyword> and record the position
 *      of the user's listings → append to rankHistory.
 *   3. Return the user's live tracked list; debit 1 credit per keyword/day.
 */
export async function GET() {
  // TODO(phase-2): read the authenticated user's tracked keywords from MongoDB.
  return NextResponse.json({ data: MOCK_TRACKED, mock: true });
}
