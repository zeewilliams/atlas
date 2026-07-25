import { makeATenLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function MakeATenPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={makeATenLesson} />
    </main>
  );
}
