export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  etsyFetch,
  isEtsyConfigured,
  EtsyApiError,
  type EtsyListing,
  type EtsyPaged,
} from "@/lib/etsy";

/**
 * POST /api/rank-check
 *
 * Body: { keyword: string, listingId: string | number }
 *
 * Finds where a listing ranks in Etsy search for a keyword by paging through
 * GET /v3/application/listings/active (sorted by score, like Etsy search)
 * and locating the listing id. Up to 5 pages × 100 results are scanned.
 *
 * Returns { position: number | null, totalResults, checked, mock: false }.
 * position is null when the listing is not found in the scanned results.
 */
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

export async function POST(req: Request) {
  let body: { keyword?: unknown; listingId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Send JSON: { keyword, listingId }." },
      { status: 400 }
    );
  }

  const keyword = String(body.keyword ?? "").trim();
  const listingId = Number(body.listingId);
  if (!keyword || !Number.isFinite(listingId) || listingId <= 0) {
    return NextResponse.json(
      { error: "Provide a keyword and a numeric listingId." },
      { status: 400 }
    );
  }

  if (!isEtsyConfigured()) {
    return NextResponse.json({
      position: null,
      mock: true,
      error: "Etsy API is not configured — connect ETSY_API_KEY / ETSY_SHARED_SECRET for live positions.",
    });
  }

  try {
    let checked = 0;
    let totalResults = 0;
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await etsyFetch<EtsyPaged<EtsyListing>>("/listings/active", {
        keywords: keyword,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        sort_on: "score",
        sort_order: "desc",
      });
      totalResults = res.count ?? 0;
      const results = res.results ?? [];
      checked += results.length;
      const idx = results.findIndex((l) => Number(l.listing_id) === listingId);
      if (idx >= 0) {
        return NextResponse.json({
          position: page * PAGE_SIZE + idx + 1,
          totalResults,
          checked,
          mock: false,
        });
      }
      if (results.length < PAGE_SIZE) break; // no more pages
    }
    return NextResponse.json({
      position: null,
      totalResults,
      checked,
      mock: false,
    });
  } catch (e) {
    const msg =
      e instanceof EtsyApiError
        ? `Etsy API error: ${e.message}`
        : "Etsy API request failed.";
    console.error("Etsy /api/rank-check failed:", msg);
    return NextResponse.json(
      { position: null, mock: true, error: msg },
      { status: 502 }
    );
  }
}
