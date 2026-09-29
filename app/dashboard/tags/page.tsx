import { TagOptimizer } from "@/components/dashboard/TagOptimizer";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Tag optimizer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Score your 13 Etsy tags against what top-ranking listings use — mock scoring.
        </p>
      </div>
      <TagOptimizer />
    </div>
  );
}
