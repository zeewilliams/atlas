"use client";

import { useState } from "react";
import type { Question } from "@atlas/curriculum";

interface MultiSelectQuestionProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/**
 * FAST "select all that apply" format. Each choice id is a key into
 * question.visual holding that card's count; question.correctAnswers is
 * the exact set of ids that must all (and only) be selected.
 */
export function MultiSelectQuestion({ question, onComplete }: MultiSelectQuestionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const reference = question.visual?.["reference"] ?? 0;
  const correctSet = new Set(question.correctAnswers ?? []);

  function toggle(id: string) {
    if (status === "correct") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    const isCorrect =
      selected.size === correctSet.size && [...selected].every((id) => correctSet.has(id));
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
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
          Reference group
        </span>
        <div className="flex flex-wrap max-w-40 gap-1">
          {Array.from({ length: reference }, (_, i) => (
            <div key={i} className="h-4 w-4 rounded-full bg-accent" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {question.choices.map((id) => {
          const count = question.visual?.[id] ?? 0;
          const isSelected = selected.has(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              aria-pressed={isSelected}
              className={`flex h-16 min-w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-standard px-4 py-2 shadow-atlas transition-transform duration-200 hover:scale-105 ${
                isSelected ? "bg-zone-active" : "bg-primary"
              }`}
            >
              <div className="flex max-w-20 flex-wrap gap-1">
                {Array.from({ length: count }, (_, i) => (
                  <div key={i} className="h-3 w-3 rounded-full bg-white" />
                ))}
              </div>
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
