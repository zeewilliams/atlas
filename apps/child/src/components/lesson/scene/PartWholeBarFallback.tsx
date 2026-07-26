const REM_PER_UNIT = 1.2;

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function PartWholeBarFallback({ a, b, blank }: { a: number; b: number; blank: number }) {
  const sum = a + b;

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-6"
      role="img"
      aria-label={`${a} and ${b} make ${sum}`}
    >
      <div
        className={`h-8 rounded-sm ${blank === 3 ? "bg-slate-500" : "bg-accent"}`}
        style={{ width: `${sum * REM_PER_UNIT}rem` }}
      />
      <div className="flex gap-0.5">
        <div
          className={`h-8 rounded-sm ${blank === 1 ? "bg-slate-500" : "bg-primary"}`}
          style={{ width: `${a * REM_PER_UNIT}rem` }}
        />
        <div
          className={`h-8 rounded-sm ${blank === 2 ? "bg-slate-500" : "bg-zone-active"}`}
          style={{ width: `${b * REM_PER_UNIT}rem` }}
        />
      </div>
    </div>
  );
}
