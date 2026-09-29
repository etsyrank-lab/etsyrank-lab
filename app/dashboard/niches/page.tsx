"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Card,
  EmptyState,
  EstMark,
  PageHeader,
  SkeletonBlock,
  Sparkline,
} from "@/components/ui";
import type { NicheOpportunity } from "@/types";

const COMP_TONE: Record<NicheOpportunity["competition"], "green" | "amber" | "red"> = {
  low: "green",
  medium: "amber",
  high: "red",
};

export default function NichesPage() {
  const [niches, setNiches] = useState<NicheOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"score" | "volume">("score");

  useEffect(() => {
    fetch("/api/niches")
      .then((r) => r.json())
      .then((j) => {
        setNiches(j.data ?? []);
        setLive(Boolean(j.live));
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(niches.map((n) => n.category))).sort()],
    [niches]
  );

  const visible = useMemo(() => {
    const list = niches.filter((n) => category === "All" || n.category === category);
    return [...list].sort((a, b) =>
      sort === "score" ? b.opportunityScore - a.opportunityScore : b.monthlyVolume - a.monthlyVolume
    );
  }, [niches, category, sort]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Research"
        title="Niche opportunity explorer"
        sub="Twelve product niches ranked by the gap between buyer demand and seller competition. Click any niche to research its keywords."
        actions={
          live ? (
            <Badge tone="green">Live competition data</Badge>
          ) : (
            <Badge tone="amber">Mock data</Badge>
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="nice-scroll flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                category === c
                  ? "bg-brand-600 text-white shadow-soft"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          Sort:
          {(["score", "volume"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`rounded-lg px-2.5 py-1.5 ${sort === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {s === "score" ? "Opportunity" : "Volume"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonBlock key={i} className="h-52" />)}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState title="No niches in this category" body="Try a different category filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((n, i) => (
            <Link key={n.id} href={`/dashboard/keywords?q=${encodeURIComponent(n.name)}`}>
              <Card className="card-lift group h-full p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">
                      #{i + 1} · {n.category}
                    </p>
                    <h3 className="mt-1 font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                      {n.name}
                    </h3>
                  </div>
                  <Badge tone={COMP_TONE[n.competition]}>{n.competition} comp.</Badge>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Monthly volume
                      {n.provenance?.volume === "estimated" && <EstMark />}
                    </p>
                    <p className="text-lg font-extrabold tabular-nums text-slate-900">
                      {n.monthlyVolume.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Avg price <span className="font-bold text-slate-600">${n.avgPrice.toFixed(2)}</span>
                    </p>
                  </div>
                  <Sparkline
                    data={n.trend}
                    width={110}
                    height={40}
                    stroke={n.opportunityScore >= 70 ? "#059669" : "#4c3fe8"}
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Opportunity</span>
                    <span className="font-extrabold tabular-nums text-slate-900">{n.opportunityScore}/100</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${n.opportunityScore >= 70 ? "bg-emerald-500" : n.opportunityScore >= 55 ? "bg-brand-500" : "bg-accent-500"}`}
                      style={{ width: `${n.opportunityScore}%` }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
