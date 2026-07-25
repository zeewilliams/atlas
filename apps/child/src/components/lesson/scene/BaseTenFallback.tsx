/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function BaseTenFallback({ tens, ones }: { tens: number; ones: number }) {
  const clampedTens = Math.max(0, tens);
  const clampedOnes = Math.max(0, ones);

  return (
    <div
      className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-6"
      role="img"
      aria-label={`${clampedTens} ten${clampedTens === 1 ? "" : "s"} and ${clampedOnes} one${clampedOnes === 1 ? "" : "s"}`}
    >
      {Array.from({ length: clampedTens }, (_, blockIndex) => (
        <div key={blockIndex} className="grid grid-cols-5 overflow-hidden rounded-sm">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-4 w-4 bg-primary" />
          ))}
        </div>
      ))}
      {clampedOnes > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: clampedOnes }, (_, i) => (
            <div key={i} className="h-4 w-4 rounded-sm bg-accent" />
          ))}
        </div>
      )}
    </div>
  );
}
