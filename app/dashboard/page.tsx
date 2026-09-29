import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { MOCK_COMPETITORS, MOCK_KEYWORDS } from "@/lib/mock-data";

export default function DashboardHome() {
  const top = [...MOCK_KEYWORDS].sort((a, b) => b.searchVolume - a.searchVolume).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mock workspace — every number below is fictional demo data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Keywords tracked", value: String(MOCK_KEYWORDS.length), to: "/dashboard/keywords" },
          { label: "Competitors watched", value: String(MOCK_COMPETITORS.length), to: "/dashboard/competition" },
          { label: "Credits left (mock)", value: "25", to: "/dashboard/tags" },
        ].map((c) => (
          <Card key={c.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900">{c.value}</p>
            <Link href={c.to} className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
              Open →
            </Link>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Top keywords by demand</h2>
          <Link href="/dashboard/keywords">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {top.map((k) => (
            <Link
              key={k.keyword}
              href={`/dashboard/keywords?q=${encodeURIComponent(k.keyword)}`}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 hover:bg-slate-100"
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
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>☐ Connect Etsy Open API v3 (replace <code>lib/mock-data.ts</code> calls)</li>
          <li>☐ Add MongoDB caching layer (<code>lib/schema.ts</code> is ready)</li>
          <li>☐ Wire up auth + credit ledger</li>
          <li>☐ Plug in AI title/tag/description generation</li>
        </ul>
      </Card>
    </div>
  );
}
