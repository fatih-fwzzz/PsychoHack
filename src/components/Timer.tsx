"use client";

import { formatDuration } from "@/lib/scoring";

export function Timer({
  remainingMs,
  label,
}: {
  remainingMs: number;
  label: string;
}) {
  const urgent = remainingMs <= 30_000;

  return (
    <div className="text-right">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`font-display text-2xl font-bold tabular-nums md:text-3xl ${
          urgent ? "timer-urgent" : "text-[var(--accent)]"
        }`}
      >
        {formatDuration(remainingMs)}
      </p>
    </div>
  );
}
