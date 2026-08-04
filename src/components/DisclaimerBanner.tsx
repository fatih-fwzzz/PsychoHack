"use client";

import { DISCLAIMER } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  const lang = useAppStore((s) => s.lang);

  return (
    <div className="flex items-start gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)]/80 px-3 py-2.5 text-xs leading-relaxed text-[var(--muted)] md:text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warn)]" aria-hidden />
      <p>{DISCLAIMER[lang]}</p>
    </div>
  );
}
