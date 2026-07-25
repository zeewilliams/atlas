import type { Lesson, Question, QuestionInteraction } from "../types";

const SKILL_ID = "place-value-base-ten";

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/**
 * Lever 1 (number range): low levels favor small, easily-subitized ones
 * counts (1-3); higher levels allow the full 1-9 range, including counts
 * that are harder to tell apart at a glance (6-9).
 */
function pickOnes(level: number): number {
  const easy = [1, 2, 3];
  const mid = [4, 5];
  const hard = [6, 7, 8, 9];
  if (level <= 3) return randomFrom(easy);
  if (level <= 6) return randomFrom([...easy, ...mid]);
  return randomFrom([...easy, ...mid, ...hard]);
}

function buildDecomposeDistractors(number: number, ones: number): number[] {
  const candidates = new Set<number>();
  candidates.add(number); // restates the whole number instead of just the ones
  candidates.add(10); // reflexively answers "ten"
  for (const n of [ones - 1, ones + 1]) {
    if (n >= 0 && n <= 9 && n !== ones) candidates.add(n);
  }
  candidates.delete(ones);
  const distractors = Array.from(candidates).slice(0, 2);
  while (distractors.length < 2) {
    const filler = randomInt(0, 9);
    if (filler !== ones && !distractors.includes(filler)) distractors.push(filler);
  }
  return distractors;
}

function buildComposeDistractors(ones: number, number: number): number[] {
  const candidates = new Set<number>();
  candidates.add(ones); // forgot to add the ten
  candidates.add(10); // stopped at the ten, ignored the ones
  for (const n of [number - 1, number + 1]) {
    if (n >= 11 && n <= 19 && n !== number) candidates.add(n);
  }
  candidates.delete(number);
  const distractors = Array.from(candidates).slice(0, 2);
  while (distractors.length < 2) {
    const filler = randomInt(11, 19);
    if (filler !== number && !distractors.includes(filler)) distractors.push(filler);
  }
  return distractors;
}

function buildDecomposeQuestion(ones: number, interaction: QuestionInteraction): Question {
  const number = 10 + ones;
  const distractors = buildDecomposeDistractors(number, ones);
  const choices = shuffle([ones, ...distractors]).map(String);

  return {
    id: randomId("place-value-q"),
    skillId: SKILL_ID,
    interaction,
    prompt: `${number} is 1 ten and how many ones?`,
    choices,
    correctAnswer: String(ones),
    tier1Hint: `${number} is a ten-rod plus loose ones — count only the loose ones.`,
    explanation: `${number} = 1 ten and ${ones} ones, because the ten-rod is already ten, so what's left is ${ones}.`,
    visual: { tens: 1, ones },
  };
}

function buildComposeQuestion(ones: number, interaction: QuestionInteraction): Question {
  const number = 10 + ones;
  const distractors = buildComposeDistractors(ones, number);
  const choices = shuffle([number, ...distractors]).map(String);

  return {
    id: randomId("place-value-q"),
    skillId: SKILL_ID,
    interaction,
    prompt:
      interaction === "drag-drop-equation"
        ? `1 ten and ${ones} ones make ___`
        : `1 ten and ${ones} ones make what number?`,
    choices,
    correctAnswer: String(number),
    tier1Hint: `A ten-rod is already 10 — just add the ${ones} loose ones on top.`,
    explanation: `1 ten and ${ones} ones make ${number}, because the ten-rod is 10 and ${ones} more makes ${number}.`,
    visual: { tens: 1, ones },
  };
}

export function generatePlaceValueQuestion(level: number): Question {
  const ones = pickOnes(level);
  return Math.random() < 0.5
    ? buildDecomposeQuestion(ones, "multiple-choice-single")
    : buildComposeQuestion(ones, "multiple-choice-single");
}

function buildFastQuestion(): Question {
  const ones = randomFrom([3, 5, 7]);
  return buildComposeQuestion(ones, "drag-drop-equation");
}

export const placeValueBaseTenLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Place Value: Base Ten Models",
  sceneKind: "base-ten",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Place Value: Base Ten Models",
  },
  hook: "A ten-rod is already worth ten all by itself. If you had one ten-rod and 4 loose cubes next to it, what number is that?",
  filmRoomScript: [
    {
      caption: "This is a ten-rod. It's ten unit cubes, fused into one solid piece — always worth exactly ten.",
      visual: { tens: 1, ones: 0 },
    },
    {
      caption: "These are loose ones. Each one is worth exactly one, and they haven't been grouped into a ten yet.",
      visual: { tens: 0, ones: 4 },
    },
    {
      caption: "Put them together: one ten-rod and 4 loose ones.",
      visual: { tens: 1, ones: 4 },
    },
    {
      caption: "1 ten and 4 ones is 14 — the ten-rod counts as ten, then you add the loose ones on top.",
      visual: { tens: 1, ones: 4 },
    },
  ],
  guidedExample: {
    prompt: "1 ten and 6 ones make what number?",
    steps: [
      "Start with one ten-rod — that's worth 10 all by itself.",
      "Add 6 loose ones next to it.",
      "10 and 6 more is 16.",
    ],
    answer: "16",
    visual: { tens: 1, ones: 6 },
  },
  generatePracticeQuestion: generatePlaceValueQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "A ten-rod is always ten — count the loose ones, then add them to ten.",
};
