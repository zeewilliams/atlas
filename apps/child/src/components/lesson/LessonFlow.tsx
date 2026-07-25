"use client";

import { useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { HookPhase } from "./phases/HookPhase";
import { FilmRoomPhase } from "./phases/FilmRoomPhase";
import { GuidedExamplePhase } from "./phases/GuidedExamplePhase";
import { PracticePhase } from "./phases/PracticePhase";
import { FastQuestionPhase } from "./phases/FastQuestionPhase";
import { MemoryAnchorPhase } from "./phases/MemoryAnchorPhase";
import { PostGamePhase } from "./phases/PostGamePhase";

const PHASES = [
  "hook",
  "film-room",
  "guided-example",
  "practice",
  "fast",
  "memory-anchor",
  "post-game",
] as const;
type Phase = (typeof PHASES)[number];

const PHASE_LABELS: Record<Phase, string> = {
  hook: "Hook",
  "film-room": "Film Room",
  "guided-example": "Guided Example",
  practice: "Practice",
  fast: "Test Format",
  "memory-anchor": "Memory Anchor",
  "post-game": "Results",
};

export function LessonFlow({ lesson }: { lesson: Lesson }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASES[phaseIndex] as Phase;
  const advance = () => setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/50">
        <span>{lesson.title}</span>
        <span>
          {PHASE_LABELS[phase]} · {phaseIndex + 1}/{PHASES.length}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-pill bg-white/10">
        <div
          className="h-full rounded-pill bg-accent transition-all duration-300"
          style={{ width: `${((phaseIndex + 1) / PHASES.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        {phase === "hook" && <HookPhase hook={lesson.hook} onComplete={advance} />}
        {phase === "film-room" && <FilmRoomPhase lesson={lesson} onComplete={advance} />}
        {phase === "guided-example" && <GuidedExamplePhase lesson={lesson} onComplete={advance} />}
        {phase === "practice" && <PracticePhase lesson={lesson} onComplete={advance} />}
        {phase === "fast" && <FastQuestionPhase lesson={lesson} onComplete={advance} />}
        {phase === "memory-anchor" && <MemoryAnchorPhase lesson={lesson} onComplete={advance} />}
        {phase === "post-game" && <PostGamePhase lesson={lesson} />}
      </div>
    </div>
  );
}
