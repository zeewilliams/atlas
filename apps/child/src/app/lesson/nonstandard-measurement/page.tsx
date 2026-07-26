"use client";

import { nonstandardMeasurementLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function NonstandardMeasurementPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={nonstandardMeasurementLesson} />
    </main>
  );
}
