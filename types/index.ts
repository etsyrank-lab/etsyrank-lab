/**
 * Shared TypeScript types for EtsyRank Lab.
 * These mirror the shapes returned by the (mocked) API routes.
 * Phase 2: real Etsy Open API v3 responses will be mapped into these types.
 */

export interface KeywordMetrics {
  keyword: string;
  /** Estimated monthly searches on Etsy. Mocked in MVP. */
  searchVolume: number;
  /** Exact number of active listings competing for this keyword. */
  competition: number;
  /** Keyword difficulty 0–100 (higher = harder). */
  kd: number;
  /** 12-month demand trend, oldest → newest. */
  trend: number[];
  /** Average click-through estimate 0–1. */
  ctr: number;
  opportunity: "high" | "medium" | "low";
}

export interface ListingSnapshot {
  listingId: number;
  title: string;
  shopName: string;
  price: number;
  currency: string;
  views: number;
  favorites: number;
  /** favorites / views ratio */
  conversion: number;
  ageDays: number;
  tags: string[];
  imageSeed: string; // used to render a deterministic placeholder swatch
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
  monthlyVolume: number;
  competition: "low" | "medium" | "high";
  opportunityScore: number; // 0–100
  trend: number[]; // 12-point sparkline
  avgPrice: number;
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
    views: number;
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
