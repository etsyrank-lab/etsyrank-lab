"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  ScoreRing,
  Textarea,
} from "@/components/ui";
import type { AuditReport } from "@/types";
import { MOCK_LISTINGS } from "@/lib/mock-data";

const ATTRIBUTE_OPTIONS = [
  "Materials",
  "Color",
  "Occasion",
  "Recipient",
  "Size",
  "Style",
  "Personalization",
  "Ships from",
];

const MOCK_DRAFTS = Object.values(MOCK_LISTINGS).flat().slice(0, 3);

export default function AuditPage() {
  const [title, setTitle] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<string[]>(["Materials", "Color"]);
  const [imageCount, setImageCount] = useState(6);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);
  const [listingId, setListingId] = useState("");
  const [auditError, setAuditError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setLive(Boolean(j.etsy)))
      .catch(() => setLive(false));
  }, []);

  function loadMock(listingId: number) {
    const l = MOCK_DRAFTS.find((x) => x.listingId === listingId);
    if (!l) return;
    setTitle(l.title);
    setTagsText(l.tags.join(", "));
    setDescription(
      `This ${l.title.split("—")[0].trim().toLowerCase()} is handmade to order in our studio. ` +
        "Personalize the details to make it a one-of-a-kind gift for birthdays, anniversaries, and holidays. " +
        "Please allow 3–5 business days for creation before shipping. Message us with any questions — we reply within 24 hours."
    );
    setReport(null);
  }

  function toggleAttr(a: string) {
    setAttributes((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  async function runAudit() {
    setLoading(true);
    setAuditError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
          description,
          attributes,
          imageCount,
        }),
      });
      const json = await res.json();
      setReport(json.data);
    } finally {
      setLoading(false);
    }
  }

  async function runLiveAudit() {
    const id = listingId.trim();
    if (!id) return;
    setLoading(true);
    setAuditError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAuditError(json.error ?? "Could not fetch that listing.");
        setReport(null);
      } else {
        setReport(json.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Optimize"
        title="Listing auditor"
        sub="Paste a draft listing and get a graded 0–100 report across the five pillars of Etsy SEO — with exact fixes, not vague advice."
        actions={
          live ? (
            <Badge tone="green">Live listing lookup</Badge>
          ) : (
            <Badge tone="amber">Mock scoring</Badge>
          )
        }
      />

      {live && (
        <Card className="border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="text-sm font-bold text-slate-900">Audit a live Etsy listing</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter a listing ID (the number in its Etsy URL) — we&apos;ll pull its real
            title, tags, description, and images, then grade them.
          </p>
          <div className="mt-3 flex gap-2">
            <Input
              value={listingId}
              onChange={(e) => setListingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runLiveAudit()}
              placeholder="e.g. 1234567890"
              inputMode="numeric"
            />
            <Button onClick={runLiveAudit} disabled={loading || !listingId.trim()} className="shrink-0">
              {loading ? "…" : "Fetch & audit"}
            </Button>
          </div>
          {auditError && <p className="mt-2 text-xs font-semibold text-rose-600">{auditError}</p>}
        </Card>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Your draft</h2>
          <div className="flex flex-wrap gap-2">
            {MOCK_DRAFTS.map((l) => (
              <button
                key={l.listingId}
                onClick={() => loadMock(l.listingId)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-brand-100 hover:text-brand-800"
              >
                Load mock: {l.shopName}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Listing title
            </label>
            <Textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Personalized Gold Name Necklace — Custom Dainty Nameplate, Gift for Her"
            />
            <p className={`mt-1 text-xs tabular-nums ${title.length > 140 ? "font-bold text-rose-600" : "text-slate-400"}`}>
              {title.length} / 140 characters
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Tags (comma separated)
            </label>
            <Textarea
              rows={2}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="name necklace, gold necklace, personalized gift, …"
            />
            <p className="mt-1 text-xs text-slate-400">
              {tagsText.split(",").map((t) => t.trim()).filter(Boolean).length} / 13 tags
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Description
            </label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What it is, who it's for, materials, sizes, shipping…"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Attributes filled
              </p>
              <div className="flex flex-wrap gap-2">
                {ATTRIBUTE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAttr(a)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      attributes.includes(a)
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Product images: <span className="text-slate-900">{imageCount} / 10</span>
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-slate-400">Listings with 7+ images convert notably better.</p>
            </div>
          </div>

          <Button onClick={runAudit} disabled={loading} className="w-full md:w-auto">
            {loading ? "Grading…" : "Run audit"}
          </Button>
        </div>
      </Card>

      {report && (
        <div className="space-y-6 fade-up">
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center gap-6 bg-gradient-to-br from-brand-50 to-white p-8 md:flex-row">
              <ScoreRing score={report.overallScore} size={140} label="score" />
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {report.listingTitle}
                  </h2>
                  <Badge tone={report.grade === "A" || report.grade === "B" ? "green" : report.grade === "C" ? "amber" : "red"}>
                    Grade {report.grade}
                  </Badge>
                </div>
                <p className="mt-2 max-w-xl text-sm text-slate-600">
                  {report.overallScore >= 75
                    ? "Strong foundation — the quick wins below will push it into top-ranking shape."
                    : report.overallScore >= 50
                      ? "Workable draft with clear gaps. Fix the lowest-scoring sections first."
                      : "This draft is leaving a lot of search traffic on the table — start with the quick wins."}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 bg-accent-50/60 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-accent-800">Quick wins</h3>
              <ul className="mt-3 space-y-2">
                {report.quickWins.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-black text-accent-600">{i + 1}.</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {report.sections.map((s) => (
              <Card key={s.id} className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{s.label}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-extrabold tabular-nums ${
                      s.score >= 80
                        ? "bg-emerald-100 text-emerald-800"
                        : s.score >= 60
                          ? "bg-brand-100 text-brand-800"
                          : s.score >= 40
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {s.score}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.score >= 80 ? "bg-emerald-500" : s.score >= 60 ? "bg-brand-500" : s.score >= 40 ? "bg-accent-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                {s.issues.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.issues.map((issue, i) => (
                      <li key={i} className="flex gap-2 text-sm text-rose-700">
                        <span>✕</span> {issue}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mt-3 space-y-1.5">
                  {s.suggestions.map((sg, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-emerald-600">✓</span> {sg}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
