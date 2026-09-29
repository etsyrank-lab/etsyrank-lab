export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";


import { auditListing } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  isEtsyConfigured,
  stripHtml,
  type EtsyListing,
  type EtsyPaged,
} from "@/lib/etsy";

/**
 * POST /api/audit
 * Body: { title, tags: string[], description, attributes: string[], imageCount }
 *    or { listing_id: number } for live mode.
 *
 * Phase 3 (live): with `listing_id` and credentials set, fetches the real
 * listing (`GET /listings/{id}`) plus its image list, then runs the same
 * deterministic scoring heuristics on the real title/tags/description/
 * attributes/image-count. Scoring itself remains a heuristic and is labeled
 * as such in the UI. Two upstream requests.
 *
 * Without credentials (or on upstream failure) → manual-input mock scoring.
 */
interface LiveImage {
  listing_image_id: number;
}

async function liveAudit(listingId: number) {
  const [listing, images] = await Promise.all([
    etsyFetch<EtsyListing>(`/listings/${listingId}`),
    etsyFetch<EtsyPaged<LiveImage>>(`/listings/${listingId}/images`).catch(
      () => ({ count: 0, results: [] as LiveImage[] })
    ),
  ]);

  const attributes = [
    ...(listing.materials ?? []),
    ...((listing.style as string[] | null) ?? []),
    ...((listing.occasion as string[] | null) ?? []),
    ...((listing.recipient as string[] | null) ?? []),
  ].filter(Boolean);

  const report = auditListing({
    title: listing.title ?? "",
    tags: listing.tags ?? [],
    description: stripHtml(listing.description ?? ""),
    attributes,
    imageCount: images.count ?? images.results.length ?? 0,
  });

  return {
    ...report,
    listingTitle: listing.title || report.listingTitle,
    listingUrl: listing.url,
    listingId,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const listingId = Number(body.listing_id ?? body.listingId ?? 0);
  if (listingId > 0) {
    if (!isEtsyConfigured()) {
      return NextResponse.json(
        { error: "Live listing lookup needs Etsy API credentials (ETSY_API_KEY + ETSY_SHARED_SECRET)." },
        { status: 400 }
      );
    }
    try {
      const report = await liveAudit(listingId);
      return NextResponse.json({ data: report, mock: false, live: true });
    } catch (e) {
      if (e instanceof EtsyApiError && e.status === 404) {
        return NextResponse.json(
          { error: `Listing #${listingId} not found on Etsy.` },
          { status: 404 }
        );
      }
      console.error(
        "Etsy /api/audit failed:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
      return NextResponse.json(
        { error: "Could not fetch that listing from Etsy. Try again in a moment." },
        { status: 502 }
      );
    }
  }

  const report = auditListing({
    title: String(body.title ?? ""),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    description: String(body.description ?? ""),
    attributes: Array.isArray(body.attributes) ? body.attributes.map(String) : [],
    imageCount: Number(body.imageCount ?? 0),
  });
  return NextResponse.json({ data: report, mock: true, live: false });
}
