"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Card, Input } from "@/components/ui";
import { KeywordTable } from "@/components/dashboard/Tables";
import { StatCard, TrendsChart, competitionTone } from "@/components/dashboard/Widgets";
import type { KeywordIdea, KeywordMetrics } from "@/types";
import { COUNTRIES } from "@/lib/countries";

function KeywordsTool() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState("");
  const [rows, setRows] = useState<KeywordMetrics[]>([]);
  const [detail, setDetail] = useState<KeywordMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);
  const [volumeSource, setVolumeSource] = useState<"google" | "estimated">("estimated");
  const [ideas, setIdeas] = useState<KeywordIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  async function runExpand(q: string, c: string = country) {
    if (!q.trim()) return;
    setIdeasLoading(true);
    try {
      const url = `/api/expand?q=${encodeURIComponent(q)}${c ? `&country=${c}` : ""}&limit=15`;
      const res = await fetch(url);
      const json = await res.json();
      setIdeas((json.data as KeywordIdea[]) ?? []);
    } finally {
      setIdeasLoading(false);
    }
  }

  async function runSearch(q: string, c: string = country) {
    setIdeas([]);
    setLoading(true);
    try {
      const url = `/api/keywords?q=${encodeURIComponent(q)}${c ? `&country=${c}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      setLive(Boolean(json.live));
      setVolumeSource(json.volumeSource === "google" ? "google" : "estimated");
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
        <Button variant="outline" onClick={() => runExpand(query)} disabled={ideasLoading || !query.trim()}>
          {ideasLoading ? "…" : "💡 Get ideas"}
        </Button>
      </Card>

      {ideas.length > 0 && (
        <Card className="p-4">
          <h3 className="text-base font-bold text-slate-900">Keyword ideas for “{query}”</h3>
          <p className="mt-1 text-xs text-slate-500">
            From top competing listings + related patterns. Volume is modeled; click Measure for full detail.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-3 font-semibold">Keyword</th>
                  <th className="py-2 pr-3 font-semibold">Source</th>
                  <th className="py-2 pr-3 font-semibold">Volume</th>
                  <th className="py-2 pr-3 font-semibold">Competition</th>
                  <th className="py-2 pr-3 font-semibold">KD</th>
                  <th className="py-2 pr-3 font-semibold">Opportunity</th>
                  <th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea) => (
                  <tr key={idea.keyword} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-3 font-medium text-slate-900">{idea.keyword}</td>
                    <td className="py-2 pr-3 text-slate-500">
                      {idea.source === "top-listings" ? "Top listings" : idea.source === "tags" ? "Tags" : "Related"}
                    </td>
                    <td className="py-2 pr-3 text-slate-700">{idea.searchVolume.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-slate-700">{idea.competition.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-slate-700">{idea.kd}</td>
                    <td className="py-2 pr-3">
                      <Badge tone={idea.opportunity === "high" ? "green" : idea.opportunity === "medium" ? "amber" : "red"}>
                        {idea.opportunity}
                      </Badge>
                    </td>
                    <td className="py-2 text-right">
                      <Button variant="outline" onClick={() => runSearch(idea.keyword)}>
                        Measure →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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
              hint={live ? (volumeSource === "google" ? "per month · Google Ads" : "per month · modeled") : "per month (mock)"}
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
          <div className="grid gap-4 md:grid-cols-6">
            <StatCard
              label="Total sales"
              value={detail.totalSales != null ? detail.totalSales.toLocaleString() : "—"}
              hint={live ? "top competing shops, lifetime" : "competing shops (mock)"}
            />
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
              {volumeSource === "google"
                ? "Search volume is measured by Google Keyword Planner; difficulty, CTR and ad competition are modeled estimates; competition, favorites, prices and total sales are measured live from Etsy. Etsy does not expose listing views or per-keyword sales — total sales sums the lifetime sales of the top 10 competing shops."
                : "Search volume, difficulty, CTR and ad competition are modeled estimates; competition, favorites, prices and total sales are measured live from Etsy. Etsy does not expose listing views or per-keyword sales — total sales sums the lifetime sales of the top 10 competing shops."}
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
