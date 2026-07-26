"use client";

import { beginningSoundsLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function BeginningSoundsPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={beginningSoundsLesson} />
    </main>
  );
}
