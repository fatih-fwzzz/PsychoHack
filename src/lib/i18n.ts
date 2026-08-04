import type { Lang, QuestionType, TestMode } from "./types";

export const DISCLAIMER = {
  en: "Disclaimer: Questions are dynamically generated using AI for practice purposes and are not official company assessment items.",
  id: "Pemberitahuan: Soal dibuat secara otomatis menggunakan AI untuk tujuan latihan dan bukan merupakan soal resmi dari lembaga atau perusahaan manapun.",
} as const;

const en = {
  brand: "PsychoHack",
  tagline: "Outsmart the clock. Secure the offer.",
  heroSubtitle:
    "Sharpen your cognitive tempo, boost visual accuracy, and execute flawlessly under tight timers.",
  ctaStart: "Start practicing",
  ctaHistory: "View history",
  navDashboard: "Dashboard",
  navHistory: "History",
  navHome: "Home",
  language: "Language",
  dashboardTitle: "Assessment modules",
  dashboardSubtitle: "Pick a drill length or sit the full perceptual speed exam.",
  activeModule: "Perceptual Speed Test",
  activeModuleDesc:
    "Sort bus times, house codes, and near-identical names under pressure. Answers lock the moment you click.",
  comingSoon: "Coming soon",
  modeFull: "Full exam",
  modeFullMeta: "77 questions · 12 minutes",
  modeDrill: "Category drill",
  questionsLabel: "questions",
  startTest: "Generate & start",
  generating: "Generating questions…",
  generateError: "Could not prepare questions. Try again.",
  usingFallback: "Using offline question generator",
  timer: "Time left",
  progress: "Question",
  of: "of",
  lockHint: "Selection locks instantly — no undo.",
  resultsTitle: "Results",
  score: "Score",
  correct: "Correct",
  unanswered: "Unanswered",
  accuracy: "Accuracy",
  timeUsed: "Time used",
  timedOut: "Time expired — unanswered items counted as incorrect.",
  byType: "Breakdown by type",
  reviewWrong: "Missed questions",
  noMisses: "Perfect run — nothing to review.",
  explanation: "Explanation",
  yourAnswer: "Your answer",
  correctAnswer: "Correct answer",
  noAnswer: "No answer",
  tryAgain: "Practice again",
  backDashboard: "Back to dashboard",
  historyTitle: "Practice history",
  historyEmpty: "No attempts yet. Finish a drill to see trends here.",
  historyChart: "Accuracy over time",
  clearHistory: "Clear history",
  date: "Date",
  mode: "Mode",
  source: "Source",
  sourceGemini: "Gemini",
  sourceDeterministic: "Offline",
  sourceHybrid: "Hybrid",
  modules: {
    verbal: "Cognitive Ability: Verbal Reasoning",
    quantitative: "Cognitive Ability: Quantitative & Numerical",
    logical: "Cognitive Ability: Logical Reasoning",
    big5: "Big 5 Personality Test Simulation",
    workValues: "Work Values & Cultural Fit Assessment",
  } as Record<string, string>,
  types: {
    BUS_TIMES: "Bus departure times",
    HOUSE_CODES: "House codes",
    NAME_SORTING: "Alphabetical names",
  } as Record<QuestionType, string>,
  modeLabel: (mode: TestMode) =>
    mode === "full" ? "Full exam (77)" : `Drill (${mode})`,
};

const id: typeof en = {
  brand: "PsychoHack",
  tagline: "Kalahkan waktu. Amankan tawaran.",
  heroSubtitle:
    "Asah tempo kognitif, tingkatkan ketelitian visual, dan eksekusi sempurna di bawah timer ketat.",
  ctaStart: "Mulai latihan",
  ctaHistory: "Lihat riwayat",
  navDashboard: "Dasbor",
  navHistory: "Riwayat",
  navHome: "Beranda",
  language: "Bahasa",
  dashboardTitle: "Modul asesmen",
  dashboardSubtitle:
    "Pilih panjang drill atau kerjakan ujian penuh perceptual speed.",
  activeModule: "Tes Kecepatan Persepsi",
  activeModuleDesc:
    "Urutkan jadwal bus, kode rumah, dan nama mirip di bawah tekanan. Jawaban terkunci saat diklik.",
  comingSoon: "Segera hadir",
  modeFull: "Ujian penuh",
  modeFullMeta: "77 soal · 12 menit",
  modeDrill: "Drill kategori",
  questionsLabel: "soal",
  startTest: "Generate & mulai",
  generating: "Menyiapkan soal…",
  generateError: "Gagal menyiapkan soal. Coba lagi.",
  usingFallback: "Menggunakan generator soal offline",
  timer: "Sisa waktu",
  progress: "Soal",
  of: "dari",
  lockHint: "Pilihan terkunci langsung — tidak bisa diubah.",
  resultsTitle: "Hasil",
  score: "Skor",
  correct: "Benar",
  unanswered: "Tidak dijawab",
  accuracy: "Akurasi",
  timeUsed: "Waktu terpakai",
  timedOut: "Waktu habis — soal kosong dihitung salah.",
  byType: "Rincian per tipe",
  reviewWrong: "Soal yang terlewat",
  noMisses: "Sempurna — tidak ada yang perlu ditinjau.",
  explanation: "Penjelasan",
  yourAnswer: "Jawaban Anda",
  correctAnswer: "Jawaban benar",
  noAnswer: "Tidak dijawab",
  tryAgain: "Latihan lagi",
  backDashboard: "Kembali ke dasbor",
  historyTitle: "Riwayat latihan",
  historyEmpty: "Belum ada percobaan. Selesaikan drill untuk melihat tren.",
  historyChart: "Akurasi dari waktu ke waktu",
  clearHistory: "Hapus riwayat",
  date: "Tanggal",
  mode: "Mode",
  source: "Sumber",
  sourceGemini: "Gemini",
  sourceDeterministic: "Offline",
  sourceHybrid: "Hybrid",
  modules: {
    verbal: "Kemampuan Kognitif: Penalaran Verbal",
    quantitative: "Kemampuan Kognitif: Penalaran Kuantitatif",
    logical: "Kemampuan Kognitif: Penalaran Logika",
    big5: "Simulasi Inventori Kepribadian Big 5",
    workValues: "Work Values & Cultural Fit",
  },
  types: {
    BUS_TIMES: "Jadwal keberangkatan bus",
    HOUSE_CODES: "Nomor dan abjad rumah",
    NAME_SORTING: "Urutan nama sesuai abjad",
  },
  modeLabel: (mode: TestMode) =>
    mode === "full" ? "Ujian penuh (77)" : `Drill (${mode})`,
};

export type Dictionary = typeof en;

export function t(lang: Lang): Dictionary {
  return lang === "en" ? en : id;
}

export function directionLabel(
  lang: Lang,
  type: QuestionType,
  ascending: boolean,
): string {
  if (lang === "en") {
    if (type === "BUS_TIMES") {
      return ascending
        ? "Sort from earliest to latest"
        : "Sort from latest to earliest";
    }
    if (type === "HOUSE_CODES") {
      return ascending ? "Sort ascending" : "Sort descending";
    }
    return ascending ? "Sort from A to Z" : "Sort from Z to A";
  }

  if (type === "BUS_TIMES") {
    return ascending
      ? "Urutkan dari paling awal ke paling akhir"
      : "Urutkan dari paling akhir ke paling awal";
  }
  if (type === "HOUSE_CODES") {
    return ascending ? "Urutkan menaik" : "Urutkan menurun";
  }
  return ascending ? "Urutkan dari A ke Z" : "Urutkan dari Z ke A";
}
