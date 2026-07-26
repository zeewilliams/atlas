"use client";

import { wordRecognitionLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function WordRecognitionPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={wordRecognitionLesson} />
    </main>
  );
}
