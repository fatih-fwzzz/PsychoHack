"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

export function QuestionCard({
  question,
  index,
  total,
  onComplete,
}: {
  question: Question;
  index: number;
  total: number;
  onComplete: (selectedSequence: string[]) => void;
}) {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);
  /** item index → rank (1-based) */
  const [ranks, setRanks] = useState<Record<number, number>>({});
  const nextRank = Object.keys(ranks).length + 1;
  const locked = Object.keys(ranks).length >= question.itemsToDisplay.length;

  function handleClick(itemIndex: number) {
    if (locked || ranks[itemIndex] !== undefined) return;

    const rank = nextRank;
    const next = { ...ranks, [itemIndex]: rank };
    setRanks(next);

    if (Object.keys(next).length >= question.itemsToDisplay.length) {
      const ordered = Object.entries(next)
        .sort((a, b) => a[1] - b[1])
        .map(([idx]) => question.itemsToDisplay[Number(idx)]!);
      // Defer submit so the final rank paints before advancing
      queueMicrotask(() => onComplete(ordered));
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.progress} {index + 1} {copy.of} {total}
          </p>
          <p className="mt-1 text-sm text-[var(--accent)]">
            {copy.types[question.type]}
          </p>
        </div>
        <p className="text-xs text-[var(--muted)]">{copy.rankHint}</p>
      </div>

      <h2 className="font-display text-xl font-semibold text-[var(--ink)] md:text-2xl">
        {question.direction}
      </h2>

      <p className="mt-2 text-sm text-[var(--muted)]">
        {copy.rankProgress.replace("{n}", String(Math.min(nextRank, question.itemsToDisplay.length)))
          .replace("{total}", String(question.itemsToDisplay.length))}
      </p>

      <div className="mt-6 grid gap-3">
        {question.itemsToDisplay.map((item, itemIndex) => {
          const rank = ranks[itemIndex];
          const selected = rank !== undefined;

          return (
            <button
              key={`${question.id}-${itemIndex}`}
              type="button"
              disabled={selected || locked}
              onClick={() => handleClick(itemIndex)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                selected
                  ? "border-[var(--accent)]/50 bg-[rgba(60,230,192,0.14)]"
                  : "border-[var(--line)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:bg-[var(--surface)]"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-display text-sm font-bold tabular-nums ${
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg-deep)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
                }`}
                aria-hidden
              >
                {selected ? rank : ""}
              </span>
              <span className="font-mono text-base text-[var(--ink)] md:text-lg">
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
