"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ICONS: Record<string, JSX.Element> = {
  grid: (
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" />
    </>
  ),
  store: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9v10h16V9M4 9h16M9 19v-6h6v6" />
    </>
  ),
  tag: (
    <>
      <path d="M20 12l-8 8-9-9V4h7z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a3 3 0 016 0M9 13l2 2 4-4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
    </>
  ),
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
};

function Icon({ name, className = "h-[18px] w-[18px]" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

const GROUPS = [
  {
    label: "Research",
    items: [
      { href: "/dashboard", label: "Overview", exact: true, icon: "grid" },
      { href: "/dashboard/keywords", label: "Keyword research", icon: "search" },
      { href: "/dashboard/niches", label: "Niche explorer", icon: "compass" },
      { href: "/dashboard/competition", label: "Competition", icon: "chart" },
      { href: "/dashboard/shop", label: "Shop analyzer", icon: "store" },
    ],
  },
  {
    label: "Optimize",
    items: [
      { href: "/dashboard/tags", label: "Tag optimizer", icon: "tag" },
      { href: "/dashboard/audit", label: "Listing auditor", icon: "clipboard" },
      { href: "/dashboard/ai-writer", label: "AI writer", icon: "sparkles" },
      { href: "/dashboard/calculator", label: "Fee calculator", icon: "calc" },
    ],
  },
  {
    label: "Track",
    items: [{ href: "/dashboard/rank-tracker", label: "Rank tracker", icon: "trend" }],
  },
];

export const FLAT_NAV = GROUPS.flatMap((g) => g.items);

export function Sidebar() {
  const pathname = usePathname();
  const [live, setLive] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setLive(Boolean(j.etsy)))
      .catch(() => setLive(false));
  }, []);
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
      <Link href="/" className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-black text-white shadow-soft">
          ER
        </span>
        <span className="text-base font-extrabold tracking-tight text-slate-900">
          EtsyRank <span className="text-brand-600">Lab</span>
        </span>
      </Link>

      <nav className="nice-scroll flex-1 space-y-6 overflow-y-auto p-4">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {g.label}
            </p>
            <div className="space-y-1">
              {g.items.map((n) => {
                const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-soft"
                        : "text-slate-600 hover:bg-brand-50 hover:text-brand-800"
                    }`}
                  >
                    <Icon name={n.icon} />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-accent-50 to-brand-50 p-4 ring-1 ring-brand-100">
          {live ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-slate-900">Etsy API</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                  Live
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Competition counts are live from the Etsy Open API; search volumes are estimates.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-slate-900">Mock credits</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-extrabold tabular-nums text-brand-700 shadow-sm">
                  25
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Demo mode — every number on this site is fictional.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
