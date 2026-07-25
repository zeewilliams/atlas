"use client";

import { useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import type { Question } from "@atlas/curriculum";

interface EquationDragDropProps {
  question: Question;
  onComplete: (correct: boolean) => void;
}

/**
 * FAST equation-structure format: drag a number tile into the blank.
 * Touch-first (Framer Motion drag tracks pointer events, not HTML5 DnD,
 * which doesn't work reliably on tablets) with 44px+ touch targets.
 */
export function EquationDragDrop({ question, onComplete }: EquationDragDropProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [locked, setLocked] = useState(false);

  const [beforeText, afterText] = question.prompt.split("___");

  function handleDragEnd(tileValue: string, info: PanInfo) {
    if (locked) return;
    const zone = dropZoneRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const { x, y } = info.point;
    const isOverZone = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (!isOverZone) return;

    setPlaced(tileValue);
    const correct = tileValue === question.correctAnswer;

    if (correct) {
      setStatus("correct");
      setLocked(true);
      onComplete(true);
    } else {
      setStatus("wrong");
      setTimeout(() => {
        setStatus("idle");
        setPlaced(null);
      }, 900);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-3 text-3xl font-extrabold text-white">
        <span>{beforeText}</span>
        <div
          ref={dropZoneRef}
          className={`flex h-16 w-16 items-center justify-center rounded-standard border-4 border-dashed transition-colors duration-200 ${
            status === "correct"
              ? "border-success bg-success/20"
              : status === "wrong"
                ? "border-danger bg-danger/20"
                : "border-accent bg-white/10"
          }`}
        >
          {placed}
        </div>
        <span>{afterText}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {question.choices.map((choice, index) => (
          <motion.div
            key={`${choice}-${index}`}
            drag={!locked}
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={(_, info) => handleDragEnd(choice, info)}
            whileDrag={{ scale: 1.1, zIndex: 10 }}
            className="flex h-14 w-14 cursor-grab items-center justify-center rounded-pill bg-primary text-xl font-bold text-white shadow-atlas active:cursor-grabbing"
          >
            {choice}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
