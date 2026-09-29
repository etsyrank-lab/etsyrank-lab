"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FLAT_NAV } from "./Sidebar";

export function Topbar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/dashboard/keywords?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-xs font-black text-white">
            ER
          </span>
        </Link>

        <form onSubmit={submit} className="relative max-w-md flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any product keyword…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </form>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 ring-1 ring-brand-100 sm:inline">
            25 credits
          </span>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-black text-white">
              DS
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold text-slate-900">Demo Seller</p>
              <p className="text-[11px] text-slate-400">Starter plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* mobile nav — horizontal scrollable tool links */}
      <nav className="nice-scroll flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        {FLAT_NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-800"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
