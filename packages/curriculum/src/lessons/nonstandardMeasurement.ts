import type { Lesson, Question, QuestionInteraction } from "../types";

const SKILL_ID = "nonstandard-measurement";

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/** Lever 1 (number range): higher levels allow longer objects to count. */
function pickLength(level: number): number {
  if (level <= 3) return randomInt(2, 4);
  if (level <= 6) return randomInt(3, 6);
  return randomInt(4, 9);
}

function buildDistractors(length: number): number[] {
  const candidates = new Set<number>();
  for (const n of [length - 1, length + 1, length - 2, length + 2]) {
    if (n >= 1 && n <= 10 && n !== length) candidates.add(n);
  }
  const distractors = Array.from(candidates).slice(0, 2);
  while (distractors.length < 2) {
    const filler = randomInt(1, 10);
    if (filler !== length && !distractors.includes(filler)) distractors.push(filler);
  }
  return distractors;
}

function buildQuestion(length: number, interaction: QuestionInteraction, prompt: string): Question {
  const distractors = buildDistractors(length);
  const choices = shuffle([length, ...distractors]).map(String);

  return {
    id: randomId("measurement-q"),
    skillId: SKILL_ID,
    interaction,
    prompt,
    choices,
    correctAnswer: String(length),
    tier1Hint: "Count the paper clips laid end to end under the object — one at a time, no skipping.",
    explanation: `The object is exactly ${length} paper clips long — that's how many units it takes to span it, end to end with no gaps or overlaps.`,
    visual: { length },
  };
}

export function generateMeasurementQuestion(level: number): Question {
  const length = pickLength(level);
  return buildQuestion(length, "multiple-choice-single", "How many paper clips long is this?");
}

function buildFastQuestion(): Question {
  const length = randomInt(3, 6);
  return buildQuestion(
    length,
    "picture-select",
    "Tap the picture that shows how many paper clips long this object is."
  );
}

export const nonstandardMeasurementLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Measuring with Paper Clips",
  sceneKind: "measurement",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Measuring with Paper Clips",
  },
  hook: "If you laid paper clips end to end next to your pencil until they matched its length, how would you know exactly how long the pencil is — without a ruler?",
  filmRoomScript: [
    {
      caption: "Here's an object we want to measure — no ruler, just paper clips.",
      visual: { length: 5 },
    },
    {
      caption: "Each paper clip is the same size — that's the unit we're counting.",
      visual: { length: 5 },
    },
    {
      caption: "Lay them end to end, no gaps, no overlaps, until they reach the end of the object.",
      visual: { length: 5 },
    },
    {
      caption: "Count the clips: 1, 2, 3, 4, 5 — the object is 5 paper clips long.",
      visual: { length: 5 },
    },
  ],
  guidedExample: {
    prompt: "How many paper clips long is this ribbon?",
    steps: [
      "Lay paper clips end to end along the ribbon, no gaps or overlaps.",
      "Count them one at a time: 1, 2, 3.",
      "The ribbon is exactly 3 paper clips long.",
    ],
    answer: "3",
    visual: { length: 3 },
  },
  generatePracticeQuestion: generateMeasurementQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "Count the units laid end to end, with no gaps — that count is the length.",
};
