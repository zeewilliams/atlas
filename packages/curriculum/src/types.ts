export interface ChildProfile {
  name: string;
  ageYears: number;
  learningStyle: "mechanism-first";
  challengeMode: boolean;
}

export interface Concept {
  id: string;
  skillId: string;
  title: string;
}

export type QuestionInteraction =
  | "multiple-choice-single"
  | "multiple-choice-multi"
  | "drag-drop-word"
  | "drag-drop-equation"
  | "picture-select"
  | "audio-read";

export interface Question {
  id: string;
  skillId: string;
  interaction: QuestionInteraction;
  prompt: string;
  /** Ordered choices; for equation/word drag-drop these are the draggable tiles. */
  choices: string[];
  correctAnswer: string;
  /** Spoken when the first wrong attempt is made. */
  tier1Hint: string;
  /** Rendered visually + spoken after a second wrong attempt reveals the answer. */
  explanation: string;
  /** True for a twin generated to replace a two-miss question; must clear before lesson ends. */
  isTwin?: boolean;
}

export type QuestionOutcome = "first-try" | "second-try" | "missed-twice";

export interface AnsweredQuestion {
  question: Question;
  outcome: QuestionOutcome;
}

export interface SessionResult {
  skillId: string;
  answered: AnsweredQuestion[];
  firstTryRate: number;
  stars: 0 | 1 | 2 | 3;
  twinsCleared: number;
}

export interface Lesson {
  skillId: string;
  title: string;
  concept: Concept;
  /** Phase 1 — Hook: the question Zee doesn't know the answer to yet. */
  hook: string;
  /** Phase 2 — Film Room: caption script for the 3D mental-model scene. */
  filmRoomScript: string[];
  /** Phase 3 — Guided Example: coach walks one complete problem, step narration. */
  guidedExample: {
    prompt: string;
    steps: string[];
    answer: string;
  };
  /** Phase 4 — generates a fresh practice question (and twins use the same generator). */
  generatePracticeQuestion: (level: number) => Question;
  /** Phase 5 — the FAST-format question for this skill. */
  fastQuestion: Question;
  /** Phase 6 — Memory Anchor, stated by coach and repeated by the child. */
  memoryAnchor: string;
}
