"use client";

import { useState } from "react";
import type { Question } from "@atlas/curriculum";

interface SimpleChoiceQuestionProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/** FAST "multiple choice single" format — plain text buttons, immediate feedback. */
export function SimpleChoiceQuestion({ question, onComplete }: SimpleChoiceQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  function handleSelect(choice: string) {
    if (status === "correct") return;
    setSelected(choice);
    const correct = choice === question.correctAnswer;
    setStatus(correct ? "correct" : "wrong");
    if (correct) {
      onComplete(true);
    } else {
      setTimeout(() => {
        setStatus("idle");
        setSelected(null);
      }, 900);
    }
  }

  return (
    <div className="flex max-w-xl flex-col items-center gap-6">
      <p className="text-center text-xl font-bold text-white">{question.prompt}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {question.choices.map((choice) => {
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleSelect(choice)}
              className={`h-14 min-w-14 cursor-pointer rounded-pill px-6 text-lg font-bold shadow-atlas transition-transform duration-200 hover:scale-105 ${
                isSelected && status === "correct"
                  ? "bg-success text-white"
                  : isSelected && status === "wrong"
                    ? "bg-danger text-white"
                    : "bg-primary text-white"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
