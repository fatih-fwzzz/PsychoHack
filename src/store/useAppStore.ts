"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/types";

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: "id",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "id" ? "en" : "id" }),
    }),
    { name: "psychohack_prefs" },
  ),
);
