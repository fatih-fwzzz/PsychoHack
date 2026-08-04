"use client";

import Image from "next/image";
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
        className="inline-flex items-center gap-3 text-[var(--ink)] transition hover:opacity-90"
      >
        <Image
          src="/logo.png"
          alt="PsychoHack"
          width={140}
          height={73}
          className="h-9 w-auto md:h-11"
          priority
          unoptimized
        />
        <span className="sr-only">{copy.brand}</span>
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
