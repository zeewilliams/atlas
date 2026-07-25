"use client";

import { useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { MakeATenScene } from "@/components/lesson/scene/MakeATenScene";

export function GuidedExamplePhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const { steps, answer, prompt } = lesson.guidedExample;
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex === steps.length - 1;
  const addend = Number(prompt.split(" ")[0]) || 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xl font-bold text-white">{prompt}</p>
      <MakeATenScene filled={addend} />
      <CoachSpeech text={steps[stepIndex] ?? ""} />
      {isLastStep && (
        <p className="text-2xl font-extrabold text-accent">{prompt.replace("?", answer)}</p>
      )}
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
