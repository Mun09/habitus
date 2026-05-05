"use client";

import { CONTRACTORS, type Contractor } from "@/lib/mock/contractors";

const ITEMS: { label: string; ratios: number[] }[] = [
  { label: "Demo & disposal", ratios: [1, 1.05, 0.92] },
  { label: "Plumbing & elec", ratios: [1, 1.08, 0.94] },
  { label: "Carpentry & paint", ratios: [1, 1.12, 0.88] },
  { label: "Kitchen & bath", ratios: [1, 1.15, 0.90] },
  { label: "Finishing & cleanup", ratios: [1, 1.06, 0.95] },
];

const BASE_PRICES = [3500000, 4200000, 6800000, 4800000, 1500000];

export function QuoteComparison({ current }: { current: Contractor }) {
  const others = CONTRACTORS.filter((c) => c.id !== current.id).slice(0, 2);
  const cols = [current, ...others];

  const total = (idx: number) =>
    BASE_PRICES.reduce((acc, p, i) => acc + p * ITEMS[i].ratios[idx], 0);

  const fmt = (v: number) => `$${Math.round(v / 1300).toLocaleString()}`;

  return (
    <div className="rounded-3xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Item
            </th>
            {cols.map((c, i) => (
              <th
                key={c.id}
                className={`p-4 text-left ${i === 0 ? "bg-primary/5" : ""}`}
              >
                <div className="serif text-base font-medium">{c.company}</div>
                <div className="text-xs text-muted-foreground">{c.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ITEMS.map((item, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              <td className="p-4 text-foreground/90">{item.label}</td>
              {item.ratios.map((r, j) => (
                <td
                  key={j}
                  className={`p-4 ${j === 0 ? "bg-primary/5 font-medium" : ""}`}
                >
                  {fmt(BASE_PRICES[i] * r)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-muted/40">
            <td className="p-4 font-semibold">Total</td>
            {cols.map((_, j) => (
              <td
                key={j}
                className={`p-4 font-semibold ${j === 0 ? "bg-primary/10 text-primary" : ""}`}
              >
                {fmt(total(j))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
