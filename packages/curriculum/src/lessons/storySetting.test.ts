import { describe, expect, it } from "vitest";
import { generateStorySettingQuestion, storySettingLesson } from "./storySetting";

const SETTINGS = new Set(["the beach", "the library", "the farm", "the forest"]);

describe("generateStorySettingQuestion", () => {
  it("always answers with the setting, never the character or object", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateStorySettingQuestion(3);
      expect(SETTINGS.has(q.correctAnswer)).toBe(true);
      expect(q.choices.length).toBe(3);
      expect(q.choices).toContain(q.correctAnswer);
    }
  });

  it("at high levels, one distractor is itself a place-sounding detail rather than an unrelated object", () => {
    let sawPlaceLikeDistractor = false;
    for (let i = 0; i < 50; i++) {
      const q = generateStorySettingQuestion(9);
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      if (distractors.some((d) => d.includes("fireplace") || d.includes("campfire") || d.includes("parking"))) {
        sawPlaceLikeDistractor = true;
      }
    }
    expect(sawPlaceLikeDistractor).toBe(true);
  });
});

describe("storySettingLesson", () => {
  it("has a picture-select FAST question with no numeric visual (word-based)", () => {
    const { fastQuestion } = storySettingLesson;
    expect(fastQuestion.interaction).toBe("picture-select");
    expect(fastQuestion.visual).toBeUndefined();
    expect(SETTINGS.has(fastQuestion.correctAnswer)).toBe(true);
  });

  it("provides textVisual setting content for every film room step and the guided example", () => {
    for (const step of storySettingLesson.filmRoomScript) {
      expect(step.textVisual?.["setting"]).toBeDefined();
    }
    expect(storySettingLesson.guidedExample.textVisual?.["setting"]).toBeDefined();
  });
});
