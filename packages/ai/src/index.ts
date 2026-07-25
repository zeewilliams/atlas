import type { ChildProfile, Concept, Question, SessionResult } from "@atlas/curriculum";
import { GeminiProvider } from "./geminiProvider";
import { OfflineFallbackProvider } from "./offlineFallback";
import type { BereaAIProvider, HomeworkContext } from "./types";

export * from "./types";
export { GeminiProvider } from "./geminiProvider";
export { OfflineFallbackProvider } from "./offlineFallback";

/**
 * Wraps a primary provider with the offline fallback so every call
 * degrades gracefully — a missing key, a network error, or a bad response
 * all land on the same pre-written path instead of breaking the lesson.
 */
class ResilientBereaAI implements BereaAIProvider {
  constructor(private readonly primary: BereaAIProvider, private readonly fallback: BereaAIProvider) {}

  isAvailable(): boolean {
    return true;
  }

  private async withFallback<T>(call: (provider: BereaAIProvider) => Promise<T>): Promise<T> {
    if (this.primary.isAvailable()) {
      try {
        return await call(this.primary);
      } catch {
        // Swallow and degrade — the lesson must never break without internet.
      }
    }
    return call(this.fallback);
  }

  generateExplanation(concept: Concept, childProfile: ChildProfile): Promise<string> {
    return this.withFallback((p) => p.generateExplanation(concept, childProfile));
  }

  generateHint(question: Question, attempts: number): Promise<string> {
    return this.withFallback((p) => p.generateHint(question, attempts));
  }

  generatePostGame(session: SessionResult): Promise<string> {
    return this.withFallback((p) => p.generatePostGame(session));
  }

  generateMemoryAnchor(skill: string): Promise<string> {
    return this.withFallback((p) => p.generateMemoryAnchor(skill));
  }

  scanHomework(imageData: string): Promise<HomeworkContext> {
    return this.withFallback((p) => p.scanHomework(imageData));
  }
}

export function getBereaAI(apiKey: string | undefined = process.env["GEMINI_API_KEY"]): BereaAIProvider {
  return new ResilientBereaAI(new GeminiProvider(apiKey), new OfflineFallbackProvider());
}
