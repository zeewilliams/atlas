"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@atlas/curriculum";
import { useMasteryStore } from "@atlas/store";
import { CoachSpeech } from "@/components/lesson/CoachSpeech";
import { LessonScene } from "@/components/lesson/LessonScene";

const PRACTICE_QUESTION_COUNT = 5;
// Lever 1 (number range) will eventually read/write this per-skill; fixed
// mid-level for Sprint 1's first pass.
const LEVEL = 5;

export function PracticePhase({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const {
    currentQuestion,
    isLocked,
    lockRemainingMs,
    progress,
    lastResult,
    isComplete,
    startSession,
    submitAnswer,
    tick,
  } = useMasteryStore();
  const [message, setMessage] = useState("Let's practice.");

  useEffect(() => {
    const initialQuestions = Array.from({ length: PRACTICE_QUESTION_COUNT }, () =>
      lesson.generatePracticeQuestion(LEVEL)
    );
    startSession({
      skillId: lesson.skillId,
      initialQuestions,
      generatePracticeQuestion: lesson.generatePracticeQuestion,
      level: LEVEL,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [isLocked, tick]);

  useEffect(() => {
    if (isComplete && progress.totalOriginal > 0) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  useEffect(() => {
    if (!lastResult) return;
    if (lastResult.type === "wrong-first") setMessage(lastResult.hint);
    else if (lastResult.type === "revealed") setMessage(lastResult.explanation);
    else if (lastResult.type === "correct") {
      setMessage(lastResult.outcome === "first-try" ? "Yes — first try!" : "There it is.");
    }
  }, [lastResult]);

  if (!currentQuestion) {
    return <p className="text-white/70">Loading practice…</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
        Question {Math.min(progress.answeredOriginal + 1, progress.totalOriginal)} of{" "}
        {progress.totalOriginal}
        {progress.pendingTwins > 0 &&
          ` · ${progress.pendingTwins} to clear`}
      </div>
      {currentQuestion.visual && (
        <LessonScene sceneKind={lesson.sceneKind} visual={currentQuestion.visual} />
      )}
      <CoachSpeech text={message} />
      <p className="max-w-md text-center text-2xl font-extrabold text-white">
        {currentQuestion.prompt}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {currentQuestion.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            disabled={isLocked}
            onClick={() => submitAnswer(choice)}
            className="h-14 min-w-14 cursor-pointer rounded-pill bg-primary px-6 text-xl font-bold text-white shadow-atlas transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {choice}
          </button>
        ))}
      </div>
      {isLocked && (
        <p className="text-xs text-white/40">{(Math.ceil(lockRemainingMs / 100) / 10).toFixed(1)}s</p>
      )}
    </div>
  );
}
