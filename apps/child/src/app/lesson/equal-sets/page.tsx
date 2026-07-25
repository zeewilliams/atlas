import { equalSetsLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function EqualSetsPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={equalSetsLesson} />
    </main>
  );
}
