import { Card, SectionHeading } from "../ui";

const FEATURES = [
  {
    title: "Keyword research",
    body: "See demand, competition, and difficulty for any product phrase — plus a 12-month demand curve so you list ahead of the season.",
  },
  {
    title: "Competitor breakdown",
    body: "Compare the shops winning your niche by sales, reviews, and rating. Learn what the incumbents do before you list against them.",
  },
  {
    title: "Tag optimizer",
    body: "Paste your 13 Etsy tags and get each one scored against the tags top-ranking listings actually use — with replacements suggested.",
  },
  {
    title: "Market insight",
    body: "Price bands, category mix, and listing age across live results. Spot the gaps competitors left open.",
  },
  {
    title: "Listing snapshots",
    body: "Views, favorites, and conversion ratios for the listings ranking today — the numbers behind the ranking.",
  },
  {
    title: "Opportunity score",
    body: "Every keyword gets a plain high / medium / low opportunity rating so you can prioritize without a statistics degree.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        kicker="Toolkit"
        title="Everything you need to research before you list"
        sub="One dashboard for demand, competition, and optimization — built for sellers, not analysts."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700">
              {f.title.charAt(0)}
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["Search a keyword", "Type any product idea to pull demand and competition numbers."],
    ["Study the winners", "Open the competitor table to see who's ranking and why."],
    ["Optimize your tags", "Score your 13 tags and swap weak ones for proven alternatives."],
  ];
  return (
    <section id="how" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading kicker="Workflow" title="From idea to optimized listing in three steps" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(([t, b], i) => (
            <div key={t} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-brand-600">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{t}</h3>
              <p className="mt-2 text-sm text-slate-600">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
