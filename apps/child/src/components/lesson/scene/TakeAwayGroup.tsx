"use client";

import { Instance, Instances } from "@react-three/drei";
import { TEN_FRAME_SLOTS, slotPosition } from "./tenFrameLayout";

/**
 * The mechanism, not a metaphor: start with a real group, remove a subset,
 * count what's left. Remaining objects stay solid; taken-away ones render
 * as faded wireframes in their old spot, so "what's left" is something Zee
 * can see directly rather than infer.
 */
export function TakeAwayGroup({ start, removed }: { start: number; removed: number }) {
  const clampedStart = Math.max(0, Math.min(10, start));
  const clampedRemoved = Math.max(0, Math.min(clampedStart, removed));
  const remaining = clampedStart - clampedRemoved;

  return (
    <group>
      <Instances limit={10}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#f5c518" />
        {TEN_FRAME_SLOTS.slice(0, remaining).map((i) => {
          const [x, y] = slotPosition(i);
          return <Instance key={i} position={[x, y, 0]} />;
        })}
      </Instances>

      <Instances limit={10}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#e53935" transparent opacity={0.25} wireframe />
        {TEN_FRAME_SLOTS.slice(remaining, clampedStart).map((i) => {
          const [x, y] = slotPosition(i);
          return <Instance key={i} position={[x, y, 0]} />;
        })}
      </Instances>
    </group>
  );
}
