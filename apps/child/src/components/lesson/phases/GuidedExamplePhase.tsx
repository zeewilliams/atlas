"use client";

import { useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { LessonScene } from "@/components/lesson/LessonScene";

export function GuidedExamplePhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { steps, answer, prompt, visual, textVisual } = lesson.guidedExample;
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="max-w-md text-center text-xl font-bold text-white">{prompt}</p>
      <LessonScene sceneKind={lesson.sceneKind} visual={visual} textVisual={textVisual} />
      <CoachSpeech text={steps[stepIndex] ?? ""} />
      {isLastStep && <p className="text-2xl font-extrabold text-accent">Answer: {answer}</p>}
      <button
        type="button"
        onClick={() => (isLastStep ? onComplete() : setStepIndex((i) => i + 1))}
        className="cursor-pointer rounded-pill bg-accent px-8 py-4 text-lg font-bold text-primary shadow-atlas transition-transform duration-200 hover:scale-105"
      >
        {isLastStep ? "Your turn" : "Next"}
      </button>
    </div>
  );
}
