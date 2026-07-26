interface SoundMatchFallbackProps {
  topWord: string;
  bottomWord: string;
  matches: boolean;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function SoundMatchFallback({ topWord, bottomWord, matches }: SoundMatchFallbackProps) {
  const onsetClass = matches ? "text-accent" : "text-white/40";
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 p-6"
      role="img"
      aria-label={`${topWord} and ${bottomWord} ${matches ? "start with the same sound" : "start with different sounds"}`}
    >
      <div className="text-4xl font-extrabold">
        <span className={onsetClass}>{topWord.slice(0, 1)}</span>
        <span className="text-white">{topWord.slice(1)}</span>
      </div>
      <div className="text-4xl font-extrabold">
        <span className={onsetClass}>{bottomWord.slice(0, 1)}</span>
        <span className="text-white">{bottomWord.slice(1)}</span>
      </div>
    </div>
  );
}
