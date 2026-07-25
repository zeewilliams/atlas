/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function EqualSetsFallback({ countA, countB }: { countA: number; countB: number }) {
  const clampedA = Math.max(0, Math.min(10, countA));
  const clampedB = Math.max(0, Math.min(10, countB));
  const matched = Math.min(clampedA, clampedB);

  function renderRow(count: number, colorClass: string) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`h-6 w-6 rounded-full ${i < matched ? colorClass : "bg-danger"}`} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 p-6"
      role="img"
      aria-label={`Top group has ${clampedA}, bottom group has ${clampedB}`}
    >
      {renderRow(clampedA, "bg-primary")}
      {renderRow(clampedB, "bg-accent")}
    </div>
  );
}
