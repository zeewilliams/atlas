import { describe, expect, it } from "vitest";
import { comparisonLesson, generateComparisonQuestion } from "./comparison";

describe("generateComparisonQuestion", () => {
  it("never generates equal groups and always answers Top or Bottom correctly", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateComparisonQuestion(5);
      const { countA, countB } = q.visual as { countA: number; countB: number };
      expect(countA).not.toBe(countB);

      const aIsGreater = countA > countB;
      const askedForMore = q.prompt.includes("more");
      const expectedSide = askedForMore === aIsGreater ? "Top" : "Bottom";
      expect(q.correctAnswer).toBe(expectedSide);
      expect(q.choices.sort()).toEqual(["Bottom", "Top"]);
    }
  });

  it("shrinks the gap between groups at higher levels", () => {
    let sawGapOver2AtHighLevel = false;
    for (let i = 0; i < 100; i++) {
      const q = generateComparisonQuestion(9);
      const { countA, countB } = q.visual as { countA: number; countB: number };
      if (Math.abs(countA - countB) > 2) sawGapOver2AtHighLevel = true;
    }
    expect(sawGapOver2AtHighLevel).toBe(false);
  });

  it("asks about both more and fewer across many draws", () => {
    const prompts = Array.from({ length: 50 }, () => generateComparisonQuestion(5).prompt);
    expect(prompts.some((p) => p.includes("more"))).toBe(true);
    expect(prompts.some((p) => p.includes("fewer"))).toBe(true);
  });
});

describe("comparisonLesson", () => {
  it("reuses the equal-sets scene and provides visual data for every fixed phase", () => {
    expect(comparisonLesson.sceneKind).toBe("equal-sets");
    expect(comparisonLesson.guidedExample.visual).toBeDefined();
    for (const step of comparisonLesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a multi-select FAST question whose correctAnswers match the more-or-fewer direction asked", () => {
    const { fastQuestion } = comparisonLesson;
    expect(fastQuestion.interaction).toBe("multiple-choice-multi");
    const reference = fastQuestion.visual?.["reference"] as number;
    const askForMore = fastQuestion.prompt.includes("MORE");

    const expectedMatches = fastQuestion.choices.filter((id) => {
      const count = fastQuestion.visual?.[id] as number;
      return askForMore ? count > reference : count < reference;
    });
    expect(new Set(fastQuestion.correctAnswers)).toEqual(new Set(expectedMatches));
    expect(fastQuestion.correctAnswers?.length).toBeGreaterThan(0);
    expect(fastQuestion.correctAnswers?.length).toBeLessThan(fastQuestion.choices.length);
  });
});
