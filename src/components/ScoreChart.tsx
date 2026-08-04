"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TestResult } from "@/lib/types";
import { accuracyPercent } from "@/lib/scoring";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

export function ScoreChart({ history }: { history: TestResult[] }) {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);

  const data = [...history]
    .reverse()
    .map((h, i) => ({
      name: `#${i + 1}`,
      accuracy: accuracyPercent(h.correct, h.total),
    }));

  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)]/60 p-4">
      <p className="mb-3 text-sm text-[var(--muted)]">{copy.historyChart}</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(140,190,220,0.12)" strokeDasharray="4 4" />
          <XAxis dataKey="name" stroke="#8aa0b5" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#8aa0b5" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{
              background: "#122033",
              border: "1px solid rgba(140,190,220,0.18)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#3ce6c0"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#3ce6c0" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
