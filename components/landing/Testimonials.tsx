import { Card, SectionHeading } from "../ui";

const QUOTES = [
  {
    quote:
      "The listing auditor flagged my 40-character titles in seconds. Rewrote six listings the same evening — my click-through doubled within a month.",
    name: "Maya R.",
    role: "Jewelry seller, 2k sales",
    initials: "MR",
    tint: "from-brand-500 to-brand-700",
  },
  {
    quote:
      "I used to guess at tags. Now I paste all 13 into the optimizer, swap the weak ones, and move on. It's the fastest part of my listing routine.",
    name: "Tom K.",
    role: "Print shop owner",
    initials: "TK",
    tint: "from-emerald-500 to-teal-700",
  },
  {
    quote:
      "The fee calculator alone changed how I price. I found two products I was basically selling at cost once Offsite Ads fees were included.",
    name: "Priya S.",
    role: "Wedding stationery designer",
    initials: "PS",
    tint: "from-accent-500 to-accent-700",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 md:py-28">
      <SectionHeading
        kicker="Seller stories"
        title="Built for sellers who'd rather make than guess"
        sub="EtsyRank Lab turns the numbers into a to-do list — here's what that feels like in practice."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {QUOTES.map((q) => (
          <Card key={q.name} className="card-lift flex h-full flex-col p-7">
            <div className="flex gap-1 text-lg text-accent-500" aria-label="5 out of 5 stars">
              {"★★★★★"}
            </div>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
              “{q.quote}”
            </blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-black text-white ${q.tint}`}
              >
                {q.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{q.name}</p>
                <p className="text-xs text-slate-500">{q.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        Illustrative quotes for the demo — real seller stories will appear here at launch.
      </p>
    </section>
  );
}
