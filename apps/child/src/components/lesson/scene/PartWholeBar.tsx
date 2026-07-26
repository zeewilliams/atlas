"use client";

const UNIT_WIDTH = 0.5;
const BAR_HEIGHT = 0.4;
const GAP_Y = 0.6;

function segmentColor(isBlank: boolean, base: string): string {
  return isBlank ? "#4b5563" : base;
}

/**
 * Part-whole bar model: the whole (top) and the two parts (bottom, split)
 * are the exact same total width — that's the literal mechanism behind
 * the equals sign. Whichever value the question hides renders gray,
 * regardless of whether it's a part or the whole, so "the blank can be
 * any piece" is something Zee sees, not just gets told.
 */
export function PartWholeBar({ a, b, blank }: { a: number; b: number; blank: number }) {
  const totalWidth = Math.max(a + b, 1) * UNIT_WIDTH;
  const aWidth = Math.max(a, 0) * UNIT_WIDTH;
  const bWidth = Math.max(b, 0) * UNIT_WIDTH;

  return (
    <group>
      <mesh position={[0, GAP_Y, 0]}>
        <boxGeometry args={[totalWidth, BAR_HEIGHT, 0.15]} />
        <meshStandardMaterial color={segmentColor(blank === 3, "#f5c518")} />
      </mesh>

      <mesh position={[-totalWidth / 2 + aWidth / 2, -GAP_Y, 0]}>
        <boxGeometry args={[aWidth, BAR_HEIGHT, 0.15]} />
        <meshStandardMaterial color={segmentColor(blank === 1, "#1a3a6b")} />
      </mesh>
      <mesh position={[-totalWidth / 2 + aWidth + bWidth / 2, -GAP_Y, 0]}>
        <boxGeometry args={[bWidth, BAR_HEIGHT, 0.15]} />
        <meshStandardMaterial color={segmentColor(blank === 2, "#7c4dff")} />
      </mesh>
    </group>
  );
}
