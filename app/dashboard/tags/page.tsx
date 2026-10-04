"use client";

import { useEffect, useState } from "react";
import { TagOptimizer } from "@/components/dashboard/TagOptimizer";

export default function TagsPage() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setLive(j.live === true))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Tag optimizer</h1>
        <p className="mt-1 text-sm text-slate-500">
          {live
            ? "Score your 13 Etsy tags against what top-ranking listings actually use — live tag data."
            : "Score your 13 Etsy tags against what top-ranking listings use."}
        </p>
      </div>
      <TagOptimizer />
    </div>
  );
}
