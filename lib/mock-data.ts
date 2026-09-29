/**
 * Mock dataset for the EtsyRank Lab MVP.
 *
 * Everything here is fictional and for UI development only.
 * Phase 2: replace `getKeywordMetrics`, `getTopListings`, etc. with calls to
 * the official Etsy Open API v3 (see the TODOs in app/api/keywords, app/api/competition, app/api/tags).
 */

import {
  CompetitorShop,
  KeywordMetrics,
  ListingSnapshot,
  MarketInsight,
  TagAnalysisResult,
} from "@/types";

const MONTHS = 12;

function trend(seed: number, base: number, swing: number): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < MONTHS; i++) {
    // deterministic pseudo-random walk so charts look organic
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280 - 0.5;
    v = Math.max(5, v + r * swing);
    // seasonal lift near the end of the year (holiday shopping)
    const seasonal = i >= 9 ? base * 0.35 : 0;
    out.push(Math.round(v + seasonal));
  }
  return out;
}

export const MOCK_KEYWORDS: KeywordMetrics[] = [
  {
    keyword: "personalized gold name necklace",
    searchVolume: 18400,
    competition: 42130,
    kd: 62,
    trend: trend(11, 320, 90),
    ctr: 0.041,
    opportunity: "medium",
  },
  {
    keyword: "boho wall art printable",
    searchVolume: 22600,
    competition: 88940,
    kd: 71,
    trend: trend(22, 410, 120),
    ctr: 0.038,
    opportunity: "low",
  },
  {
    keyword: "custom pet portrait",
    searchVolume: 15200,
    competition: 38410,
    kd: 58,
    trend: trend(33, 280, 80),
    ctr: 0.052,
    opportunity: "medium",
  },
  {
    keyword: "sage green wedding invitations",
    searchVolume: 9800,
    competition: 15230,
    kd: 44,
    trend: trend(44, 190, 70),
    ctr: 0.047,
    opportunity: "high",
  },
  {
    keyword: "minimalist dainty ring",
    searchVolume: 21400,
    competition: 96500,
    kd: 78,
    trend: trend(55, 390, 110),
    ctr: 0.033,
    opportunity: "low",
  },
  {
    keyword: "funny cat mug gift",
    searchVolume: 7600,
    competition: 19870,
    kd: 39,
    trend: trend(66, 150, 60),
    ctr: 0.049,
    opportunity: "high",
  },
  {
    keyword: "macrame plant hanger",
    searchVolume: 12900,
    competition: 31200,
    kd: 52,
    trend: trend(77, 240, 85),
    ctr: 0.044,
    opportunity: "medium",
  },
  {
    keyword: "birth flower necklace",
    searchVolume: 16800,
    competition: 27450,
    kd: 47,
    trend: trend(88, 300, 95),
    ctr: 0.051,
    opportunity: "high",
  },
];

export const MOCK_LISTINGS: Record<string, ListingSnapshot[]> = {
  "personalized gold name necklace": [
    {
      listingId: 101,
      title: "Personalized Gold Name Necklace — Custom Dainty Nameplate, Gift for Her",
      shopName: "GildedLetter",
      price: 34.99,
      currency: "USD",
      views: 48200,
      favorites: 3910,
      conversion: 0.081,
      ageDays: 412,
      tags: ["name necklace", "gold necklace", "personalized gift", "dainty jewelry", "custom necklace", "gift for her", "bridesmaid gift", "gold nameplate", "minimalist necklace", "birthday gift", "anniversary gift", "mom gift", "delicate necklace"],
      imageSeed: "g1",
    },
    {
      listingId: 102,
      title: "Custom Name Necklace 14K Gold Filled — Handmade Personalized Jewelry",
      shopName: "AurumAtelier",
      price: 42.5,
      currency: "USD",
      views: 36500,
      favorites: 2870,
      conversion: 0.079,
      ageDays: 288,
      tags: ["custom name necklace", "gold filled necklace", "personalized jewelry", "nameplate necklace", "gift for wife", "mothers day gift", "handmade necklace", "dainty gold necklace", "custom gift", "bridal jewelry", "name jewelry", "elegant necklace", "gold necklace women"],
      imageSeed: "g2",
    },
    {
      listingId: 103,
      title: "Dainty Gold Name Necklace Personalized — Minimalist Custom Pendant",
      shopName: "InkAndOre",
      price: 27.99,
      currency: "USD",
      views: 29100,
      favorites: 1980,
      conversion: 0.068,
      ageDays: 154,
      tags: ["gold name necklace", "dainty necklace", "personalized necklace", "custom pendant", "minimalist jewelry", "gift for girlfriend", "layering necklace", "thin gold necklace", "everyday necklace", "simple necklace", "choker necklace", "teen gift", "best friend gift"],
      imageSeed: "g3",
    },
  ],
};

export const MOCK_COMPETITORS: CompetitorShop[] = [
  { shopId: 1, shopName: "GildedLetter", totalSales: 48210, reviews: 12480, rating: 4.9, country: "United States", yearOpened: 2018, activeListings: 86 },
  { shopId: 2, shopName: "AurumAtelier", totalSales: 31540, reviews: 8930, rating: 4.8, country: "United States", yearOpened: 2019, activeListings: 112 },
  { shopId: 3, shopName: "InkAndOre", totalSales: 22980, reviews: 6210, rating: 4.9, country: "Canada", yearOpened: 2020, activeListings: 64 },
  { shopId: 4, shopName: "WillowAndWren", totalSales: 18760, reviews: 5120, rating: 4.7, country: "United Kingdom", yearOpened: 2017, activeListings: 143 },
  { shopId: 5, shopName: "PaperBloomCo", totalSales: 15420, reviews: 4380, rating: 4.8, country: "United States", yearOpened: 2021, activeListings: 58 },
  { shopId: 6, shopName: "FernAndFable", totalSales: 12110, reviews: 3290, rating: 4.9, country: "Australia", yearOpened: 2022, activeListings: 47 },
];

export const MOCK_TOP_TAGS: Record<string, string[]> = {
  "personalized gold name necklace": [
    "name necklace", "gold necklace", "personalized necklace", "custom necklace",
    "dainty necklace", "gift for her", "personalized gift", "gold nameplate",
    "minimalist necklace", "custom name necklace", "birthday gift", "mom gift",
    "delicate necklace", "anniversary gift", "bridesmaid gift",
  ],
};

export const MOCK_MARKET_INSIGHT: MarketInsight = {
  keyword: "personalized gold name necklace",
  avgPrice: 36.4,
  priceRange: [18.99, 68.0],
  topCategories: [
    { name: "Necklaces", share: 0.62 },
    { name: "Pendants", share: 0.21 },
    { name: "Jewelry Sets", share: 0.11 },
    { name: "Other", share: 0.06 },
  ],
  commonTags: [
    { tag: "name necklace", usage: 84 },
    { tag: "gold necklace", usage: 79 },
    { tag: "personalized gift", usage: 71 },
    { tag: "dainty necklace", usage: 66 },
    { tag: "gift for her", usage: 58 },
  ],
  avgListingAgeDays: 342,
};

/** Score a seller's 13 tags against the mock "top tags" for a keyword. */
export function analyzeTags(keyword: string, userTags: string[]): TagAnalysisResult {
  const topTags = MOCK_TOP_TAGS[keyword] ?? MOCK_TOP_TAGS["personalized gold name necklace"];
  const normalized = userTags.map((t) => t.trim().toLowerCase()).filter(Boolean);

  const tags = normalized.map((tag) => {
    const idx = topTags.findIndex((t) => t.toLowerCase() === tag);
    // usageCount: how "popular" this tag is among top listings (mock heuristic)
    const usageCount = idx === -1 ? Math.floor(Math.random() * 8) : 92 - idx * 3;
    const score = idx === -1 ? Math.min(28, usageCount * 3) : Math.max(55, 100 - idx * 3);
    return {
      tag,
      usageCount,
      score,
      verdict: (score >= 70 ? "strong" : score >= 40 ? "ok" : "weak") as "strong" | "ok" | "weak",
    };
  });

  const overallScore = tags.length
    ? Math.round(tags.reduce((s, t) => s + t.score, 0) / tags.length)
    : 0;

  const used = new Set(normalized);
  const suggestions = topTags.filter((t) => !used.has(t.toLowerCase())).slice(0, 5);

  return { keyword, overallScore, tags, suggestions };
}

export function getKeywordMetrics(keyword: string): KeywordMetrics | undefined {
  const q = keyword.trim().toLowerCase();
  return MOCK_KEYWORDS.find((k) => k.keyword === q);
}

export function searchKeywords(query: string): KeywordMetrics[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_KEYWORDS;
  return MOCK_KEYWORDS.filter((k) => k.keyword.includes(q));
}
