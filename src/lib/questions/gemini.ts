import { GoogleGenAI, Type } from "@google/genai";
import type { Lang, Question } from "../types";
import { repairQuestion } from "./deterministic";

const CHUNK = 20;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

async function generateChunk(
  ai: GoogleGenAI,
  count: number,
  lang: Lang,
): Promise<Question[]> {
  const isEn = lang === "en";
  const prompt = isEn
    ? `Generate ${count} Perceptual Speed Test practice questions in English.`
    : `Generate ${count} Perceptual Speed Test practice questions in Indonesian (Bahasa Indonesia).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}
Include an even mix of:
1. BUS_TIMES (5 times HH:MM, sorted earliest to latest or latest to earliest)
2. HOUSE_CODES (5 codes like A-09, B-05, ascending or descending)
3. NAME_SORTING (5 names with distractors: near-identical prefixes like Anisa/Annisa/Anita, or shared base names like Ari/Aria/Arif).

Return 4 choices (A, B, C, D) per question where ONLY ONE is correctly sorted.
Each itemsToDisplay must contain the same 5 items used across the options (permuted).
direction must clearly state sort direction.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: {
              type: Type.STRING,
              enum: ["BUS_TIMES", "HOUSE_CODES", "NAME_SORTING"],
            },
            direction: { type: Type.STRING },
            itemsToDisplay: { type: Type.ARRAY, items: { type: Type.STRING } },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, enum: ["A", "B", "C", "D"] },
                  sequence: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "sequence"],
              },
            },
            correctOptionId: {
              type: Type.STRING,
              enum: ["A", "B", "C", "D"],
            },
            explanation: { type: Type.STRING },
          },
          required: [
            "id",
            "type",
            "direction",
            "itemsToDisplay",
            "options",
            "correctOptionId",
          ],
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];
  const parsed = JSON.parse(text) as Partial<Question>[];
  if (!Array.isArray(parsed)) return [];

  const seed = Date.now();
  return parsed
    .map((raw, i) => repairQuestion(raw, lang, i, seed))
    .filter((q): q is Question => q !== null);
}

export async function generateWithGemini(
  count: number,
  lang: Lang,
): Promise<Question[] | null> {
  const ai = getClient();
  if (!ai) return null;

  const all: Question[] = [];
  let remaining = count;

  while (remaining > 0) {
    const size = Math.min(CHUNK, remaining);
    const chunk = await generateChunk(ai, size, lang);
    if (chunk.length === 0) break;
    all.push(...chunk);
    remaining -= chunk.length;
    if (chunk.length < size) break;
  }

  return all.length > 0 ? all.slice(0, count) : null;
}
