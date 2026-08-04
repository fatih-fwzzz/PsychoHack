"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ScoreChart } from "@/components/ScoreChart";
import { ClientOnly } from "@/components/ClientOnly";
import { clearHistory, HISTORY_KEY } from "@/lib/history";
import { accuracyPercent, formatDuration } from "@/lib/scoring";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("psychohack-history", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("psychohack-history", onStoreChange);
  };
}

function getHistorySnapshot() {
  return localStorage.getItem(HISTORY_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function History() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);
  const raw = useSyncExternalStore(
    subscribe,
    getHistorySnapshot,
    getServerSnapshot,
  );
  const entries = (() => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const onClear = useCallback(() => {
    clearHistory();
    window.dispatchEvent(new Event("psychohack-history"));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-5 pb-16 pt-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              {copy.historyTitle}
            </h1>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--danger)] hover:underline"
            >
              {copy.clearHistory}
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-[var(--line)] px-5 py-12 text-center">
            <p className="text-[var(--muted)]">{copy.historyEmpty}</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-[var(--accent)] hover:underline"
            >
              {copy.ctaStart}
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <ScoreChart history={entries} />
            </div>
            <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--line)]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-[var(--bg-elevated)] text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">{copy.date}</th>
                    <th className="px-4 py-3 font-medium">{copy.mode}</th>
                    <th className="px-4 py-3 font-medium">{copy.accuracy}</th>
                    <th className="px-4 py-3 font-medium">{copy.timeUsed}</th>
                    <th className="px-4 py-3 font-medium">{copy.source}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-t border-[var(--line)]">
                      <td className="px-4 py-3 tabular-nums">
                        {new Date(e.date).toLocaleString(
                          lang === "id" ? "id-ID" : "en-US",
                        )}
                      </td>
                      <td className="px-4 py-3">{copy.modeLabel(e.mode)}</td>
                      <td className="px-4 py-3 tabular-nums text-[var(--accent)]">
                        {accuracyPercent(e.correct, e.total)}% ({e.correct}/
                        {e.total})
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {formatDuration(e.durationMs)}
                      </td>
                      <td className="px-4 py-3">
                        {e.source === "gemini"
                          ? copy.sourceGemini
                          : e.source === "hybrid"
                            ? copy.sourceHybrid
                            : copy.sourceDeterministic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ClientOnly>
      <History />
    </ClientOnly>
  );
}
