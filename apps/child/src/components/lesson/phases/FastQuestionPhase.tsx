"use client";

import { useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { EquationDragDrop } from "@/components/fast/EquationDragDrop";

export function FastQuestionPhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <CoachSpeech text="Drag the missing number into the blank — just like on the real test." />
      <EquationDragDrop
        question={lesson.fastQuestion}
        onComplete={(correct) => {
          if (correct) setDone(true);
        }}
      />
      {done && (
        <button
          type="button"
          onClick={onComplete}
          className="cursor-pointer rounded-pill bg-success px-8 py-4 text-lg font-bold text-white shadow-atlas transition-transform duration-200 hover:scale-105"
        >
          Continue
        </button>
      )}
    </div>
  );
}
