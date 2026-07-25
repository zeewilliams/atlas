# Atlas

Adaptive learning platform powered by Berea AI.

## Structure

- `apps/child` — the child-facing lesson experience (Next.js App Router)
- `packages/curriculum` — lesson definitions and the mastery engine
- `packages/ai` — Berea AI provider abstraction (Gemini + offline fallback)
- `packages/store` — shared Zustand stores
- `content/lessons` — lesson configs and FAST alignment metadata

## Getting started

```bash
npm install
npm run dev
```

Then open the printed localhost URL and navigate to `/lesson/make-a-ten`.
