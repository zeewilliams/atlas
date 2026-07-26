import { describe, expect, it } from "vitest";
import { generatePredictionQuestion, predictionLesson } from "./prediction";

const CORRECT_PREDICTIONS = new Set([
  "It will start to rain.",
  "The ice cream will melt.",
  "The seeds will grow into plants.",
  "Ben will do well on his spelling test.",
  "The team will play better in the game.",
]);

describe("generatePredictionQuestion", () => {
  it("always answers with the prediction that follows from the clues", () => {
    for (let i = 0; i < 100; i++) {
      const q = generatePredictionQuestion(3);
      expect(CORRECT_PREDICTIONS.has(q.correctAnswer)).toBe(true);
      expect(q.choices.length).toBe(3);
      expect(q.choices).toContain(q.correctAnswer);
    }
  });

  it("at low levels, includes an obviously unrelated distractor", () => {
    const unrelatedPhrases = ["nap", "sandwich", "puddle"];
    let sawUnrelated = false;
    for (let i = 0; i < 50; i++) {
      const q = generatePredictionQuestion(2);
      if (q.choices.some((c) => unrelatedPhrases.some((phrase) => c.includes(phrase)))) sawUnrelated = true;
    }
    expect(sawUnrelated).toBe(true);
  });

  it("at high levels, both distractors are subtle near-misses, not an obviously unrelated event", () => {
    const unrelatedPhrases = ["paint a picture", "go to the beach"];
    for (let i = 0; i < 50; i++) {
      const q = generatePredictionQuestion(9);
      for (const choice of q.choices) {
        expect(unrelatedPhrases.includes(choice)).toBe(false);
      }
    }
  });
});

describe("predictionLesson", () => {
  it("has a multiple-choice-single FAST question", () => {
    const { fastQuestion } = predictionLesson;
    expect(fastQuestion.interaction).toBe("multiple-choice-single");
    expect(fastQuestion.choices).toContain(fastQuestion.correctAnswer);
  });

  it("provides clue/prediction textVisual content for every film room step and the guided example", () => {
    for (const step of predictionLesson.filmRoomScript) {
      expect(step.textVisual?.["clue"]).toBeDefined();
    }
    expect(predictionLesson.guidedExample.textVisual?.["prediction"]).toBeDefined();
  });
});
