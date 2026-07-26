import type { Lesson, Question } from "../types";

const SKILL_ID = "prediction";

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

interface PredictionEntry {
  clues: string;
  correct: string;
  contradicts: string;
  unrelated: string;
  /** A second, subtler contradiction — plausible-sounding but still wrong. */
  contradicts2: string;
}

// Easy tier: one distractor obviously contradicts the clues, the other is
// a random unrelated event — both easy to rule out.
const EASY_PREDICTIONS: PredictionEntry[] = [
  {
    clues: "Dark clouds filled the sky and the wind picked up.",
    correct: "It will start to rain.",
    contradicts: "The sun will get brighter.",
    unrelated: "The dog will take a nap.",
    contradicts2: "The clouds will disappear instantly.",
  },
  {
    clues: "The ice cream was left outside in the hot sun.",
    correct: "The ice cream will melt.",
    contradicts: "The ice cream will freeze harder.",
    unrelated: "The ice cream will turn into a sandwich.",
    contradicts2: "The ice cream will stay perfectly frozen.",
  },
  {
    clues: "Mia planted seeds and watered them every day.",
    correct: "The seeds will grow into plants.",
    contradicts: "The seeds will turn back into a seed packet.",
    unrelated: "The seeds will become a puddle.",
    contradicts2: "The seeds will stay seeds forever.",
  },
];

// Hard tier: both distractors are subtly wrong (one direct contradiction,
// one near-miss that sounds plausible but still contradicts the clues) —
// no obviously-silly option to eliminate on sight.
const HARD_PREDICTIONS: PredictionEntry[] = [
  {
    clues: "Ben studied his spelling words every night this week.",
    correct: "Ben will do well on his spelling test.",
    contradicts: "Ben will forget how to spell any word.",
    unrelated: "Ben will paint a picture.",
    contradicts2: "Ben will decide not to take the test.",
  },
  {
    clues: "The team practiced passing and shooting all season.",
    correct: "The team will play better in the game.",
    contradicts: "The team will forget how to play.",
    unrelated: "The team will go to the beach.",
    contradicts2: "The team will play exactly the same as before practicing.",
  },
];

/** Lever 1 (number range): higher levels swap the obviously-unrelated distractor for a subtler near-miss. */
function pickDistractors(level: number, entry: PredictionEntry): string[] {
  if (level > 6) return [entry.contradicts, entry.contradicts2];
  return [entry.contradicts, entry.unrelated];
}

function pickBank(level: number): PredictionEntry[] {
  return level > 6 ? HARD_PREDICTIONS : EASY_PREDICTIONS;
}

function buildQuestion(level: number): { entry: PredictionEntry; choices: string[] } {
  const entry = randomFrom(pickBank(level));
  const distractors = pickDistractors(level, entry);
  const choices = shuffle([entry.correct, ...distractors]);
  return { entry, choices };
}

export function generatePredictionQuestion(level: number): Question {
  const { entry, choices } = buildQuestion(level);

  return {
    id: randomId("prediction-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `${entry.clues} What will probably happen next?`,
    choices,
    correctAnswer: entry.correct,
    tier1Hint: "A good prediction uses the clues you were just given — it doesn't contradict them, and it isn't a random guess.",
    explanation: `"${entry.correct}" fits the clues you were given — the other choices either contradict what already happened or have nothing to do with it.`,
  };
}

function buildFastQuestion(): Question {
  const { entry, choices } = buildQuestion(2);

  return {
    id: randomId("prediction-fast"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `${entry.clues} Tap the ending that makes sense with the clues.`,
    choices,
    correctAnswer: entry.correct,
    tier1Hint: "Use only what the clues already told you — don't guess something unrelated.",
    explanation: `"${entry.correct}" is the prediction that follows from the clues given.`,
  };
}

export const predictionLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Prediction",
  sceneKind: "prediction-clues",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Prediction",
  },
  hook: "If dark clouds fill the sky and the wind picks up, is guessing it will start snowing on a summer day a good prediction — or does a good prediction have to use the clues you were already given?",
  filmRoomScript: [
    {
      caption: "Here are the clues: dark clouds filled the sky, and the wind picked up.",
      visual: {},
      textVisual: { clue: "Dark clouds filled the sky and the wind picked up.", prediction: "" },
    },
    {
      caption: "A prediction has to use those clues — not ignore them, and not contradict them.",
      visual: {},
      textVisual: { clue: "Dark clouds filled the sky and the wind picked up.", prediction: "" },
    },
    {
      caption: "Dark clouds and wind are what happens right before rain — so that's the smart guess.",
      visual: {},
      textVisual: { clue: "Dark clouds filled the sky and the wind picked up.", prediction: "It will start to rain." },
    },
    {
      caption: "\"The sun will get brighter\" contradicts the clues — that's not a prediction, that's ignoring what you were told.",
      visual: {},
      textVisual: { clue: "Dark clouds filled the sky and the wind picked up.", prediction: "It will start to rain." },
    },
  ],
  guidedExample: {
    prompt: "Mia planted seeds and watered them every day. What will probably happen next?",
    steps: [
      "The clues: seeds were planted, and watered every day.",
      "That's exactly what makes a seed grow — so use that clue.",
      "The seeds will grow into plants — that's the prediction the clues support.",
    ],
    answer: "The seeds will grow into plants.",
    visual: {},
    textVisual: {
      clue: "Mia planted seeds and watered them every day.",
      prediction: "The seeds will grow into plants.",
    },
  },
  generatePracticeQuestion: generatePredictionQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "A good prediction uses the clues you already have — it doesn't ignore them or contradict them.",
};
