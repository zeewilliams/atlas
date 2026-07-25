"use client";

import { Instance, Instances } from "@react-three/drei";
import { TEN_FRAME_SLOTS, slotPosition } from "./tenFrameLayout";

/**
 * The mechanism, not a metaphor: a ten-frame always has exactly ten slots.
 * Filled slots get a counter; the rest stay visibly empty, so the answer to
 * "how many more to make ten" is something Zee can see directly, not infer.
 */
export function TenFrame({ filled }: { filled: number }) {
  const clampedFilled = Math.max(0, Math.min(10, filled));

  return (
    <group>
      <Instances limit={10}>
        <boxGeometry args={[0.9, 0.9, 0.12]} />
        <meshStandardMaterial color="#1a3a6b" transparent opacity={0.18} />
        {TEN_FRAME_SLOTS.map((i) => {
          const [x, y] = slotPosition(i);
          return <Instance key={i} position={[x, y, 0]} />;
        })}
      </Instances>

      <Instances limit={10}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#f5c518" />
        {TEN_FRAME_SLOTS.slice(0, clampedFilled).map((i) => {
          const [x, y] = slotPosition(i);
          return <Instance key={i} position={[x, y, 0.15]} />;
        })}
      </Instances>
    </group>
  );
}
