import { describe, expect, it } from "vitest";
import { equationStructureLesson, generateEquationStructureQuestion } from "./equationStructure";

describe("generateEquationStructureQuestion", () => {
  it("keeps a + b = sum true regardless of which slot is blank", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateEquationStructureQuestion(5);
      const { a, b, sum, blank } = q.visual as { a: number; b: number; sum: number; blank: number };
      expect(a + b).toBe(sum);
      expect([1, 2, 3]).toContain(blank);

      const correct = blank === 1 ? a : blank === 2 ? b : sum;
      expect(Number(q.correctAnswer)).toBe(correct);
      expect(q.choices).toContain(q.correctAnswer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });

  it("keeps the sum within 6 at low levels and allows up to 10 at high levels", () => {
    let sawSumOver6AtLowLevel = false;
    for (let i = 0; i < 100; i++) {
      const q = generateEquationStructureQuestion(2);
      const { sum } = q.visual as { sum: number };
      if (sum > 6) sawSumOver6AtLowLevel = true;
    }
    expect(sawSumOver6AtLowLevel).toBe(false);

    let sawSumOver8AtHighLevel = false;
    for (let i = 0; i < 100; i++) {
      const q = generateEquationStructureQuestion(9);
      const { sum } = q.visual as { sum: number };
      if (sum > 8) sawSumOver8AtHighLevel = true;
    }
    expect(sawSumOver8AtHighLevel).toBe(true);
  });

  it("produces questions with the blank in all three positions across many draws", () => {
    const blanks = Array.from(
      { length: 100 },
      () => (generateEquationStructureQuestion(6).visual as { blank: number }).blank
    );
    expect(new Set(blanks)).toEqual(new Set([1, 2, 3]));
  });
});

describe("equationStructureLesson", () => {
  it("uses the part-whole scene and provides visual data for every fixed phase", () => {
    expect(equationStructureLesson.sceneKind).toBe("part-whole");
    expect(equationStructureLesson.guidedExample.visual).toBeDefined();
    for (const step of equationStructureLesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a FAST question using the drag-drop-equation interaction with a single blank", () => {
    expect(equationStructureLesson.fastQuestion.interaction).toBe("drag-drop-equation");
    expect(equationStructureLesson.fastQuestion.prompt).toContain("___");
  });
});
