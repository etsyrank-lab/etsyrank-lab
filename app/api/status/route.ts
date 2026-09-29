export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";


import { isEtsyConfigured } from "@/lib/etsy";

/**
 * GET /api/status
 * Reports whether live Etsy Open API v3 credentials are configured.
 * The dashboard uses this to show a "Live Etsy data" vs "Mock" badge.
 * Safe to call publicly — it never exposes the credentials themselves.
 */
export async function GET() {
  const etsy = isEtsyConfigured();
  return NextResponse.json({
    etsy,
    live: etsy,
    mock: !etsy,
    timestamp: new Date().toISOString(),
  });
}
