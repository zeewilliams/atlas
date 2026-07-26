interface AdjectiveHighlightFallbackProps {
  before: string;
  adjective: string;
  after: string;
  noun: string;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function AdjectiveHighlightFallback({ before, adjective, after, noun }: AdjectiveHighlightFallbackProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 p-6"
      role="img"
      aria-label={`"${adjective}" describes ${noun} in: ${before}${adjective}${after}`}
    >
      <p className="max-w-sm text-center text-2xl font-bold text-white">
        {before}
        <span className="text-accent">{adjective}</span>
        {after}
      </p>
      <span className="whitespace-nowrap rounded-pill bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
        describes: {noun}
      </span>
    </div>
  );
}
