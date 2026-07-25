import { describe, expect, it } from "vitest";
import { equalSetsLesson, generateEqualSetsQuestion } from "./equalSets";

describe("generateEqualSetsQuestion", () => {
  it("answers Yes only when countA equals countB, and No otherwise", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateEqualSetsQuestion(5);
      const { countA, countB } = q.visual as { countA: number; countB: number };
      expect(q.correctAnswer).toBe(countA === countB ? "Yes" : "No");
      expect(q.choices.sort()).toEqual(["No", "Yes"]);
    }
  });

  it("keeps both counts within 1-10", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateEqualSetsQuestion(8);
      const { countA, countB } = q.visual as { countA: number; countB: number };
      expect(countA).toBeGreaterThanOrEqual(1);
      expect(countA).toBeLessThanOrEqual(10);
      expect(countB).toBeGreaterThanOrEqual(1);
      expect(countB).toBeLessThanOrEqual(10);
    }
  });

  it("produces both Yes and No answers across many draws", () => {
    const answers = Array.from({ length: 60 }, () => generateEqualSetsQuestion(5).correctAnswer);
    expect(answers).toContain("Yes");
    expect(answers).toContain("No");
  });
});

describe("equalSetsLesson", () => {
  it("uses the equal-sets scene and provides visual data for every fixed phase", () => {
    expect(equalSetsLesson.sceneKind).toBe("equal-sets");
    expect(equalSetsLesson.guidedExample.visual).toBeDefined();
    for (const step of equalSetsLesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a multi-select FAST question whose correctAnswers are exactly the cards matching the reference count", () => {
    const { fastQuestion } = equalSetsLesson;
    expect(fastQuestion.interaction).toBe("multiple-choice-multi");
    const reference = fastQuestion.visual?.["reference"];
    expect(reference).toBeDefined();

    const expectedMatches = fastQuestion.choices.filter(
      (id) => fastQuestion.visual?.[id] === reference
    );
    expect(new Set(fastQuestion.correctAnswers)).toEqual(new Set(expectedMatches));
    expect(fastQuestion.correctAnswers?.length).toBeGreaterThan(0);
    expect(fastQuestion.correctAnswers?.length).toBeLessThan(fastQuestion.choices.length);
  });
});
