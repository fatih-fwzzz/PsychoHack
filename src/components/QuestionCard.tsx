"use client";

import type { OptionId, Question } from "@/lib/types";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

export function QuestionCard({
  question,
  index,
  total,
  onSelect,
}: {
  question: Question;
  index: number;
  total: number;
  onSelect: (id: OptionId) => void;
}) {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.progress} {index + 1} {copy.of} {total}
          </p>
          <p className="mt-1 text-sm text-[var(--accent)]">
            {copy.types[question.type]}
          </p>
        </div>
        <p className="text-xs text-[var(--muted)]">{copy.lockHint}</p>
      </div>

      <h2 className="font-display text-xl font-semibold text-[var(--ink)] md:text-2xl">
        {question.direction}
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {question.itemsToDisplay.map((item) => (
          <span
            key={item}
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-sm"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className="group flex w-full items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-3 text-left transition hover:border-[var(--accent)] hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] font-display text-sm font-bold text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-deep)]">
              {opt.id}
            </span>
            <span className="flex flex-wrap gap-x-2 gap-y-1 pt-1 font-mono text-sm text-[var(--ink)]">
              {opt.sequence.map((s, i) => (
                <span key={`${opt.id}-${s}-${i}`}>
                  {s}
                  {i < opt.sequence.length - 1 ? (
                    <span className="text-[var(--muted)]"> → </span>
                  ) : null}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
