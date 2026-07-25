"use client";

import { Instance, Instances } from "@react-three/drei";

const UNIT_SPACING = 0.55;

function columnX(index: number, totalColumns: number): number {
  const totalWidth = Math.max(totalColumns - 1, 0) * UNIT_SPACING;
  return -totalWidth / 2 + index * UNIT_SPACING;
}

/**
 * The mechanism, not a metaphor: pair each item in row A with the item
 * directly below it in row B. Anything past the shorter row's length has
 * no partner and renders red — "equal" literally means no leftovers.
 */
export function EqualSetsGroup({ countA, countB }: { countA: number; countB: number }) {
  const clampedA = Math.max(0, Math.min(10, countA));
  const clampedB = Math.max(0, Math.min(10, countB));
  const totalColumns = Math.max(clampedA, clampedB, 1);
  const matched = Math.min(clampedA, clampedB);

  const rowAPositions = Array.from({ length: clampedA }, (_, i) => columnX(i, totalColumns));
  const rowBPositions = Array.from({ length: clampedB }, (_, i) => columnX(i, totalColumns));

  return (
    <group>
      <Instances limit={10}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#1a3a6b" />
        {rowAPositions.slice(0, matched).map((x, i) => (
          <Instance key={`a-matched-${i}`} position={[x, 0.5, 0]} />
        ))}
      </Instances>
      <Instances limit={10}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#e53935" />
        {rowAPositions.slice(matched).map((x, i) => (
          <Instance key={`a-extra-${i}`} position={[x, 0.5, 0]} />
        ))}
      </Instances>

      <Instances limit={10}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#f5c518" />
        {rowBPositions.slice(0, matched).map((x, i) => (
          <Instance key={`b-matched-${i}`} position={[x, -0.5, 0]} />
        ))}
      </Instances>
      <Instances limit={10}>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshStandardMaterial color="#e53935" />
        {rowBPositions.slice(matched).map((x, i) => (
          <Instance key={`b-extra-${i}`} position={[x, -0.5, 0]} />
        ))}
      </Instances>
    </group>
  );
}
