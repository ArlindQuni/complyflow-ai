# ComplyFlow AI

**Live app:** https://complyflow-copilot.lovable.app ·
**Three-minute judge demo:** https://complyflow-copilot.lovable.app/judge-demo


A compliance operations copilot. Paste a regulatory notice, card-scheme bulletin, contract change or
internal policy update, and ComplyFlow turns it into an actionable workflow: a plain-English summary,
dated items, obligations with verbatim evidence from the source text, a risk score with rationale,
suggested owners, an implementation plan, a status-tracked checklist, a draft acknowledgement and an
audit-style activity timeline.

**ComplyFlow AI is not a legal-advice product.** It describes operational obligations found in a
document and is intended for human review.

## Quick start

Requires Node.js 20+ (npm, pnpm or bun all work; the repo ships a `bun.lock`).

```sh
npm install        # or: bun install
npm run dev        # dev server on http://localhost:8080
```

Production build and local preview:

```sh
npm run build      # vite build (TanStack Start / nitro output)
npm run preview    # serve the production build
```

Other scripts defined in `package.json`: `build:dev`, `lint`, `format`. There is no test script.

## Environment

| Variable | Where it is read | Required |
| --- | --- | --- |
| `LOVABLE_API_KEY` | server only, inside the `analyzeDocument` handler in `src/lib/analyze.functions.ts` | no |

Copy `.env.example` to `.env` to set it. It is deliberately **not** prefixed with `VITE_`, so it never
reaches the browser bundle, and it is only read inside a server-function handler. No other secrets or
paid services are used. No key is needed to run or demo the app.

## Two analysis modes (both visible in the UI)

1. **Hosted AI** — when `LOVABLE_API_KEY` is present, the server function posts the document to
   `https://ai.gateway.lovable.dev/v1/chat/completions` with model `google/gemini-3.8-flash` and
   `response_format: { type: "json_object" }`. The response is validated with Zod before it reaches
   the UI.
2. **Deterministic engine** — if no key is configured, or the call fails or times out (the gateway
   call is bounded at 120 seconds), `src/lib/local-engine.ts` produces the same output shape entirely
   in the browser. This is a fallback, not a guarantee: badly malformed input, a browser error or a
   storage failure can still produce an error state, which the UI shows explicitly.

A configured key proves only that hosted mode is *attempted*; it does not prove a successful model
response. Check the confidence card on the resulting analysis, which names the actual producer.

### Source grounding (`src/lib/grounding.ts`)

Model output is verified against the submitted text before it is stored, in both modes:

- An obligation is kept only when its evidence is a literal substring of the source (whitespace- and
  case-insensitive). Anything that cannot be quoted is dropped and counted.
- A date is kept only when that exact calendar date is written in the source as ISO (`2026-03-31`),
  `31 March 2026` or `March 31, 2026`. Every other date is removed — including checklist due dates,
  which are never invented — and the wording describing the timing is preserved as text instead.
- Suggested internal target dates are never presented as source deadlines.
- The confidence rationale records how many obligations and dates were removed.

The confidence card on every analysis states which produced it: *Hosted AI model*,
*Deterministic engine (no external AI call)*, or *Seeded demo record*.

### Deterministic engine limitations (honest list)

- Pattern- and keyword-based: it matches explicit wording, dates and obligation phrasing. Implied or
  purely relative requirements ("within a reasonable period") are often missed.
- Risk scoring is rule-weighted, not learned; it is stable and explainable but coarse.
- Summaries and the draft response are templated from extracted content, not generated prose.
- Obligation evidence is a literal substring of the pasted text, so quality depends on the input
  being clean plain text.
- It is a triage draft for human review, not an authoritative reading of the document.

## Data, persistence and scope

- **No authentication, no multi-user backend, no database.** The workspace lives in the visitor's
  browser under the `localStorage` key `complyflow.workspace.v1`.
- Clearing browser storage, or using another browser or device, resets the workspace to the seeded
  demo data in `src/lib/seed.ts`. Nothing is shared between visitors.
- **Privacy, precisely:** clicking **Run analysis** on `/new` uploads the document text to this app's
  server, which may forward it to the hosted AI gateway — that upload happens even when the result
  ultimately comes from the offline fallback. Only **Run offline engine** guarantees that no analysis
  request leaves the browser.
- All demo documents, issuers and bulletins were written for this showcase. They are illustrative and
  imply no affiliation with, or endorsement by, any regulator, card scheme or company.

## Architecture

TanStack Start v1 (React 19, Vite 8, Tailwind v4, shadcn/ui, TypeScript strict). Server logic uses
`createServerFn`; there are no API routes or edge functions.

```
src/
  routes/            index, dashboard, new, analyses.$analysisId, tasks, how-it-works, judge-demo
  lib/analyze.functions.ts   server function -> hosted AI gateway, Zod-validated
  lib/local-engine.ts        deterministic in-browser analyzer (fallback)
  lib/store.tsx              React context + localStorage workspace
  lib/seed.ts                seeded demo analyses and sample documents
  components/                app shell and compliance UI primitives
```

Pipeline: ingest → extract → classify → deadline & obligation detection → risk scoring → action plan →
audit trail. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Three-minute judge demo

Open `/judge-demo` in the app, or follow [docs/JUDGE_RUN_SHEET.md](docs/JUDGE_RUN_SHEET.md).
No login and no API key required.