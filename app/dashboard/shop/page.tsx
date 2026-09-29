"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  PageHeader,
  ScoreRing,
  Select,
  SkeletonBlock,
  Stat,
} from "@/components/ui";
import type { ShopAnalysis } from "@/types";
import { MOCK_COMPETITORS } from "@/lib/mock-data";

export default function ShopPage() {
  const [shopName, setShopName] = useState(MOCK_COMPETITORS[0].shopName);
  const [analysis, setAnalysis] = useState<ShopAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shop?shop=${encodeURIComponent(shopName)}`)
      .then((r) => r.json())
      .then((j) => setAnalysis(j.data))
      .finally(() => setLoading(false));
  }, [shopName]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Research"
        title="Shop analyzer"
        sub="Pick a shop to see its health score, what's working, and the exact gaps you can exploit when you compete against it."
        actions={<Badge tone="amber">Mock data</Badge>}
      />

      <Card className="p-5">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Shop to analyze
        </label>
        <Select value={shopName} onChange={(e) => setShopName(e.target.value)} className="max-w-md">
          {MOCK_COMPETITORS.map((s) => (
            <option key={s.shopId} value={s.shopName}>
              {s.shopName} — {s.totalSales.toLocaleString()} sales
            </option>
          ))}
        </Select>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-44" />)}
        </div>
      ) : !analysis ? (
        <Card className="p-8 text-center text-sm text-slate-500">Shop not found in mock data.</Card>
      ) : (
        <div className="fade-up space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="flex items-center gap-5 p-6">
              <ScoreRing score={analysis.healthScore} size={110} label="health" />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{analysis.shopName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {analysis.healthScore >= 80
                    ? "A formidable competitor — study, don't copy."
                    : analysis.healthScore >= 60
                      ? "Solid shop with attackable gaps."
                      : "Beatable — several fundamentals are weak."}
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">Strengths</h3>
              <ul className="mt-3 space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-emerald-600">✓</span> {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-rose-700">Weaknesses to exploit</h3>
              <ul className="mt-3 space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-rose-500">✕</span> {w}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5"><Stat label="Total sales" value={analysis.stats.totalSales.toLocaleString()} /></Card>
            <Card className="p-5"><Stat label="Reviews" value={analysis.stats.reviews.toLocaleString()} hint={`${analysis.stats.rating}★ average`} /></Card>
            <Card className="p-5"><Stat label="Active listings" value={String(analysis.stats.activeListings)} hint={`Since ${analysis.stats.yearOpened}`} /></Card>
            <Card className="p-5"><Stat label="Based in" value={analysis.stats.country} /></Card>
          </div>

          <Card className="overflow-hidden">
            <h3 className="border-b border-slate-100 px-6 py-4 text-base font-bold text-slate-900">
              Top listings
            </h3>
            {analysis.topListings.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                No mock listings recorded for this shop yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-3 font-semibold">Listing</th>
                      <th className="px-6 py-3 font-semibold">Price</th>
                      <th className="px-6 py-3 font-semibold">Views</th>
                      <th className="px-6 py-3 font-semibold">Favorites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysis.topListings.map((l) => (
                      <tr key={l.listingId} className="hover:bg-slate-50/60">
                        <td className="max-w-md px-6 py-3.5 font-medium text-slate-800 line-clamp-2">{l.title}</td>
                        <td className="px-6 py-3.5 tabular-nums text-slate-600">${l.price.toFixed(2)}</td>
                        <td className="px-6 py-3.5 tabular-nums text-slate-600">
                          {l.views != null ? l.views.toLocaleString() : "—"}
                        </td>
                        <td className="px-6 py-3.5 tabular-nums font-semibold text-slate-900">{l.favorites.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
