import type { Lesson, Question } from "../types";

const SKILL_ID = "describing-words";

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

interface AdjectiveEntry {
  noun: string;
  adjective: string;
  verb: string;
  otherNoun: string;
  /** A real adjective, but one that describes otherNoun, not noun — the harder tier. */
  otherAdjective: string;
}

const ADJECTIVE_BANK: AdjectiveEntry[] = [
  { noun: "ball", adjective: "round", verb: "kick", otherNoun: "shoe", otherAdjective: "fluffy" },
  { noun: "dog", adjective: "fluffy", verb: "bark", otherNoun: "leash", otherAdjective: "hot" },
  { noun: "sky", adjective: "cloudy", verb: "fly", otherNoun: "bird", otherAdjective: "soft" },
  { noun: "soup", adjective: "hot", verb: "stir", otherNoun: "bowl", otherAdjective: "round" },
  { noun: "cat", adjective: "soft", verb: "purr", otherNoun: "tail", otherAdjective: "cloudy" },
];

/**
 * Lever 1 (number range): low levels pair the adjective against a verb and
 * an unrelated noun (easy to rule out by part of speech alone). High
 * levels swap the noun distractor for a real adjective that describes a
 * different thing in the sentence — forcing a match to THIS noun, not
 * just "is this word a describing word at all."
 */
function pickDistractors(level: number, entry: AdjectiveEntry): string[] {
  if (level > 6) return [entry.verb, entry.otherAdjective];
  return [entry.verb, entry.otherNoun];
}

export function generateDescribingWordsQuestion(level: number): Question {
  const entry = randomFrom(ADJECTIVE_BANK);
  const distractors = pickDistractors(level, entry);
  const choices = shuffle([entry.adjective, ...distractors]);

  return {
    id: randomId("describing-words-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `Which word describes the ${entry.noun}?`,
    choices,
    correctAnswer: entry.adjective,
    tier1Hint: `A describing word tells you more about the ${entry.noun} — like its size, shape, color, or how it feels. It isn't an action and it isn't a different thing.`,
    explanation: `"${entry.adjective}" describes the ${entry.noun} — it changes how you picture it. "${entry.verb}" is an action, not a description.`,
  };
}

function buildFastQuestion(): Question {
  const entries = shuffle(ADJECTIVE_BANK).slice(0, 2);
  const [first, second] = entries as [AdjectiveEntry, AdjectiveEntry];
  const before1 = "The ";
  const after1 = ` ${first.noun} sat there. `;
  const before2 = "The ";
  const after2 = ` ${second.noun} moved.`;

  const choices = shuffle([
    first.adjective,
    second.adjective,
    first.verb,
    second.otherNoun,
  ]);
  const correctAnswers = [first.adjective, second.adjective];

  return {
    id: randomId("describing-words-fast"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-multi",
    prompt: `${before1}${first.adjective}${after1}${before2}${second.adjective}${after2} Select every describing word (adjective) in these sentences.`,
    choices,
    correctAnswer: correctAnswers.join(","),
    correctAnswers,
    tier1Hint: "A describing word tells you more about a person, place, or thing — it isn't an action word and it isn't the thing itself.",
    explanation: `"${first.adjective}" and "${second.adjective}" are the describing words — they tell you what the nouns are like, not what they do.`,
  };
}

export const describingWordsLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Describing Words",
  sceneKind: "adjective-highlight",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Describing Words",
  },
  hook: 'In "the round ball," is "round" telling you what the ball IS, what it DOES, or something else about it?',
  filmRoomScript: [
    {
      caption: 'Here\'s a sentence: "The round ball bounced."',
      visual: {},
      textVisual: { before: "The ", adjective: "round", after: " ball bounced.", noun: "ball" },
    },
    {
      caption: '"Round" isn\'t the ball, and it isn\'t an action — it tells you what the ball is LIKE.',
      visual: {},
      textVisual: { before: "The ", adjective: "round", after: " ball bounced.", noun: "ball" },
    },
    {
      caption: 'That\'s what a describing word (adjective) does — it changes how you picture the noun it\'s attached to.',
      visual: {},
      textVisual: { before: "The ", adjective: "round", after: " ball bounced.", noun: "ball" },
    },
    {
      caption: '"Bounced" tells you what the ball DID — that\'s a different job, an action word, not a describing word.',
      visual: {},
      textVisual: { before: "The round ball ", adjective: "bounced", after: ".", noun: "ball" },
    },
  ],
  guidedExample: {
    prompt: "Which word describes the dog? fluffy / bark / leash",
    steps: [
      '"Bark" is something the dog does — that\'s an action, not a description.',
      '"Leash" is a different thing entirely, not a description of the dog.',
      '"Fluffy" tells you what the dog is like — that\'s the describing word.',
    ],
    answer: "fluffy",
    visual: {},
    textVisual: { before: "The ", adjective: "fluffy", after: " dog ran.", noun: "dog" },
  },
  generatePracticeQuestion: generateDescribingWordsQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "A describing word tells you what something is LIKE — not what it does and not what it is.",
};
