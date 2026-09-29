import Link from "next/link";
import { Button, Card, PageHeader } from "@/components/ui";
import { MOCK_KEYWORDS, MOCK_NICHES, MOCK_TRACKED } from "@/lib/mock-data";

const TOOLS = [
  { href: "/dashboard/keywords", label: "Keyword research", desc: "Demand, competition & difficulty", icon: "K", tint: "from-brand-500 to-brand-700" },
  { href: "/dashboard/niches", label: "Niche explorer", desc: "Ranked product opportunities", icon: "N", tint: "from-emerald-500 to-teal-700" },
  { href: "/dashboard/competition", label: "Competition", desc: "Who's winning your niche", icon: "C", tint: "from-violet-500 to-purple-700" },
  { href: "/dashboard/shop", label: "Shop analyzer", desc: "Rival health scores", icon: "S", tint: "from-sky-500 to-blue-700" },
  { href: "/dashboard/tags", label: "Tag optimizer", desc: "Score all 13 tags", icon: "T", tint: "from-accent-500 to-accent-700" },
  { href: "/dashboard/audit", label: "Listing auditor", desc: "0–100 grade + fixes", icon: "A", tint: "from-rose-500 to-red-700" },
  { href: "/dashboard/ai-writer", label: "AI writer", desc: "Titles, tags & descriptions", icon: "W", tint: "from-fuchsia-500 to-purple-700" },
  { href: "/dashboard/calculator", label: "Fee calculator", desc: "True profit per sale", icon: "F", tint: "from-amber-500 to-orange-700" },
  { href: "/dashboard/rank-tracker", label: "Rank tracker", desc: "Daily positions, 30-day charts", icon: "R", tint: "from-indigo-500 to-brand-700" },
];

export default function DashboardHome() {
  const top = [...MOCK_KEYWORDS].sort((a, b) => b.searchVolume - a.searchVolume).slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Workspace"
        title="Good afternoon, seller"
        sub="Mock workspace — every number below is fictional demo data. Pick a tool to start researching."
        actions={
          <Link href="/dashboard/audit">
            <Button variant="accent">Audit a listing</Button>
          </Link>
        }
      />

      {/* gradient welcome strip */}
      <div className="mesh-dark relative overflow-hidden rounded-3xl p-7 text-white shadow-lift md:p-9">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-200">Today's edge</p>
            <p className="mt-2 max-w-lg text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
              3 high-opportunity niches are trending up this week.
            </p>
            <Link href="/dashboard/niches" className="mt-4 inline-block">
              <Button variant="accent">Explore niches →</Button>
            </Link>
          </div>
          <div className="flex gap-8">
            {[
              [String(MOCK_NICHES.length), "niches tracked"],
              [String(MOCK_TRACKED.length), "keywords watched"],
              ["25", "mock credits left"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-extrabold tabular-nums">{v}</p>
                <p className="mt-1 text-xs text-brand-200">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">All tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href}>
              <Card className="card-lift group flex h-full items-center gap-4 p-5">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-base font-black text-white shadow-soft ${t.tint}`}>
                  {t.icon}
                </span>
                <span>
                  <span className="block font-bold text-slate-900 group-hover:text-brand-700">{t.label}</span>
                  <span className="block text-xs text-slate-500">{t.desc}</span>
                </span>
                <span className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600">→</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Top keywords by demand</h2>
          <Link href="/dashboard/keywords">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>
        <div className="mt-4 space-y-2.5">
          {top.map((k) => (
            <Link
              key={k.keyword}
              href={`/dashboard/keywords?q=${encodeURIComponent(k.keyword)}`}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-transparent transition hover:bg-brand-50 hover:ring-brand-100"
            >
              <span className="text-sm font-semibold text-slate-800">{k.keyword}</span>
              <span className="text-sm tabular-nums text-slate-500">
                {k.searchVolume.toLocaleString()} / mo
              </span>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="border-dashed p-6">
        <h2 className="text-base font-bold text-slate-900">Phase 2 checklist</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <li>☐ Connect Etsy Open API v3 (replace <code>lib/mock-data.ts</code> calls)</li>
          <li>☐ Add MongoDB caching layer (<code>lib/schema.ts</code> is ready)</li>
          <li>☐ Wire up auth + credit ledger</li>
          <li>☐ Swap AI writer mock for GPT-5 mini (<code>app/api/ai-writer</code> TODO)</li>
        </ul>
      </Card>
    </div>
  );
}
