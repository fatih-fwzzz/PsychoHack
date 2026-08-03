export type Lang = "id" | "en";

export type QuestionType = "BUS_TIMES" | "HOUSE_CODES" | "NAME_SORTING";

export type OptionId = "A" | "B" | "C" | "D";

export type TestMode = "full" | 10 | 25 | 50;

export interface QuestionOption {
  id: OptionId;
  sequence: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  direction: string;
  itemsToDisplay: string[];
  options: QuestionOption[];
  correctOptionId: OptionId;
  explanation?: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: OptionId | null;
  correctOptionId: OptionId;
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
