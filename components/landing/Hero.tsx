import Link from "next/link";
import { Badge, Button } from "../ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center md:pt-24">
        <Badge tone="brand">MVP preview — mock data, no signup needed</Badge>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
          Find the keywords your Etsy listings are missing
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          EtsyRank Lab turns raw marketplace signals — search demand, live competition,
          tag usage — into plain-English guidance for titles, tags, and pricing.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button className="px-8 py-3 text-base">Open the dashboard</Button>
          </Link>
          <a href="#features">
            <Button variant="outline" className="px-8 py-3 text-base">See features</Button>
          </a>
        </div>

        {/* mock dashboard preview card */}
        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Keyword snapshot</p>
            <Badge tone="green">Live mock</Badge>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500">“sage green wedding invitations”</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Search volume", "9,800 / mo"],
              ["Competing listings", "15,230"],
              ["Difficulty", "44 / 100"],
              ["Opportunity", "High"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{k}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
