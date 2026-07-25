import { describe, expect, it } from "vitest";
import { generateMeasurementQuestion, nonstandardMeasurementLesson } from "./nonstandardMeasurement";

describe("generateMeasurementQuestion", () => {
  it("keeps the visual length in sync with correctAnswer and offers unique choices", () => {
    for (let i = 0; i < 50; i++) {
      const q = generateMeasurementQuestion(5);
      const { length } = q.visual as { length: number };
      expect(Number(q.correctAnswer)).toBe(length);
      expect(q.choices).toContain(q.correctAnswer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });

  it("only allows longer objects (5-9) at higher levels", () => {
    let sawLongAtLowLevel = false;
    for (let i = 0; i < 100; i++) {
      const q = generateMeasurementQuestion(2);
      const { length } = q.visual as { length: number };
      if (length > 4) sawLongAtLowLevel = true;
    }
    expect(sawLongAtLowLevel).toBe(false);
  });
});

describe("nonstandardMeasurementLesson", () => {
  it("uses the measurement scene and provides visual data for every fixed phase", () => {
    expect(nonstandardMeasurementLesson.sceneKind).toBe("measurement");
    expect(nonstandardMeasurementLesson.guidedExample.visual).toBeDefined();
    for (const step of nonstandardMeasurementLesson.filmRoomScript) {
      expect(step.visual).toBeDefined();
    }
  });

  it("has a FAST question using the picture-select interaction", () => {
    expect(nonstandardMeasurementLesson.fastQuestion.interaction).toBe("picture-select");
  });
});
