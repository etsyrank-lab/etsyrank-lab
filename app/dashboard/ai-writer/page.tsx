"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
} from "@/components/ui";
import type { GeneratedListing } from "@/types";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

const IDEAS = [
  "sage green wedding invitations",
  "funny cat mug gift",
  "birth flower necklace",
  "macrame plant hanger",
];

export default function AiWriterPage() {
  const [idea, setIdea] = useState("");
  const [draft, setDraft] = useState<GeneratedListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    const q = idea.trim();
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: q }),
      });
      const json = await res.json();
      setDraft(json.data);
    } finally {
      setLoading(false);
    }
  }

  function copy(key: string, text: string) {
    copyText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  const copyBtn = (key: string, text: string) => (
    <button
      onClick={() => copy(key, text)}
      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-brand-100 hover:text-brand-800"
    >
      {copied === key ? "Copied ✓" : "Copy"}
    </button>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Optimize"
        title="AI listing writer"
        sub="Describe your product in a few words and get an SEO-structured title, all 13 tags, and a ready-to-edit description."
        actions={<Badge tone="amber">Mock output</Badge>}
      />

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="e.g. personalized leather journal for travelers"
            className="text-base"
          />
          <Button onClick={generate} disabled={loading || !idea.trim()} className="shrink-0 px-8">
            {loading ? "Writing…" : "Generate listing"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-slate-400">Try:</span>
          {IDEAS.map((x) => (
            <button
              key={x}
              onClick={() => setIdea(x)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-brand-100 hover:text-brand-800"
            >
              {x}
            </button>
          ))}
        </div>
      </Card>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="skeleton h-40" />
          <div className="skeleton h-40" />
          <div className="skeleton h-48 md:col-span-2" />
        </div>
      )}

      {draft && !loading && (
        <div className="fade-up space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">SEO title</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs tabular-nums ${draft.title.length > 140 ? "font-bold text-rose-600" : "text-slate-400"}`}>
                  {draft.title.length}/140
                </span>
                {copyBtn("title", draft.title)}
              </div>
            </div>
            <p className="mt-2 text-lg font-semibold leading-relaxed text-slate-900">{draft.title}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                13 tags <span className="ml-1 font-normal normal-case text-slate-400">({draft.tags.length}/13)</span>
              </h2>
              {copyBtn("tags", draft.tags.join(", "))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.tags.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</h2>
              {copyBtn("desc", draft.description)}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {draft.description}
            </p>
          </Card>

          <Card className="border-dashed p-5">
            <div className="flex gap-3 text-sm text-slate-600">
              <span className="text-lg">⚙</span>
              <p>
                <span className="font-bold text-slate-900">Phase 2 wiring:</span> this mock template
                output will be replaced by a GPT-5 mini call inside{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">app/api/ai-writer/route.ts</code>{" "}
                — grounded on your niche's real top tags, validated to Etsy's 140/20-character limits, and billed at ~$0.00026 per listing.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
