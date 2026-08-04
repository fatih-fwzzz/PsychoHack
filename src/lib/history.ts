import type { TestResult } from "./types";

export const HISTORY_KEY = "psychohack_history";

export function loadHistory(): TestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TestResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function notifyHistoryChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("psychohack-history"));
}

export function saveHistory(entries: TestResult[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  notifyHistoryChanged();
}

export function appendHistory(entry: TestResult): TestResult[] {
  const next = [entry, ...loadHistory()].slice(0, 50);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
  notifyHistoryChanged();
}
