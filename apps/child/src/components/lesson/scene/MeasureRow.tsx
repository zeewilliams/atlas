"use client";

import { Instance, Instances } from "@react-three/drei";

const UNIT_WIDTH = 0.6;
const UNIT_HEIGHT = 0.22;
// Paper clips are laid end-to-end with a visible seam between them — unlike
// the fused ten-rod, each unit here stays a distinct, countable thing.
const UNIT_GAP = 0.06;

export function MeasureRow({ length }: { length: number }) {
  const clampedLength = Math.max(1, Math.min(10, length));
  const totalWidth = clampedLength * UNIT_WIDTH + (clampedLength - 1) * UNIT_GAP;
  const startX = -totalWidth / 2;
  const unitCenters = Array.from(
    { length: clampedLength },
    (_, i) => startX + i * (UNIT_WIDTH + UNIT_GAP) + UNIT_WIDTH / 2
  );

  return (
    <group>
      {/* The object being measured — its length is exactly N units, nothing more or less. */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[totalWidth, 0.3, 0.15]} />
        <meshStandardMaterial color="#f5c518" />
      </mesh>

      {/* The paper-clip units laid end-to-end beneath it. */}
      <Instances limit={10}>
        <boxGeometry args={[UNIT_WIDTH * 0.92, UNIT_HEIGHT, 0.15]} />
        <meshStandardMaterial color="#1a3a6b" />
        {unitCenters.map((x, i) => (
          <Instance key={i} position={[x, -0.1, 0]} />
        ))}
      </Instances>
    </group>
  );
}
