/**
 * Shared TypeScript types for EtsyRank Lab.
 *
 * Phase 3: real Etsy Open API v3 responses are mapped into these types.
 * Etsy publishes NO search-volume endpoint, so volume/difficulty are always
 * estimates — the `provenance` markers say which fields are live vs estimated.
 */

/** Where a metric value came from. */
export type DataSource = "live" | "estimated" | "mock";

/** Per-field provenance for keyword-style metrics. */
export interface FieldProvenance {
  volume: DataSource;
  competition: DataSource;
  difficulty: DataSource;
}

/** Competition tier derived from the active-listing count — drives UI color coding. */
export type CompetitionLevel = "low" | "medium" | "high";

export interface KeywordMetrics {
  keyword: string;
  /** Estimated monthly searches — Etsy does not publish this; always estimated. */
  searchVolume: number;
  /** Exact number of active listings competing for this keyword (live via Etsy). */
  competition: number;
  /** Competition tier: low / medium / high (from the listing count). */
  competitionLevel?: CompetitionLevel;
  /** Keyword difficulty 0–100 (higher = harder). Heuristic — always estimated. */
  kd: number;
  /** 12-month demand trend, oldest → newest. */
  trend: number[];
  /** Average click-through estimate 0–1. */
  ctr: number;
  opportunity: "high" | "medium" | "low";
  /** Estimated advertiser competition 0–100 — Etsy has no ads API; always estimated. */
  adCompetition?: number;
  /** Average price of the top competing listings (live from Etsy). */
  avgPrice?: number;
  /** Average favorites across the top competing listings (live from Etsy). */
  avgFavorites?: number;
  /** Avg listing views — Etsy does not expose this; absent (UI shows "—"). */
  avgViews?: number | null;
  /** favorites ÷ views — impossible without view data; absent (UI shows "—"). */
  favsPerView?: number | null;
  /** Which fields are live vs estimated. Absent = legacy mock row. */
  provenance?: FieldProvenance;
}

export interface ListingSnapshot {
  listingId: number;
  title: string;
  shopName: string;
  price: number;
  currency: string;
  /** Etsy does not expose listing views via the API — absent on live rows. */
  views?: number;
  favorites: number;
  /** favorites / views ratio — absent when views are unknown. */
  conversion?: number;
  /** Derived from creation_tsi on live rows. */
  ageDays?: number;
  tags: string[];
  imageSeed: string; // used to render a deterministic placeholder swatch
  url?: string;
  source?: DataSource;
}

export interface CompetitorShop {
  shopId: number;
  shopName: string;
  totalSales: number;
  reviews: number;
  rating: number;
  country: string;
  yearOpened: number;
  activeListings: number;
}

export interface TagScore {
  tag: string;
  /** how many of the top-20 listings for the keyword use this tag */
  usageCount: number;
  score: number; // 0–100
  verdict: "strong" | "ok" | "weak";
}

export interface TagAnalysisResult {
  keyword: string;
  overallScore: number; // 0–100
  tags: TagScore[];
  suggestions: string[];
}

export interface MarketInsight {
  keyword: string;
  avgPrice: number;
  priceRange: [number, number];
  topCategories: { name: string; share: number }[];
  commonTags: { tag: string; usage: number }[];
  avgListingAgeDays: number;
}

/* ---------------- Phase 2 tools ---------------- */

export type AuditSectionId = "title" | "tags" | "description" | "attributes" | "images";

export interface AuditSection {
  id: AuditSectionId;
  label: string;
  score: number; // 0–100
  weight: number; // contribution to overall score, sums to 1
  issues: string[];
  suggestions: string[];
}

export interface AuditReport {
  listingTitle: string;
  overallScore: number; // 0–100
  grade: "A" | "B" | "C" | "D" | "F";
  sections: AuditSection[];
  quickWins: string[];
}

export interface AuditInput {
  title: string;
  tags: string[];
  description: string;
  attributes: string[];
  imageCount: number;
}

export interface NicheOpportunity {
  id: string;
  name: string;
  category: string;
  /** Estimated monthly searches — Etsy does not publish this; always estimated. */
  monthlyVolume: number;
  /** Derived from the live active-listing count when available. */
  competition: "low" | "medium" | "high";
  opportunityScore: number; // 0–100
  trend: number[]; // 12-point sparkline
  avgPrice: number;
  /** Which fields are live vs estimated. Absent = legacy mock row. */
  provenance?: FieldProvenance;
}

export interface TrackedKeyword {
  id: string;
  keyword: string;
  currentRank: number;
  /** rank 7 days ago (lower rank = better) */
  previousRank: number;
  /** 30 daily rank readings, oldest → newest */
  rankHistory: number[];
  searchVolume: number;
}

export interface ShopAnalysis {
  shopName: string;
  healthScore: number; // 0–100
  strengths: string[];
  weaknesses: string[];
  topListings: {
    listingId: number;
    title: string;
    price: number;
    /** Etsy does not expose listing views via the API — absent on live rows. */
    views?: number;
    favorites: number;
  }[];
  stats: {
    totalSales: number;
    reviews: number;
    rating: number;
    activeListings: number;
    yearOpened: number;
    country: string;
  };
}

export interface GeneratedListing {
  title: string;
  tags: string[]; // exactly 13
  description: string;
  /** always true in the MVP — flags mock output in the UI */
  mock: true;
}
