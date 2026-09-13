# ComplyFlow AI — pitch deck content (9 slides)

## Slide 1 — ComplyFlow AI
The compliance operations copilot. One notice in → summary, dates, obligations, owners, plan, checklist, audit trail out. Live: https://complyflow-copilot.lovable.app

## Slide 2 — The problem
Compliance teams receive constant notices and changes. Each needs manual triage into dates, obligations, owners and tasks. A generic AI summariser can introduce invented deadlines.

## Slide 3 — What it does
Summary and key points; dated items; evidence-backed obligations; explainable risk; implementation plan; checklist; response draft; audit timeline.

## Slide 4 — Innovation: grounding that deletes
Every result passes grounding before storage. Unsupported evidence and dates are removed, not merely flagged. Removals are exposed in the confidence rationale.

## Slide 5 — Technical architecture
TanStack Start, React 19, TypeScript strict, Vite, Tailwind v4, shadcn/ui. Server function → optional Lovable AI gateway → Zod validation → grounding → localStorage.

## Slide 6 — Reliability: dual engine
Hosted AI when configured; deterministic rule-based fallback otherwise. Both emit the same schema and share the same grounding stage.

## Slide 7 — UX
Enterprise-calm design, responsive views, evidence highlighting, real loading/error states, resettable seeded demo.

## Slide 8 — Impact and honest limits
For compliance/risk/operations teams. First-pass triage with traceability. Not legal advice; no production metrics claimed; browser-local demo workspace.

## Slide 9 — Demo and what's next
Live app + `/judge-demo`. Next: multi-user workspaces, PDF/email ingestion, version diffing, integrations and evaluation.
