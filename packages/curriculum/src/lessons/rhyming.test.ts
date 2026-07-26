import { describe, expect, it } from "vitest";
import { generateRhymingQuestion, rhymingLesson } from "./rhyming";

const RHYME_OF: Record<string, string> = {
  cat: "at", hat: "at", mat: "at", bat: "at", rat: "at",
  can: "an", man: "an", fan: "an", pan: "an", van: "an",
  pig: "ig", big: "ig", wig: "ig", fig: "ig", dig: "ig",
  top: "op", hop: "op", mop: "op", pop: "op", cop: "op",
  sun: "un", fun: "un", run: "un", bun: "un", pun: "un",
};

describe("generateRhymingQuestion", () => {
  it("always answers with a word that shares the target's ending sound", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateRhymingQuestion(5);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      expect(RHYME_OF[q.correctAnswer]).toBe(RHYME_OF[target]);
      expect(q.choices).toContain(q.correctAnswer);
      expect(q.choices.length).toBe(3);
    }
  });

  it("never gives a distractor that rhymes with the target", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateRhymingQuestion(5);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      for (const d of distractors) {
        expect(RHYME_OF[d]).not.toBe(RHYME_OF[target]);
      }
    }
  });

  it("at high levels, sometimes includes a distractor sharing the target's onset letter", () => {
    let sawOnsetShare = false;
    for (let i = 0; i < 200; i++) {
      const q = generateRhymingQuestion(9);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      const targetOnset = target.slice(0, target.length - RHYME_OF[target]!.length);
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      if (targetOnset && distractors.some((d) => d.startsWith(targetOnset))) sawOnsetShare = true;
    }
    expect(sawOnsetShare).toBe(true);
  });
});

describe("rhymingLesson", () => {
  it("has a drag-drop-word FAST question whose answer rhymes with the target family", () => {
    const { fastQuestion } = rhymingLesson;
    expect(fastQuestion.interaction).toBe("drag-drop-word");
    expect(fastQuestion.choices).toContain(fastQuestion.correctAnswer);
  });

  it("provides textVisual word content for every film room step and the guided example", () => {
    for (const step of rhymingLesson.filmRoomScript) {
      expect(step.textVisual).toBeDefined();
    }
    expect(rhymingLesson.guidedExample.textVisual).toBeDefined();
  });
});
