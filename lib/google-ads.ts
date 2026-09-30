/**
 * Google Ads API — real monthly search volumes via KeywordPlanIdeaService.
 *
 * Why this exists: Etsy publishes no search-volume endpoint, so Etsy's own
 * API can never answer "how many people search this". Google's Keyword
 * Planner can — it returns real average monthly searches measured on Google
 * Search, optionally geo-targeted to the selected country. This is the same
 * "Etsy + Google APIs" combination rankkw.com advertises.
 *
 * Cost: $0. The API is free and unmetered per call; access is granted via the
 * Google Cloud project's access level. IMPORTANT: the Keyword Planner
 * services (GenerateKeywordIdeas) are explicitly BLOCKED at Explorer level —
 * Basic access is required. Explorer (2,880 ops/day) is a stepping stone;
 * Basic (15,000 ops/day) unlocks planning. In the post-Sept-2026 system,
 * Basic is approved automatically within minutes once brand verification is
 * complete (OAuth consent screen: External, published "In production",
 * branding filled). No ad spend is required — though note Google returns
 * *bucketed* volumes (e.g. 1K–10K bands) for accounts with no spend history.
 * Still real measured data.
 *
 * Auth model (post Sept-2026): access levels are tied to the Google Cloud
 * project, and developer tokens were sunset — so the token header is only
 * sent when GOOGLE_ADS_DEVELOPER_TOKEN is set (harmless either way).
 *
 * Required env vars:
 *   GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET / GOOGLE_ADS_REFRESH_TOKEN
 *   GOOGLE_ADS_CUSTOMER_ID  (10-digit Ads account ID, no dashes)
 * Optional:
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID (only if you query through a manager account)
 *   GOOGLE_ADS_DEVELOPER_TOKEN   (legacy; only needed if your setup still asks)
 *
 * When any required var is missing, isGoogleAdsConfigured() is false and
 * callers fall back to the modeled estimate — the app keeps working.
 */

import { countryName } from "./countries";

const API_BASE = "https://googleads.googleapis.com/v25";

export class GoogleAdsError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "GoogleAdsError";
    this.status = status;
  }
}

export function isGoogleAdsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_CLIENT_ID &&
      process.env.GOOGLE_ADS_CLIENT_SECRET &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID
  );
}

function customerId(): string {
  return (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/\D/g, "");
}

/* ------------------------------------------------------------------ */
/* Caches: access token (~50 min), geo constants (per country, long),  */
/* volumes (per keyword+country, 10 min — mirrors the Etsy cache).      */
/* ------------------------------------------------------------------ */

let accessToken: string | null = null;
let accessTokenExp = 0;
const geoCache = new Map<string, string>(); // ISO code -> "geoTargetConstants/NNNN"
const volumeCache = new Map<string, { value: number | null; exp: number }>();
const VOL_TTL_MS = 10 * 60 * 1000;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < accessTokenExp) return accessToken;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new GoogleAdsError(
      `Google OAuth token refresh failed (HTTP ${res.status}) — check GOOGLE_ADS_CLIENT_ID/SECRET/REFRESH_TOKEN`,
      res.status
    );
  }
  const body = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) throw new GoogleAdsError("Google OAuth returned no access token");
  accessToken = body.access_token;
  accessTokenExp = Date.now() + (body.expires_in ?? 3600) * 1000 - 60_000; // 1 min safety margin
  return accessToken;
}

function apiHeaders(token: string): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  // Legacy header — only sent when configured; the API ignores it otherwise.
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN) {
    h["developer-token"] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  }
  const loginId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").replace(/\D/g, "");
  if (loginId) h["login-customer-id"] = loginId;
  return h;
}

/**
 * Resolve an ISO country code to a Google geo-target constant, e.g.
 * "US" -> "geoTargetConstants/2840". Cached per country; returns null on
 * any failure so callers can fall back to untargeted (global) volumes.
 */
async function resolveGeoConstant(countryCode: string): Promise<string | null> {
  const code = countryCode.toUpperCase();
  const cached = geoCache.get(code);
  if (cached) return cached;
  const name = countryName(code);
  if (!name) return null;
  try {
    const token = await getAccessToken();
    const res = await fetch(
      `${API_BASE}/customers/${customerId()}/geoTargetConstants:suggest`,
      {
        method: "POST",
        headers: apiHeaders(token),
        body: JSON.stringify({
          locale: "en",
          countryCode: code,
          locationNames: { names: [name] },
        }),
      }
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      geoTargetConstantSuggestions?: Array<{
        geoTargetConstant?: { resourceName?: string };
      }>;
    };
    const resourceName =
      body.geoTargetConstantSuggestions?.[0]?.geoTargetConstant?.resourceName ?? null;
    if (resourceName) geoCache.set(code, resourceName);
    return resourceName;
  } catch {
    return null;
  }
}

interface KeywordIdea {
  text?: string;
  keywordIdeaMetrics?: { avgMonthlySearches?: string };
}

/**
 * Real average monthly searches for an exact keyword from Google Keyword
 * Planner. Returns null when Google has no data for the term (or on any
 * upstream hiccup) so the caller can fall back to the modeled estimate.
 */
export async function getGoogleSearchVolume(
  keyword: string,
  countryCode?: string
): Promise<number | null> {
  const cacheKey = `${keyword.toLowerCase().trim()}|${(countryCode ?? "").toUpperCase()}`;
  const hit = volumeCache.get(cacheKey);
  if (hit && Date.now() < hit.exp) return hit.value;

  const token = await getAccessToken();
  const geoTarget = countryCode ? await resolveGeoConstant(countryCode) : null;

  const body: Record<string, unknown> = {
    keywordSeed: { keywords: [keyword.trim()] },
    keywordPlanNetwork: "GOOGLE_SEARCH",
    language: "languageConstants/1000", // English
    pageSize: 10,
  };
  if (geoTarget) body.geoTargetConstants = [geoTarget];

  const res = await fetch(`${API_BASE}/customers/${customerId()}:generateKeywordIdeas`, {
    method: "POST",
    headers: apiHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GoogleAdsError(
      `Google Ads generateKeywordIdeas failed (HTTP ${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
      res.status
    );
  }
  const data = (await res.json()) as { results?: KeywordIdea[] };
  const want = keyword.toLowerCase().trim();
  const match = (data.results ?? []).find((r) => r.text?.toLowerCase().trim() === want);
  const raw = match?.keywordIdeaMetrics?.avgMonthlySearches;
  const value = raw != null ? parseInt(raw, 10) : NaN;
  const result = Number.isFinite(value) ? value : null;

  volumeCache.set(cacheKey, { value: result, exp: Date.now() + VOL_TTL_MS });
  return result;
}
