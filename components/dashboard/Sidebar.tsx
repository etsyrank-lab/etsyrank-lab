"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/keywords", label: "Keyword research" },
  { href: "/dashboard/competition", label: "Competition" },
  { href: "/dashboard/tags", label: "Tag optimizer" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
          ER
        </span>
        <span className="text-base font-bold tracking-tight text-slate-900">EtsyRank Lab</span>
      </Link>
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-50 text-brand-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-bold">Mock mode</p>
          <p className="mt-1">All numbers are fictional demo data. Connect the Etsy API in Phase 2.</p>
        </div>
      </div>
    </aside>
  );
}
