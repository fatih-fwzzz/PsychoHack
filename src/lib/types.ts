export type Lang = "id" | "en";

export type QuestionType = "BUS_TIMES" | "HOUSE_CODES" | "NAME_SORTING";

export type TestMode = "full" | 10 | 25 | 50;

export interface Question {
  id: string;
  type: QuestionType;
  direction: string;
  /** Shuffled items shown for click-to-rank answering. */
  itemsToDisplay: string[];
  /** Correct ranked order for scoring. */
  correctSequence: string[];
  explanation?: string;
}

export interface AnswerRecord {
  questionId: string;
  /** User's click order; null if unanswered / incomplete on timeout. */
  selectedSequence: string[] | null;
  correctSequence: string[];
  type: QuestionType;
  isCorrect: boolean;
  responseMs: number;
}

export interface TypeBreakdown {
  correct: number;
  total: number;
}

export interface TestResult {
  id: string;
  date: string;
  mode: TestMode;
  lang: Lang;
  total: number;
  correct: number;
  unanswered: number;
  durationMs: number;
  timeLimitMs: number;
  timedOut: boolean;
  byType: Record<QuestionType, TypeBreakdown>;
  answers: AnswerRecord[];
  source: "gemini" | "deterministic" | "hybrid";
}

export interface GenerateQuestionsRequest {
  count: number;
  lang: Lang;
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  source: "gemini" | "deterministic" | "hybrid";
}

export function sequencesEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function formatSequence(seq: string[] | null | undefined): string {
  if (!seq || seq.length === 0) return "";
  return seq.join(" → ");
}
