"use client";

import { comparisonLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={comparisonLesson} />
    </main>
  );
}
