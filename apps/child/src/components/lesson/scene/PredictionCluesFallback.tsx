import { ArrowDown } from "lucide-react";

interface PredictionCluesFallbackProps {
  clue: string;
  prediction: string;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function PredictionCluesFallback({ clue, prediction }: PredictionCluesFallbackProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-6"
      role="img"
      aria-label={`Clue: ${clue}. Prediction: ${prediction}`}
    >
      <p className="max-w-sm text-center text-lg font-bold text-white">{clue}</p>
      <ArrowDown className="text-accent" size={28} />
      <p className="max-w-sm text-center text-lg font-extrabold text-accent">{prediction}</p>
    </div>
  );
}
