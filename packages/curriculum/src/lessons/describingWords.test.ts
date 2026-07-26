import { describe, expect, it } from "vitest";
import { describingWordsLesson, generateDescribingWordsQuestion } from "./describingWords";

const ADJECTIVES = new Set(["round", "fluffy", "cloudy", "hot", "soft"]);

describe("generateDescribingWordsQuestion", () => {
  it("always answers with the adjective for the noun in the prompt", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateDescribingWordsQuestion(3);
      expect(ADJECTIVES.has(q.correctAnswer)).toBe(true);
      expect(q.choices.length).toBe(3);
      expect(q.choices).toContain(q.correctAnswer);
    }
  });

  it("at high levels, includes a real adjective distractor that describes a different noun", () => {
    let sawAdjectiveDistractor = false;
    for (let i = 0; i < 100; i++) {
      const q = generateDescribingWordsQuestion(9);
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      if (distractors.some((d) => ADJECTIVES.has(d))) sawAdjectiveDistractor = true;
    }
    expect(sawAdjectiveDistractor).toBe(true);
  });

  it("at low levels, distractors are a verb and an unrelated noun, never another adjective", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateDescribingWordsQuestion(2);
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      for (const d of distractors) {
        expect(ADJECTIVES.has(d)).toBe(false);
      }
    }
  });
});

describe("describingWordsLesson", () => {
  it("has a multiple-choice-multi FAST question whose correctAnswers are both adjectives", () => {
    const { fastQuestion } = describingWordsLesson;
    expect(fastQuestion.interaction).toBe("multiple-choice-multi");
    expect(fastQuestion.visual).toBeUndefined();
    for (const answer of fastQuestion.correctAnswers ?? []) {
      expect(ADJECTIVES.has(answer)).toBe(true);
    }
    expect(fastQuestion.correctAnswers?.length).toBe(2);
  });

  it("provides textVisual word content for every film room step and the guided example", () => {
    for (const step of describingWordsLesson.filmRoomScript) {
      expect(step.textVisual).toBeDefined();
    }
    expect(describingWordsLesson.guidedExample.textVisual).toBeDefined();
  });
});
