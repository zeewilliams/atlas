import type { Lesson, Question, QuestionInteraction } from "../types";
import { pickContextItem } from "../contextBank";

const SKILL_ID = "subtraction-within-10";

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

/**
 * Lever 1 (number range): higher levels allow a zero remainder — the
 * hardest case, since there's nothing left over to anchor a quick visual
 * count against.
 */
function pickNumbers(level: number): { start: number; removed: number } {
  const start = level <= 3 ? randomInt(4, 6) : level <= 6 ? randomInt(5, 8) : randomInt(6, 10);
  const maxRemoved = level <= 6 ? Math.max(1, start - 1) : start;
  const removed = randomInt(1, maxRemoved);
  return { start, removed };
}

function buildDistractors(start: number, removed: number, correct: number): number[] {
  const candidates = new Set<number>();
  candidates.add(removed); // common mistake: states the number taken away
  candidates.add(start); // common mistake: forgot to subtract at all
  for (const n of [correct - 1, correct + 1]) {
    if (n >= 0 && n <= 10 && n !== correct) candidates.add(n);
  }
  candidates.delete(correct);
  const distractors = Array.from(candidates).slice(0, 2);
  while (distractors.length < 2) {
    const filler = Math.floor(Math.random() * 11);
    if (filler !== correct && !distractors.includes(filler)) distractors.push(filler);
  }
  return distractors;
}

function buildQuestion(
  start: number,
  removed: number,
  interaction: QuestionInteraction = "multiple-choice-single"
): Question {
  const correct = start - removed;
  const { plural } = pickContextItem();
  const distractors = buildDistractors(start, removed, correct);
  const choices = shuffle([correct, ...distractors]).map(String);

  return {
    id: randomId("subtraction-q"),
    skillId: SKILL_ID,
    interaction,
    prompt: `You have ${start} ${plural}. You give ${removed} away. How many ${plural} are left?`,
    choices,
    correctAnswer: String(correct),
    tier1Hint: `Start with ${start}, take away ${removed} — count what's left.`,
    explanation: `${start} - ${removed} = ${correct}, because after taking ${removed} away from ${start}, ${correct} are left.`,
    visual: { start, removed },
  };
}

export function generateSubtractionQuestion(level: number): Question {
  const { start, removed } = pickNumbers(level);
  return buildQuestion(start, removed);
}

function buildFastQuestion(): Question {
  const { start, removed } = pickNumbers(5);
  return buildQuestion(start, removed, "audio-read");
}

export const subtractionWithin10Lesson: Lesson = {
  skillId: SKILL_ID,
  title: "Subtraction within 10",
  sceneKind: "take-away",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Subtraction within 10",
  },
  hook: "If you have 7 blocks and give 3 away, how many are left — and how would you show it without counting from 1 again?",
  filmRoomScript: [
    {
      caption: "Here's a group of 7. Every one of them is real, countable, right here.",
      visual: { start: 7, removed: 0 },
    },
    {
      caption: "Taking away means some of them leave the group — 3 of them, gone.",
      visual: { start: 7, removed: 3 },
    },
    {
      caption: "What's left is what you count now — not the ones that left, just what's still here.",
      visual: { start: 7, removed: 3 },
    },
    {
      caption: "7 take away 3 leaves 4. Every time, because taking away only ever shrinks the group.",
      visual: { start: 7, removed: 3 },
    },
  ],
  guidedExample: {
    prompt: "You have 6 apples. You give 2 away. How many apples are left?",
    steps: [
      "Start with a group of 6 apples.",
      "2 apples leave the group — they're given away.",
      "Count what's still in the group: 1, 2, 3, 4. That's 4 apples left.",
    ],
    answer: "4",
    visual: { start: 6, removed: 2 },
  },
  generatePracticeQuestion: generateSubtractionQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "What's taken away leaves the group — count what's still there, not what left.",
};
