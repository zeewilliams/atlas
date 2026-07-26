import { rhymingLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function RhymingPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={rhymingLesson} />
    </main>
  );
}
