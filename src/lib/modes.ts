import type { TestMode } from "./types";

/** Full exam: 77 Q / 12 min ≈ 9.35s per question; drills scale the same pace. */
const SECONDS_PER_QUESTION = (12 * 60) / 77;

export function questionCount(mode: TestMode): number {
  return mode === "full" ? 77 : mode;
}

export function timeLimitMs(mode: TestMode): number {
  if (mode === "full") return 12 * 60 * 1000;
  return Math.round(questionCount(mode) * SECONDS_PER_QUESTION * 1000);
}

export const DRILL_SIZES: Array<10 | 25 | 50> = [10, 25, 50];
