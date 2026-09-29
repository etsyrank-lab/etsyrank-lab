export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";


import { generateListingDraft } from "@/lib/mock-data";

/**
 * POST /api/ai-writer
 * Body: { idea: string }
 *
 * MVP: generates a listing draft from mock templates (lib/mock-data.ts).
 *
 * Phase 2 (real LLM — recommended: GPT-5 mini):
 *   1. Build a prompt with the product idea + top tags for the niche
 *      (from KeywordCache / tag research) as grounding context.
 *   2. Call the OpenAI chat API (model "gpt-5-mini") with a JSON schema
 *      demanding { title (≤140 chars), tags (exactly 13, ≤20 chars each),
 *      description }.
 *   3. Validate + truncate server-side; store the draft in MongoDB.
 *   4. Debit 3 credits per generation (~$0.00026 in tokens at
 *      $0.20/$0.80 per 1M — see PROJECT-NOTES.md).
 *   5. Set `mock: false` once this path is live.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const idea = String(body.idea ?? "").trim();
  if (!idea) {
    return NextResponse.json(
      { data: null, mock: true, error: "Provide a product idea, e.g. { \"idea\": \"sage green wedding invitations\" }." },
      { status: 400 }
    );
  }
  // TODO(phase-2): replace generateListingDraft with the GPT-5 mini call above.
  const draft = generateListingDraft(idea);
  return NextResponse.json({ data: draft, mock: true });
}
