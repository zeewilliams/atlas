import { factVsOpinionLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function FactVsOpinionPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={factVsOpinionLesson} />
    </main>
  );
}
