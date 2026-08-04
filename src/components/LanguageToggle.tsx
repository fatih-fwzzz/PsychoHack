"use client";

import { useAppStore } from "@/store/useAppStore";

export function LanguageToggle() {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] p-1 text-sm"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        className={`rounded-md px-2.5 py-1 transition ${
          lang === "id"
            ? "bg-[var(--accent)] text-[var(--bg-deep)] font-semibold"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-md px-2.5 py-1 transition ${
          lang === "en"
            ? "bg-[var(--accent)] text-[var(--bg-deep)] font-semibold"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
