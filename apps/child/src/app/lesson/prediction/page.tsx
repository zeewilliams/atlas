import { predictionLesson } from "@atlas/curriculum";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export default function PredictionPage() {
  return (
    <main className="min-h-screen bg-island">
      <LessonFlow lesson={predictionLesson} />
    </main>
  );
}
