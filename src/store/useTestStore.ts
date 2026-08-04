"use client";

import { create } from "zustand";
import type { AnswerRecord, Lang, Question, TestMode, TestResult } from "@/lib/types";
import { sequencesEqual } from "@/lib/types";
import { buildResult } from "@/lib/scoring";
import { appendHistory } from "@/lib/history";
import { timeLimitMs } from "@/lib/modes";

interface TestState {
  mode: TestMode | null;
  questions: Question[];
  index: number;
  answers: AnswerRecord[];
  startedAt: number | null;
  endsAt: number | null;
  source: TestResult["source"] | null;
  result: TestResult | null;
  questionStartedAt: number | null;
  status: "idle" | "ready" | "running" | "finished";
  startSession: (input: {
    mode: TestMode;
    questions: Question[];
    source: TestResult["source"];
    lang: Lang;
  }) => void;
  /** Submit a completed click-rank sequence for the current question. */
  submitRanking: (selectedSequence: string[]) => void;
  finish: (timedOut: boolean, lang: Lang) => TestResult | null;
  reset: () => void;
}

function unansweredForRest(
  questions: Question[],
  fromIndex: number,
  answers: AnswerRecord[],
): AnswerRecord[] {
  const answeredIds = new Set(answers.map((a) => a.questionId));
  const extra: AnswerRecord[] = [];
  for (let i = fromIndex; i < questions.length; i += 1) {
    const q = questions[i]!;
    if (answeredIds.has(q.id)) continue;
    extra.push({
      questionId: q.id,
      selectedSequence: null,
      correctSequence: q.correctSequence,
      type: q.type,
      isCorrect: false,
      responseMs: 0,
    });
  }
  return extra;
}

export const useTestStore = create<TestState>((set, get) => ({
  mode: null,
  questions: [],
  index: 0,
  answers: [],
  startedAt: null,
  endsAt: null,
  source: null,
  result: null,
  questionStartedAt: null,
  status: "idle",

  startSession: ({ mode, questions, source }) => {
    const now = Date.now();
    set({
      mode,
      questions,
      index: 0,
      answers: [],
      startedAt: now,
      endsAt: now + timeLimitMs(mode),
      source,
      result: null,
      questionStartedAt: now,
      status: "running",
    });
  },

  submitRanking: (selectedSequence) => {
    const state = get();
    if (state.status !== "running") return;
    const q = state.questions[state.index];
    if (!q) return;

    const now = Date.now();
    const responseMs = state.questionStartedAt
      ? now - state.questionStartedAt
      : 0;

    const answer: AnswerRecord = {
      questionId: q.id,
      selectedSequence,
      correctSequence: q.correctSequence,
      type: q.type,
      isCorrect: sequencesEqual(selectedSequence, q.correctSequence),
      responseMs,
    };

    const answers = [...state.answers, answer];
    const nextIndex = state.index + 1;

    if (nextIndex >= state.questions.length) {
      set({ answers, index: nextIndex, questionStartedAt: null });
      return;
    }

    set({
      answers,
      index: nextIndex,
      questionStartedAt: now,
    });
  },

  finish: (timedOut, lang) => {
    const state = get();
    if (!state.mode || !state.startedAt || !state.source) return null;
    if (state.status === "finished" && state.result) return state.result;

    const now = Date.now();
    const answers = [
      ...state.answers,
      ...unansweredForRest(state.questions, state.index, state.answers),
    ];

    const result = buildResult({
      questions: state.questions,
      answers,
      mode: state.mode,
      lang,
      durationMs: Math.min(
        now - state.startedAt,
        state.endsAt ? state.endsAt - state.startedAt : now - state.startedAt,
      ),
      timeLimitMs: timeLimitMs(state.mode),
      timedOut,
      source: state.source,
    });

    appendHistory(result);
    set({ answers, result, status: "finished", questionStartedAt: null });
    return result;
  },

  reset: () =>
    set({
      mode: null,
      questions: [],
      index: 0,
      answers: [],
      startedAt: null,
      endsAt: null,
      source: null,
      result: null,
      questionStartedAt: null,
      status: "idle",
    }),
}));
