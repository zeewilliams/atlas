import type { Lesson, Question } from "../types";

const SKILL_ID = "equal-sets";

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

/** Lever 1 (number range): higher levels allow larger, harder-to-subitize groups. */
function pickBaseCount(level: number): number {
  if (level <= 3) return randomInt(2, 4);
  if (level <= 6) return randomInt(3, 6);
  return randomInt(3, 8);
}

export function generateEqualSetsQuestion(level: number): Question {
  const countA = pickBaseCount(level);
  const makeEqual = Math.random() < 0.5;
  let countB = countA;

  if (!makeEqual) {
    const diff = randomInt(1, 3);
    countB = Math.random() < 0.5 ? countA + diff : countA - diff;
    countB = Math.max(1, Math.min(10, countB));
    if (countB === countA) {
      countB = countA + 2 <= 10 ? countA + 2 : Math.max(1, countA - 2);
    }
  }

  const isEqual = countA === countB;
  const correctAnswer = isEqual ? "Yes" : "No";
  const choices = shuffle(["Yes", "No"]);

  return {
    id: randomId("equal-sets-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: "Do these two groups have the same number of items?",
    choices,
    correctAnswer,
    tier1Hint: "Match one from the top row to one from the bottom row — is there a partner for every single one?",
    explanation: isEqual
      ? `Both groups have ${countA} — every single one has a partner, so they're equal.`
      : `${countA > countB ? "The top" : "The bottom"} group has extra with no partner, so they're not equal.`,
    visual: { countA, countB },
  };
}

function buildFastQuestion(): Question {
  const reference = randomInt(3, 6);
  const cardCounts: number[] = [reference];

  let firstNonMatch = reference + (Math.random() < 0.5 ? 1 : -1);
  firstNonMatch = Math.max(1, Math.min(10, firstNonMatch));
  if (firstNonMatch === reference) {
    firstNonMatch = firstNonMatch + 2 <= 10 ? firstNonMatch + 2 : firstNonMatch - 2;
  }
  cardCounts.push(firstNonMatch);

  while (cardCounts.length < 4) {
    if (Math.random() < 0.5) {
      cardCounts.push(reference);
    } else {
      let candidate = reference + randomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
      candidate = Math.max(1, Math.min(10, candidate));
      if (candidate === reference) {
        candidate = candidate + 1 <= 10 ? candidate + 1 : candidate - 1;
      }
      cardCounts.push(candidate);
    }
  }

  const shuffledCounts = shuffle(cardCounts);
  const visual: Record<string, number> = { reference };
  const choices: string[] = [];
  const correctAnswers: string[] = [];

  shuffledCounts.forEach((count, i) => {
    const id = `card-${i}`;
    choices.push(id);
    visual[id] = count;
    if (count === reference) correctAnswers.push(id);
  });

  return {
    id: randomId("equal-sets-fast"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-multi",
    prompt: "Select every group that has the same number as the reference group.",
    choices,
    correctAnswer: correctAnswers.join(","),
    correctAnswers,
    tier1Hint: "Match each one to a partner — only the groups with no leftovers match.",
    explanation: `The groups with ${reference} items match — everything else has extra or is missing some.`,
    visual,
  };
}

export const equalSetsLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Equal Sets",
  sceneKind: "equal-sets",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Equal Sets",
  },
  hook: "If one row has 5 blocks and another row has 4, can you tell they're not equal without counting either row all the way — just by matching them up one to one?",
  filmRoomScript: [
    {
      caption: "Here are two groups — one on top, one on bottom.",
      visual: { countA: 5, countB: 4 },
    },
    {
      caption: "Match each one on top to a partner on the bottom, one at a time.",
      visual: { countA: 5, countB: 4 },
    },
    {
      caption: "One on top has no partner — it's left over. That means the groups are not equal.",
      visual: { countA: 5, countB: 4 },
    },
    {
      caption: "If every single one has a partner and nobody's left over, the groups are equal.",
      visual: { countA: 4, countB: 4 },
    },
  ],
  guidedExample: {
    prompt: "Do these two groups have the same number?",
    steps: [
      "Match each one on top to one on the bottom.",
      "Every single one has a partner — nobody's left over.",
      "Same number of partners means the groups are equal.",
    ],
    answer: "Yes",
    visual: { countA: 4, countB: 4 },
  },
  generatePracticeQuestion: generateEqualSetsQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "If every one has a partner and nobody's left over, the groups are equal.",
};
