import type { AnsweredQuestion, Question, QuestionOutcome, SessionResult } from "../types";

const RENDER_LOCK_MS = 600;
const WRONG_FIRST_LOCK_MS = 900;

export type SubmitResult =
  | { type: "locked"; remainingMs: number }
  | { type: "wrong-first"; hint: string; lockMs: number }
  | { type: "revealed"; correctAnswer: string; explanation: string }
  | { type: "correct"; outcome: QuestionOutcome }
  | { type: "session-complete" };

interface ActiveQuestionState {
  question: Question;
  attempts: number;
  removedChoices: string[];
  lockUntil: number;
}

export interface MasterySessionOptions {
  skillId: string;
  initialQuestions: Question[];
  generatePracticeQuestion: (level: number) => Question;
  level?: number;
  /** Injectable clock for deterministic tests. */
  now?: () => number;
}

/**
 * Anti-guessing mastery engine (see ATLAS_MASTER_SKILL.md, Phase 4).
 * Every question renders with an input lock, wrong answers remove the
 * choice and escalate to a demonstrated explanation + queued twin, and
 * only first-try answers count toward the mastery score.
 */
export class MasterySession {
  readonly skillId: string;
  private queue: Question[];
  private readonly generatePracticeQuestion: (level: number) => Question;
  private readonly level: number;
  private readonly now: () => number;
  private current: ActiveQuestionState | null = null;
  private readonly answered: AnsweredQuestion[] = [];
  private readonly totalOriginal: number;

  constructor(options: MasterySessionOptions) {
    this.skillId = options.skillId;
    this.queue = [...options.initialQuestions];
    this.totalOriginal = options.initialQuestions.length;
    this.generatePracticeQuestion = options.generatePracticeQuestion;
    this.level = options.level ?? 5;
    this.now = options.now ?? (() => Date.now());
    this.advance();
  }

  private advance(): void {
    const next = this.queue.shift();
    if (!next) {
      this.current = null;
      return;
    }
    this.current = {
      question: next,
      attempts: 0,
      removedChoices: [],
      lockUntil: this.now() + RENDER_LOCK_MS,
    };
  }

  /** Current question with any removed (wrong, tier-1) choices filtered out. */
  getCurrentQuestion(): Question | null {
    if (!this.current) return null;
    const { question, removedChoices } = this.current;
    return {
      ...question,
      choices: question.choices.filter((c) => !removedChoices.includes(c)),
    };
  }

  isLocked(): boolean {
    if (!this.current) return false;
    return this.now() < this.current.lockUntil;
  }

  getLockRemainingMs(): number {
    if (!this.current) return 0;
    return Math.max(0, this.current.lockUntil - this.now());
  }

  isComplete(): boolean {
    return this.current === null;
  }

  getProgress(): { answeredOriginal: number; totalOriginal: number; pendingTwins: number } {
    const answeredOriginal = this.answered.filter((a) => !a.question.isTwin).length;
    const pendingTwins =
      this.queue.filter((q) => q.isTwin).length + (this.current?.question.isTwin ? 1 : 0);
    return { answeredOriginal, totalOriginal: this.totalOriginal, pendingTwins };
  }

  submitAnswer(choice: string): SubmitResult {
    if (!this.current) return { type: "session-complete" };
    if (this.isLocked()) return { type: "locked", remainingMs: this.getLockRemainingMs() };

    const state = this.current;
    state.attempts += 1;
    const isCorrect = choice === state.question.correctAnswer;

    if (isCorrect) {
      const outcome: QuestionOutcome = state.attempts === 1 ? "first-try" : "second-try";
      this.answered.push({ question: state.question, outcome });
      this.advance();
      return { type: "correct", outcome };
    }

    if (state.attempts === 1) {
      state.removedChoices.push(choice);
      state.lockUntil = this.now() + WRONG_FIRST_LOCK_MS;
      return { type: "wrong-first", hint: state.question.tier1Hint, lockMs: WRONG_FIRST_LOCK_MS };
    }

    // Second miss: reveal, explain, queue a twin, move on.
    this.answered.push({ question: state.question, outcome: "missed-twice" });
    const twin: Question = {
      ...this.generatePracticeQuestion(this.level),
      skillId: state.question.skillId,
      isTwin: true,
    };
    this.queue.push(twin);
    const { correctAnswer, explanation } = state.question;
    this.advance();
    return { type: "revealed", correctAnswer, explanation };
  }

  getResult(): SessionResult {
    const original = this.answered.filter((a) => !a.question.isTwin);
    const twins = this.answered.filter((a) => a.question.isTwin);
    const firstTryCount = original.filter((a) => a.outcome === "first-try").length;
    const firstTryRate = original.length > 0 ? firstTryCount / original.length : 0;
    const stars = firstTryRate >= 0.95 ? 3 : firstTryRate >= 0.8 ? 2 : firstTryRate >= 0.6 ? 1 : 0;
    const twinsCleared = twins.filter((a) => a.outcome !== "missed-twice").length;

    return {
      skillId: this.skillId,
      answered: this.answered,
      firstTryRate,
      stars,
      twinsCleared,
    };
  }
}
