import { placeValueBaseTenLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function PlaceValueBaseTenPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={placeValueBaseTenLesson} />
    </main>
  );
}
