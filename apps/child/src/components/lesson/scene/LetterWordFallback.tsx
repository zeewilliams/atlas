interface LetterWordFallbackProps {
  word: string;
  isReal: boolean;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function LetterWordFallback({ word, isReal }: LetterWordFallbackProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 p-6"
      role="img"
      aria-label={`${word} — ${isReal ? "a real word" : "not a real word"}`}
    >
      <div className="flex gap-2 text-5xl font-extrabold text-white">
        {word.split("").map((letter, i) => (
          <span key={`${letter}-${i}`}>{letter}</span>
        ))}
      </div>
      <span
        className={`rounded-standard px-4 py-1 text-sm font-extrabold text-white ${
          isReal ? "bg-success" : "bg-slate-500"
        }`}
      >
        {isReal ? "A real word" : "Not a real word"}
      </span>
    </div>
  );
}
