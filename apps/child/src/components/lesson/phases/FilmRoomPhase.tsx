"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { LessonScene } from "@/components/lesson/LessonScene";

const STEP_DURATION_MS = 6000;

export function FilmRoomPhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = lesson.filmRoomScript;
  const isLastStep = stepIndex === steps.length - 1;
  const step = steps[stepIndex];

  useEffect(() => {
    if (isLastStep) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stepIndex, isLastStep]);

  return (
    <div className="flex flex-col items-center gap-6">
      {step && (
        <LessonScene sceneKind={lesson.sceneKind} visual={step.visual} textVisual={step.textVisual} />
      )}
      <CoachSpeech text={step?.caption ?? ""} />
      <button
        type="button"
        onClick={() => (isLastStep ? onComplete() : setStepIndex((i) => i + 1))}
        className="cursor-pointer rounded-pill bg-accent px-8 py-4 text-lg font-bold text-primary shadow-atlas transition-transform duration-200 hover:scale-105"
      >
        {isLastStep ? "Watch me do one" : "Continue"}
      </button>
    </div>
  );
}
