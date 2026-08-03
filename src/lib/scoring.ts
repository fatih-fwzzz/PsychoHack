import type {
  AnswerRecord,
  Lang,
  Question,
  QuestionType,
  TestMode,
  TestResult,
  TypeBreakdown,
} from "./types";

function emptyBreakdown(): Record<QuestionType, TypeBreakdown> {
  return {
    BUS_TIMES: { correct: 0, total: 0 },
    HOUSE_CODES: { correct: 0, total: 0 },
    NAME_SORTING: { correct: 0, total: 0 },
  };
}

export function buildResult(input: {
  questions: Question[];
  answers: AnswerRecord[];
  mode: TestMode;
  lang: Lang;
  durationMs: number;
  timeLimitMs: number;
  timedOut: boolean;
  source: TestResult["source"];
}): TestResult {
  const byType = emptyBreakdown();
  for (const q of input.questions) {
    byType[q.type].total += 1;
  }

  let correct = 0;
  let unanswered = 0;
  for (const a of input.answers) {
    if (a.selectedOptionId === null) unanswered += 1;
    if (a.isCorrect) {
      correct += 1;
      byType[a.type].correct += 1;
    }
  }

  return {
    id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    mode: input.mode,
    lang: input.lang,
    total: input.questions.length,
    correct,
    unanswered,
    durationMs: input.durationMs,
    timeLimitMs: input.timeLimitMs,
    timedOut: input.timedOut,
    byType,
    answers: input.answers,
    source: input.source,
  };
}

export function accuracyPercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 1000) / 10;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
