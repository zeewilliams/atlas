import { TEN_FRAME_COLUMNS, TEN_FRAME_SLOTS } from "./tenFrameLayout";

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function TakeAwayFallback({ start, removed }: { start: number; removed: number }) {
  const clampedStart = Math.max(0, Math.min(10, start));
  const clampedRemoved = Math.max(0, Math.min(clampedStart, removed));
  const remaining = clampedStart - clampedRemoved;

  return (
    <div
      className="grid h-full w-full place-items-center gap-2 p-6"
      style={{ gridTemplateColumns: `repeat(${TEN_FRAME_COLUMNS}, 1fr)` }}
      role="img"
      aria-label={`${clampedStart} objects, ${clampedRemoved} taken away, ${remaining} left`}
    >
      {TEN_FRAME_SLOTS.slice(0, clampedStart).map((i) => (
        <div
          key={i}
          className={`aspect-square w-full max-w-16 rounded-full border-2 ${
            i < remaining ? "border-accent bg-accent" : "border-danger/40 bg-transparent opacity-30"
          }`}
        />
      ))}
    </div>
  );
}
