"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COST_BENCHMARK, type CostBenchmark } from "@/lib/mock/materials";

export function CostBenchmarkChart({
  benchmark,
}: { benchmark?: CostBenchmark } = {}) {
  const b = benchmark ?? COST_BENCHMARK;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    {
      label: "Lowball quote",
      value: b.lowballQuote,
      color: "var(--danger)",
      flag: "⚠ risk",
    },
    {
      label: "Habitus quote",
      value: b.ourQuote,
      color: "var(--primary)",
      flag: "best",
    },
    {
      label: "Market avg",
      value: b.marketAvg,
      color: "var(--secondary)",
      flag: "",
    },
  ];

  const fmt = (v: number) => `$${Math.round(v / 1300).toLocaleString()}`;

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="serif text-base font-medium">Cost benchmark</div>
        <div className="text-xs text-muted-foreground mt-1">
          Same-spec quote comparison
        </div>
      </div>
      <div className="p-2 md:p-4">
        <div className="h-64 md:h-72 min-w-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={data} layout="vertical" margin={{ left: 0, right: 50, top: 10, bottom: 10 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => fmt(v as number).replace("$", "")}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  fontSize={12}
                  stroke="var(--foreground)"
                />
                <Tooltip
                  cursor={{ fill: "rgba(15,30,44,0.04)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    boxShadow: "0 8px 30px rgba(15,30,44,0.06)",
                  }}
                  formatter={(v) => fmt(Number(v))}
                  labelStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={28}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-2xl bg-[color:var(--danger)]/8 border border-[color:var(--danger)]/30 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-[color:var(--danger)] flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-foreground/80">{b.warning}</p>
        </div>
      </div>
    </div>
  );
}
