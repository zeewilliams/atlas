import type { Lesson, Question } from "../types";

const SKILL_ID = "make-a-ten";

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

/**
 * Lever 1 (number range): as level rises, harder addends (smaller gap-to-ten
 * pairs, e.g. 1 or 2) enter the pool alongside the easy ones near 10.
 */
function pickAddend(level: number): number {
  const easy = [7, 8, 9];
  const mid = [4, 5, 6];
  const hard = [1, 2, 3];
  if (level <= 3) return randomFrom(easy);
  if (level <= 6) return randomFrom([...easy, ...mid]);
  return randomFrom([...easy, ...mid, ...hard]);
}

function buildDistractors(addend: number, correct: number): number[] {
  const candidates = new Set<number>();
  // Common mistake: restating the known addend instead of the missing one.
  if (addend !== correct) candidates.add(addend);
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

export function generateMakeATenQuestion(level: number): Question {
  const addend = pickAddend(level);
  const correct = 10 - addend;
  const distractors = buildDistractors(addend, correct);
  const choices = shuffle([correct, ...distractors]).map(String);

  return {
    id: randomId("make-a-ten-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `${addend} + ? = 10`,
    choices,
    correctAnswer: String(correct),
    tier1Hint: `Count up from ${addend} to 10 — how many more do you need?`,
    explanation: `${addend} + ${correct} = 10, because ${addend} and ${correct} together fill all ten slots in the ten-frame.`,
  };
}

function buildFastQuestion(): Question {
  const addend = randomFrom([6, 7, 8]);
  const correct = 10 - addend;
  const distractors = buildDistractors(addend, correct);
  const choices = shuffle([correct, ...distractors]).map(String);

  return {
    id: randomId("make-a-ten-fast"),
    skillId: SKILL_ID,
    interaction: "drag-drop-equation",
    prompt: `${addend} + ___ = 10`,
    choices,
    correctAnswer: String(correct),
    tier1Hint: `Drag the number that fills the rest of the ten-frame.`,
    explanation: `${addend} + ${correct} = 10.`,
  };
}

export const makeATenLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Make a Ten",
  concept: {
    id: "make-a-ten",
    skillId: SKILL_ID,
    title: "Make a Ten",
  },
  hook: "If a ten-frame has 8 dots in it, how many empty spots are left — and how do you know without counting one by one?",
  filmRoomScript: [
    "This is a ten-frame. It always has exactly ten slots — two rows of five.",
    "When 8 slots are filled, the empty slots are what's left of 10.",
    "You don't need to count the filled ones again — you only count what's missing.",
    "8 filled and 2 empty. 8 + 2 = 10, every time, because the frame only ever holds ten.",
  ],
  guidedExample: {
    prompt: "6 + ? = 10",
    steps: [
      "Fill the ten-frame with 6 dots.",
      "Count the empty slots left in the frame: 7, 8, 9, 10 — that's 4 empty slots.",
      "6 + 4 = 10.",
    ],
    answer: "4",
  },
  generatePracticeQuestion: generateMakeATenQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "Whatever's in the ten-frame, the empty slots are what's left of ten.",
};
