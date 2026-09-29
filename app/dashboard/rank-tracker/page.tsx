"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageHeader,
  SkeletonBlock,
  Sparkline,
} from "@/components/ui";
import type { TrackedKeyword } from "@/types";

function walk(seed: number, base: number): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < 30; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    v = Math.max(1, Math.round(v + (seed / 233280 - 0.5) * 6));
    out.push(v);
  }
  return out;
}

export default function RankTrackerPage() {
  const [tracked, setTracked] = useState<TrackedKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    fetch("/api/rank-tracker")
      .then((r) => r.json())
      .then((j) => setTracked(j.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function addKeyword() {
    const kw = newKeyword.trim().toLowerCase();
    if (!kw || tracked.some((t) => t.keyword === kw)) return;
    const history = walk(Date.now() % 100000, 15 + Math.floor(Math.random() * 20));
    setTracked((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        keyword: kw,
        currentRank: history[history.length - 1],
        previousRank: history[history.length - 8],
        rankHistory: history,
        searchVolume: 5000 + Math.floor(Math.random() * 15000),
      },
    ]);
    setNewKeyword("");
  }

  function remove(id: string) {
    setTracked((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Track"
        title="Rank tracker"
        sub="Watch where your listings sit in Etsy search for the keywords that matter — daily position, 7-day movement, and a 30-day history chart."
        actions={<Badge tone="amber">Mock positions</Badge>}
      />

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="Add a keyword to track, e.g. boho wall art printable"
          />
          <Button onClick={addKeyword} className="shrink-0">Track keyword</Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Phase 2 checks positions daily via the Etsy API and stores real history per listing.
        </p>
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-20" />)}
        </div>
      ) : tracked.length === 0 ? (
        <EmptyState
          title="No keywords tracked yet"
          body="Add your first keyword above and we'll start charting its search position."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">Keyword</th>
                  <th className="px-5 py-3 font-semibold">Volume</th>
                  <th className="px-5 py-3 font-semibold">Rank</th>
                  <th className="px-5 py-3 font-semibold">7-day change</th>
                  <th className="px-5 py-3 font-semibold">30-day history</th>
                  <th className="px-5 py-3 font-semibold"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tracked.map((t) => {
                  const change = t.previousRank - t.currentRank; // positive = improved
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4 font-semibold text-slate-900">{t.keyword}</td>
                      <td className="px-5 py-4 tabular-nums text-slate-500">
                        {t.searchVolume.toLocaleString()}/mo
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-base font-extrabold tabular-nums text-brand-800">
                          {t.currentRank}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {change > 0 ? (
                          <Badge tone="green">▲ {change} up</Badge>
                        ) : change < 0 ? (
                          <Badge tone="red">▼ {Math.abs(change)} down</Badge>
                        ) : (
                          <Badge>– steady</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Sparkline
                          data={t.rankHistory}
                          width={140}
                          height={38}
                          invert
                          stroke={change >= 0 ? "#059669" : "#e11d48"}
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => remove(t.id)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-400">
            Lower rank numbers are better — #1 is the top of Etsy search. History charts are inverted so an upward slope means climbing.
          </p>
        </Card>
      )}
    </div>
  );
}
