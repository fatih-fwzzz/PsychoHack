"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Timer } from "@/components/Timer";
import { QuestionCard } from "@/components/QuestionCard";
import { ClientOnly } from "@/components/ClientOnly";
import { useAppStore } from "@/store/useAppStore";
import { useTestStore } from "@/store/useTestStore";
import { t } from "@/lib/i18n";
import type { OptionId } from "@/lib/types";

function TestRunner() {
  const lang = useAppStore((s) => s.lang);
  const copy = t(lang);
  const router = useRouter();
  const status = useTestStore((s) => s.status);
  const questions = useTestStore((s) => s.questions);
  const index = useTestStore((s) => s.index);
  const endsAt = useTestStore((s) => s.endsAt);
  const selectOption = useTestStore((s) => s.selectOption);
  const finish = useTestStore((s) => s.finish);

  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (status !== "running") {
      if (status === "idle") router.replace("/dashboard");
      return;
    }

    const tick = () => {
      if (!endsAt) return;
      const left = Math.max(0, endsAt - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        finish(true, lang);
        router.push("/results");
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [status, endsAt, finish, lang, router]);

  useEffect(() => {
    if (status === "running" && index >= questions.length && questions.length > 0) {
      finish(false, lang);
      router.push("/results");
    }
  }, [status, index, questions.length, finish, lang, router]);

  const question = questions[index];

  function onSelect(id: OptionId) {
    selectOption(id);
  }

  if (status !== "running" || !question) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <Header compact />
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <DisclaimerBanner />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-150"
              style={{
                width: `${Math.min(100, (index / questions.length) * 100)}%`,
              }}
            />
          </div>
          <Timer remainingMs={remainingMs} label={copy.timer} />
        </div>
      </div>

      <main className="mx-auto flex max-w-3xl justify-center px-5 py-8 md:px-8">
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          onSelect={onSelect}
        />
      </main>
    </div>
  );
}

export default function TestPage() {
  return (
    <ClientOnly>
      <TestRunner />
    </ClientOnly>
  );
}
