import { describe, expect, it } from "vitest";
import { generateWordRecognitionQuestion, wordRecognitionLesson } from "./wordRecognition";

const REAL_WORDS = new Set(["cat", "dog", "sun", "hat", "pig", "top"]);

describe("generateWordRecognitionQuestion", () => {
  it("always answers with a real word and includes exactly one real word among the choices", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateWordRecognitionQuestion(3);
      expect(REAL_WORDS.has(q.correctAnswer)).toBe(true);
      expect(q.choices.length).toBe(3);
      const realCount = q.choices.filter((c) => REAL_WORDS.has(c)).length;
      expect(realCount).toBe(1);
    }
  });

  it("uses the letter-anagram hard tier at higher levels", () => {
    let sawAnagram = false;
    for (let i = 0; i < 50; i++) {
      const q = generateWordRecognitionQuestion(9);
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      const sortedReal = q.correctAnswer.split("").sort().join("");
      if (distractors.some((d) => d.split("").sort().join("") === sortedReal)) sawAnagram = true;
    }
    expect(sawAnagram).toBe(true);
  });
});

describe("wordRecognitionLesson", () => {
  it("has a drag-drop-word FAST question whose answer is a real word", () => {
    const { fastQuestion } = wordRecognitionLesson;
    expect(fastQuestion.interaction).toBe("drag-drop-word");
    expect(REAL_WORDS.has(fastQuestion.correctAnswer)).toBe(true);
  });

  it("provides textVisual word content for every film room step and the guided example", () => {
    for (const step of wordRecognitionLesson.filmRoomScript) {
      expect(step.textVisual).toBeDefined();
    }
    expect(wordRecognitionLesson.guidedExample.textVisual).toBeDefined();
  });
});
