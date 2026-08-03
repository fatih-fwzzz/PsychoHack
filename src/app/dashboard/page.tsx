"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { ComingSoonGrid } from "@/components/ComingSoonGrid";
import { ClientOnly } from "@/components/ClientOnly";
import { useAppStore } from "@/store/useAppStore";
import { useTestStore } from "@/store/useTestStore";
import { t } from "@/lib/i18n";
import { DRILL_SIZES, questionCount } from "@/lib/modes";
import type { GenerateQuestionsResponse, TestMode } from "@/lib/types";
import { Loader2 } from "lucide-react";

function Dashboard() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);
  const startSession = useTestStore((s) => s.startSession);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function start(mode: TestMode) {
    setLoading(true);
    setError(null);
    setHint(null);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: questionCount(mode), lang }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = (await res.json()) as GenerateQuestionsResponse;
      if (!data.questions?.length) throw new Error("empty");
      if (data.source !== "gemini") setHint(copy.usingFallback);
      startSession({
        mode,
        questions: data.questions,
        source: data.source,
        lang,
      });
      router.push("/test");
    } catch {
      setError(copy.generateError);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 pb-16 pt-4 md:px-8">
        <DisclaimerBanner />

        <div className="mt-8 animate-rise">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            {copy.dashboardTitle}
          </h1>
          <p className="mt-2 text-[var(--muted)]">{copy.dashboardSubtitle}</p>
        </div>

        <section className="animate-rise-delay mt-8 rounded-2xl border border-[var(--accent)]/35 bg-[var(--bg-elevated)]/70 p-5 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
            Active
          </p>
          <h2 className="font-display mt-2 text-2xl font-bold">
            {copy.activeModule}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] md:text-base">
            {copy.activeModuleDesc}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => start("full")}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-left transition hover:border-[var(--accent)] disabled:opacity-60"
            >
              <p className="font-display font-semibold">{copy.modeFull}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {copy.modeFullMeta}
              </p>
            </button>

            {DRILL_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                disabled={loading}
                onClick={() => start(size)}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-left transition hover:border-[var(--accent)] disabled:opacity-60"
              >
                <p className="font-display font-semibold">
                  {copy.modeDrill} · {size}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {size} {copy.questionsLabel}
                </p>
              </button>
            ))}
          </div>

          {loading && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.generating}
            </p>
          )}
          {error && <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>}
          {hint && !error && (
            <p className="mt-4 text-sm text-[var(--warn)]">{hint}</p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">
            {copy.comingSoon}
          </h2>
          <div className="mt-4">
            <ComingSoonGrid />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly>
      <Dashboard />
    </ClientOnly>
  );
}
