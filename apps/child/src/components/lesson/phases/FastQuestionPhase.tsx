"use client";

import { useState } from "react";
import type { Lesson, QuestionInteraction } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { EquationDragDrop } from "@/components/fast/EquationDragDrop";
import { AudioReadQuestion } from "@/components/fast/AudioReadQuestion";
import { PictureSelectQuestion } from "@/components/fast/PictureSelectQuestion";
import { MultiSelectQuestion } from "@/components/fast/MultiSelectQuestion";

const INTRO_TEXT: Partial<Record<QuestionInteraction, string>> = {
  "drag-drop-equation": "Drag the missing number into the blank — just like on the real test.",
  "audio-read": "Listen to the question, then pick your answer — just like on the real test.",
  "picture-select": "Tap the picture with the right answer — just like on the real test.",
  "multiple-choice-multi": "Select every group that matches — there may be more than one.",
};

export function FastQuestionPhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [done, setDone] = useState(false);
  const question = lesson.fastQuestion;
  const handleComplete = (correct: boolean) => {
    if (correct) setDone(true);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <CoachSpeech text={INTRO_TEXT[question.interaction] ?? "Answer just like on the real test."} />
      {question.interaction === "drag-drop-equation" && (
        <EquationDragDrop question={question} onComplete={handleComplete} />
      )}
      {question.interaction === "audio-read" && (
        <AudioReadQuestion question={question} onComplete={handleComplete} />
      )}
      {question.interaction === "picture-select" && (
        <PictureSelectQuestion question={question} onComplete={handleComplete} />
      )}
      {question.interaction === "multiple-choice-multi" && (
        <MultiSelectQuestion question={question} onComplete={handleComplete} />
      )}
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
