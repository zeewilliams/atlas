import type { Lesson, Question } from "../types";

const SKILL_ID = "beginning-sounds";

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

// Words grouped by their beginning sound (onset letter). The confusable
// neighbors (p, n, v, d, z) get real groups too, so the harder distractor
// tier below has actual words to draw from instead of being dead code.
const SOUND_GROUPS: Record<string, string[]> = {
  b: ["ball", "bear", "bike", "bug"],
  s: ["sun", "sock", "snake", "seal"],
  m: ["moon", "mouse", "milk", "map"],
  t: ["tiger", "top", "turtle", "tent"],
  f: ["fish", "fox", "fan", "frog"],
  p: ["pig", "pen", "pizza", "pool"],
  n: ["nose", "nest", "nut", "net"],
  v: ["van", "vase", "violin", "vet"],
  d: ["dog", "duck", "door", "dice"],
  z: ["zebra", "zoo", "zipper", "zero"],
};

// True phonetic near-neighbors — same place of articulation, voiced vs
// unvoiced. A harder, still-legitimate distractor at high levels, since
// telling these apart is a genuinely finer-grained sound distinction.
const CONFUSABLE_LETTER: Record<string, string> = {
  b: "p",
  m: "n",
  f: "v",
  t: "d",
  s: "z",
};

const LETTERS = Object.keys(SOUND_GROUPS);

/**
 * Lever 1 (number range): low levels draw two clearly different letters
 * for the distractor groups; high levels swap one in for the target's
 * confusable phonetic neighbor when a group for that letter exists.
 */
function pickDistractorLetters(level: number, targetLetter: string): [string, string] {
  const confusable = CONFUSABLE_LETTER[targetLetter];
  const useConfusable = level > 6 && !!confusable && !!SOUND_GROUPS[confusable];
  const excluded = useConfusable ? [targetLetter, confusable as string] : [targetLetter];
  const remaining = shuffle(LETTERS.filter((l) => !excluded.includes(l)));
  const second = remaining[0] as string;
  return useConfusable ? [confusable as string, second] : [second, remaining[1] as string];
}

function buildQuestion(level: number): { target: string; correct: string; letter: string; choices: string[] } {
  const letter = randomFrom(LETTERS);
  const group = SOUND_GROUPS[letter] as string[];
  const [target, correct] = shuffle(group).slice(0, 2) as [string, string];

  const distractorLetters = pickDistractorLetters(level, letter);
  const distractors = distractorLetters.map((l) => randomFrom(SOUND_GROUPS[l] as string[]));
  const choices = shuffle([correct, ...distractors]);
  return { target, correct, letter, choices };
}

export function generateBeginningSoundsQuestion(level: number): Question {
  const { target, correct, letter, choices } = buildQuestion(level);

  return {
    id: randomId("beginning-sounds-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `Which word starts with the same sound as "${target}"?`,
    choices,
    correctAnswer: correct,
    tier1Hint: `Say "${target}" out loud — which choice starts with that same "${letter}" sound?`,
    explanation: `"${target}" and "${correct}" both start with the "${letter}" sound — everything after the first sound doesn't matter for this.`,
  };
}

function buildFastQuestion(): Question {
  const { target, correct, letter, choices } = buildQuestion(6);

  return {
    id: randomId("beginning-sounds-fast"),
    skillId: SKILL_ID,
    interaction: "audio-read",
    prompt: `Which word starts with the same sound as "${target}"?`,
    choices,
    correctAnswer: correct,
    tier1Hint: `Listen for the "${letter}" sound at the start of each word.`,
    explanation: `"${correct}" starts with the same "${letter}" sound as "${target}".`,
  };
}

export const beginningSoundsLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Beginning Sounds",
  sceneKind: "sound-match",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Beginning Sounds",
  },
  hook: '"Ball" and "bike" don\'t look anything alike after the first letter — so what exactly makes them start the same way?',
  filmRoomScript: [
    {
      caption: 'Here\'s "ball." Listen to the very first sound: "b."',
      visual: {},
      textVisual: { topWord: "ball", bottomWord: "", matches: "false" },
    },
    {
      caption: 'Here\'s "bike." Its first sound is "b" too — even though the rest of the word is completely different.',
      visual: {},
      textVisual: { topWord: "ball", bottomWord: "bike", matches: "true" },
    },
    {
      caption: 'Now compare "ball" to "sun" — the first sound is "s," not "b." Different beginning sound.',
      visual: {},
      textVisual: { topWord: "ball", bottomWord: "sun", matches: "false" },
    },
    {
      caption: "Only the very first sound matters for this — not the length or the rest of the word.",
      visual: {},
      textVisual: { topWord: "ball", bottomWord: "bike", matches: "true" },
    },
  ],
  guidedExample: {
    prompt: 'Which word starts with the same sound as "moon"?',
    steps: [
      'Say "moon" out loud and isolate the first sound: "m."',
      'Check each choice for that same starting sound.',
      '"mouse" starts with "m" too — that\'s the match.',
    ],
    answer: "mouse",
    visual: {},
    textVisual: { topWord: "moon", bottomWord: "mouse", matches: "true" },
  },
  generatePracticeQuestion: generateBeginningSoundsQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "Only the very first sound has to match — the rest of the word can be completely different.",
};
