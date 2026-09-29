"use client";

import { useState } from "react";
import { SectionHeading } from "../ui";

const FAQS = [
  {
    q: "What exactly is EtsyRank Lab?",
    a: "A research and optimization toolkit for Etsy sellers: keyword demand, competition intel, tag scoring, listing audits, an AI listing writer, a fee calculator, and rank tracking — all in one dashboard.",
  },
  {
    q: "Is the data on the demo real?",
    a: "No. Every number in this preview is fictional mock data so you can explore the full workflow. When the product launches, keyword and listing data will come from the official Etsy Open API.",
  },
  {
    q: "Is EtsyRank Lab affiliated with Etsy?",
    a: "No. It's an independent tool built by sellers, for sellers. Etsy is a trademark of Etsy, Inc., which does not sponsor or endorse this project.",
  },
  {
    q: "Do I need to connect my Etsy shop?",
    a: "Not for research — keyword, niche, and competition tools work without any connection. Shop-specific features like automated rank tracking will optionally connect via Etsy's official OAuth when they launch.",
  },
  {
    q: "How do credits work?",
    a: "Each tool run costs a small number of credits (for example, 1 for a keyword lookup, 3 for an AI-written listing). Plans refill credits daily, so heavy research days never hit a wall mid-session.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — plans are month-to-month and you keep access until the end of your billing period. No lock-ins, no cancellation hoops.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 border-t border-slate-200/70 bg-slate-50/70">
      <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
        <SectionHeading
          kicker="FAQ"
          title="Questions, answered"
          sub="The short version of everything sellers ask before trying the toolkit."
        />
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isOpen ? "border-brand-200 shadow-soft" : "border-slate-200/70"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900">{f.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                      isOpen ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
