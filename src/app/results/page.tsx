"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ClientOnly } from "@/components/ClientOnly";
import { useAppStore } from "@/store/useAppStore";
import { useTestStore } from "@/store/useTestStore";
import { t } from "@/lib/i18n";
import { accuracyPercent, formatDuration } from "@/lib/scoring";
import { formatSequence, type QuestionType } from "@/lib/types";

const TYPES: QuestionType[] = ["BUS_TIMES", "HOUSE_CODES", "NAME_SORTING"];

function Results() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);
  const router = useRouter();
  const result = useTestStore((s) => s.result);
  const questions = useTestStore((s) => s.questions);
  const status = useTestStore((s) => s.status);

  useEffect(() => {
    if (status !== "finished" || !result) {
      router.replace("/dashboard");
    }
  }, [status, result, router]);

  if (!result) return <div className="min-h-screen" />;

  const pct = accuracyPercent(result.correct, result.total);
  const missed = result.answers.filter((a) => !a.isCorrect);
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const sourceLabel =
    result.source === "gemini"
      ? copy.sourceGemini
      : result.source === "hybrid"
        ? copy.sourceHybrid
        : copy.sourceDeterministic;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-4 md:px-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {copy.resultsTitle}
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">
          {pct}%
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {copy.modeLabel(result.mode)} · {sourceLabel}
        </p>

        {result.timedOut && (
          <p className="mt-4 rounded-lg border border-[var(--warn)]/40 bg-[var(--warn)]/10 px-3 py-2 text-sm text-[var(--warn)]">
            {copy.timedOut}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label={copy.correct} value={`${result.correct}/${result.total}`} />
          <Stat label={copy.unanswered} value={String(result.unanswered)} />
          <Stat label={copy.accuracy} value={`${pct}%`} />
          <Stat label={copy.timeUsed} value={formatDuration(result.durationMs)} />
        </div>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">{copy.byType}</h2>
          <div className="mt-3 grid gap-2">
            {TYPES.map((type) => {
              const b = result.byType[type];
              return (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-3 text-sm"
                >
                  <span>{copy.types[type]}</span>
                  <span className="tabular-nums text-[var(--accent)]">
                    {b.correct}/{b.total}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">
            {copy.reviewWrong}
          </h2>
          {missed.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">{copy.noMisses}</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {missed.map((a) => {
                const q = questionMap.get(a.questionId);
                if (!q) return null;
                return (
                  <li
                    key={a.questionId}
                    className="rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)]/70 p-4"
                  >
                    <p className="text-xs text-[var(--accent)]">
                      {copy.types[q.type]}
                    </p>
                    <p className="mt-1 font-medium">{q.direction}</p>
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      {copy.yourAnswer}:{" "}
                      <span className="font-mono text-[var(--danger)]">
                        {a.selectedSequence
                          ? formatSequence(a.selectedSequence)
                          : copy.noAnswer}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {copy.correctAnswer}:{" "}
                      <span className="font-mono text-[var(--ok)]">
                        {formatSequence(a.correctSequence)}
                      </span>
                    </p>
                    {q.explanation && (
                      <p className="mt-2 text-sm text-[var(--ink)]">
                        <span className="text-[var(--muted)]">
                          {copy.explanation}:{" "}
                        </span>
                        {q.explanation}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--bg-deep)]"
          >
            {copy.tryAgain}
          </Link>
          <Link
            href="/history"
            className="rounded-xl border border-[var(--line)] px-5 py-3 font-medium"
          >
            {copy.navHistory}
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
        {label}
      </p>
      <p className="font-display mt-1 text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <ClientOnly>
      <Results />
    </ClientOnly>
  );
}
