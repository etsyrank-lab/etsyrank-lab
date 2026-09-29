import Link from "next/link";
import { Card, SectionHeading } from "../ui";

const TOOLS = [
  {
    href: "/dashboard/keywords",
    title: "Keyword research",
    body: "Demand, competition, and difficulty for any product phrase — plus a 12-month curve so you list ahead of the season.",
    icon: "K",
    tint: "from-brand-500 to-brand-700",
  },
  {
    href: "/dashboard/niches",
    title: "Niche explorer",
    body: "Twelve starter niches ranked by the gap between buyer demand and seller competition. Find your opening.",
    icon: "N",
    tint: "from-emerald-500 to-teal-700",
  },
  {
    href: "/dashboard/competition",
    title: "Competition intel",
    body: "Compare the shops winning your niche by sales, reviews, and rating. Learn the playbook before you list against it.",
    icon: "C",
    tint: "from-violet-500 to-purple-700",
  },
  {
    href: "/dashboard/shop",
    title: "Shop analyzer",
    body: "A health score for any rival shop — strengths, weaknesses to exploit, and their top listings laid bare.",
    icon: "S",
    tint: "from-sky-500 to-blue-700",
  },
  {
    href: "/dashboard/tags",
    title: "Tag optimizer",
    body: "Paste your 13 Etsy tags and get each one scored against what top-ranking listings actually use — with swaps suggested.",
    icon: "T",
    tint: "from-accent-500 to-accent-700",
  },
  {
    href: "/dashboard/audit",
    title: "Listing auditor",
    body: "A 0–100 grade across title, tags, description, attributes, and images — with the exact fixes that move the score.",
    icon: "A",
    tint: "from-rose-500 to-red-700",
  },
  {
    href: "/dashboard/ai-writer",
    title: "AI listing writer",
    body: "Type a product idea, get an SEO-structured title, 13 tags, and a description draft in seconds.",
    icon: "W",
    tint: "from-fuchsia-500 to-purple-700",
  },
  {
    href: "/dashboard/calculator",
    title: "Fee calculator",
    body: "Every Etsy fee — transaction, listing, processing, Offsite Ads — broken down so you price for real profit.",
    icon: "F",
    tint: "from-amber-500 to-orange-700",
  },
  {
    href: "/dashboard/rank-tracker",
    title: "Rank tracker",
    body: "Daily search positions for your keywords with 7-day movement badges and 30-day history charts.",
    icon: "R",
    tint: "from-indigo-500 to-brand-700",
  },
];

export function Features() {
  return (
    <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:py-28">
      <SectionHeading
        kicker="The toolkit"
        title="Nine tools, one workflow"
        sub="Research the niche, size up the competition, write the listing, price it right, then watch it climb — without leaving the dashboard."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.title} href={t.href}>
            <Card className="card-lift group h-full p-6">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-black text-white shadow-soft ${t.tint}`}
              >
                {t.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-700">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.body}</p>
              <p className="mt-4 text-sm font-bold text-brand-600 opacity-0 transition group-hover:opacity-100">
                Open tool →
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["Research", "Search a keyword or browse niches to find demand with room to compete."],
    ["Optimize", "Audit your draft, score your tags, and let the AI writer do the heavy lifting."],
    ["Profit", "Price with the fee calculator, then track your climb in rank tracker."],
  ];
  return (
    <section id="how" className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <SectionHeading kicker="Workflow" title="From idea to ranking listing in three moves" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(([t, b], i) => (
            <div key={t} className="card-lift rounded-2xl border border-slate-200/70 bg-white p-7 shadow-soft">
              <p className="text-gradient text-sm font-black tracking-widest">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
