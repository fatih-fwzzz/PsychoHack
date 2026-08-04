"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { ClientOnly } from "@/components/ClientOnly";
import { useAppStore } from "@/store/useAppStore";
import { t } from "@/lib/i18n";
import { ArrowRight, Zap } from "lucide-react";

function Landing() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-atmosphere" aria-hidden />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-3xl opacity-40 md:opacity-70"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(60,230,192,0.2),transparent_55%)]" />
        <div className="absolute right-[-10%] top-[18%] h-[420px] w-[420px] rounded-full border border-[var(--line)]" />
        <div className="absolute right-[8%] top-[28%] h-[280px] w-[280px] rounded-full border border-[var(--accent)]/30" />
        <div className="absolute bottom-[18%] right-[18%] font-display text-[9rem] font-extrabold leading-none text-[var(--accent)]/10 md:text-[12rem]">
          12:00
        </div>
      </div>

      <Header />

      <main className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-20 pt-8 md:px-8 md:pb-28">
        <div className="max-w-2xl">
          <p className="animate-rise inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
            <Zap className="h-4 w-4" aria-hidden />
            Perceptual Speed
          </p>
          <h1 className="animate-rise-delay font-display mt-4 text-5xl font-extrabold leading-[0.95] tracking-tight text-[var(--ink)] md:text-7xl">
            {copy.brand}
          </h1>
          <p className="animate-rise-delay mt-4 font-display text-xl font-semibold text-[var(--ink)] md:text-2xl">
            {copy.tagline}
          </p>
          <p className="animate-rise-delay-2 mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {copy.heroSubtitle}
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="cta-pulse inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--bg-deep)] transition hover:brightness-110"
            >
              {copy.ctaStart}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center rounded-xl border border-[var(--line)] px-5 py-3 font-medium text-[var(--ink)] transition hover:border-[var(--accent)]/50 hover:bg-[var(--bg-elevated)]"
            >
              {copy.ctaHistory}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ClientOnly>
      <Landing />
    </ClientOnly>
  );
}
