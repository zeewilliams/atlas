interface StorySettingFallbackProps {
  setting: string;
}

const SETTING_COLORS: Record<string, string> = {
  "the beach": "#5bb8d4",
  "the library": "#7c4dff",
  "the cabin": "#f57f17",
  "the farm": "#43a047",
  "the forest": "#1a3a6b",
};

/** 2D fallback for devices without WebGL — same mechanism, plain HTML. */
export function StorySettingFallback({ setting }: StorySettingFallbackProps) {
  const color = SETTING_COLORS[setting] ?? "#1a3a6b";
  return (
    <div
      className="flex h-full w-full items-center justify-center p-6"
      style={{ backgroundColor: color }}
      role="img"
      aria-label={`Setting: ${setting}`}
    >
      <span className="whitespace-nowrap rounded-pill bg-black/40 px-5 py-2 text-2xl font-extrabold text-white">
        {setting}
      </span>
    </div>
  );
}
