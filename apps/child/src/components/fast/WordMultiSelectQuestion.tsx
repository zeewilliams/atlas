"use client";

import { useState } from "react";
import type { Question } from "@atlas/curriculum";

interface WordMultiSelectQuestionProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/**
 * FAST "select all that apply" format for word/sentence choices — the
 * choices themselves are the words being judged, unlike MultiSelectQuestion
 * (which renders dot-counts keyed off question.visual for math lessons).
 */
export function WordMultiSelectQuestion({ question, onComplete }: WordMultiSelectQuestionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const correctSet = new Set(question.correctAnswers ?? []);

  function toggle(choice: string) {
    if (status === "correct") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(choice)) next.delete(choice);
      else next.add(choice);
      return next;
    });
  }

  function handleSubmit() {
    const isCorrect =
      selected.size === correctSet.size && [...selected].every((c) => correctSet.has(c));
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      onComplete(true);
    } else {
      setTimeout(() => {
        setStatus("idle");
        setSelected(new Set());
      }, 900);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex max-w-xl flex-wrap justify-center gap-3">
        {question.choices.map((choice) => {
          const isSelected = selected.has(choice);
          return (
            <button
              key={choice}
              type="button"
              onClick={() => toggle(choice)}
              aria-pressed={isSelected}
              className={`h-14 min-w-14 cursor-pointer rounded-standard px-5 text-lg font-bold shadow-atlas transition-transform duration-200 hover:scale-105 ${
                isSelected ? "bg-zone-active text-white" : "bg-primary text-white"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected.size === 0 || status === "correct"}
        className={`cursor-pointer rounded-pill px-8 py-4 text-lg font-bold shadow-atlas transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
          status === "wrong"
            ? "bg-danger text-white"
            : status === "correct"
              ? "bg-success text-white"
              : "bg-accent text-primary"
        }`}
      >
        Check
      </button>
    </div>
  );
}
