import type { Lesson, Question } from "../types";

const SKILL_ID = "story-setting";

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

interface StoryEntry {
  snippet: string;
  setting: string;
  character: string;
  object: string;
}

// Easy tier: the non-setting distractors are clearly a character and an
// object — nothing place-like about either.
const EASY_STORIES: StoryEntry[] = [
  { snippet: "Mia dug in the sand and built a castle by the crashing waves.", setting: "the beach", character: "Mia", object: "a castle" },
  { snippet: "The kids read books quietly at their table in the library.", setting: "the library", character: "the kids", object: "books" },
  { snippet: "At the farm, the chickens pecked at corn near the big red barn.", setting: "the farm", character: "the chickens", object: "corn" },
];

// Hard tier: one distractor is itself a place-sounding word that's really
// just a detail INSIDE the setting, not the overall setting — forcing a
// choice between the specific detail and the actual overall location.
const HARD_STORIES: StoryEntry[] = [
  { snippet: "Snow fell outside the cabin while the family warmed up by the fireplace in the forest.", setting: "the forest", character: "the family", object: "the fireplace" },
  { snippet: "Late at night, the campers told stories around the campfire in the forest.", setting: "the forest", character: "the campers", object: "the campfire" },
  { snippet: "Ben waited on the library steps outside while his mom searched for a parking spot.", setting: "the library", character: "Ben", object: "a parking spot" },
];

/** Lever 1 (number range): higher levels draw from the harder, detail-vs-setting tier. */
function pickBank(level: number): StoryEntry[] {
  return level > 5 ? HARD_STORIES : EASY_STORIES;
}

function buildQuestion(level: number): { entry: StoryEntry; choices: string[] } {
  const entry = randomFrom(pickBank(level));
  const choices = shuffle([entry.setting, entry.character, entry.object]);
  return { entry, choices };
}

export function generateStorySettingQuestion(level: number): Question {
  const { entry, choices } = buildQuestion(level);

  return {
    id: randomId("story-setting-q"),
    skillId: SKILL_ID,
    interaction: "multiple-choice-single",
    prompt: `${entry.snippet} Where does this story take place?`,
    choices,
    correctAnswer: entry.setting,
    tier1Hint: "The setting is the place (and sometimes the time) the story happens in — not who's in it and not an object mentioned along the way.",
    explanation: `The setting is ${entry.setting} — that's where the story happens. "${entry.character}" is a character and "${entry.object}" is a thing in the story, not the setting itself.`,
  };
}

function buildFastQuestion(): Question {
  const { entry, choices } = buildQuestion(2);

  return {
    id: randomId("story-setting-fast"),
    skillId: SKILL_ID,
    interaction: "picture-select",
    prompt: `${entry.snippet} Tap the picture that shows where this story takes place.`,
    choices,
    correctAnswer: entry.setting,
    tier1Hint: "Look for the place — not the character or the object.",
    explanation: `The story takes place in ${entry.setting}.`,
  };
}

export const storySettingLesson: Lesson = {
  skillId: SKILL_ID,
  title: "Story Setting",
  sceneKind: "story-setting",
  concept: {
    id: SKILL_ID,
    skillId: SKILL_ID,
    title: "Story Setting",
  },
  hook: 'In "Mia built a sandcastle by the waves," is the setting Mia, the sandcastle, or something else in that sentence?',
  filmRoomScript: [
    {
      caption: 'Here\'s the story: "Mia built a sandcastle by the waves."',
      visual: {},
      textVisual: { setting: "the beach" },
    },
    {
      caption: '"Mia" is a character — someone IN the story, not the place it happens.',
      visual: {},
      textVisual: { setting: "the beach" },
    },
    {
      caption: '"A sandcastle" is an object in the story — also not the place.',
      visual: {},
      textVisual: { setting: "the beach" },
    },
    {
      caption: '"By the waves" tells you WHERE this happens — the beach. That\'s the setting.',
      visual: {},
      textVisual: { setting: "the beach" },
    },
  ],
  guidedExample: {
    prompt: "The kids read books quietly in the library. Where does this story take place?",
    steps: [
      '"The kids" are characters — people in the story, not the place.',
      '"Books" are objects in the story, not the place either.',
      '"In the library" tells you the location — that\'s the setting.',
    ],
    answer: "the library",
    visual: {},
    textVisual: { setting: "the library" },
  },
  generatePracticeQuestion: generateStorySettingQuestion,
  fastQuestion: buildFastQuestion(),
  memoryAnchor: "The setting is the place the story happens — not the characters and not the objects.",
};
