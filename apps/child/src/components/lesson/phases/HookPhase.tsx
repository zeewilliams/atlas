"use client";

import { CoachSpeech } from "@/components/lesson/CoachSpeech";

export function HookPhase({ hook, onComplete }: { hook: string; onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <CoachSpeech text={hook} />
      <button
        type="button"
        onClick={onComplete}
        className="cursor-pointer rounded-pill bg-accent px-8 py-4 text-lg font-bold text-primary shadow-atlas transition-transform duration-200 hover:scale-105"
      >
        Let&apos;s find out
      </button>
    </div>
  );
}
