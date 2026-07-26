"use client";

import { Html } from "@react-three/drei";

interface StorySettingGroupProps {
  setting: string;
}

const SETTING_COLORS: Record<string, string> = {
  "the beach": "#5bb8d4",
  "the library": "#7c4dff",
  "the cabin": "#f57f17",
  "the farm": "#43a047",
  "the forest": "#1a3a6b",
};

/**
 * The mechanism: the setting is the place (and time) the story happens in —
 * shown as a backdrop color tied to that location, not the characters or
 * objects mentioned along the way.
 */
export function StorySettingGroup({ setting }: StorySettingGroupProps) {
  const color = SETTING_COLORS[setting] ?? "#1a3a6b";

  return (
    <group>
      <mesh position={[0, 0, -0.3]}>
        <planeGeometry args={[6, 3.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, 0, 0]} center>
        <span className="whitespace-nowrap rounded-pill bg-black/40 px-5 py-2 text-2xl font-extrabold text-white">
          {setting}
        </span>
      </Html>
    </group>
  );
}
