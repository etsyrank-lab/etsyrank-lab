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

interface RankPoint {
  t: string; // ISO timestamp
  pos: number | null; // null = not found in scanned results
}

interface Tracked {
  id: string;
  keyword: string;
  listingId: string;
  searchVolume: number | null;
  history: RankPoint[];
}

const STORE_KEY = "etsyrank-tracked-v1";

function loadStored(): Tracked[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function latestPos(t: Tracked): number | null {
  for (let i = t.history.length - 1; i >= 0; i--) {
    if (t.history[i].pos != null) return t.history[i].pos;
  }
  return null;
}

/** Compare latest position against the oldest point (~7d window label). */
function sevenDayChange(t: Tracked): number | null {
  const pts = t.history.filter((p) => p.pos != null);
  if (pts.length < 2) return null;
  const first = pts[0].pos as number;
  const last = pts[pts.length - 1].pos as number;
  return first - last; // positive = climbed up
}

export default function RankTrackerPage() {
  const [tracked, setTracked] = useState<Tracked[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");
  const [newListing, setNewListing] = useState("");
  const [adding, setAdding] = useState(false);
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTracked(loadStored());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(tracked));
      } catch {
        /* storage full/blocked — history just won't persist */
      }
    }
  }, [tracked, loading]);

  async function fetchVolume(keyword: string): Promise<number | null> {
    try {
      const r = await fetch(`/api/keywords?q=${encodeURIComponent(keyword)}`);
      const j = await r.json();
      const v = j?.data?.searchVolume;
      return typeof v === "number" ? v : null;
    } catch {
      return null;
    }
  }

  async function addTracked() {
    const kw = newKeyword.trim().toLowerCase();
    const lid = newListing.trim();
    if (!kw || !lid || !/^\d+$/.test(lid)) {
      setError("Enter a keyword and a numeric Etsy listing ID.");
      return;
    }
    if (tracked.some((t) => t.keyword === kw && t.listingId === lid)) {
      setError("That keyword + listing is already tracked.");
      return;
    }
    setError(null);
    setAdding(true);
    const volume = await fetchVolume(kw);
    const entry: Tracked = {
      id: `trk-${Date.now()}`,
      keyword: kw,
      listingId: lid,
      searchVolume: volume,
      history: [],
    };
    setTracked((prev) => [...prev, entry]);
    setNewKeyword("");
    setNewListing("");
    setAdding(false);
    // Check its position right away.
    checkOne(entry.id, kw, lid);
  }

  async function checkOne(id: string, keyword?: string, listingId?: string) {
    const target = tracked.find((t) => t.id === id);
    const kw = keyword ?? target?.keyword;
    const lid = listingId ?? target?.listingId;
    if (!kw || !lid) return;
    setChecking((p) => ({ ...p, [id]: true }));
    setError(null);
    try {
      const r = await fetch("/api/rank-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw, listingId: lid }),
      });
      const j = await r.json();
      if (j.mock && j.error && j.position === undefined) {
        throw new Error(j.error);
      }
      const point: RankPoint = {
        t: new Date().toISOString(),
        pos: typeof j.position === "number" ? j.position : null,
      };
      setTracked((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, history: [...t.history, point] } : t
        )
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Position check failed. Try again."
      );
    } finally {
      setChecking((p) => ({ ...p, [id]: false }));
    }
  }

  async function checkAll() {
    for (const t of tracked) {
      // eslint-disable-next-line no-await-in-loop
      await checkOne(t.id);
    }
  }

  function remove(id: string) {
    setTracked((prev) => prev.filter((t) => t.id !== id));
  }

  const anyChecking = Object.values(checking).some(Boolean);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Track"
        title="Rank tracker"
        sub="Watch where your listings sit in Etsy search for the keywords that matter — live position checks against the Etsy API, with history per listing."
        actions={<Badge tone="green">Live positions</Badge>}
      />

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTracked()}
            placeholder="Keyword, e.g. boho wall art printable"
            className="sm:flex-[2]"
          />
          <Input
            value={newListing}
            onChange={(e) => setNewListing(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTracked()}
            placeholder="Etsy listing ID, e.g. 4583567068"
            inputMode="numeric"
            className="sm:flex-1"
          />
          <Button onClick={addTracked} disabled={adding} className="shrink-0">
            {adding ? "Adding…" : "Track listing"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            onClick={checkAll}
            disabled={tracked.length === 0 || anyChecking}
            className="shrink-0"
          >
            {anyChecking ? "Checking…" : "Check all positions"}
          </Button>
          <p className="text-xs text-slate-400">
            Position = where the listing appears in Etsy search for that
            keyword (top 500 scanned). History is stored in this browser;
            daily automatic checks arrive with user accounts.
          </p>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </Card>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-20" />
          ))}
        </div>
      ) : tracked.length === 0 ? (
        <EmptyState
          title="No listings tracked yet"
          body="Add a keyword plus one of your Etsy listing IDs above, and we'll check exactly where that listing ranks in Etsy search."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">Keyword / Listing</th>
                  <th className="px-5 py-3 font-semibold">Volume</th>
                  <th className="px-5 py-3 font-semibold">Rank</th>
                  <th className="px-5 py-3 font-semibold">Change</th>
                  <th className="px-5 py-3 font-semibold">History</th>
                  <th className="px-5 py-3 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tracked.map((t) => {
                  const pos = latestPos(t);
                  const change = sevenDayChange(t);
                  const spark = t.history
                    .filter((p) => p.pos != null)
                    .map((p) => p.pos as number);
                  const lastCheck =
                    t.history.length > 0
                      ? new Date(
                          t.history[t.history.length - 1].t
                        ).toLocaleString()
                      : "never";
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {t.keyword}
                        </p>
                        <p className="text-xs tabular-nums text-slate-400">
                          Listing {t.listingId}
                        </p>
                      </td>
                      <td className="px-5 py-4 tabular-nums text-slate-500">
                        {t.searchVolume != null
                          ? `${t.searchVolume.toLocaleString()}/mo`
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        {pos != null ? (
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-base font-extrabold tabular-nums text-brand-800">
                            {pos}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            {t.history.length ? "500+" : "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {change == null ? (
                          <Badge>–</Badge>
                        ) : change > 0 ? (
                          <Badge tone="green">▲ {change} up</Badge>
                        ) : change < 0 ? (
                          <Badge tone="red">▼ {Math.abs(change)} down</Badge>
                        ) : (
                          <Badge>– steady</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Sparkline
                          data={spark}
                          width={140}
                          height={38}
                          invert
                          stroke={
                            change == null || change >= 0
                              ? "#059669"
                              : "#e11d48"
                          }
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => checkOne(t.id)}
                            disabled={checking[t.id]}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
                          >
                            {checking[t.id] ? "Checking…" : "Check now"}
                          </button>
                          <button
                            onClick={() => remove(t.id)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-300">
                          checked {lastCheck}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-400">
            Lower rank numbers are better — #1 is the top of Etsy search.
            “500+” means the listing wasn’t in the top 500 results. History
            charts are inverted so an upward slope means climbing.
          </p>
        </Card>
      )}
    </div>
  );
}
