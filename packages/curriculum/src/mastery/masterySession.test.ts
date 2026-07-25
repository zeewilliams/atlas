import { describe, expect, it } from "vitest";
import { MasterySession } from "./masterySession";
import type { Question } from "../types";

function makeQuestion(id: string, correctAnswer = "2"): Question {
  return {
    id,
    skillId: "make-a-ten",
    interaction: "multiple-choice-single",
    prompt: `8 + ? = 10`,
    choices: ["1", "2", "3"],
    correctAnswer,
    tier1Hint: "Count up from 8 to 10.",
    explanation: "8 needs 2 more to reach 10.",
  };
}

describe("MasterySession", () => {
  it("locks input for 600ms on render and rejects early submissions", () => {
    let t = 1_000;
    const session = new MasterySession({
      skillId: "make-a-ten",
      initialQuestions: [makeQuestion("q1")],
      generatePracticeQuestion: () => makeQuestion("twin"),
      now: () => t,
    });

    expect(session.isLocked()).toBe(true);
    expect(session.submitAnswer("2")).toEqual({ type: "locked", remainingMs: 600 });

    t += 600;
    expect(session.isLocked()).toBe(false);
  });

  it("removes the wrong choice and locks 900ms on the first miss", () => {
    let t = 0;
    const session = new MasterySession({
      skillId: "make-a-ten",
      initialQuestions: [makeQuestion("q1")],
      generatePracticeQuestion: () => makeQuestion("twin"),
      now: () => t,
    });
    t += 600;

    const result = session.submitAnswer("1");
    expect(result).toEqual({ type: "wrong-first", hint: "Count up from 8 to 10.", lockMs: 900 });
    expect(session.getCurrentQuestion()?.choices).toEqual(["2", "3"]);
    expect(session.isLocked()).toBe(true);
  });

  it("reveals the answer and queues a twin on the second miss", () => {
    let t = 0;
    const session = new MasterySession({
      skillId: "make-a-ten",
      initialQuestions: [makeQuestion("q1")],
      generatePracticeQuestion: () => makeQuestion("twin-gen"),
      now: () => t,
    });
    t += 600;
    session.submitAnswer("1"); // wrong-first
    t += 900;

    const revealed = session.submitAnswer("3"); // second miss
    expect(revealed).toEqual({
      type: "revealed",
      correctAnswer: "2",
      explanation: "8 needs 2 more to reach 10.",
    });

    // Session isn't complete — the twin must still be cleared.
    expect(session.isComplete()).toBe(false);
    expect(session.getProgress().pendingTwins).toBe(1);
    expect(session.getCurrentQuestion()?.isTwin).toBe(true);
  });

  it("only counts first-try answers toward the mastery score, not twins", () => {
    let t = 0;
    const session = new MasterySession({
      skillId: "make-a-ten",
      initialQuestions: [makeQuestion("q1"), makeQuestion("q2")],
      generatePracticeQuestion: () => makeQuestion("twin"),
      now: () => t,
    });

    t += 600;
    session.submitAnswer("2"); // q1 first-try correct

    t += 600;
    session.submitAnswer("1"); // q2 wrong-first
    t += 900;
    session.submitAnswer("3"); // q2 missed-twice -> queues twin
    t += 600;
    session.submitAnswer("2"); // twin cleared first-try

    expect(session.isComplete()).toBe(true);
    const result = session.getResult();
    expect(result.firstTryRate).toBe(0.5); // 1 of 2 ORIGINAL questions first-try
    expect(result.stars).toBe(0);
    expect(result.twinsCleared).toBe(1);
  });

  it("awards 3 stars at >=95% first-try and requires all twins cleared before completion", () => {
    let t = 0;
    const questions = [makeQuestion("q1"), makeQuestion("q2"), makeQuestion("q3")];
    const session = new MasterySession({
      skillId: "make-a-ten",
      initialQuestions: questions,
      generatePracticeQuestion: () => makeQuestion("twin"),
      now: () => t,
    });

    for (let i = 0; i < 3; i++) {
      t += 600;
      session.submitAnswer("2");
    }

    expect(session.isComplete()).toBe(true);
    expect(session.getResult().stars).toBe(3);
    expect(session.getResult().firstTryRate).toBe(1);
  });
});
