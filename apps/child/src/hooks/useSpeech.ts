"use client";

import { useCallback, useEffect, useState } from "react";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Detected post-mount only, so the server render and first client paint
  // agree (both without the speak button) — no hydration mismatch.
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
