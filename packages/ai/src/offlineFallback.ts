import type { ChildProfile, Concept, Question, SessionResult } from "@atlas/curriculum";
import type { BereaAIProvider, HomeworkContext } from "./types";

const MEMORY_ANCHORS: Record<string, string> = {
  "make-a-ten": "Whatever's in the ten-frame, the empty slots are what's left of ten.",
  "subtraction-within-10": "What's taken away leaves the group — count what's still there, not what left.",
};

/**
 * Pre-written, deterministic responses. Always available — this is the
 * guarantee that Atlas never breaks without internet.
 */
export class OfflineFallbackProvider implements BereaAIProvider {
  isAvailable(): boolean {
    return true;
  }

  async generateExplanation(concept: Concept, _childProfile: ChildProfile): Promise<string> {
    return `Let's look at how ${concept.title} actually works, step by step.`;
  }

  async generateHint(question: Question, attempts: number): Promise<string> {
    if (attempts <= 1) return question.tier1Hint;
    return `${question.tier1Hint} Here's the answer: ${question.correctAnswer}. ${question.explanation}`;
  }

  async generatePostGame(session: SessionResult): Promise<string> {
    const pct = Math.round(session.firstTryRate * 100);
    const twinNote =
      session.twinsCleared > 0
        ? ` ${session.twinsCleared} follow-up question${session.twinsCleared === 1 ? "" : "s"} needed a second look, and got cleared.`
        : "";
    return `${pct}% first-try on ${session.skillId.replace(/-/g, " ")} today.${twinNote} Worth reviewing anything marked "missed twice" together.`;
  }

  async generateMemoryAnchor(skill: string): Promise<string> {
    return MEMORY_ANCHORS[skill] ?? `Remember what made this one click today.`;
  }

  async scanHomework(_imageData: string): Promise<HomeworkContext> {
    return {
      skillsDetected: [],
      rawSummary: "Homework scanning needs an internet connection — try again when you're back online.",
    };
  }
}
