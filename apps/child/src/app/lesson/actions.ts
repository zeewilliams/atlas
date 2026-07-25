"use server";

import { getBereaAI } from "@atlas/ai";
import type { ChildProfile, Concept, Question, SessionResult } from "@atlas/curriculum";

export async function generateExplanationAction(
  concept: Concept,
  childProfile: ChildProfile
): Promise<string> {
  return getBereaAI().generateExplanation(concept, childProfile);
}

export async function generateHintAction(question: Question, attempts: number): Promise<string> {
  return getBereaAI().generateHint(question, attempts);
}

export async function generatePostGameAction(session: SessionResult): Promise<string> {
  return getBereaAI().generatePostGame(session);
}

export async function generateMemoryAnchorAction(skillId: string): Promise<string> {
  return getBereaAI().generateMemoryAnchor(skillId);
}
