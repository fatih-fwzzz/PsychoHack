import type { Lang, OptionId, Question, QuestionOption, QuestionType } from "../types";
import { directionLabel } from "../i18n";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function seqEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function uniqueTimes(rand: () => number, count: number): string[] {
  const set = new Set<string>();
  while (set.size < count) {
    const h = Math.floor(rand() * 18) + 5;
    const m = Math.floor(rand() * 12) * 5;
    set.add(`${pad2(h)}:${pad2(m)}`);
  }
  return [...set];
}

function uniqueHouseCodes(rand: () => number, count: number): string[] {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const set = new Set<string>();
  while (set.size < count) {
    const letter = letters[Math.floor(rand() * letters.length)]!;
    const num = pad2(Math.floor(rand() * 40) + 1);
    set.add(`${letter}-${num}`);
  }
  return [...set];
}

const NAME_POOL_EN = [
  ["Anisa", "Annisa", "Anita", "Anissa", "Anindya"],
  ["Ari", "Aria", "Arif", "Ario", "Arin"],
  ["Budi", "Budiman", "Budiono", "Budhi", "Budiarto"],
  ["Dian", "Diana", "Diane", "Diani", "Diandra"],
  ["Rina", "Rini", "Rinda", "Rinna", "Rinah"],
  ["Sari", "Sarita", "Sarina", "Sarinah", "Sarika"],
];

const NAME_POOL_ID = [
  ["Anisa", "Annisa", "Anita", "Anissa", "Anindya"],
  ["Ari", "Aria", "Arif", "Ario", "Arin"],
  ["Budi", "Budiman", "Budiono", "Budhi", "Budiarto"],
  ["Dewi", "Dewita", "Dewina", "Dewanti", "Dewara"],
  ["Putri", "Putra", "Putria", "Putriani", "Putrika"],
  ["Wahyu", "Wahyudi", "Wahyuningsih", "Wahyuni", "Wahya"],
];

function uniqueNames(lang: Lang, rand: () => number, count: number): string[] {
  const pool = lang === "en" ? NAME_POOL_EN : NAME_POOL_ID;
  const group = pick(pool, rand);
  return shuffle(group, rand).slice(0, count);
}

export function sortItems(
  type: QuestionType,
  items: string[],
  ascending: boolean,
): string[] {
  const sorted = [...items].sort((a, b) => {
    if (type === "BUS_TIMES") return a.localeCompare(b);
    if (type === "HOUSE_CODES") {
      const [la, na] = a.split("-");
      const [lb, nb] = b.split("-");
      if (la !== lb) return (la ?? "").localeCompare(lb ?? "");
      return Number(na) - Number(nb);
    }
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });
  return ascending ? sorted : sorted.reverse();
}

function wrongPermutation(
  correct: string[],
  rand: () => number,
  used: Set<string>,
): string[] {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const candidate = shuffle(correct, rand);
    const key = candidate.join("|");
    if (key !== correct.join("|") && !used.has(key)) {
      used.add(key);
      return candidate;
    }
  }
  const fallback = [...correct];
  if (fallback.length >= 2) {
    [fallback[0], fallback[1]] = [fallback[1]!, fallback[0]!];
  }
  used.add(fallback.join("|"));
  return fallback;
}

export function buildOptions(
  correctSequence: string[],
  rand: () => number,
): { options: QuestionOption[]; correctOptionId: OptionId } {
  const ids: OptionId[] = ["A", "B", "C", "D"];
  const used = new Set<string>([correctSequence.join("|")]);
  const sequences = [
    correctSequence,
    wrongPermutation(correctSequence, rand, used),
    wrongPermutation(correctSequence, rand, used),
    wrongPermutation(correctSequence, rand, used),
  ];
  const shuffledIds = shuffle(ids, rand);
  const options: QuestionOption[] = shuffledIds.map((id, i) => ({
    id,
    sequence: sequences[i]!,
  }));
  const correctOptionId = shuffledIds[0]!;
  options.sort((a, b) => a.id.localeCompare(b.id));
  return { options, correctOptionId };
}

export function explanationFor(
  lang: Lang,
  type: QuestionType,
  ascending: boolean,
  correct: string[],
): string {
  const dir = directionLabel(lang, type, ascending);
  if (lang === "en") {
    return `${dir}. Correct order: ${correct.join(" → ")}.`;
  }
  return `${dir}. Urutan benar: ${correct.join(" → ")}.`;
}

const TYPES: QuestionType[] = ["BUS_TIMES", "HOUSE_CODES", "NAME_SORTING"];

export function generateDeterministicQuestions(
  count: number,
  lang: Lang,
  seed = Date.now(),
): Question[] {
  const rand = mulberry32(seed);
  const questions: Question[] = [];

  for (let i = 0; i < count; i += 1) {
    const type = TYPES[i % TYPES.length]!;
    const ascending = rand() > 0.5;
    let items: string[];
    if (type === "BUS_TIMES") items = uniqueTimes(rand, 5);
    else if (type === "HOUSE_CODES") items = uniqueHouseCodes(rand, 5);
    else items = uniqueNames(lang, rand, 5);

    const correct = sortItems(type, items, ascending);
    const { options, correctOptionId } = buildOptions(correct, rand);

    questions.push({
      id: `q_${seed}_${i}`,
      type,
      direction: directionLabel(lang, type, ascending),
      itemsToDisplay: shuffle(items, rand),
      options,
      correctOptionId,
      explanation: explanationFor(lang, type, ascending, correct),
    });
  }

  return questions;
}

export function isAscendingDirection(direction: string): boolean {
  const d = direction.toLowerCase();
  if (
    d.includes("z to a") ||
    d.includes("z ke a") ||
    d.includes("latest to earliest") ||
    d.includes("paling akhir ke paling awal") ||
    d.includes("descending") ||
    d.includes("menurun")
  ) {
    return false;
  }
  return true;
}

/** Recompute the correct option from items; rebuild options if AI options are invalid. */
export function repairQuestion(
  raw: Partial<Question>,
  lang: Lang,
  index: number,
  seed: number,
): Question | null {
  const type = raw.type;
  if (!type || !TYPES.includes(type)) return null;

  const ascending = isAscendingDirection(raw.direction || "");
  const items =
    raw.itemsToDisplay?.length === 5
      ? raw.itemsToDisplay
      : raw.options?.[0]?.sequence;

  if (!items || items.length < 4) return null;

  const sliced = items.slice(0, 5);
  while (sliced.length < 5) sliced.push(`${sliced[0]}-x`);

  const correct = sortItems(type, sliced, ascending);
  const rand = mulberry32(seed + index * 97);

  let options = raw.options?.filter(
    (o) => o?.id && o.sequence?.length === sliced.length,
  ) as QuestionOption[] | undefined;

  let correctOptionId: OptionId | undefined = options?.find((opt) =>
    seqEqual(opt.sequence, correct),
  )?.id;

  if (!options || options.length !== 4 || !correctOptionId) {
    const built = buildOptions(correct, rand);
    options = built.options;
    correctOptionId = built.correctOptionId;
  }

  return {
    id: raw.id || `gemini_${seed}_${index}`,
    type,
    direction: raw.direction || directionLabel(lang, type, ascending),
    itemsToDisplay: sliced,
    options,
    correctOptionId,
    explanation:
      raw.explanation || explanationFor(lang, type, ascending, correct),
  };
}
