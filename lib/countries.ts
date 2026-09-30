/**
 * Shared seller-country filter options.
 * Used by the Keyword Research UI (Etsy `shop_location` filter) and by the
 * Google Ads volume lookup (geo targeting), so both stay in sync.
 */
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "IE", name: "Ireland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "PL", name: "Poland" },
  { code: "IN", name: "India" },
  { code: "PK", name: "Pakistan" },
  { code: "TR", name: "Türkiye" },
  { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "NZ", name: "New Zealand" },
  { code: "CN", name: "China" },
] as const;

export function countryName(code: string): string | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase())?.name;
}
