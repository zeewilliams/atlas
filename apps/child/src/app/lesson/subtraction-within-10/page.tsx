import { subtractionWithin10Lesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function SubtractionWithin10Page() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={subtractionWithin10Lesson} />
    </main>
  );
}
