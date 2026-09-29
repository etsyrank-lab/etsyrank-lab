import Link from "next/link";
import { Badge, Button } from "../ui";
import { Counter } from "./Counter";

const STATS: [number, string, string][] = [
  [9, "", "SEO tools in one dashboard"],
  [13, "", "tags scored per listing"],
  [30, "", "days of rank history"],
  [12, "", "curated starter niches"],
];

function PreviewSparkline() {
  const data = [22, 26, 24, 31, 29, 36, 34, 42, 48, 45, 54, 62];
  const w = 320;
  const h = 90;
  const max = 70;
  const pts = data.map((v, i) => [(i * w) / (data.length - 1), h - 8 - (v / max) * (h - 20)] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d5df7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5d5df7" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#heroFill)" />
      <path d={line} fill="none" stroke="#4c3fe8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#4c3fe8" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="mesh-bg relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center md:pt-24">
        <div className="fade-up">
          <Badge tone="brand">Live demo — 9 tools, mock data, no signup needed</Badge>
        </div>
        <h1 className="fade-up anim-d1 mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
          Turn Etsy search data into listings{" "}
          <span className="text-gradient">buyers actually find</span>
        </h1>
        <p className="fade-up anim-d2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          EtsyRank Lab reads demand, competition, and pricing signals across the
          marketplace — then tells you, in plain English, exactly what to fix in
          your titles, tags, and prices.
        </p>
        <div className="fade-up anim-d3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button className="px-8 py-3.5 text-base">Open the live dashboard</Button>
          </Link>
          <a href="#tools">
            <Button variant="outline" className="px-8 py-3.5 text-base">Explore the tools</Button>
          </a>
        </div>

        <div className="fade-up anim-d4 mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(([n, suffix, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                <Counter to={n} suffix={suffix} />
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* CSS-built dashboard preview */}
        <div className="fade-up anim-d4 relative mx-auto mt-14 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-lift">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 hidden rounded-lg bg-white px-4 py-1 text-xs text-slate-400 ring-1 ring-slate-200 sm:block">
                etsyrank-lab.vercel.app/dashboard
              </span>
              <span className="ml-auto"><Badge tone="green">Live mock</Badge></span>
            </div>
            <div className="grid md:grid-cols-[180px_1fr]">
              <div className="hidden space-y-1 border-r border-slate-100 p-4 md:block">
                {["Overview", "Keyword research", "Niche explorer", "Tag optimizer", "Listing auditor", "Rank tracker"].map((x, i) => (
                  <div
                    key={x}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${i === 1 ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white" : "text-slate-500"}`}
                  >
                    {x}
                  </div>
                ))}
              </div>
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Keyword snapshot</p>
                    <p className="font-mono text-xs text-slate-500">“sage green wedding invitations”</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    Opportunity: High
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    ["Search volume", "9,800/mo"],
                    ["Competition", "15,230"],
                    ["Difficulty", "44/100"],
                    ["Avg. price", "$24.99"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{k}</p>
                      <p className="mt-0.5 text-lg font-extrabold tabular-nums text-slate-900">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700">12-month demand</p>
                    <p className="text-xs font-bold text-emerald-600">▲ trending up</p>
                  </div>
                  <div className="mt-2"><PreviewSparkline /></div>
                </div>
              </div>
            </div>
          </div>

          {/* floating accent cards */}
          <div className="float-y absolute -right-4 -top-6 hidden rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 shadow-lift backdrop-blur lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Listing score</p>
            <p className="text-2xl font-extrabold text-emerald-600">92<span className="text-sm text-slate-400">/100</span></p>
          </div>
          <div className="float-y absolute -left-6 bottom-10 hidden rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-3 shadow-lift backdrop-blur lg:block" style={{ animationDelay: "1.4s" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Net profit / sale</p>
            <p className="text-2xl font-extrabold text-slate-900">$18.42</p>
          </div>
        </div>
      </div>
    </section>
  );
}
