import { equationStructureLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function EquationStructurePage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={equationStructureLesson} />
    </main>
  );
}
