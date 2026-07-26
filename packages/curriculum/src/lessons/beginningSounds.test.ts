import { describe, expect, it } from "vitest";
import { beginningSoundsLesson, generateBeginningSoundsQuestion } from "./beginningSounds";

const LETTER_OF: Record<string, string> = {
  ball: "b", bear: "b", bike: "b", bug: "b",
  sun: "s", sock: "s", snake: "s", seal: "s",
  moon: "m", mouse: "m", milk: "m", map: "m",
  tiger: "t", top: "t", turtle: "t", tent: "t",
  fish: "f", fox: "f", fan: "f", frog: "f",
  pig: "p", pen: "p", pizza: "p", pool: "p",
  nose: "n", nest: "n", nut: "n", net: "n",
  van: "v", vase: "v", violin: "v", vet: "v",
  dog: "d", duck: "d", door: "d", dice: "d",
  zebra: "z", zoo: "z", zipper: "z", zero: "z",
};

describe("generateBeginningSoundsQuestion", () => {
  it("always answers with a word sharing the target's first letter", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateBeginningSoundsQuestion(5);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      expect(LETTER_OF[q.correctAnswer]).toBe(LETTER_OF[target]);
      expect(q.choices.length).toBe(3);
      expect(q.choices).toContain(q.correctAnswer);
    }
  });

  it("never gives a distractor that shares the target's first letter", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateBeginningSoundsQuestion(5);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      for (const d of distractors) {
        expect(LETTER_OF[d]).not.toBe(LETTER_OF[target]);
      }
    }
  });

  it("at high levels, sometimes includes a distractor from the target's confusable neighbor letter", () => {
    const confusablePairs: Record<string, string> = { b: "p", m: "n", f: "v", t: "d", s: "z" };
    let sawConfusable = false;
    for (let i = 0; i < 200; i++) {
      const q = generateBeginningSoundsQuestion(9);
      const target = q.prompt.match(/"(.+)"/)?.[1] as string;
      const targetLetter = LETTER_OF[target] as string;
      const confusableLetter = confusablePairs[targetLetter];
      const distractors = q.choices.filter((c) => c !== q.correctAnswer);
      if (confusableLetter && distractors.some((d) => LETTER_OF[d] === confusableLetter)) {
        sawConfusable = true;
      }
    }
    expect(sawConfusable).toBe(true);
  });
});

describe("beginningSoundsLesson", () => {
  it("has an audio-read FAST question", () => {
    expect(beginningSoundsLesson.fastQuestion.interaction).toBe("audio-read");
    expect(beginningSoundsLesson.fastQuestion.choices).toContain(beginningSoundsLesson.fastQuestion.correctAnswer);
  });

  it("provides textVisual word content for every film room step and the guided example", () => {
    for (const step of beginningSoundsLesson.filmRoomScript) {
      expect(step.textVisual).toBeDefined();
    }
    expect(beginningSoundsLesson.guidedExample.textVisual).toBeDefined();
  });
});
