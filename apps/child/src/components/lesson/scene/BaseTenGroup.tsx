"use client";

import { Instance, Instances } from "@react-three/drei";
import { UNIT_SIZE, computeBaseTenLayout } from "./baseTenLayout";

export function BaseTenGroup({ tens, ones }: { tens: number; ones: number }) {
  const { tenBlockUnits, oneUnits } = computeBaseTenLayout(tens, ones);
  const totalTenUnits = tenBlockUnits.reduce((sum, block) => sum + block.length, 0);

  return (
    <group>
      <Instances limit={Math.max(totalTenUnits, 1)}>
        <boxGeometry args={[UNIT_SIZE * 0.96, UNIT_SIZE * 0.96, UNIT_SIZE * 0.96]} />
        <meshStandardMaterial color="#1a3a6b" />
        {tenBlockUnits.flatMap((block, blockIndex) =>
          block.map(([x, y], unitIndex) => (
            <Instance key={`${blockIndex}-${unitIndex}`} position={[x, y, 0]} />
          ))
        )}
      </Instances>

      <Instances limit={Math.max(oneUnits.length, 1)}>
        <boxGeometry args={[UNIT_SIZE * 0.8, UNIT_SIZE * 0.8, UNIT_SIZE * 0.8]} />
        <meshStandardMaterial color="#f5c518" />
        {oneUnits.map(([x, y], i) => (
          <Instance key={i} position={[x, y, 0]} />
        ))}
      </Instances>
    </group>
  );
}
