"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Card, Input } from "@/components/ui";
import { KeywordTable } from "@/components/dashboard/Tables";
import { StatCard, TrendsChart } from "@/components/dashboard/Widgets";
import type { KeywordMetrics } from "@/types";

function KeywordsTool() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [rows, setRows] = useState<KeywordMetrics[]>([]);
  const [detail, setDetail] = useState<KeywordMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/keywords?q=${encodeURIComponent(q)}`);
      const json = await res.json();
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
        <p className="mt-1 text-sm text-slate-500">Demand, competition, and difficulty — mock data.</p>
      </div>

      <Card className="flex gap-3 p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
          placeholder="Try “necklace”, “printable”, “wedding”…"
        />
        <Button onClick={() => runSearch(query)} disabled={loading}>
          {loading ? "…" : "Search"}
        </Button>
      </Card>

      {detail ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">{detail.keyword}</h2>
            <Badge tone={detail.opportunity === "high" ? "green" : detail.opportunity === "medium" ? "amber" : "red"}>
              {detail.opportunity} opportunity
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Search volume" value={detail.searchVolume.toLocaleString()} hint="per month (mock)" />
            <StatCard label="Competition" value={detail.competition.toLocaleString()} hint="active listings (mock)" />
            <StatCard label="Difficulty" value={`${detail.kd} / 100`} hint="higher = harder" />
            <StatCard label="Est. CTR" value={`${(detail.ctr * 100).toFixed(1)}%`} hint="click-through (mock)" />
          </div>
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
