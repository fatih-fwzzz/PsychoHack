import { NextResponse } from "next/server";
import { generateDeterministicQuestions } from "@/lib/questions/deterministic";
import { generateWithGemini } from "@/lib/questions/gemini";
import type { GenerateQuestionsResponse, Lang } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { count?: number; lang?: Lang };
    const count = Math.min(Math.max(Number(body.count) || 25, 1), 77);
    const lang: Lang = body.lang === "en" ? "en" : "id";

    let source: GenerateQuestionsResponse["source"] = "deterministic";
    let questions = generateDeterministicQuestions(count, lang);

    try {
      const gemini = await generateWithGemini(count, lang);
      if (gemini && gemini.length > 0) {
        if (gemini.length >= count) {
          questions = gemini.slice(0, count);
          source = "gemini";
        } else {
          const fill = generateDeterministicQuestions(
            count - gemini.length,
            lang,
            Date.now() + 1,
          );
          questions = [...gemini, ...fill].slice(0, count);
          source = "hybrid";
        }
      }
    } catch (err) {
      console.error("Gemini generation failed, using deterministic fallback", err);
      source = "deterministic";
      questions = generateDeterministicQuestions(count, lang);
    }

    const payload: GenerateQuestionsResponse = { questions, source };
    return NextResponse.json(payload);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 },
    );
  }
}
