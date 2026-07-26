"use client";

import { storySettingLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function StorySettingPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={storySettingLesson} />
    </main>
  );
}
