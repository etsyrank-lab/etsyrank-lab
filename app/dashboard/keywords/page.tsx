"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Card, Input } from "@/components/ui";
import { KeywordTable } from "@/components/dashboard/Tables";
import { StatCard, TrendsChart, competitionTone } from "@/components/dashboard/Widgets";
import type { KeywordMetrics } from "@/types";

/** Seller-country filter options (Etsy `shop_location`, ISO-3166 alpha-2). */
const COUNTRIES = [
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
];

function KeywordsTool() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState("");
  const [rows, setRows] = useState<KeywordMetrics[]>([]);
  const [detail, setDetail] = useState<KeywordMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);

  async function runSearch(q: string, c: string = country) {
    setLoading(true);
    try {
      const url = `/api/keywords?q=${encodeURIComponent(q)}${c ? `&country=${c}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      setLive(Boolean(json.live));
      if (json.data && !Array.isArray(json.data)) {
        setDetail(json.data as KeywordMetrics);
        setRows([]);
      } else {
        setRows(json.data as KeywordMetrics[]);
        setDetail(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Keyword research</h1>
        <p className="mt-1 text-sm text-slate-500">
          {live
            ? "Competition counts are live from Etsy — volume & difficulty are estimates."
            : "Demand, competition, and difficulty — mock data."}
        </p>
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
          placeholder="Try “necklace”, “printable”, “wedding”…"
        />
        <select
          value={country}
          onChange={(e) => { setCountry(e.target.value); if (query) runSearch(query, e.target.value); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-brand-500"
          title="Search by country (seller location)"
        >
          <option value="">🌐 All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
        <Button onClick={() => runSearch(query)} disabled={loading}>
          {loading ? "…" : "Search"}
        </Button>
      </Card>

      {detail ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">{detail.keyword}</h2>
            <Badge tone={detail.opportunity === "high" ? "green" : detail.opportunity === "medium" ? "amber" : "red"}>
              {detail.opportunity} opportunity
            </Badge>
            {country && (
              <Badge tone="brand">
                🌐 {COUNTRIES.find((c) => c.code === country)?.name ?? country} sellers
              </Badge>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Search volume"
              value={detail.searchVolume.toLocaleString()}
              hint={live ? "per month" : "per month (mock)"}
            />
            <StatCard
              label="Competition"
              value={detail.competition.toLocaleString()}
              hint={live ? "live active listings" : "active listings (mock)"}
              tone={competitionTone(detail.competitionLevel)}
            />
            <StatCard
              label="Difficulty"
              value={`${detail.kd} / 100`}
              hint="higher = harder"
            />
            <StatCard
              label="CTR"
              value={`${(detail.ctr * 100).toFixed(1)}%`}
              hint={live ? "click-through" : "click-through (mock)"}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            <StatCard
              label="Ad competition"
              value={detail.adCompetition != null ? `${detail.adCompetition} / 100` : "—"}
              hint="advertiser demand (estimated)"
            />
            <StatCard
              label="Avg. views"
              value="—"
              hint="not provided by Etsy"
            />
            <StatCard
              label="Avg. favorites"
              value={detail.avgFavorites != null ? detail.avgFavorites.toLocaleString() : "—"}
              hint={live ? "per top listing" : "per listing (mock)"}
            />
            <StatCard
              label="Favs / views"
              value="—"
              hint="needs view data"
            />
            <StatCard
              label="Avg. price"
              value={detail.avgPrice != null ? `$${detail.avgPrice.toFixed(2)}` : "—"}
              hint={live ? "top competing listings" : "competing listings (mock)"}
            />
          </div>
          {live && (
            <p className="text-xs text-slate-400">
              Search volume, difficulty, CTR and ad competition are modeled estimates; competition, favorites and prices are measured live from Etsy. Etsy does not expose listing views.
            </p>
          )}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900">12-month demand trend</h3>
            <div className="mt-4">
              <TrendsChart data={detail.trend} />
            </div>
          </Card>
          <Button variant="outline" onClick={() => { setDetail(null); runSearch(""); }}>
            ← Back to all keywords
          </Button>
        </div>
      ) : (
        <KeywordTable rows={rows} />
      )}
    </div>
  );
}

export default function KeywordsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading keyword tool…</p>}>
      <KeywordsTool />
    </Suspense>
  );
}
