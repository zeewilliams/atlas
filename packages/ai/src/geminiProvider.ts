import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChildProfile, Concept, Question, SessionResult } from "@atlas/curriculum";
import type { BereaAIProvider, HomeworkContext } from "./types";

const MODEL = "gemini-2.0-flash";

/**
 * Security rule: the child profile is referenced but never transmitted
 * verbatim — no name, no identifying detail, just the attributes that
 * change how something should be explained.
 */
function describeProfile(profile: ChildProfile): string {
  const parts = [
    `a ${profile.ageYears}-year-old learner`,
    profile.learningStyle === "mechanism-first"
      ? "who wants the real mechanism explained plainly, not a metaphor"
      : undefined,
    profile.challengeMode ? "currently in challenge mode (push slightly above grade level)" : undefined,
  ].filter(Boolean);
  return parts.join(", ");
}

export class GeminiProvider implements BereaAIProvider {
  private readonly client: GoogleGenerativeAI | null;

  constructor(apiKey: string | undefined) {
    this.client = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  private async generate(prompt: string): Promise<string> {
    if (!this.client) throw new Error("Gemini provider has no API key configured.");
    const model = this.client.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }

  async generateExplanation(concept: Concept, childProfile: ChildProfile): Promise<string> {
    return this.generate(
      `Write a 2-3 sentence spoken explanation of the concept "${concept.title}" for ${describeProfile(
        childProfile
      )}. Explain the actual mechanism, not an analogy. Keep it under 40 words, plain spoken language.`
    );
  }

  async generateHint(question: Question, attempts: number): Promise<string> {
    return this.generate(
      `A child just answered "${question.prompt}" incorrectly (attempt ${attempts}). The correct answer is "${question.correctAnswer}". Give a single short spoken strategy hint (under 20 words) that nudges toward the mechanism without stating the answer outright.`
    );
  }

  async generatePostGame(session: SessionResult): Promise<string> {
    const pct = Math.round(session.firstTryRate * 100);
    return this.generate(
      `Write a 2-3 sentence parent-facing summary of a practice session on "${session.skillId.replace(
        /-/g,
        " "
      )}". First-try rate was ${pct}%, with ${session.twinsCleared} follow-up question(s) needed. Be specific and factual, no praise inflation, mention what to watch for.`
    );
  }

  async generateMemoryAnchor(skill: string): Promise<string> {
    return this.generate(
      `Write one short spoken sentence (under 15 words) a 5-year-old could repeat back to lock in the concept "${skill.replace(
        /-/g,
        " "
      )}". State the mechanism plainly, no metaphor.`
    );
  }

  async scanHomework(imageData: string): Promise<HomeworkContext> {
    if (!this.client) throw new Error("Gemini provider has no API key configured.");
    const model = this.client.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent([
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
      "List the specific math or reading skills being tested on this homework page as a short comma-separated list on the first line, then a one-sentence summary on the next line.",
    ]);
    const text = result.response.text().trim();
    const [skillsLine, ...rest] = text.split("\n");
    const skillsDetected = (skillsLine ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return { skillsDetected, rawSummary: rest.join(" ").trim() || text };
  }
}
