import type { Lesson, Question } from "../types";

const SKILL_ID = "word-recognition";

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

interface WordEntry {
  real: string;
  nonwords: [string, string];
}

// Easy tier: nonwords share no letters with the real word — spotting the
// real word doesn't require sounding anything out closely.
const EASY_WORDS: WordEntry[] = [
  { real: "cat", nonwords: ["zil", "fom"] },
  { real: "dog", nonwords: ["wux", "kel"] },
  { real: "sun", nonwords: ["fem", "gib"] },
  { real: "hat", nonwords: ["zol", "puv"] },
];

// Hard tier: nonwords are the real word's own letters reordered — the only
// way to tell them apart is sounding each one out and checking whether it
// resolves to a word you actually know.
const HARD_WORDS: WordEntry[] = [
  { real: "cat", nonwords: ["tac", "atc"] },
  { real: "dog", nonwords: ["ogd", "gdo"] },
  { real: "sun", nonwords: ["nus", "usn"] },
  { real: "pig", nonwords: ["gip", "ipg"] },
  { real: "top", nonwords: ["otp", "tpo"] },
];

/** Lever 1 (number range): higher levels draw from the letter-anagram tier. */
function pickBank(level: number): WordEntry[] {
  return level > 5 ? HARD_WORDS : EASY_WORDS;
}

function buildQuestion(level: number): { real: string; choices: string[] } {
  const entry = randomFrom(pickBank(level));
  const choices = shuffle([entry.real, ...entry.nonwords]);
  return { real: entry.real, choices };
}

export function generateWordRecognitionQuestion(level: number): Question {
  const { real, choices } = buildQuestion(level);

  return {
    id: randomId("word-recognition-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: "Which one of these is a real word?",
    choices,
    correctAnswer: real,
    tier1Hint: "Sound out each one, letter by letter — only one of them makes a word you actually know.",
    explanation: `"${real}" is a real word you can say and that means something — the others are just letters, with no meaning attached.`,
  };
}

function buildFastQuestion(): Question {
  const { real, choices } = buildQuestion(7);

  return {
    id: randomId("word-recognition-fast"),
    skillId: SKILL_ID,
    interaction: "drag-drop-word",
    prompt: "___",
    choices,
    correctAnswer: real,
    tier1Hint: "Drag the one that's a real word into the blank.",
    explanation: `"${real}" is the real word — the others don't spell anything.`,
  };
}

export const wordRecognitionLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Word Recognition",
  sceneKind: "letter-word",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Word Recognition",
  },
  hook: '"Cat" and "tac" use the exact same three letters — so why is only one of them a real word?',
  filmRoomScript: [
    {
      caption: 'Here are the letters c-a-t, in order. Sound them out: "cat."',
      visual: {},
      textVisual: { word: "cat", isReal: "true" },
    },
    {
      caption: '"Cat" means something you know — a real animal. That\'s what makes it a word.',
      visual: {},
      textVisual: { word: "cat", isReal: "true" },
    },
    {
      caption: 'Now here are the same three letters, reordered: t-a-c. Sound it out: "tac."',
      visual: {},
      textVisual: { word: "tac", isReal: "false" },
    },
    {
      caption: '"Tac" doesn\'t mean anything — it\'s not a word you\'ve ever heard, even though it uses real letters.',
      visual: {},
      textVisual: { word: "tac", isReal: "false" },
    },
  ],
  guidedExample: {
    prompt: "Which one of these is a real word? dog / gdo / ogd",
    steps: [
      'Sound out the first one: "dog." That\'s a word you know — an animal.',
      'Sound out the second one: "gdo." That doesn\'t mean anything.',
      'Sound out the third one: "ogd." That doesn\'t mean anything either.',
    ],
    answer: "dog",
    visual: {},
    textVisual: { word: "dog", isReal: "true" },
  },
  generatePracticeQuestion: generateWordRecognitionQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "A real word is letters that sound out to something you actually know — not just any letters in order.",
};
