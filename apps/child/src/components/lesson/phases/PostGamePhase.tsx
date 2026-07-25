"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Lesson } from "@atlas/curriculum";
import { useMasteryStore } from "@atlas/store";
import { generatePostGameAction } from "@/app/lesson/actions";

export function PostGamePhase({ lesson }: { lesson: Lesson }) {
  const result = useMasteryStore((s) => s.getResult());
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!result) return;
    let cancelled = false;
    generatePostGameAction(result)
      .then((text) => {
        if (!cancelled) setSummary(text);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) return null;

  const pct = Math.round(result.firstTryRate * 100);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            size={48}
            className={i < result.stars ? "fill-accent text-accent" : "text-white/20"}
          />
        ))}
      </div>
      <p className="text-2xl font-extrabold text-white">{pct}% first try</p>
      {result.twinsCleared > 0 && (
        <p className="text-white/70">
          {result.twinsCleared} follow-up question{result.twinsCleared === 1 ? "" : "s"} conquered
        </p>
      )}
      <div className="w-full max-w-md rounded-card border border-white/20 bg-white/10 p-4 shadow-atlas backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Memory anchor</p>
        <p className="mt-1 text-white">{lesson.memoryAnchor}</p>
      </div>
      <div className="w-full max-w-md rounded-card border border-white/20 bg-primary/40 p-4 text-left shadow-atlas">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">For your parent</p>
        <p className="mt-1 text-sm text-white">{summary ?? "Loading summary…"}</p>
      </div>
    </div>
  );
}
