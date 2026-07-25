/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function MeasureRowFallback({ length }: { length: number }) {
  const clampedLength = Math.max(1, Math.min(10, length));

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 p-6"
      role="img"
      aria-label={`Object measuring ${clampedLength} paper clips long`}
    >
      <div className="h-6 rounded-sm bg-accent" style={{ width: `${clampedLength * 2.2}rem` }} />
      <div className="flex gap-1">
        {Array.from({ length: clampedLength }, (_, i) => (
          <div key={i} className="h-4 w-8 rounded-sm bg-primary" />
        ))}
      </div>
    </div>
  );
}
