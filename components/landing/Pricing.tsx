import Link from "next/link";
import { Button, Card, SectionHeading } from "../ui";

const PLANS = [
  {
    name: "Starter",
    price: "$9",
    per: "/ month",
    features: ["100 keyword lookups / day", "Tag optimizer", "Competitor tables"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    per: "/ month",
    features: [
      "1,000 lookups / day",
      "Everything in Starter",
      "AI title & description helper",
      "Rank tracking (Phase 2)",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$79",
    per: "/ month",
    features: ["Unlimited lookups", "Everything in Pro", "Team seats (Phase 2)", "Priority support"],
    cta: "Contact us",
    highlight: false,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Pricing"
        title="Start free, upgrade when it pays for itself"
        sub="MVP preview — checkout is not wired up yet. Phase 2 adds Stripe billing."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={`p-8 ${p.highlight ? "border-2 border-brand-600 shadow-lg" : ""}`}
          >
            <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
            <p className="mt-2">
              <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
              <span className="text-sm text-slate-500">{p.per}</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="mt-8 block">
              <Button variant={p.highlight ? "primary" : "outline"} className="w-full">
                {p.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-slate-500 md:flex-row">
        <p className="font-semibold text-slate-700">EtsyRank Lab</p>
        <p className="max-w-xl text-center md:text-right">
          Demo project with mock data. Not affiliated with or endorsed by Etsy, Inc.
          “Etsy” is a trademark of Etsy, Inc.
        </p>
      </div>
    </footer>
  );
}
