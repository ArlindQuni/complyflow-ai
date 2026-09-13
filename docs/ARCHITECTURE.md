# ComplyFlow AI — Architecture

## Stack

- TanStack Start v1 (file-based routing in `src/routes`, SSR, `createServerFn` for server logic)
- React 19, Vite 8, TypeScript in strict mode
- Tailwind CSS v4 (`src/styles.css` tokens) and shadcn/ui components
- Zod for validating model output
- No database, no auth provider, no edge functions, no paid third-party services

## Pipeline

```text
   paste / upload plain text
            |
   [1] ingest        src/routes/new.tsx        size cap 60,000 chars, optional title
            |
   [2] analyse       hosted AI  OR  deterministic engine
            |        src/lib/analyze.functions.ts   src/lib/local-engine.ts
            |
   [3] validate      Zod schema with safe defaults (AiSchema)
            |
   [3b] ground       src/lib/grounding.ts: drop unquotable obligations,
            |        remove any date not written in the source

   [4] normalise     src/lib/store.tsx toAnalysis(): ids, checklist state, timeline seed
            |
   [5] persist       localStorage "complyflow.workspace.v1"
            |
   [6] present       dashboard / analysis detail / tasks
```

Stage 2 output is identical in shape in both modes, so every downstream view is mode-agnostic.

## Analysis stages inside stage 2

| Stage | What it produces |
| --- | --- |
| Extract | title, issuer, jurisdiction, key points |
| Classify | source type: regulatory notice, card-scheme bulletin, contract change, policy update, compliance comms |
| Deadline detection | effective date plus dated items typed as effective / submission / remediation / notification |
| Obligation detection | obligation text, category, suggested owner, due date, and a verbatim evidence excerpt from the source |
| Risk scoring | 0–100 with weighted factors and a written rationale (80+ hard external deadlines with penalties, 60–79 firm external deadlines, 35–59 contained or internal, <35 informational) |
| Action plan | ordered steps with owner and S/M/L effort |
| Checklist | trackable tasks linked back to obligations |
| Draft response | professional acknowledgement text |
| Confidence | 0–1 score with rationale and the source label shown in the UI |

## Hosted AI path

`analyzeDocument` (`src/lib/analyze.functions.ts`) is a POST server function. Inside the handler it
reads `process.env.LOVABLE_API_KEY` and calls:

- endpoint `https://ai.gateway.lovable.dev/v1/chat/completions`
- model `google/gemini-3.8-flash`
- `response_format: { type: "json_object" }`
- system prompt enforcing verbatim evidence, ISO dates taken only from the document, the risk-score
  bands above, and an explicit no-legal-advice rule

Failures are mapped to user-facing messages (429 rate limit, 402 credits exhausted, empty response,
timeout). The call is bounded by an `AbortController` at 120 seconds so the fallback cannot hang.
The key is never exposed to the client: it has no `VITE_` prefix and is read only inside the handler.

## Source grounding

`src/lib/grounding.ts` runs on every analysis before it is stored, in both modes. Obligations survive
only if their evidence is a literal substring of the submitted text; dates survive only if that exact
calendar date is written in the source (ISO, `31 March 2026`, `March 31, 2026`). Checklist due dates,
obligation due dates, the effective date and dated items are all subject to the same check — internal
target dates are never fabricated, and unverifiable timings are preserved as wording in key points.
The number of removals is appended to the confidence rationale shown in the UI.

## Deterministic fallback

`src/lib/local-engine.ts` runs in the browser and is used when the key is missing, the request fails,
or the operator clicks "Run offline engine" on `/new`. It performs sentence segmentation, modal-verb
and obligation-phrase matching, date parsing into ISO form, keyword-driven owner routing and weighted
rule-based risk scoring. Limitations are listed in the README; the engine marks its own confidence
rationale accordingly and the UI labels the record as deterministic.

## State and persistence

`src/lib/store.tsx` holds a React context with the analyses array, hydrated from `localStorage`
(`complyflow.workspace.v1`) on mount and written back on every change. It exposes `addAnalysis`,
`setTaskStatus`, `logEvent` and `resetDemo`. Task changes and manual events append to the analysis
timeline, which is the audit trail shown on the detail page. There is no server-side persistence and
no cross-device or cross-user sharing.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | landing page and product explanation |
| `/dashboard` | portfolio view: obligations, upcoming dates, task status |
| `/new` | paste or upload a document and run an analysis |
| `/analyses/$analysisId` | full structured result with evidence highlighting and timeline |
| `/tasks` | cross-document checklist with status changes |
| `/how-it-works` | in-app architecture explanation |
| `/judge-demo` | guided three-minute demo run sheet |

## Known boundaries

- Single-browser workspace; no accounts, roles or sharing.
- Plain text only; PDF/DOCX are not parsed.
- Not legal advice; outputs require human review before action.
