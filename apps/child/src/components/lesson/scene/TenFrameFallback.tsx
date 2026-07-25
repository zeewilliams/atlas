import { TEN_FRAME_COLUMNS, TEN_FRAME_SLOTS } from "./tenFrameLayout";

/** 2D fallback for devices without WebGL — same mechanism, plain SVG. */
export function TenFrameFallback({ filled }: { filled: number }) {
  const clampedFilled = Math.max(0, Math.min(10, filled));
  return (
    <div
      className="grid h-full w-full place-items-center gap-2 p-6"
      style={{ gridTemplateColumns: `repeat(${TEN_FRAME_COLUMNS}, 1fr)` }}
      role="img"
      aria-label={`Ten-frame with ${clampedFilled} of 10 slots filled`}
    >
      {TEN_FRAME_SLOTS.map((i) => (
        <div
          key={i}
          className="flex aspect-square w-full max-w-16 items-center justify-center rounded-standard border-2 border-primary/40"
        >
          {i < clampedFilled && <div className="h-3/5 w-3/5 rounded-full bg-accent" />}
        </div>
      ))}
    </div>
  );
}
