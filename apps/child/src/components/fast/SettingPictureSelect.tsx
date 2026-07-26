"use client";

import { useState } from "react";
import { BookOpen, Home, MapPin, Tent, Trees, Waves } from "lucide-react";
import type { Question } from "@atlas/curriculum";

interface SettingPictureSelectProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

const SETTING_ICONS: Record<string, typeof MapPin> = {
  "the beach": Waves,
  "the library": BookOpen,
  "the cabin": Home,
  "the farm": Home,
  "the forest": Trees,
  "the campsite": Tent,
};

/**
 * FAST "tap the correct picture" format for story settings — each choice
 * renders as an icon standing in for the location, matching FAST's picture
 * selection format without needing generated art.
 */
export function SettingPictureSelect({ question, onComplete }: SettingPictureSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

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
      <p className="max-w-md text-center text-xl font-bold text-white">{question.prompt}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {question.choices.map((choice) => {
          const Icon = SETTING_ICONS[choice] ?? MapPin;
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleSelect(choice)}
              aria-label={choice}
              className={`flex h-20 min-w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-standard px-4 py-3 shadow-atlas transition-transform duration-200 hover:scale-105 ${
                isSelected && status === "correct"
                  ? "bg-success"
                  : isSelected && status === "wrong"
                    ? "bg-danger"
                    : "bg-primary"
              }`}
            >
              <Icon size={28} className="text-white" />
              <span className="text-xs font-bold text-white">{choice}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
