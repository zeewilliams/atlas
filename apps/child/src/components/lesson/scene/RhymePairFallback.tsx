interface RhymePairFallbackProps {
  topOnset: string;
  topRime: string;
  bottomOnset: string;
  bottomRime: string;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function RhymePairFallback({ topOnset, topRime, bottomOnset, bottomRime }: RhymePairFallbackProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 p-6"
      role="img"
      aria-label={`${topOnset}${topRime} and ${bottomOnset}${bottomRime} rhyme — both end in ${topRime}`}
    >
      <div className="flex items-baseline text-4xl font-extrabold">
        <span className="text-white">{topOnset}</span>
        <span className="text-accent">{topRime}</span>
      </div>
      <div className="flex items-baseline text-4xl font-extrabold">
        <span className="text-white">{bottomOnset}</span>
        <span className="text-accent">{bottomRime}</span>
      </div>
    </div>
  );
}
