/**
 * Server-side client for the Etsy Open API v3.
 *
 * Auth (enforced by Etsy since Feb 2026): the `x-api-key` header must be
 * `keystring:shared_secret` (colon-joined). A bare keystring returns
 * 403 "Shared secret is required in x-api-key header."
 *
 * Credentials come ONLY from environment variables — never hardcode them.
 * If they are missing, `isEtsyConfigured()` is false and every API route
 * falls back to mock data, so local dev and the deployed demo keep working.
 */

const BASE_URL = "https://openapi.etsy.com/v3/application";

/** 10-minute in-memory TTL cache shared by all routes in this process. */
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { expires: number; data: unknown }>();

export function isEtsyConfigured(): boolean {
  return Boolean(process.env.ETSY_API_KEY && process.env.ETSY_SHARED_SECRET);
}

function apiKeyHeader(): string {
  // keystring:shared_secret — required format since Feb 2026
  return `${process.env.ETSY_API_KEY ?? ""}:${process.env.ETSY_SHARED_SECRET ?? ""}`;
}

export class EtsyApiError extends Error {
  constructor(
    public status: number,
    public path: string,
    message: string
  ) {
    super(message);
    this.name = "EtsyApiError";
  }
}

function pruneCache() {
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  const now = Date.now();
  cache.forEach((v, k) => {
    if (v.expires <= now) cache.delete(k);
  });
}

/**
 * GET helper with TTL caching. Throws EtsyApiError on non-2xx or when the
 * credentials are missing (callers catch this and fall back to mock data).
 */
export async function etsyFetch<T>(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  if (!isEtsyConfigured()) {
    throw new EtsyApiError(0, path, "Etsy API credentials are not configured");
  }
  const url = new URL(BASE_URL + path);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const key = url.toString();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }
  const res = await fetch(key, {
    headers: { "x-api-key": apiKeyHeader() },
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new EtsyApiError(
      res.status,
      path,
      `Etsy API ${res.status} on ${path}: ${body.slice(0, 200)}`
    );
  }
  const data = (await res.json()) as T;
  cache.set(key, { expires: Date.now() + CACHE_TTL_MS, data });
  pruneCache();
  return data;
}

/* ------------------------- Etsy payload types ------------------------ */

export interface EtsyMoney {
  amount: number;
  divisor: number;
  currency_code: string;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  price: EtsyMoney;
  tags: string[];
  taxonomy_id: number;
  num_favorers: number;
  url: string;
  creation_tsi: number;
  shop_id: number;
  materials?: string[] | null;
  style?: string[] | null;
  occasion?: string[] | null;
  recipient?: string[] | null;
}

export interface EtsyShop {
  shop_id: number;
  shop_name: string;
  creation_tsi: number;
  listing_active_count: number;
  review_count: number;
  review_average: number;
  transaction_sold_count: number;
  shop_location_country_iso: string;
  url: string;
}

export interface EtsyTaxonomyNode {
  id: number;
  name: string;
}

export interface EtsyPaged<T> {
  count: number;
  results: T[];
}

/* ------------------------------ helpers ------------------------------ */

export function moneyToNumber(m: EtsyMoney): number {
  if (!m || !m.divisor) return 0;
  return m.amount / m.divisor;
}

/** Deterministic string hash for stable per-keyword estimates. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Etsy publishes NO search-volume endpoint, so volume is always an estimate.
 * Deterministic per keyword so it is stable across requests.
 */
/**
 * Estimated monthly searches. Etsy publishes no search-volume endpoint, so this
 * is a heuristic — but an anchored one, not a random number:
 *
 *  - Power-law on the REAL competing-listing count: bigger markets genuinely
 *    get more searches (calibrated so ~20k listings ≈ ~10k searches/mo and
 *    ~1.4M listings ≈ ~150k searches/mo).
 *  - Specificity discount: longer, more specific phrases take a fraction of
 *    the head-term volume.
 *  - Deterministic ±15% jitter (hash-seeded) so the figure is stable per
 *    keyword but not a pure function of the listing count.
 */
export function estimateVolume(keyword: string, competition: number): number {
  const words = keyword.toLowerCase().trim().split(/\s+/).filter(Boolean).length;
  const base = 30 * Math.pow(Math.max(competition, 1), 0.62);
  const specificity = Math.pow(Math.max(words, 1), -0.4);
  const h = hashStr(keyword.toLowerCase().trim());
  const jitter = 0.85 + ((h % 1000) / 1000) * 0.3;
  const volume = base * specificity * jitter;
  // Round to the nearest 10 — no false precision on a modeled number.
  return Math.max(50, Math.round(volume / 10) * 10);
}

/** Heuristic difficulty 5–95 from the real competing-listing count. */
export function kdFromCount(count: number): number {
  const kd = 15 + 55 * (Math.log10(count + 1) / 5);
  return Math.min(95, Math.max(5, Math.round(kd)));
}

export function opportunityFromKd(kd: number): "high" | "medium" | "low" {
  return kd < 45 ? "high" : kd < 65 ? "medium" : "low";
}

/** Competition tier from the active-listing count — drives UI color coding. */
export function competitionLevel(count: number): "low" | "medium" | "high" {
  if (count < 10000) return "low";
  if (count < 100000) return "medium";
  return "high";
}

/**
 * Estimated advertiser competition 0–100. Etsy has no ads API, so this is a
 * deterministic heuristic anchored on keyword difficulty — stable per keyword.
 */
export function estimateAdCompetition(keyword: string, kd: number): number {
  const h = hashStr(keyword.toLowerCase().trim());
  return Math.min(98, Math.max(8, Math.round(kd * 0.7 + (h % 25))));
}

export function keywordSeed(keyword: string): number {
  return hashStr(keyword.toLowerCase().trim()) % 100000;
}

/**
 * Etsy's `shop_location` filter expects the full country name
 * (e.g. "United States"), not the ISO code — codes silently match nothing.
 */
const SHOP_LOCATION_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  IE: "Ireland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  PL: "Poland",
  IN: "India",
  PK: "Pakistan",
  TR: "Türkiye",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  JP: "Japan",
  BR: "Brazil",
  MX: "Mexico",
  NZ: "New Zealand",
  CN: "China",
};

/** ISO-3166 alpha-2 → Etsy's shop_location value. Undefined for unknown codes. */
export function shopLocationName(code: string): string | undefined {
  return SHOP_LOCATION_NAMES[code.toUpperCase()];
}

/** Taxonomy node names change rarely — cache them for the process lifetime. */
const taxonomyCache = new Map<number, string>();
export async function getTaxonomyName(taxonomyId: number): Promise<string | null> {
  if (!taxonomyId) return null;
  const cached = taxonomyCache.get(taxonomyId);
  if (cached) return cached;
  try {
    const node = await etsyFetch<EtsyTaxonomyNode>(
      `/seller/taxonomy/nodes/${taxonomyId}`
    );
    if (node?.name) taxonomyCache.set(taxonomyId, node.name);
    return node?.name ?? null;
  } catch {
    return null;
  }
}

/** Strip any HTML from listing descriptions before scoring/display. */
export function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
