"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { generateMemoryAnchorAction } from "@/app/lesson/actions";

export function MemoryAnchorPhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const [anchor, setAnchor] = useState(lesson.memoryAnchor);

  useEffect(() => {
    let cancelled = false;
    generateMemoryAnchorAction(lesson.skillId)
      .then((text) => {
        if (!cancelled && text) setAnchor(text);
      })
      .catch(() => {
        // Keep the curriculum-authored fallback already on screen.
      });
    return () => {
      cancelled = true;
    };
  }, [lesson.skillId]);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Say it back</p>
      <CoachSpeech text={anchor} />
      <button
        type="button"
        onClick={onComplete}
        className="cursor-pointer rounded-pill bg-accent px-8 py-4 text-lg font-bold text-primary shadow-atlas transition-transform duration-200 hover:scale-105"
      >
        Got it
      </button>
    </div>
  );
}
