import Link from "next/link";
import { Button, Card, SectionHeading } from "../ui";

const PLANS = [
  {
    name: "Starter",
    price: "$9",
    per: "/ month",
    blurb: "For new shops finding their first winning niche.",
    features: [
      "100 keyword lookups / day",
      "Niche explorer",
      "Tag optimizer + listing auditor",
      "Fee calculator",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    per: "/ month",
    blurb: "For growing shops optimizing every listing.",
    features: [
      "1,000 lookups / day",
      "Everything in Starter",
      "AI listing writer",
      "Rank tracker + shop analyzer",
      "CSV export",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$79",
    per: "/ month",
    blurb: "For teams running multiple shops.",
    features: [
      "Unlimited lookups",
      "Everything in Pro",
      "Team seats (Phase 2)",
      "Priority support",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:py-28">
      <SectionHeading
        kicker="Pricing"
        title="Start free, upgrade when it pays for itself"
        sub="One optimized listing usually covers a month of Pro. MVP preview — checkout is not wired up yet."
      />
      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={`card-lift flex flex-col p-8 ${
              p.highlight ? "border-2 border-brand-600 shadow-lift lg:-my-3 lg:py-11" : ""
            }`}
          >
            {p.highlight && (
              <span className="mb-4 inline-flex w-fit rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-xs font-bold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{p.blurb}</p>
            <p className="mt-4">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">{p.price}</span>
              <span className="text-sm text-slate-500">{p.per}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span className="font-black text-emerald-600">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="mt-8 block">
              <Button variant={p.highlight ? "primary" : "outline"} className="w-full py-3">
                {p.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-slate-400">
        Prices shown for the demo. Phase 2 adds Stripe billing with monthly and annual options.
      </p>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
      <div className="mesh-dark dot-grid relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-lift md:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Your next bestseller is hiding in the data. Go find it.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
          Nine tools, zero setup, no credit card. Open the dashboard and audit
          your first listing in under a minute.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button variant="accent" className="px-8 py-3.5 text-base">
              Open the live dashboard
            </Button>
          </Link>
          <a href="#tools">
            <Button className="border border-white/30 bg-white/10 px-8 py-3.5 text-base text-white backdrop-blur hover:bg-white/20">
              See all tools
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

const FOOT_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Research",
    links: [
      { label: "Keyword research", href: "/dashboard/keywords" },
      { label: "Niche explorer", href: "/dashboard/niches" },
      { label: "Competition intel", href: "/dashboard/competition" },
      { label: "Shop analyzer", href: "/dashboard/shop" },
    ],
  },
  {
    title: "Optimize",
    links: [
      { label: "Tag optimizer", href: "/dashboard/tags" },
      { label: "Listing auditor", href: "/dashboard/audit" },
      { label: "AI listing writer", href: "/dashboard/ai-writer" },
      { label: "Fee calculator", href: "/dashboard/calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Reviews", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-black text-white shadow-soft">
                ER
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                EtsyRank <span className="text-brand-600">Lab</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The research toolkit for Etsy sellers who'd rather make than
              guess. Mock-data demo — real Etsy API wiring lands in Phase 2.
            </p>
          </div>
          {FOOT_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-brand-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 pt-8 text-xs text-slate-400 md:flex-row">
          <p>© 2026 EtsyRank Lab. All rights reserved.</p>
          <p className="max-w-xl text-center md:text-right">
            Demo project with mock data. Not affiliated with or endorsed by Etsy, Inc.
            “Etsy” is a trademark of Etsy, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
