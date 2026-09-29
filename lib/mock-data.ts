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

/** Deterministic 12-point demand sparkline. Exported for live-mode visuals. */
export function trend(seed: number, base: number, swing: number): number[] {
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

/* ------------------------------------------------------------------ */
/* Phase 2 tools — mock datasets + deterministic heuristics            */
/* ------------------------------------------------------------------ */

import type {
  AuditInput,
  AuditReport,
  AuditSection,
  GeneratedListing,
  NicheOpportunity,
  ShopAnalysis,
  TrackedKeyword,
} from "@/types";

/** Deterministic 30-point walk for rank histories (lower = better rank). */
function rankWalk(seed: number, base: number, swing: number): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < 30; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280 - 0.5;
    v = Math.max(1, Math.round(v + r * swing));
    out.push(v);
  }
  return out;
}

export const MOCK_NICHES: NicheOpportunity[] = [
  { id: "n1", name: "sage green wedding invitations", category: "Weddings", monthlyVolume: 9800, competition: "low", opportunityScore: 86, trend: trend(101, 190, 70), avgPrice: 2.4 },
  { id: "n2", name: "funny cat mug gift", category: "Home & Living", monthlyVolume: 7600, competition: "low", opportunityScore: 82, trend: trend(102, 150, 60), avgPrice: 16.9 },
  { id: "n3", name: "birth flower necklace", category: "Jewelry", monthlyVolume: 16800, competition: "medium", opportunityScore: 78, trend: trend(103, 300, 95), avgPrice: 32.5 },
  { id: "n4", name: "custom pet portrait", category: "Art", monthlyVolume: 15200, competition: "medium", opportunityScore: 74, trend: trend(104, 280, 80), avgPrice: 45.0 },
  { id: "n5", name: "macrame plant hanger", category: "Home & Living", monthlyVolume: 12900, competition: "medium", opportunityScore: 71, trend: trend(105, 240, 85), avgPrice: 18.75 },
  { id: "n6", name: "personalized baby blanket", category: "Baby & Kids", monthlyVolume: 18400, competition: "high", opportunityScore: 58, trend: trend(106, 330, 90), avgPrice: 38.0 },
  { id: "n7", name: "boho wall art printable", category: "Art", monthlyVolume: 22600, competition: "high", opportunityScore: 44, trend: trend(107, 410, 120), avgPrice: 6.5 },
  { id: "n8", name: "minimalist dainty ring", category: "Jewelry", monthlyVolume: 21400, competition: "high", opportunityScore: 39, trend: trend(108, 390, 110), avgPrice: 24.99 },
  { id: "n9", name: "groomsmen gift box set", category: "Weddings", monthlyVolume: 6400, competition: "low", opportunityScore: 80, trend: trend(109, 130, 55), avgPrice: 42.0 },
  { id: "n10", name: "dog bandana personalized", category: "Pets", monthlyVolume: 8900, competition: "low", opportunityScore: 77, trend: trend(110, 170, 65), avgPrice: 12.5 },
  { id: "n11", name: "linen apron with pocket", category: "Clothing", monthlyVolume: 5200, competition: "low", opportunityScore: 73, trend: trend(111, 110, 50), avgPrice: 34.0 },
  { id: "n12", name: "baptism guest book", category: "Paper & Party", monthlyVolume: 4100, competition: "low", opportunityScore: 69, trend: trend(112, 95, 45), avgPrice: 28.5 },
];

export const NICHE_CATEGORIES = [
  "All",
  ...Array.from(new Set(MOCK_NICHES.map((n) => n.category))).sort(),
];

export const MOCK_TRACKED: TrackedKeyword[] = [
  { id: "t1", keyword: "sage green wedding invitations", currentRank: 4, previousRank: 9, rankHistory: rankWalk(201, 12, 5), searchVolume: 9800 },
  { id: "t2", keyword: "birth flower necklace", currentRank: 11, previousRank: 8, rankHistory: rankWalk(202, 9, 5), searchVolume: 16800 },
  { id: "t3", keyword: "funny cat mug gift", currentRank: 6, previousRank: 6, rankHistory: rankWalk(203, 6, 3), searchVolume: 7600 },
  { id: "t4", keyword: "custom pet portrait", currentRank: 18, previousRank: 24, rankHistory: rankWalk(204, 26, 6), searchVolume: 15200 },
  { id: "t5", keyword: "macrame plant hanger", currentRank: 23, previousRank: 19, rankHistory: rankWalk(205, 17, 6), searchVolume: 12900 },
];

/* ------------------------- Listing auditor ------------------------- */

const TITLE_LIMIT = 140;

function scoreTitle(title: string): AuditSection {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const len = title.length;

  if (!len) {
    issues.push("No title provided — nothing to score.");
    suggestions.push("Paste your listing title to get a full report.");
    return { id: "title", label: "Title", score: 0, weight: 0.3, issues, suggestions };
  }
  if (len < 40) {
    score -= 50;
    issues.push(`Title is only ${len} characters — far below Etsy's ${TITLE_LIMIT}-character limit.`);
    suggestions.push(`Expand to 120–${TITLE_LIMIT} characters with 3–4 descriptive phrases buyers actually search (material, style, occasion, recipient).`);
  } else if (len < 80) {
    score -= 25;
    issues.push(`Title is ${len} characters — you're leaving search space unused.`);
    suggestions.push(`Grow it toward 120–${TITLE_LIMIT} characters by front-loading your strongest keyword phrase.`);
  } else if (len < 120) {
    score -= 8;
    suggestions.push(`Solid length (${len} chars). You have room for one more long-tail phrase near the front.`);
  } else if (len > TITLE_LIMIT) {
    score -= 40;
    issues.push(`Title is ${len} characters — ${len - TITLE_LIMIT} over Etsy's limit and will be cut off.`);
    suggestions.push(`Trim filler words ("very", "super", "best ever") and keep the highest-intent phrases.`);
  } else {
    suggestions.push(`Great length (${len}/${TITLE_LIMIT}). Keep your primary keyword phrase inside the first 55 characters.`);
  }

  const words = title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  const stuffed: string[] = [];
  counts.forEach((c, w) => {
    if (c >= 4) stuffed.push(w);
  });
  if (stuffed.length) {
    score -= 15;
    issues.push(`Keyword stuffing: "${stuffed[0]}" repeats ${counts.get(stuffed[0])}×.`);
    suggestions.push("Say it once in the title, then cover variants in your tags instead — repetition doesn't rank you higher.");
  }
  if (title.includes("|")) {
    score -= 5;
    suggestions.push('Swap "|" separators for commas or dashes — they read better and waste fewer characters.');
  }
  return { id: "title", label: "Title", score: Math.max(0, Math.round(score)), weight: 0.3, issues, suggestions };
}

function scoreTags(tags: string[]): AuditSection {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const clean = tags.map((t) => t.trim()).filter(Boolean);

  if (!clean.length) {
    issues.push("No tags provided.");
    suggestions.push("Add all 13 tags — every blank slot is a missed search query.");
    return { id: "tags", label: "Tags", score: 0, weight: 0.25, issues, suggestions };
  }
  const missing = 13 - clean.length;
  if (missing > 0) {
    score -= missing * 7;
    issues.push(`Only ${clean.length}/13 tags used — ${missing} slot${missing > 1 ? "s" : ""} empty.`);
    suggestions.push("Fill every slot. Mix 4 exact-match phrases, 4 related searches, 3 style words, 2 broad category tags.");
  }
  const seen = new Set<string>();
  const dups = clean.filter((t) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return true;
    seen.add(k);
    return false;
  });
  if (dups.length) {
    score -= dups.length * 10;
    issues.push(`Duplicate tags: ${Array.from(new Set(dups)).join(", ")}.`);
    suggestions.push("Duplicates waste slots — replace each repeat with a synonym or long-tail variant.");
  }
  const tooLong = clean.filter((t) => t.length > 20);
  if (tooLong.length) {
    score -= tooLong.length * 8;
    issues.push(`${tooLong.length} tag${tooLong.length > 1 ? "s" : ""} exceed Etsy's 20-character tag limit and won't save: "${tooLong[0]}".`);
    suggestions.push("Split long tags into two shorter phrases (e.g. \"personalized mother's day gift\" → \"mothers day gift\", \"personalized gift\").");
  }
  const multiWord = clean.filter((t) => t.trim().split(/\s+/).length >= 2).length;
  if (clean.length >= 5 && multiWord / clean.length < 0.5) {
    score -= 10;
    suggestions.push("Use mostly 2–3 word phrases — single-word tags are too broad and rarely convert.");
  }
  if (score >= 90) suggestions.push("Tag set looks strong. Re-check quarterly against the Tag Optimizer for drifting demand.");
  return { id: "tags", label: "Tags", score: Math.max(0, Math.round(score)), weight: 0.25, issues, suggestions };
}

function scoreDescription(desc: string, tags: string[]): AuditSection {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const len = desc.length;

  if (!len) {
    issues.push("No description provided.");
    suggestions.push("Write at least 600 characters: what it is, who it's for, materials, size, and shipping in the first 3 lines.");
    return { id: "description", label: "Description", score: 0, weight: 0.2, issues, suggestions };
  }
  if (len < 200) {
    score -= 75;
    issues.push(`Description is only ${len} characters — too thin for buyers and search.`);
  } else if (len < 600) {
    score -= 50;
    issues.push(`Description is ${len} characters — aim for 600+ to answer buyer questions.`);
  } else if (len < 1200) {
    score -= 25;
    suggestions.push(`Decent length (${len} chars). Add a materials/care section and an FAQ to pass 1,200.`);
  } else {
    suggestions.push(`Strong length (${len} chars). Make sure the first 160 characters sell the click — that's what shows in search previews.`);
  }
  const head = desc.slice(0, 200).toLowerCase();
  const tagHit = tags.some((t) => t && head.includes(t.toLowerCase()));
  if (!tagHit && tags.length) {
    score -= 10;
    suggestions.push("Echo one of your top tags naturally in the first two sentences to reinforce relevance.");
  }
  if (!/(ship|deliver)/i.test(desc)) {
    score -= 5;
    suggestions.push("Add a short shipping/processing-time note — it's the #1 pre-purchase question.");
  }
  return { id: "description", label: "Description", score: Math.max(0, Math.round(score)), weight: 0.2, issues, suggestions };
}

function scoreAttributes(attrs: string[]): AuditSection {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const n = attrs.filter(Boolean).length;
  let score = 15;
  if (n >= 5) {
    score = 100;
    suggestions.push("Attributes well filled — these power Etsy's filters (color, size, occasion).");
  } else if (n >= 3) {
    score = 70;
    suggestions.push("Add 2+ more attributes (materials, occasion, recipient) — filtered searches convert better.");
  } else if (n >= 1) {
    score = 40;
    issues.push(`Only ${n} attribute${n > 1 ? "s" : ""} filled.`);
    suggestions.push("Fill materials, color, occasion, and recipient — each one is a filter your listing can appear under.");
  } else {
    issues.push("No attributes filled.");
    suggestions.push("Fill at least 5 attributes: buyers filter by these, and unfilled ones hide you from filtered results.");
  }
  return { id: "attributes", label: "Attributes", score, weight: 0.1, issues, suggestions };
}

function scoreImages(count: number): AuditSection {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 5;
  if (count >= 10) {
    score = 100;
    suggestions.push("All 10 image slots used — include a size/scale shot and a lifestyle photo if you haven't.");
  } else if (count >= 7) {
    score = 80;
    suggestions.push(`Good (${count}/10). Fill remaining slots with detail close-ups and packaging shots.`);
  } else if (count >= 4) {
    score = 55;
    issues.push(`Only ${count}/10 images — listings with 7+ images convert notably better.`);
    suggestions.push("Add: 1 lifestyle photo, 1 scale reference, 1 detail close-up, 1 packaging shot.");
  } else if (count >= 1) {
    score = 30;
    issues.push(`Only ${count} image${count > 1 ? "s" : ""} — this is costing you clicks.`);
    suggestions.push("Minimum viable set: hero, lifestyle, scale, detail, packaging (5 images).");
  } else {
    issues.push("No images provided.");
    suggestions.push("Listings need photos to sell — add at least 5 before publishing.");
  }
  return { id: "images", label: "Images", score, weight: 0.15, issues, suggestions };
}

/** Grade a listing draft across the five pillars Etsy SEO cares about. */
export function auditListing(input: AuditInput): AuditReport {
  const sections = [
    scoreTitle(input.title),
    scoreTags(input.tags),
    scoreDescription(input.description, input.tags),
    scoreAttributes(input.attributes),
    scoreImages(input.imageCount),
  ];
  const overallScore = Math.round(sections.reduce((s, x) => s + x.score * x.weight, 0));
  const grade = overallScore >= 90 ? "A" : overallScore >= 75 ? "B" : overallScore >= 60 ? "C" : overallScore >= 40 ? "D" : "F";
  const quickWins = sections
    .flatMap((s) => s.suggestions.map((text) => ({ section: s.label, text, score: s.score })))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((w) => `[${w.section}] ${w.text}`);
  return {
    listingTitle: input.title.trim() || "Untitled draft",
    overallScore,
    grade,
    sections,
    quickWins,
  };
}

/* ------------------------- AI listing writer ------------------------ */

const GIFT_MODIFIERS = [
  "gift for her", "gift for mom", "birthday gift", "anniversary gift",
  "housewarming gift", "personalized gift", "custom gift", "handmade gift",
  "unique gift", "gift for best friend", "mothers day gift", "christmas gift",
];

/** Mock generator — Phase 2 replaces this with a GPT-5 mini call in /api/ai-writer. */
export function generateListingDraft(idea: string): GeneratedListing {
  const clean = idea.trim().toLowerCase().replace(/\s+/g, " ") || "handmade gift";
  const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
  const words = clean.split(" ").filter(Boolean);
  const last = words[words.length - 1];

  const title =
    `${cap} — Personalized Handmade Gift for Her, Custom ${cap}, Birthday & Anniversary Gift Idea`.slice(0, 140);

  const tagPool = [
    clean,
    `personalized ${last}`,
    `custom ${clean}`,
    `handmade ${last}`,
    `${clean} gift`,
    ...GIFT_MODIFIERS,
    `${last} decor`,
    `boho ${last}`,
  ];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const t of tagPool) {
    const k = t.toLowerCase();
    if (!seen.has(k) && t.length <= 20) {
      seen.add(k);
      tags.push(t);
    }
    if (tags.length === 13) break;
  }

  const description =
    `Meet your new favorite ${clean} — designed to be as meaningful as it is beautiful. ` +
    `Each piece is made to order in our small studio, so you can personalize the details and give a gift that feels truly one of a kind.\n\n` +
    `WHY YOU'LL LOVE IT\n` +
    `• Thoughtful personalization options make every ${last} unique\n` +
    `• Crafted from quality materials, made to be used and loved daily\n` +
    `• Arrives gift-ready — perfect for birthdays, anniversaries, and holidays\n\n` +
    `DETAILS\n` +
    `Please check the photos and dropdown menus for current sizes, colors, and personalization options. ` +
    `Because each ${clean} is handmade to order, please allow 3–5 business days for creation before shipping.\n\n` +
    `Have a question about personalizing your ${last}? Send us a message — we reply within 24 hours and love helping you get it just right.`;

  return { title, tags, description, mock: true };
}

/* --------------------------- Shop analyzer -------------------------- */

/**
 * Score shop health from a shop profile + its top listings.
 * Used by the mock path AND the live Etsy route (which maps real shop
 * payloads into the CompetitorShop shape first).
 */
export function buildShopAnalysis(
  shop: CompetitorShop,
  listings: ShopAnalysis["topListings"]
): ShopAnalysis {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (shop.rating >= 4.8) strengths.push(`Elite buyer trust — ${shop.rating}★ average across ${shop.reviews.toLocaleString()} reviews.`);
  else if (shop.rating < 4.7 && shop.rating > 0) weaknesses.push(`Rating of ${shop.rating}★ trails top competitors — resolve 1-star themes publicly.`);
  if (shop.totalSales >= 20000) strengths.push(`${shop.totalSales.toLocaleString()} lifetime sales — proven, scalable winners in the catalog.`);
  if (shop.activeListings >= 100) strengths.push(`Deep catalog (${shop.activeListings} listings) captures far more long-tail searches.`);
  else if (shop.activeListings < 60) weaknesses.push(`Small catalog (${shop.activeListings} listings) — each new listing is a new chance to rank.`);
  if (shop.yearOpened > 0 && 2026 - shop.yearOpened <= 4) weaknesses.push(`Younger shop (opened ${shop.yearOpened}) — still compounding review momentum.`);
  else if (shop.yearOpened > 0) strengths.push(`Established since ${shop.yearOpened} — age authority Etsy rewards.`);
  const avgFavs = listings.length ? listings.reduce((s, l) => s + l.favorites, 0) / listings.length : 0;
  if (avgFavs > 2000) strengths.push("Top listings earn thousands of favorites — strong click-through signals.");
  else weaknesses.push("Top listings underperform on favorites — refresh hero images first.");
  if (!strengths.length) strengths.push("Consistent sales history with a loyal review base.");
  if (!weaknesses.length) weaknesses.push("No glaring weaknesses — next lever is expanding into adjacent niches.");

  const healthScore = Math.min(
    98,
    Math.round(
      shop.rating * 14 +
        Math.min(20, shop.reviews / 800) +
        Math.min(15, shop.activeListings / 10) +
        Math.min(10, (2026 - shop.yearOpened) * 1.5)
    )
  );

  return {
    shopName: shop.shopName,
    healthScore,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 3),
    topListings: listings,
    stats: {
      totalSales: shop.totalSales,
      reviews: shop.reviews,
      rating: shop.rating,
      activeListings: shop.activeListings,
      yearOpened: shop.yearOpened,
      country: shop.country,
    },
  };
}

export function getShopAnalysis(shopName: string): ShopAnalysis | undefined {
  const shop = MOCK_COMPETITORS.find((s) => s.shopName.toLowerCase() === shopName.trim().toLowerCase());
  if (!shop) return undefined;

  const listings = Object.values(MOCK_LISTINGS)
    .flat()
    .filter((l) => l.shopName === shop.shopName)
    .slice(0, 5)
    .map((l) => ({ listingId: l.listingId, title: l.title, price: l.price, views: l.views, favorites: l.favorites }));

  return buildShopAnalysis(shop, listings);
}
