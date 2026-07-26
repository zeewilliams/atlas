import type { Lesson, Question, QuestionInteraction } from "../types";

const SKILL_ID = "equation-structure";

type BlankPosition = "first" | "second" | "sum";

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

/** Lever 1 (number range): higher levels allow larger sums (up to 10). */
function pickAddends(level: number): [number, number] {
  const maxSum = level <= 3 ? 6 : level <= 6 ? 8 : 10;
  const a = randomInt(1, maxSum - 1);
  const b = randomInt(1, maxSum - a);
  return [a, b];
}

function buildDistractors(correct: number, siblings: number[]): number[] {
  const candidates = new Set<number>();
  for (const s of siblings) {
    if (s !== correct) candidates.add(s);
  }
  for (const n of [correct - 1, correct + 1]) {
    if (n >= 0 && n <= 10 && n !== correct) candidates.add(n);
  }
  candidates.delete(correct);
  const distractors = Array.from(candidates).slice(0, 2);
  while (distractors.length < 2) {
    const filler = randomInt(0, 10);
    if (filler !== correct && !distractors.includes(filler)) distractors.push(filler);
  }
  return distractors;
}

function buildEquationQuestion(
  a: number,
  b: number,
  blankPosition: BlankPosition,
  interaction: QuestionInteraction
): Question {
  const sum = a + b;
  let prompt: string;
  let correct: number;
  let siblings: number[];
  let blank: number;

  if (blankPosition === "first") {
    prompt = `___ + ${b} = ${sum}`;
    correct = a;
    siblings = [b, sum];
    blank = 1;
  } else if (blankPosition === "second") {
    prompt = `${a} + ___ = ${sum}`;
    correct = b;
    siblings = [a, sum];
    blank = 2;
  } else {
    prompt = `${a} + ${b} = ___`;
    correct = sum;
    siblings = [a, b];
    blank = 3;
  }

  const distractors = buildDistractors(correct, siblings);
  const choices = shuffle([correct, ...distractors]).map(String);

  return {
    id: randomId("equation-structure-q"),
    skillId: SKILL_ID,
    interaction,
    prompt,
    choices,
    correctAnswer: String(correct),
    tier1Hint:
      blankPosition === "sum"
        ? `Add ${a} and ${b} together to find the total.`
        : `The equals sign means both sides match — figure out what's missing so ${a} and ${b} still add up to ${sum}.`,
    explanation: `${a} + ${b} = ${sum}, no matter which part is missing — the equals sign means both sides are the same amount.`,
    visual: { a, b, sum, blank },
  };
}

export function generateEquationStructureQuestion(level: number): Question {
  const [a, b] = pickAddends(level);
  const blankPosition = randomFrom<BlankPosition>(["first", "second", "sum"]);
  return buildEquationQuestion(a, b, blankPosition, "multiple-choice-single");
}

function buildFastQuestion(): Question {
  const [a, b] = pickAddends(6);
  const blankPosition = randomFrom<BlankPosition>(["first", "second", "sum"]);
  return buildEquationQuestion(a, b, blankPosition, "drag-drop-equation");
}

export const equationStructureLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Equation Structure",
  sceneKind: "part-whole",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Equation Structure",
  },
  hook: "In 4 + 3 = 7, does the equals sign mean 'here comes the answer,' or does it mean both sides are the same amount? What if the blank wasn't on the right side at all?",
  filmRoomScript: [
    {
      caption: "Here's 4 and 3 making a whole of 7 — the top bar and the two parts below are exactly the same total length.",
      visual: { a: 4, b: 3, blank: 0 },
    },
    {
      caption: "The equals sign just means both sides match — it doesn't care which part is missing.",
      visual: { a: 4, b: 3, blank: 0 },
    },
    {
      caption: "If the first part is missing, you still know the whole and the other part — so you can find it.",
      visual: { a: 4, b: 3, blank: 1 },
    },
    {
      caption: "Same idea no matter which piece is blank: the parts always add up to the whole.",
      visual: { a: 4, b: 3, blank: 3 },
    },
  ],
  guidedExample: {
    prompt: "___ + 3 = 7",
    steps: [
      "The whole is 7, and one part is 3.",
      "Find the missing part: 7 take away 3 is 4.",
      "4 + 3 = 7 — both sides match.",
    ],
    answer: "4",
    visual: { a: 4, b: 3, blank: 1 },
  },
  generatePracticeQuestion: generateEquationStructureQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "The equals sign means both sides match — the blank can be any part, not just the answer.",
};
