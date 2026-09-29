import Link from "next/link";
import { Badge } from "../ui";
import { competitionTone } from "./Widgets";
import type { CompetitorShop, KeywordMetrics, ListingSnapshot } from "@/types";

const oppTone = { high: "green", medium: "amber", low: "red" } as const;

const COMP_TEXT: Record<string, string> = {
  green: "text-green-600",
  lime: "text-lime-500",
  red: "text-red-600",
};

export function KeywordTable({ rows }: { rows: KeywordMetrics[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-semibold">Keyword</th>
            <th className="px-5 py-3 font-semibold">Volume</th>
            <th className="px-5 py-3 font-semibold">Competition</th>
            <th className="px-5 py-3 font-semibold">KD</th>
            <th className="px-5 py-3 font-semibold">CTR</th>
            <th className="px-5 py-3 font-semibold">Opportunity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((k) => (
            <tr key={k.keyword} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-5 py-3">
                <Link
                  href={`/dashboard/keywords?q=${encodeURIComponent(k.keyword)}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {k.keyword}
                </Link>
              </td>
              <td className="px-5 py-3 tabular-nums">
                {k.searchVolume.toLocaleString()}
              </td>
              <td className={`px-5 py-3 font-semibold tabular-nums ${COMP_TEXT[competitionTone(k.competitionLevel) ?? ""] ?? ""}`}>{k.competition.toLocaleString()}</td>
              <td className="px-5 py-3 tabular-nums">
                {k.kd}
              </td>
              <td className="px-5 py-3 tabular-nums">{(k.ctr * 100).toFixed(1)}%</td>
              <td className="px-5 py-3">
                <Badge tone={oppTone[k.opportunity]}>{k.opportunity}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompetitorTable({ shops }: { shops: CompetitorShop[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-semibold">#</th>
            <th className="px-5 py-3 font-semibold">Shop</th>
            <th className="px-5 py-3 font-semibold">Sales</th>
            <th className="px-5 py-3 font-semibold">Reviews</th>
            <th className="px-5 py-3 font-semibold">Rating</th>
            <th className="px-5 py-3 font-semibold">Country</th>
            <th className="px-5 py-3 font-semibold">Opened</th>
            <th className="px-5 py-3 font-semibold">Listings</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((s, i) => (
            <tr key={s.shopId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-5 py-3 font-bold text-slate-400">{i + 1}</td>
              <td className="px-5 py-3 font-semibold text-slate-900">{s.shopName}</td>
              <td className="px-5 py-3 tabular-nums">{s.totalSales.toLocaleString()}</td>
              <td className="px-5 py-3 tabular-nums">{s.reviews.toLocaleString()}</td>
              <td className="px-5 py-3 tabular-nums">★ {s.rating.toFixed(1)}</td>
              <td className="px-5 py-3">{s.country}</td>
              <td className="px-5 py-3 tabular-nums">{s.yearOpened}</td>
              <td className="px-5 py-3 tabular-nums">{s.activeListings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SEED_COLORS = ["#e0c3a5", "#c9b8d4", "#a8c8b8", "#e5b8a0", "#b8c8e0", "#d4c9a8"];

export function ListingCards({ listings }: { listings: ListingSnapshot[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {listings.map((l) => {
        const color = SEED_COLORS[l.listingId % SEED_COLORS.length];
        return (
          <div key={l.listingId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex h-28 items-center justify-center" style={{ background: color }}>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-700">
                Listing #{l.listingId}
              </span>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900">{l.title}</p>
              <p className="mt-1 text-xs text-slate-500">{l.shopName}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Price", `$${l.price}`],
                  // Etsy doesn't expose listing views via the API — live rows show "—".
                  ["Views", l.views != null ? l.views.toLocaleString() : "—"],
                  ["Favs", l.favorites.toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-slate-50 py-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">{k}</p>
                    <p className="text-sm font-bold text-slate-800">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Conversion{" "}
                <span className="font-bold text-slate-700">
                  {l.conversion != null ? `${(l.conversion * 100).toFixed(1)}%` : "—"}
                </span>
                {" · "}
                {l.ageDays != null ? `${l.ageDays} days old` : "age unknown"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
