import type { Lesson, Question } from "../types";

const SKILL_ID = "fact-vs-opinion";

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

interface SentenceEntry {
  text: string;
  isFact: boolean;
}

// Easy tier: clear-cut cases — a checkable measurement/definition, or an
// obvious feeling word ("best," "cutest") that can't be proven.
const EASY_SENTENCES: SentenceEntry[] = [
  { text: "The sun rises in the east.", isFact: true },
  { text: "A triangle has three sides.", isFact: true },
  { text: "There are seven days in a week.", isFact: true },
  { text: "Dogs are mammals.", isFact: true },
  { text: "Chocolate ice cream is the best flavor.", isFact: false },
  { text: "Puppies are the cutest animals.", isFact: false },
  { text: "Winter is the worst season.", isFact: false },
  { text: "Blue is the prettiest color.", isFact: false },
];

// Hard tier: sounds factual in structure ("the most," "is a") but still
// hinges on a subjective word — can't be checked and proven the same way
// a measurement can.
const HARD_SENTENCES: SentenceEntry[] = [
  { text: "Roses are the most beautiful flowers.", isFact: false },
  { text: "Math is more fun than reading.", isFact: false },
  { text: "Soccer is the best sport to play.", isFact: false },
  { text: "Water freezes at 32 degrees Fahrenheit.", isFact: true },
  { text: "A week has more days than a weekend.", isFact: true },
];

function pickBank(level: number): SentenceEntry[] {
  return level > 5 ? HARD_SENTENCES : EASY_SENTENCES;
}

export function generateFactVsOpinionQuestion(level: number): Question {
  const entry = randomFrom(pickBank(level));
  const correctAnswer = entry.isFact ? "Fact" : "Opinion";

  return {
    id: randomId("fact-opinion-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `Is this a fact or an opinion? "${entry.text}"`,
    choices: shuffle(["Fact", "Opinion"]),
    correctAnswer,
    tier1Hint: "Ask yourself: can this be checked and proven true or false? Or is it just what someone thinks or feels?",
    explanation: entry.isFact
      ? `"${entry.text}" is a fact — it can be checked and proven true.`
      : `"${entry.text}" is an opinion — it's what someone thinks or feels, and can't be proven the same way a fact can.`,
  };
}

function buildFastQuestion(): Question {
  const facts = shuffle(EASY_SENTENCES.filter((s) => s.isFact)).slice(0, 2);
  const opinions = shuffle(EASY_SENTENCES.filter((s) => !s.isFact)).slice(0, 2);
  const entries = shuffle([...facts, ...opinions]);
  const choices = entries.map((e) => e.text);
  const correctAnswers = facts.map((f) => f.text);

  return {
    id: randomId("fact-opinion-fast"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-multi",
    prompt: "Select every sentence that is a FACT — one that can be checked and proven.",
    choices,
    correctAnswer: correctAnswers.join(","),
    correctAnswers,
    tier1Hint: "A fact can be checked and proven true or false. An opinion is just what someone thinks or feels.",
    explanation: `${correctAnswers.join(" and ")} can be checked and proven — the rest are opinions, what someone thinks or feels.`,
  };
}

export const factVsOpinionLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Fact vs. Opinion",
  sceneKind: "fact-opinion",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Fact vs. Opinion",
  },
  hook: '"The sun rises in the east" and "chocolate ice cream is the best flavor" are both sentences about the world — so why is only one of them something you could actually prove?',
  filmRoomScript: [
    {
      caption: 'Here\'s a sentence: "The sun rises in the east."',
      visual: {},
      textVisual: { sentence: "The sun rises in the east.", isFact: "true" },
    },
    {
      caption: "You could check this — watch the sunrise, look it up. It can be proven true. That makes it a fact.",
      visual: {},
      textVisual: { sentence: "The sun rises in the east.", isFact: "true" },
    },
    {
      caption: 'Here\'s a different sentence: "Chocolate ice cream is the best flavor."',
      visual: {},
      textVisual: { sentence: "Chocolate ice cream is the best flavor.", isFact: "false" },
    },
    {
      caption: 'There\'s no test that proves this true — it\'s what someone thinks or feels. That makes it an opinion.',
      visual: {},
      textVisual: { sentence: "Chocolate ice cream is the best flavor.", isFact: "false" },
    },
  ],
  guidedExample: {
    prompt: 'Is this a fact or an opinion? "A triangle has three sides."',
    steps: [
      "Ask: can this be checked and proven?",
      "Yes — you can count the sides of any triangle and get three, every time.",
      "Since it can be proven true, this is a fact.",
    ],
    answer: "Fact",
    visual: {},
    textVisual: { sentence: "A triangle has three sides.", isFact: "true" },
  },
  generatePracticeQuestion: generateFactVsOpinionQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "A fact can be checked and proven. An opinion is just what someone thinks or feels.",
};
