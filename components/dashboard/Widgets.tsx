import { Card, EstMark } from "../ui";

export function StatCard({ label, value, hint, est }: { label: string; value: string; hint?: string; est?: boolean }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {est && <EstMark />}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

/** Lightweight SVG area chart for the 12-month demand trend (no chart lib needed in MVP). */
export function TrendsChart({ data, height = 160 }: { data: number[]; height?: number }) {
  const w = 600;
  const h = height;
  const max = Math.max(...data) * 1.15;
  const min = 0;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = h - 12 - ((v - min) / (max - min)) * (h - 28);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="12-month demand trend">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b66f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b66f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="#2549eb" strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#2549eb" stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>12 months ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
