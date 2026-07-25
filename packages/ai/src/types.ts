import type { ChildProfile, Concept, Question, SessionResult } from "@atlas/curriculum";

export interface HomeworkContext {
  skillsDetected: string[];
  rawSummary: string;
}

/**
 * Berea AI provider abstraction (ATLAS_MASTER_SKILL.md, "AI Integration").
 * Every implementation — Gemini or offline — must satisfy this interface so
 * the app never breaks without internet.
 */
export interface BereaAIProvider {
  generateExplanation(concept: Concept, childProfile: ChildProfile): Promise<string>;
  generateHint(question: Question, attempts: number): Promise<string>;
  generatePostGame(session: SessionResult): Promise<string>;
  generateMemoryAnchor(skill: string): Promise<string>;
  scanHomework(imageData: string): Promise<HomeworkContext>;
  isAvailable(): boolean;
}
