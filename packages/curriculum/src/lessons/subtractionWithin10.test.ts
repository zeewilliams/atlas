import { describe, expect, it } from "vitest";
import { generateSubtractionQuestion, subtractionWithin10Lesson } from "./subtractionWithin10";

describe("generateSubtractionQuestion", () => {
  it("always computes correctAnswer as start - removed from the visual data", () => {
    for (let i = 0; i < 50; i++) {
      const q = generateSubtractionQuestion(5);
      const { start, removed } = q.visual as { start: number; removed: number };
      expect(Number(q.correctAnswer)).toBe(start - removed);
      expect(q.choices).toContain(q.correctAnswer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });

  it("keeps start within 1-10 and removed within 0-start at every level", () => {
    for (const level of [1, 4, 5, 8, 10]) {
      for (let i = 0; i < 30; i++) {
        const q = generateSubtractionQuestion(level);
        const { start, removed } = q.visual as { start: number; removed: number };
        expect(start).toBeGreaterThanOrEqual(1);
        expect(start).toBeLessThanOrEqual(10);
        expect(removed).toBeGreaterThanOrEqual(1);
        expect(removed).toBeLessThanOrEqual(start);
      }
    }
  });

  it("only allows a zero remainder at higher levels", () => {
    let sawZeroAtLowLevel = false;
    for (let i = 0; i < 200; i++) {
      const q = generateSubtractionQuestion(3);
      if (Number(q.correctAnswer) === 0) sawZeroAtLowLevel = true;
    }
    expect(sawZeroAtLowLevel).toBe(false);
  });

  it("keeps the prompt in sync with the visual start/removed values", () => {
    const q = generateSubtractionQuestion(5);
    const { start, removed } = q.visual as { start: number; removed: number };
    expect(q.prompt).toContain(String(start));
    expect(q.prompt).toContain(String(removed));
  });
});

describe("subtractionWithin10Lesson", () => {
  it("uses the take-away scene and provides visual data for every fixed phase", () => {
    expect(subtractionWithin10Lesson.sceneKind).toBe("take-away");
    expect(subtractionWithin10Lesson.guidedExample.visual).toBeDefined();
    for (const step of subtractionWithin10Lesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a FAST question using the audio-read interaction", () => {
    expect(subtractionWithin10Lesson.fastQuestion.interaction).toBe("audio-read");
  });
});
