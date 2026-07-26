interface FactOpinionFallbackProps {
  sentence: string;
  isFact: boolean;
}

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function FactOpinionFallback({ sentence, isFact }: FactOpinionFallbackProps) {
  const label = isFact ? "Fact — can be checked" : "Opinion — what someone thinks";
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 p-6"
      role="img"
      aria-label={`${sentence} — ${label}`}
    >
      <p className="max-w-sm text-center text-xl font-bold text-white">{sentence}</p>
      <span
        className={`whitespace-nowrap rounded-standard px-4 py-1 text-sm font-extrabold text-white ${
          isFact ? "bg-success" : "bg-zone-active"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
