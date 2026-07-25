"use client";

import type { SceneKind } from "@atlas/curriculum";
import { MakeATenScene } from "@/components/lesson/scene/MakeATenScene";
import { SubtractionScene } from "@/components/lesson/scene/SubtractionScene";
import { BaseTenScene } from "@/components/lesson/scene/BaseTenScene";

/** Dispatches to the right R3F scene for a lesson's sceneKind. */
export function LessonScene({ sceneKind, visual }: { sceneKind: SceneKind; visual: Record<string, number> }) {
  switch (sceneKind) {
    case "ten-frame":
      return <MakeATenScene filled={visual["filled"] ?? 0} />;
    case "take-away":
      return <SubtractionScene start={visual["start"] ?? 0} removed={visual["removed"] ?? 0} />;
    case "base-ten":
      return <BaseTenScene tens={visual["tens"] ?? 0} ones={visual["ones"] ?? 0} />;
    default:
      return null;
  }
}
