import { describe, expect, it } from "vitest";
import { factVsOpinionLesson, generateFactVsOpinionQuestion } from "./factVsOpinion";

const FACTS = new Set([
  "The sun rises in the east.",
  "A triangle has three sides.",
  "There are seven days in a week.",
  "Dogs are mammals.",
  "Water freezes at 32 degrees Fahrenheit.",
  "A week has more days than a weekend.",
]);
const OPINIONS = new Set([
  "Chocolate ice cream is the best flavor.",
  "Puppies are the cutest animals.",
  "Winter is the worst season.",
  "Blue is the prettiest color.",
  "Roses are the most beautiful flowers.",
  "Math is more fun than reading.",
  "Soccer is the best sport to play.",
]);

describe("generateFactVsOpinionQuestion", () => {
  it("always answers Fact or Opinion correctly for the quoted sentence", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateFactVsOpinionQuestion(3);
      const sentence = q.prompt.match(/"(.+)"/)?.[1] as string;
      if (FACTS.has(sentence)) expect(q.correctAnswer).toBe("Fact");
      if (OPINIONS.has(sentence)) expect(q.correctAnswer).toBe("Opinion");
      expect(q.choices.sort()).toEqual(["Fact", "Opinion"]);
    }
  });

  it("at high levels, draws from the harder tier of factual-sounding-but-subjective sentences", () => {
    let sawHardTierSentence = false;
    for (let i = 0; i < 50; i++) {
      const q = generateFactVsOpinionQuestion(9);
      const sentence = q.prompt.match(/"(.+)"/)?.[1] as string;
      if (sentence.includes("Roses") || sentence.includes("Math is more fun") || sentence.includes("Soccer")) {
        sawHardTierSentence = true;
      }
    }
    expect(sawHardTierSentence).toBe(true);
  });
});

describe("factVsOpinionLesson", () => {
  it("has a multiple-choice-multi FAST question whose correctAnswers are all facts", () => {
    const { fastQuestion } = factVsOpinionLesson;
    expect(fastQuestion.interaction).toBe("multiple-choice-multi");
    expect(fastQuestion.visual).toBeUndefined();
    for (const answer of fastQuestion.correctAnswers ?? []) {
      expect(FACTS.has(answer)).toBe(true);
    }
    const nonAnswers = fastQuestion.choices.filter((c) => !fastQuestion.correctAnswers?.includes(c));
    for (const nonAnswer of nonAnswers) {
      expect(OPINIONS.has(nonAnswer)).toBe(true);
    }
  });

  it("provides sentence/isFact textVisual content for every film room step and the guided example", () => {
    for (const step of factVsOpinionLesson.filmRoomScript) {
      expect(step.textVisual?.["sentence"]).toBeDefined();
      expect(step.textVisual?.["isFact"]).toBeDefined();
    }
    expect(factVsOpinionLesson.guidedExample.textVisual?.["sentence"]).toBeDefined();
  });
});
