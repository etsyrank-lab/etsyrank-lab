"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { CompetitorTable, ListingCards } from "@/components/dashboard/Tables";
import { StatCard } from "@/components/dashboard/Widgets";
import type { CompetitorShop, ListingSnapshot, MarketInsight } from "@/types";

interface CompetitionData {
  keyword: string;
  shops: CompetitorShop[];
  listings: ListingSnapshot[];
  market: MarketInsight;
}

export default function CompetitionPage() {
  const [query, setQuery] = useState("personalized gold name necklace");
  const [data, setData] = useState<CompetitionData | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(q: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/competition?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setData(json.data as CompetitionData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Competition analysis</h1>
        <p className="mt-1 text-sm text-slate-500">Who's winning your niche — mock shop and listing data.</p>
      </div>

      <Card className="flex gap-3 p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(query)}
          placeholder="e.g. personalized gold name necklace"
        />
        <Button onClick={() => run(query)} disabled={loading}>
          {loading ? "…" : "Analyze"}
        </Button>
      </Card>

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Avg. price" value={`$${data.market.avgPrice.toFixed(2)}`} hint={`range $${data.market.priceRange[0]}–$${data.market.priceRange[1]}`} />
            <StatCard label="Avg. listing age" value={`${data.market.avgListingAgeDays} days`} hint="older = entrenched" />
            <StatCard label="Top category" value={data.market.topCategories[0]?.name ?? "—"} hint={`${Math.round((data.market.topCategories[0]?.share ?? 0) * 100)}% of results`} />
            <StatCard label="Shops compared" value={String(data.shops.length)} hint="ranked by sales" />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Top shops by sales</h2>
            <CompetitorTable shops={data.shops} />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Top-ranking listings</h2>
            <ListingCards listings={data.listings} />
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900">Most-used tags in this niche</h2>
            <div className="mt-4 space-y-2">
              {data.market.commonTags.map((t) => (
                <div key={t.tag} className="flex items-center gap-3">
                  <span className="w-44 truncate text-sm font-medium text-slate-700">{t.tag}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${t.usage}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm tabular-nums text-slate-500">{t.usage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
