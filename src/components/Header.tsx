"use client";

import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";

export function Header({ compact = false }: { compact?: boolean }) {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 md:px-8">
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight text-[var(--ink)] md:text-xl"
      >
        {copy.brand}
        <span className="text-[var(--accent)]">.</span>
      </Link>
      <nav className="flex items-center gap-3 md:gap-5">
        {!compact && (
          <>
            <Link
              href="/dashboard"
              className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--ink)] sm:inline"
            >
              {copy.navDashboard}
            </Link>
            <Link
              href="/history"
              className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--ink)] sm:inline"
            >
              {copy.navHistory}
            </Link>
          </>
        )}
        <LanguageToggle />
      </nav>
    </header>
  );
}
