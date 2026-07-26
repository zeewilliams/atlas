"use client";

import { describingWordsLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function DescribingWordsPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={describingWordsLesson} />
    </main>
  );
}
