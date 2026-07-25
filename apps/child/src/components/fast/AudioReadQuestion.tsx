"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import type { Question } from "@atlas/curriculum";
import { useSpeech } from "@/hooks/useSpeech";

interface AudioReadQuestionProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/** FAST audio-dependent format: the question is read aloud, then answered. */
export function AudioReadQuestion({ question, onComplete }: AudioReadQuestionProps) {
  const { speak, isSpeaking, isSupported } = useSpeech();
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    speak(question.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function handleSelect(choice: string) {
    if (status === "correct") return;
    setSelected(choice);
    const correct = choice === question.correctAnswer;
    setStatus(correct ? "correct" : "wrong");
    if (correct) {
      onComplete(true);
    } else {
      setTimeout(() => {
        setStatus("idle");
        setSelected(null);
      }, 900);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => speak(question.prompt)}
        disabled={!isSupported}
        aria-label="Read the question aloud again"
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent text-primary shadow-atlas transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Volume2 size={26} className={isSpeaking ? "animate-pulse" : ""} />
      </button>
      <p className="max-w-md text-center text-xl font-bold text-white">{question.prompt}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {question.choices.map((choice) => {
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleSelect(choice)}
              className={`h-14 min-w-14 cursor-pointer rounded-pill px-6 text-xl font-bold shadow-atlas transition-transform duration-200 hover:scale-105 ${
                isSelected && status === "correct"
                  ? "bg-success text-white"
                  : isSelected && status === "wrong"
                    ? "bg-danger text-white"
                    : "bg-primary text-white"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
