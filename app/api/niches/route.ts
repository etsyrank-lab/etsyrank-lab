export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";


import { MOCK_NICHES } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  isEtsyConfigured,
  kdFromCount,
  type EtsyPaged,
} from "@/lib/etsy";
import type { FieldProvenance, NicheOpportunity } from "@/types";

/**
 * GET /api/niches
 *
 * Phase 3 (live): competition for each curated niche comes from the real Etsy
 * Open API v3 — one `GET /listings/active?limit=1` per niche, using the `count`
 * field (12 parallel upstream requests, all TTL-cached).
 *
 * Search volume stays an estimate (Etsy publishes none) and is labeled "est."
 * in the UI; the opportunity score is recomputed from the real count so it
 * stays coherent with the live competition level.
 *
 * Without credentials (or on upstream failure) → mock fallback.
 */
const LIVE_PROVENANCE: FieldProvenance = {
  volume: "estimated",
  competition: "live",
  difficulty: "estimated",
};

const FALLBACK_PROVENANCE: FieldProvenance = {
  volume: "estimated",
  competition: "mock",
  difficulty: "estimated",
};

async function liveNiches(): Promise<NicheOpportunity[]> {
  const counts = await Promise.all(
    MOCK_NICHES.map(async (n) => {
      try {
        const r = await etsyFetch<EtsyPaged<unknown>>("/listings/active", {
          keywords: n.name,
          limit: 1,
        });
        return r.count ?? 0;
      } catch {
        return null; // single-niche failure shouldn't sink the whole list
      }
    })
  );

  return MOCK_NICHES.map((n, i) => {
    const count = counts[i];
    if (count == null) {
      return { ...n, provenance: FALLBACK_PROVENANCE };
    }
    const kd = kdFromCount(count);
    const competition = count < 25000 ? "low" : count < 80000 ? "medium" : "high";
    const opportunityScore = Math.max(
      5,
      Math.min(
        98,
        Math.round(100 - kd * 0.85 + Math.min(12, Math.log10(n.monthlyVolume) * 2.5))
      )
    );
    return {
      ...n,
      competition: competition as NicheOpportunity["competition"],
      opportunityScore,
      provenance: LIVE_PROVENANCE,
    };
  });
}

export async function GET() {
  if (isEtsyConfigured()) {
    try {
      const data = await liveNiches();
      return NextResponse.json({ data, mock: false, live: true });
    } catch (e) {
      console.error(
        "Etsy /api/niches failed, falling back to mock:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }
  return NextResponse.json({ data: MOCK_NICHES, mock: true, live: false });
}
