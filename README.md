# PsychoHack

Outsmart the clock. Secure the offer.

AI-assisted practice for high-speed perceptual speed assessments (Talentics-style mechanics). Bilingual ID/EN. Questions are generated via Gemini when `GEMINI_API_KEY` is set, otherwise a deterministic offline generator is used.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Zustand (language + test session)
- Recharts (history accuracy)
- `@google/genai` (`gemini-2.5-flash`) with server-side answer repair

## Setup

```bash
npm install
cp .env.example .env.local
# optional: add GEMINI_API_KEY from Google AI Studio
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/dashboard` | Start full exam (77/12m) or drills (10/25/50) |
| `/test` | Timed click-to-rank runner (assign 1, 2, 3…) |
| `/results` | Score, type breakdown, missed review |
| `/history` | `localStorage` history + accuracy chart |
| `/api/generate-questions` | Batch question generation |

## Notes

- Correct sequences are **computed/validated server-side** — Gemini labels are not trusted blindly.
- Answer by clicking unordered items in order; each click assigns the next rank and locks.
- Full exam generation without Gemini is instant via the offline bank; with Gemini, questions are fetched in chunks of 20.
- History key: `psychohack_history`.
