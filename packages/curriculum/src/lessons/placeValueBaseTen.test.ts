import { describe, expect, it } from "vitest";
import { generatePlaceValueQuestion, placeValueBaseTenLesson } from "./placeValueBaseTen";

describe("generatePlaceValueQuestion", () => {
  it("always keeps tens at 1 and ones within 0-9, with correctAnswer matching one of the two variants", () => {
    for (let i = 0; i < 100; i++) {
      const q = generatePlaceValueQuestion(5);
      const { tens, ones } = q.visual as { tens: number; ones: number };
      expect(tens).toBe(1);
      expect(ones).toBeGreaterThanOrEqual(0);
      expect(ones).toBeLessThanOrEqual(9);

      const number = 10 + ones;
      const answer = Number(q.correctAnswer);
      expect([ones, number]).toContain(answer);
      expect(q.choices).toContain(q.correctAnswer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });

  it("only allows harder ones counts (6-9) at higher levels", () => {
    let sawHardAtLowLevel = false;
    for (let i = 0; i < 200; i++) {
      const q = generatePlaceValueQuestion(2);
      const { ones } = q.visual as { tens: number; ones: number };
      if (ones >= 6) sawHardAtLowLevel = true;
    }
    expect(sawHardAtLowLevel).toBe(false);
  });

  it("produces both decompose and compose phrasing across many draws", () => {
    const prompts = Array.from({ length: 50 }, () => generatePlaceValueQuestion(5).prompt);
    const hasDecompose = prompts.some((p) => p.includes("is 1 ten and how many ones"));
    const hasCompose = prompts.some((p) => p.includes("make what number"));
    expect(hasDecompose).toBe(true);
    expect(hasCompose).toBe(true);
  });
});

describe("placeValueBaseTenLesson", () => {
  it("uses the base-ten scene and provides visual data for every fixed phase", () => {
    expect(placeValueBaseTenLesson.sceneKind).toBe("base-ten");
    expect(placeValueBaseTenLesson.guidedExample.visual).toBeDefined();
    for (const step of placeValueBaseTenLesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a FAST question using the drag-drop-equation interaction with a single blank", () => {
    expect(placeValueBaseTenLesson.fastQuestion.interaction).toBe("drag-drop-equation");
    expect(placeValueBaseTenLesson.fastQuestion.prompt).toContain("___");
  });
});
