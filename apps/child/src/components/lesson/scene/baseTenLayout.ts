export const UNIT_SIZE = 0.34;

const TEN_BLOCK_COLUMNS = 5;
const TEN_BLOCK_ROWS = 2;
const TEN_BLOCK_WIDTH = TEN_BLOCK_COLUMNS * UNIT_SIZE;
const TEN_BLOCK_HEIGHT = TEN_BLOCK_ROWS * UNIT_SIZE;
const BLOCK_GAP = 0.5;
const ONE_SPACING = 0.55;

export interface BaseTenLayout {
  /** One entry per ten-rod, each holding the 10 tightly-packed unit positions that make it up. */
  tenBlockUnits: Array<Array<[number, number]>>;
  /** Loose unit positions, spaced apart — not yet grouped into a ten. */
  oneUnits: Array<[number, number]>;
}

/**
 * A ten-rod is rendered as ten unit cubes packed edge-to-edge (no gap) —
 * the same primitive as a loose one, just fused by position. That's the
 * literal mechanism: a ten IS ten ones, not a differently-shaped token
 * that stands for ten.
 */
export function computeBaseTenLayout(tens: number, ones: number): BaseTenLayout {
  const clampedTens = Math.max(0, tens);
  const clampedOnes = Math.max(0, ones);

  const tensWidth = clampedTens > 0 ? clampedTens * TEN_BLOCK_WIDTH + (clampedTens - 1) * BLOCK_GAP : 0;
  const onesWidth = clampedOnes > 0 ? (clampedOnes - 1) * ONE_SPACING : 0;
  const bridgeGap = clampedTens > 0 && clampedOnes > 0 ? BLOCK_GAP : 0;
  const totalWidth = tensWidth + bridgeGap + onesWidth;
  const startX = -totalWidth / 2;

  const tenBlockUnits: Array<Array<[number, number]>> = [];
  for (let b = 0; b < clampedTens; b++) {
    const blockStartX = startX + b * (TEN_BLOCK_WIDTH + BLOCK_GAP);
    const units: Array<[number, number]> = [];
    for (let u = 0; u < 10; u++) {
      const col = u % TEN_BLOCK_COLUMNS;
      const row = Math.floor(u / TEN_BLOCK_COLUMNS);
      units.push([blockStartX + col * UNIT_SIZE, row * UNIT_SIZE - TEN_BLOCK_HEIGHT / 2]);
    }
    tenBlockUnits.push(units);
  }

  const onesStartX = startX + tensWidth + bridgeGap;
  const oneUnits: Array<[number, number]> = [];
  for (let i = 0; i < clampedOnes; i++) {
    oneUnits.push([onesStartX + i * ONE_SPACING, -TEN_BLOCK_HEIGHT / 2]);
  }

  return { tenBlockUnits, oneUnits };
}
