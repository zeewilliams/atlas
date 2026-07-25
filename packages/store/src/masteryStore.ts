import { create } from "zustand";
import { MasterySession } from "@atlas/curriculum";
import type { MasterySessionOptions, Question, SessionResult, SubmitResult } from "@atlas/curriculum";

interface Progress {
  answeredOriginal: number;
  totalOriginal: number;
  pendingTwins: number;
}

interface MasteryStoreState {
  session: MasterySession | null;
  currentQuestion: Question | null;
  isLocked: boolean;
  lockRemainingMs: number;
  progress: Progress;
  lastResult: SubmitResult | null;
  isComplete: boolean;
  startSession: (options: MasterySessionOptions) => void;
  submitAnswer: (choice: string) => SubmitResult;
  /** Call on an interval while locked so the UI can show a live countdown. */
  tick: () => void;
  getResult: () => SessionResult | null;
  reset: () => void;
}

const EMPTY_PROGRESS: Progress = { answeredOriginal: 0, totalOriginal: 0, pendingTwins: 0 };

function snapshot(session: MasterySession) {
  return {
    currentQuestion: session.getCurrentQuestion(),
    isLocked: session.isLocked(),
    lockRemainingMs: session.getLockRemainingMs(),
    progress: session.getProgress(),
    isComplete: session.isComplete(),
  };
}

export const useMasteryStore = create<MasteryStoreState>((set, get) => ({
  session: null,
  currentQuestion: null,
  isLocked: false,
  lockRemainingMs: 0,
  progress: EMPTY_PROGRESS,
  lastResult: null,
  isComplete: false,

  startSession: (options) => {
    const session = new MasterySession(options);
    set({ session, lastResult: null, ...snapshot(session) });
  },

  submitAnswer: (choice) => {
    const { session } = get();
    if (!session) return { type: "session-complete" };
    const result = session.submitAnswer(choice);
    set({ lastResult: result, ...snapshot(session) });
    return result;
  },

  tick: () => {
    const { session } = get();
    if (!session) return;
    set(snapshot(session));
  },

  getResult: () => {
    const { session } = get();
    return session ? session.getResult() : null;
  },

  reset: () =>
    set({
      session: null,
      currentQuestion: null,
      isLocked: false,
      lockRemainingMs: 0,
      progress: EMPTY_PROGRESS,
      lastResult: null,
      isComplete: false,
    }),
}));
