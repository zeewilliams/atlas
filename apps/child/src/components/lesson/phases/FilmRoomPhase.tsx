"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { MakeATenScene } from "@/components/lesson/scene/MakeATenScene";

// Make-a-Ten-specific pairing of each caption with the filled count that
// demonstrates it. A future lesson with its own Film Room would define its
// own step/scene mapping rather than reusing this one.
const FILLED_BY_STEP = [0, 8, 8, 8];
const STEP_DURATION_MS = 6000;

export function FilmRoomPhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = lesson.filmRoomScript;
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (isLastStep) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stepIndex, isLastStep]);

  const filled = FILLED_BY_STEP[stepIndex] ?? 8;

  return (
    <div className="flex flex-col items-center gap-6">
      <MakeATenScene filled={filled} />
      <CoachSpeech text={steps[stepIndex] ?? ""} />
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
