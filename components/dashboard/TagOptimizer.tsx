"use client";

import { useState } from "react";
import { Badge, Button, Card, Input } from "../ui";
import type { TagAnalysisResult } from "@/types";

const verdictTone = { strong: "green", ok: "amber", weak: "red" } as const;

export function TagOptimizer() {
  const [keyword, setKeyword] = useState("personalized gold name necklace");
  const [raw, setRaw] = useState(
    ["name necklace", "gold necklace", "gift for wife", "custom jewelry", "dainty",
     "birthday present", "mom gift", "cute", "sale", "handmade", "trendy", "2026", "love"]
      .join(", ")
  );
  const [result, setResult] = useState<TagAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    try {
      const tags = raw.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, tags }),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      setResult(json.data as TagAnalysisResult);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Target keyword</label>
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. personalized gold name necklace" />
          </div>
          <div className="flex items-end">
            <Button onClick={run} disabled={loading} className="w-full md:w-auto">
              {loading ? "Scoring…" : "Score my tags"}
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Your 13 Etsy tags <span className="font-normal text-slate-400">(comma-separated)</span>
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="tag one, tag two, …"
          />
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </Card>

      {result && (
        <div className="space-y-6">
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Overall tag score</p>
              <p className="text-4xl font-extrabold text-slate-900">{result.overallScore}<span className="text-lg text-slate-400">/100</span></p>
            </div>
            <Badge tone={result.overallScore >= 70 ? "green" : result.overallScore >= 40 ? "amber" : "red"}>
              {result.overallScore >= 70 ? "Strong set" : result.overallScore >= 40 ? "Needs work" : "Weak set"}
            </Badge>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900">Per-tag breakdown</h3>
            <div className="mt-4 space-y-3">
              {result.tags.map((t) => (
                <div key={t.tag} className="flex items-center gap-3">
                  <span className="w-48 truncate text-sm font-medium text-slate-700">{t.tag || "(empty)"}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${t.verdict === "strong" ? "bg-emerald-500" : t.verdict === "ok" ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${t.score}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-bold tabular-nums text-slate-700">{t.score}</span>
                  <Badge tone={verdictTone[t.verdict]}>{t.verdict}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900">Suggested swaps</h3>
            <p className="mt-1 text-sm text-slate-500">Top-ranking listings use these tags — consider replacing your weakest ones.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.suggestions.map((s) => (
                <Badge key={s} tone="brand">{s}</Badge>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
