export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";


import { analyzeTags } from "@/lib/mock-data";
import {
  EtsyApiError,
  etsyFetch,
  isEtsyConfigured,
  type EtsyListing,
  type EtsyPaged,
} from "@/lib/etsy";
import type { TagAnalysisResult } from "@/types";

/**
 * POST /api/tags
 * Body: { keyword: string, tags: string[] }  (tags = up to 13 Etsy tags)
 *
 * Phase 3 (live): pulls the real `tags` arrays from the top 60 listings for
 * the keyword, counts tag frequency, and scores the user's tags against what
 * top-ranking listings actually use. One upstream request.
 *
 * Without credentials (or on upstream failure) → mock `analyzeTags()` path.
 */
function verdictFor(score: number): "strong" | "ok" | "weak" {
  return score >= 60 ? "strong" : score >= 30 ? "ok" : "weak";
}

async function liveTagAnalysis(
  keyword: string,
  userTags: string[]
): Promise<TagAnalysisResult> {
  const search = await etsyFetch<EtsyPaged<EtsyListing>>("/listings/active", {
    keywords: keyword,
    limit: 60,
    sort_on: "score",
    sort_order: "desc",
  });
  const results = search.results;
  const total = results.length || 1;

  const freq = new Map<string, number>();
  for (const l of results) {
    const seen = new Set<string>();
    for (const t of l.tags ?? []) {
      const k = t.toLowerCase().trim();
      if (k && !seen.has(k)) {
        seen.add(k);
        freq.set(k, (freq.get(k) ?? 0) + 1);
      }
    }
  }
  const ranked = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const normalized = userTags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  const tags = normalized.map((tag) => {
    const found = ranked.find(([t]) => t === tag);
    const usageCount = found ? found[1] : 0;
    const pct = usageCount / total;
    // A tag used by ~60%+ of top listings scores near 100.
    const score = found ? Math.min(100, Math.round(pct * 165)) : 12;
    return { tag, usageCount, score, verdict: verdictFor(score) };
  });

  const overallScore = tags.length
    ? Math.round(tags.reduce((s, t) => s + t.score, 0) / tags.length)
    : 0;

  const used = new Set(normalized);
  const suggestions = ranked
    .map(([t]) => t)
    .filter((t) => !used.has(t))
    .slice(0, 5);

  return { keyword, overallScore, tags, suggestions };
}

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

  if (isEtsyConfigured()) {
    try {
      const result = await liveTagAnalysis(keyword, tags);
      return NextResponse.json({ data: result, mock: false, live: true });
    } catch (e) {
      console.error(
        "Etsy /api/tags failed, falling back to mock:",
        e instanceof EtsyApiError ? `${e.status} ${e.message}` : e
      );
    }
  }

  const result = analyzeTags(keyword, tags);
  return NextResponse.json({ data: result, mock: true, live: false });
}
