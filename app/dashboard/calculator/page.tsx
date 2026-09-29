"use client";

import { useMemo, useState } from "react";
import { Badge, Card, Input, PageHeader, Stat } from "@/components/ui";

/**
 * Etsy fee math (US, 2026 schedule — verify against Etsy's current fee page):
 * - Transaction fee: 6.5% of (item price + shipping charged)
 * - Listing fee: $0.20 per listing
 * - Etsy Payments processing: 3% + $0.25 (US)
 * - Offsite Ads: 12% of sale (< $10k/yr) or 15% (≥ $10k/yr), only when enabled
 */
export default function CalculatorPage() {
  const [salePrice, setSalePrice] = useState(29.99);
  const [shippingCharged, setShippingCharged] = useState(4.99);
  const [itemCost, setItemCost] = useState(8.0);
  const [shippingCost, setShippingCost] = useState(3.5);
  const [offsiteAds, setOffsiteAds] = useState(false);
  const [highVolume, setHighVolume] = useState(false);

  const calc = useMemo(() => {
    const revenue = salePrice + shippingCharged;
    const transactionFee = revenue * 0.065;
    const listingFee = 0.2;
    const processingFee = revenue * 0.03 + 0.25;
    const offsiteFee = offsiteAds ? revenue * (highVolume ? 0.15 : 0.12) : 0;
    const totalFees = transactionFee + listingFee + processingFee + offsiteFee;
    const totalCosts = itemCost + shippingCost;
    const net = revenue - totalFees - totalCosts;
    const margin = revenue > 0 ? (net / revenue) * 100 : 0;
    return { revenue, transactionFee, listingFee, processingFee, offsiteFee, totalFees, totalCosts, net, margin };
  }, [salePrice, shippingCharged, itemCost, shippingCost, offsiteAds, highVolume]);

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const rows: [string, number, string][] = [
    ["Transaction fee (6.5%)", calc.transactionFee, "bg-brand-500"],
    ["Listing fee ($0.20)", calc.listingFee, "bg-brand-300"],
    ["Payment processing (3% + $0.25)", calc.processingFee, "bg-accent-500"],
    ["Offsite Ads fee", calc.offsiteFee, "bg-violet-500"],
    ["Item + shipping costs", calc.totalCosts, "bg-slate-400"],
  ];

  const fields: { label: string; value: number; set: (n: number) => void; hint: string }[] = [
    { label: "Sale price", value: salePrice, set: setSalePrice, hint: "What the buyer pays for the item" },
    { label: "Shipping charged", value: shippingCharged, set: setShippingCharged, hint: "Shipping fee the buyer pays" },
    { label: "Item cost", value: itemCost, set: setItemCost, hint: "Materials + labor per unit" },
    { label: "Your shipping cost", value: shippingCost, set: setShippingCost, hint: "Postage + packaging you pay" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Optimize"
        title="Fee & profit calculator"
        sub="See exactly what Etsy keeps from every sale — transaction, listing, processing and Offsite Ads fees — and what actually lands in your pocket."
        actions={<Badge tone="green">100% client-side</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-base font-bold text-slate-900">Sale inputs</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label}>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {f.label}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    $
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={f.value}
                    onChange={(e) => f.set(Math.max(0, Number(e.target.value) || 0))}
                    className="pl-8 tabular-nums"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">{f.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">
                Sale came from Offsite Ads
                <span className="block text-xs font-normal text-slate-400">
                  Etsy charges 12% of the sale when they advertise it for you
                </span>
              </span>
              <input
                type="checkbox"
                checked={offsiteAds}
                onChange={(e) => setOffsiteAds(e.target.checked)}
                className="h-5 w-5 accent-[#4c3fe8]"
              />
            </label>
            {offsiteAds && (
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-700">
                  My shop made $10k+ in the last 12 months
                  <span className="block text-xs font-normal text-slate-400">
                    High-volume shops pay 15% instead of 12%
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={highVolume}
                  onChange={(e) => setHighVolume(e.target.checked)}
                  className="h-5 w-5 accent-[#4c3fe8]"
                />
              </label>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-200">Net profit per sale</p>
            <p className={`mt-1 text-4xl font-extrabold tabular-nums tracking-tight ${calc.net >= 0 ? "text-white" : "text-rose-300"}`}>
              {money(calc.net)}
            </p>
            <p className="mt-1 text-sm text-brand-200">
              {calc.margin.toFixed(1)}% margin on {money(calc.revenue)} revenue
            </p>
          </div>
          <div className="space-y-4 p-6">
            <div>
              <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
                {rows
                  .filter(([, v]) => v > 0.001)
                  .map(([label, v, color]) => (
                    <div
                      key={label}
                      className={`${color} h-full transition-all`}
                      style={{ width: `${(v / calc.revenue) * 100}%` }}
                      title={`${label}: ${money(v)}`}
                    />
                  ))}
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${Math.max(0, (calc.net / calc.revenue)) * 100}%` }}
                  title={`Your profit: ${money(calc.net)}`}
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Your profit
                <span className="inline-block h-2 w-2 rounded-full bg-slate-300" /> Fees & costs
              </div>
            </div>
            <dl className="divide-y divide-slate-100 text-sm">
              {rows.map(([label, v]) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600">{label}</dt>
                  <dd className="font-bold tabular-nums text-slate-900">{money(v)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-2.5">
                <dt className="font-bold text-slate-900">Total Etsy fees</dt>
                <dd className="font-extrabold tabular-nums text-brand-700">{money(calc.totalFees)}</dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><Stat label="Buyer pays" value={money(calc.revenue)} hint="Item + shipping" /></Card>
        <Card className="p-5"><Stat label="Etsy keeps" value={money(calc.totalFees)} hint={`${((calc.totalFees / calc.revenue) * 100 || 0).toFixed(1)}% of revenue`} /></Card>
        <Card className="p-5"><Stat label="Break-even price" value={money(calc.totalFees + calc.totalCosts - shippingCharged)} hint="Minimum item price to not lose money" /></Card>
      </div>

      <p className="text-xs text-slate-400">
        Estimates use Etsy's US fee schedule (6.5% transaction, $0.20 listing, 3% + $0.25 processing). Real
        payouts vary by country, currency conversion, and sales tax handling — treat this as planning math, not accounting advice.
      </p>
    </div>
  );
}
