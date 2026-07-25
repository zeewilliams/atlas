"use client";

import { useState } from "react";
import type { Question } from "@atlas/curriculum";

interface PictureSelectQuestionProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/**
 * Each choice renders as a picture (a stylized clip-count row) rather than
 * a numeral — matching FAST's "tap the correct image" format. Built from
 * CSS shapes, not photographic assets, since no image-generation pass has
 * run for this lesson yet.
 */
function ClipCountPicture({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-3 w-6 rounded-sm bg-white" />
      ))}
    </div>
  );
}

export function PictureSelectQuestion({ question, onComplete }: PictureSelectQuestionProps) {
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
    <div className="flex flex-wrap justify-center gap-4">
      {question.choices.map((choice) => {
        const isSelected = selected === choice;
        return (
          <button
            key={choice}
            type="button"
            onClick={() => handleSelect(choice)}
            aria-label={`${choice} paper clips`}
            className={`flex h-16 min-w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-standard px-4 py-2 shadow-atlas transition-transform duration-200 hover:scale-105 ${
              isSelected && status === "correct"
                ? "bg-success"
                : isSelected && status === "wrong"
                  ? "bg-danger"
                  : "bg-primary"
            }`}
          >
            <ClipCountPicture count={Number(choice)} />
          </button>
        );
      })}
    </div>
  );
}
