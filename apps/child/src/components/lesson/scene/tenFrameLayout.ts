export const TEN_FRAME_COLUMNS = 5;
export const TEN_FRAME_ROWS = 2;
const SPACING = 1.15;

export function slotPosition(index: number): [number, number] {
  const col = index % TEN_FRAME_COLUMNS;
  const row = Math.floor(index / TEN_FRAME_COLUMNS);
  const x = (col - (TEN_FRAME_COLUMNS - 1) / 2) * SPACING;
  const y = ((TEN_FRAME_ROWS - 1) / 2 - row) * SPACING;
  return [x, y];
}

export const TEN_FRAME_SLOTS = Array.from({ length: 10 }, (_, i) => i);
