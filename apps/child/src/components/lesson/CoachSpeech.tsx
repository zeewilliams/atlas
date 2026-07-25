"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

/**
 * Coach speech bubble. Approximates the "liquid glass" surface from the
 * master skill with Tailwind backdrop-blur/translucency — the real
 * liquid-glass-js package wasn't wired in because its exact npm name/API
 * couldn't be confirmed; swap this in once that's verified.
 */
export function CoachSpeech({ text }: { text: string }) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  return (
    <div className="flex items-start gap-3 rounded-card border border-white/20 bg-white/10 p-4 shadow-atlas backdrop-blur-md">
      <p className="flex-1 text-base font-semibold leading-snug text-white">{text}</p>
      {isSupported && (
        <button
          type="button"
          aria-label={isSpeaking ? "Stop reading aloud" : "Read aloud"}
          onClick={() => (isSpeaking ? stop() : speak(text))}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-primary transition-transform duration-200 hover:scale-105"
        >
          {isSpeaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      )}
    </div>
  );
}
