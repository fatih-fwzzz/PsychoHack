"use client";

import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

const MODULES = [
  "verbal",
  "quantitative",
  "logical",
  "big5",
  "workValues",
] as const;

export function ComingSoonGrid() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {MODULES.map((key) => (
        <div
          key={key}
          className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg-elevated)]/40 px-4 py-5 opacity-70"
        >
          <p className="font-display text-sm font-semibold text-[var(--ink)]">
            {copy.modules[key]}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {copy.comingSoon}
          </p>
        </div>
      ))}
    </div>
  );
}
