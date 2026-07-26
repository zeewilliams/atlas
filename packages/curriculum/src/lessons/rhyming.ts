import type { Lesson, Question } from "../types";

const SKILL_ID = "rhyming";

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

interface RhymeFamily {
  rime: string;
  words: string[];
}

// Word families grouped by shared ending sound (rime) — the mechanism
// behind rhyming, independent of the beginning sound (onset).
const RHYME_FAMILIES: RhymeFamily[] = [
  { rime: "at", words: ["cat", "hat", "mat", "bat", "rat"] },
  { rime: "an", words: ["can", "man", "fan", "pan", "van"] },
  { rime: "ig", words: ["pig", "big", "wig", "fig", "dig"] },
  { rime: "op", words: ["top", "hop", "mop", "pop", "cop"] },
  { rime: "un", words: ["sun", "fun", "run", "bun", "pun"] },
];

function onsetOf(word: string, rime: string): string {
  return word.slice(0, word.length - rime.length);
}

/**
 * Lever 1 (number range): at low levels distractors sound nothing alike;
 * at high levels one distractor shares the target's onset letter but not
 * its rime — testing whether Zee is matching the ending sound or just the
 * starting letter.
 */
function pickDistractors(level: number, targetFamily: RhymeFamily, targetOnset: string): string[] {
  const otherFamilies = RHYME_FAMILIES.filter((f) => f.rime !== targetFamily.rime);
  const distractors: string[] = [];

  if (level > 6) {
    const onsetMatchFamily = randomFrom(otherFamilies);
    const onsetMatchWord = onsetMatchFamily.words.find((w) => w.startsWith(targetOnset));
    if (onsetMatchWord) distractors.push(onsetMatchWord);
  }

  while (distractors.length < 2) {
    const family = randomFrom(otherFamilies);
    const word = randomFrom(family.words);
    if (!distractors.includes(word)) distractors.push(word);
  }

  return distractors;
}

function buildQuestion(level: number): { target: string; correct: string; family: RhymeFamily; choices: string[] } {
  const family = randomFrom(RHYME_FAMILIES);
  const [target, correct] = shuffle(family.words).slice(0, 2) as [string, string];
  const targetOnset = onsetOf(target, family.rime);
  const distractors = pickDistractors(level, family, targetOnset);
  const choices = shuffle([correct, ...distractors]);
  return { target, correct, family, choices };
}

export function generateRhymingQuestion(level: number): Question {
  const { target, correct, family, choices } = buildQuestion(level);

  return {
    id: randomId("rhyming-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `Which word rhymes with "${target}"?`,
    choices,
    correctAnswer: correct,
    tier1Hint: `Say "${target}" out loud — which choice ends with the exact same sound, "${family.rime}"?`,
    explanation: `"${target}" and "${correct}" both end in "${family.rime}" — that's why they rhyme, even though they start differently.`,
  };
}

function buildFastQuestion(): Question {
  const { target, correct, choices } = buildQuestion(6);

  return {
    id: randomId("rhyming-fast"),
    skillId: SKILL_ID,
    interaction: "drag-drop-word",
    prompt: `Rhymes with "${target}": ___`,
    choices,
    correctAnswer: correct,
    tier1Hint: `Drag the word that ends with the same sound as "${target}".`,
    explanation: `"${correct}" rhymes with "${target}" because they share the same ending sound.`,
  };
}

export const rhymingLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Rhyming",
  sceneKind: "rhyme-pair",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Rhyming",
  },
  hook: 'If "cat" and "hat" start with totally different letters, why do they rhyme — what part of the word is actually doing the matching?',
  filmRoomScript: [
    {
      caption: 'Here\'s "cat." It has a beginning sound and an ending sound.',
      visual: {},
      textVisual: { topOnset: "c", topRime: "at", bottomOnset: "", bottomRime: "" },
    },
    {
      caption: 'Here\'s "hat." Its beginning is totally different from "cat" — but watch the ending.',
      visual: {},
      textVisual: { topOnset: "c", topRime: "at", bottomOnset: "h", bottomRime: "at" },
    },
    {
      caption: 'Both words end in the exact same sound: "at." That matching ending is what makes them rhyme.',
      visual: {},
      textVisual: { topOnset: "c", topRime: "at", bottomOnset: "h", bottomRime: "at" },
    },
    {
      caption: "The beginning can be anything — only the ending sound has to match.",
      visual: {},
      textVisual: { topOnset: "c", topRime: "at", bottomOnset: "h", bottomRime: "at" },
    },
  ],
  guidedExample: {
    prompt: 'Which word rhymes with "pan"?',
    steps: [
      'Say "pan" out loud and listen to the ending: "an."',
      'Check each choice for that same ending sound.',
      '"fan" ends in "an" too — that\'s the match.',
    ],
    answer: "fan",
    visual: {},
    textVisual: { topOnset: "p", topRime: "an", bottomOnset: "f", bottomRime: "an" },
  },
  generatePracticeQuestion: generateRhymingQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "Rhyming words can start differently, but they always end in the same sound.",
};
