export type ContextCategory = "animals" | "food" | "space" | "school" | "nature" | "family" | "sports";

export interface ContextItem {
  category: ContextCategory;
  singular: string;
  plural: string;
}

// Deliberately generic — no real names. Zee's private family details live
// only in the gitignored master skill and must never enter committed
// curriculum content (ATLAS_MASTER_SKILL.md, Security Rule 4).
const ITEMS_BY_CATEGORY: Record<ContextCategory, Array<Omit<ContextItem, "category">>> = {
  animals: [
    { singular: "puppy", plural: "puppies" },
    { singular: "bird", plural: "birds" },
    { singular: "fish", plural: "fish" },
  ],
  food: [
    { singular: "apple", plural: "apples" },
    { singular: "cookie", plural: "cookies" },
    { singular: "grape", plural: "grapes" },
  ],
  space: [
    { singular: "star", plural: "stars" },
    { singular: "rocket", plural: "rockets" },
    { singular: "planet", plural: "planets" },
  ],
  school: [
    { singular: "pencil", plural: "pencils" },
    { singular: "book", plural: "books" },
    { singular: "crayon", plural: "crayons" },
  ],
  nature: [
    { singular: "leaf", plural: "leaves" },
    { singular: "rock", plural: "rocks" },
    { singular: "flower", plural: "flowers" },
  ],
  family: [
    { singular: "sticker", plural: "stickers" },
    { singular: "toy", plural: "toys" },
    { singular: "block", plural: "blocks" },
  ],
  sports: [
    { singular: "football", plural: "footballs" },
    { singular: "goal", plural: "goals" },
    { singular: "point", plural: "points" },
  ],
};

// Sports appears ~20% of the time; the rest is split evenly across the
// other six categories (ATLAS_MASTER_SKILL.md, Lever 3 — context rotation).
const CATEGORY_WEIGHTS: Array<{ category: ContextCategory; weight: number }> = [
  { category: "sports", weight: 0.2 },
  { category: "animals", weight: 0.8 / 6 },
  { category: "food", weight: 0.8 / 6 },
  { category: "space", weight: 0.8 / 6 },
  { category: "school", weight: 0.8 / 6 },
  { category: "nature", weight: 0.8 / 6 },
  { category: "family", weight: 0.8 / 6 },
];

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1] as T;
}

export function pickContextItem(): ContextItem {
  const { category } = pickWeighted(CATEGORY_WEIGHTS);
  const items = ITEMS_BY_CATEGORY[category];
  const item = items[Math.floor(Math.random() * items.length)] as Omit<ContextItem, "category">;
  return { category, ...item };
}
