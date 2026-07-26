import { describe, expect, it } from "vitest";
import type { ChildProfile, Question, SessionResult } from "@atlas/curriculum";
import { GeminiProvider } from "./geminiProvider";
import { OfflineFallbackProvider } from "./offlineFallback";
import { getBereaAI } from "./index";

const CHILD: ChildProfile = {
  name: "Zee",
  ageYears: 5,
  learningStyle: "mechanism-first",
  challengeMode: false,
};

const QUESTION: Question = {
  id: "q1",
  skillId: "make-a-ten",
  interaction: "multiple-choice-single",
  prompt: "8 + ? = 10",
  choices: ["1", "2", "3"],
  correctAnswer: "2",
  tier1Hint: "Count up from 8 to 10.",
  explanation: "8 needs 2 more to reach 10.",
};

const SESSION: SessionResult = {
  skillId: "make-a-ten",
  answered: [],
  firstTryRate: 0.8,
  stars: 2,
  twinsCleared: 0,
};

describe("GeminiProvider without an API key", () => {
  it("reports itself unavailable", () => {
    expect(new GeminiProvider(undefined).isAvailable()).toBe(false);
  });
});

describe("getBereaAI with no GEMINI_API_KEY", () => {
  const berea = getBereaAI(undefined);

  it("still returns explanations, hints, memory anchors, and post-game summaries", async () => {
    await expect(berea.generateExplanation({ id: "c1", skillId: "make-a-ten", title: "Make a Ten" }, CHILD)).resolves
      .toBeTypeOf("string");
    await expect(berea.generateHint(QUESTION, 1)).resolves.toBe(QUESTION.tier1Hint);
    await expect(berea.generateMemoryAnchor("make-a-ten")).resolves.toBeTypeOf("string");
    const summary = await berea.generatePostGame(SESSION);
    expect(summary).toContain("80%");
  });

  it("matches the dedicated offline fallback provider's output directly", async () => {
    const fallback = new OfflineFallbackProvider();
    await expect(berea.generatePostGame(SESSION)).resolves.toBe(await fallback.generatePostGame(SESSION));
  });
});
