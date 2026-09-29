import { NextRequest, NextResponse } from "next/server";
import { auditListing } from "@/lib/mock-data";

/**
 * POST /api/audit
 * Body: { title, tags: string[], description, attributes: string[], imageCount }
 *
 * MVP: grades the draft with deterministic heuristics in lib/mock-data.ts.
 *
 * Phase 2 (real Etsy Open API v3):
 *   1. Accept a listing_id instead of pasted text; fetch the live listing via
 *      GET /v3/application/listings/:listing_id (x-api-key header).
 *   2. Pull the listing's real tags via /listings/:id/tags (taxonomy endpoint).
 *   3. Score against live top-20 results for the listing's primary keyword
 *      (GET /v3/application/listings/active?q=...).
 *   4. Persist the report in MongoDB (new AuditReport schema) for history.
 *   5. Debit 1 credit per audit.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // TODO(phase-2): validate with zod; accept listing_id for live mode.
  const report = auditListing({
    title: String(body.title ?? ""),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    description: String(body.description ?? ""),
    attributes: Array.isArray(body.attributes) ? body.attributes.map(String) : [],
    imageCount: Number(body.imageCount ?? 0),
  });
  return NextResponse.json({ data: report, mock: true });
}
