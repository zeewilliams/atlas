import type { Lesson, Question } from "../types";

const SKILL_ID = "comparison";

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
 * Lever 1 (number range): higher levels shrink the gap between the two
 * groups, so telling them apart takes closer counting instead of an
 * obvious visual difference.
 */
function pickCounts(level: number): [number, number] {
  const gap = level <= 3 ? randomInt(3, 4) : level <= 6 ? randomInt(2, 3) : randomInt(1, 2);
  const base = randomInt(2, 8);
  let other = Math.random() < 0.5 ? base + gap : base - gap;
  other = Math.max(1, Math.min(10, other));
  if (other === base) {
    other = base + gap <= 10 ? base + gap : Math.max(1, base - gap);
  }
  return [base, other];
}

export function generateComparisonQuestion(level: number): Question {
  const [countA, countB] = pickCounts(level);
  const askForMore = Math.random() < 0.5;
  const aIsGreater = countA > countB;
  const correctSide = askForMore === aIsGreater ? "Top" : "Bottom";
  const choices = shuffle(["Top", "Bottom"]);
  const diff = Math.abs(countA - countB);
  const greaterSide = aIsGreater ? "Top" : "Bottom";
  const lesserSide = aIsGreater ? "bottom" : "top";

  return {
    id: randomId("comparison-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: askForMore ? "Which group has more?" : "Which group has fewer?",
    choices,
    correctAnswer: correctSide,
    tier1Hint:
      "Match one from the top to one from the bottom — whichever side has extra with no partner is the one that's different.",
    explanation: `${greaterSide} has ${diff} more than ${lesserSide} — that's the side with leftovers after pairing.`,
    visual: { countA, countB },
  };
}

function buildFastQuestion(): Question {
  const reference = randomInt(3, 6);
  const askForMore = Math.random() < 0.5;

  let matchCandidate = askForMore ? reference + randomInt(1, 3) : reference - randomInt(1, 3);
  matchCandidate = Math.max(1, Math.min(10, matchCandidate));

  let nonMatchCandidate = askForMore ? reference - randomInt(1, 3) : reference + randomInt(1, 3);
  nonMatchCandidate = Math.max(1, Math.min(10, nonMatchCandidate));

  const cardCounts = [matchCandidate, nonMatchCandidate];
  while (cardCounts.length < 4) {
    const candidate = Math.max(1, Math.min(10, reference + randomInt(-4, 4)));
    cardCounts.push(candidate);
  }

  const shuffledCounts = shuffle(cardCounts);
  const visual: Record<string, number> = { reference };
  const choices: string[] = [];
  const correctAnswers: string[] = [];

  shuffledCounts.forEach((count, i) => {
    const id = `card-${i}`;
    choices.push(id);
    visual[id] = count;
    const matches = askForMore ? count > reference : count < reference;
    if (matches) correctAnswers.push(id);
  });

  return {
    id: randomId("comparison-fast"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-multi",
    prompt: askForMore
      ? "Select every group that has MORE than the reference group."
      : "Select every group that has FEWER than the reference group.",
    choices,
    correctAnswer: correctAnswers.join(","),
    correctAnswers,
    tier1Hint:
      "Match each one to a partner with the reference group — leftovers on the group's side means more, leftovers on the reference side means fewer.",
    explanation: askForMore
      ? `Groups with more than ${reference} items match.`
      : `Groups with fewer than ${reference} items match.`,
    visual,
  };
}

export const comparisonLesson: Lesson = {
  skillId: SKILL_ID,
  title: "More or Fewer",
  // Same pairing mechanism as Equal Sets — "more/fewer" is just asking
  // which side the leftover sits on, not a different visual model.
  sceneKind: "equal-sets",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "More or Fewer",
  },
  hook: "If one row has 6 blocks and another has 4, which row has more — and how can you tell just by matching them up, without counting either row all the way?",
  filmRoomScript: [
    {
      caption: "Here are two groups again — matched up just like before.",
      visual: { countA: 6, countB: 4 },
    },
    {
      caption: "This time, someone has extra that doesn't have a partner.",
      visual: { countA: 6, countB: 4 },
    },
    {
      caption: "Whoever has the leftover has more — the other side has fewer.",
      visual: { countA: 6, countB: 4 },
    },
    {
      caption: "Top has 2 extra with no partner, so top has more and bottom has fewer.",
      visual: { countA: 6, countB: 4 },
    },
  ],
  guidedExample: {
    prompt: "Which group has more?",
    steps: [
      "Match each one on top to one on the bottom.",
      "Top still has 1 left over with no partner.",
      "The side with leftovers has more — so top has more.",
    ],
    answer: "Top",
    visual: { countA: 5, countB: 4 },
  },
  generatePracticeQuestion: generateComparisonQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "Whoever's left over after matching has more — the other side has fewer.",
};
