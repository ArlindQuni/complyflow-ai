# ComplyFlow AI — Devpost submission copy

_AI Builders Hackathon 2026._ All copy below is written to be literally true of the code in this
repository.

## Project name

ComplyFlow AI

## Tagline

The compliance operations copilot that turns a regulatory notice into an evidence-backed workflow.

## One-sentence pitch

ComplyFlow AI reads a regulatory notice, card-scheme bulletin, contract change or policy update and
produces a plain-English summary, dated items, obligations quoted verbatim from the source, an
explainable risk score, suggested owners, an implementation plan, a tracked checklist, a draft
acknowledgement and an audit-style timeline — with every quote and date verified against the
submitted text before it is shown.

## Inspiration / Problem

Compliance and payments-risk teams receive a constant stream of notices, scheme bulletins, contract
amendments and internal policy updates. Each one has to be read, understood, dated, split into
obligations, assigned to owners and tracked to completion. That triage is slow, repetitive and
easy to do inconsistently — and it is exactly the kind of work where a generic AI summariser is
dangerous, because a hallucinated deadline or an invented obligation is worse than no answer.

We wanted to see whether an AI workflow tool could be built so that it is structurally unable to
present an unsupported quote or an invented date to the user.

## What it does

From a single pasted or uploaded plain-text document, ComplyFlow produces:

1. A plain-English summary and key points.
2. Detected effective date and dated items, typed (effective / submission / remediation /
   notification) and sorted by days remaining.
3. Obligations, each with a category, suggested owner and a **verbatim evidence excerpt** that is
   highlighted inside the original document text.
4. A 0–100 risk score with weighted factors and a written rationale.
5. Owner suggestions routed by obligation category.
6. An ordered implementation plan with owner and S/M/L effort per step.
7. A status-tracked checklist linked back to obligations.
8. A draft acknowledgement / response letter.
9. An audit-style activity timeline that records status changes as they happen.

A dashboard gives the portfolio view across every ingested document; a tasks view aggregates the
checklist across analyses; `/how-it-works` explains the pipeline; `/judge-demo` is a scripted
three-minute walkthrough. There is no login and no API key required to use any of it.

## How we built it

TanStack Start v1 (React 19, Vite, TypeScript in strict mode), Tailwind CSS v4 with a custom token
set, and shadcn/ui primitives. Server logic is a single `createServerFn` handler — there are no API
routes, edge functions or databases. The workspace lives in the visitor's browser under the
`localStorage` key `complyflow.workspace.v1`, seeded with four illustrative demo analyses so the
whole product is demonstrable on first load.

## AI / technical architecture

```text
ingest → analyse (hosted AI or deterministic engine) → Zod validation
       → source grounding → normalise → persist → present
```

**Hosted AI path.** When `LOVABLE_API_KEY` is configured, the server function posts the document to
the Lovable AI gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) using the model
`google/gemini-3.8-flash` with `response_format: { type: "json_object" }`. The system prompt requires
verbatim evidence, ISO dates taken only from the document, the documented risk bands, and an explicit
no-legal-advice rule. The call is bounded by an `AbortController` at 120 seconds, and rate-limit,
credit-exhausted, empty-response and timeout failures are each mapped to a clear user-facing message.
The key has no `VITE_` prefix and is read only inside the handler, so it never reaches the browser.

**Deterministic engine.** `src/lib/local-engine.ts` runs entirely in the browser and produces the
same output shape: sentence segmentation, modal-verb and obligation-phrase matching, date parsing to
ISO, keyword-driven owner routing and weighted rule-based risk scoring. It is used when no key is
configured, when the hosted call fails or times out, or when the user deliberately clicks
**Run offline engine**. Because the shapes match, every downstream view is mode-agnostic.

**Source grounding — the part we care about most.** `src/lib/grounding.ts` runs on every result in
both modes, before anything is stored:

- An obligation survives only if its evidence is a literal substring of the submitted text
  (whitespace- and case-insensitive). Anything unquotable is dropped and counted.
- A date survives only if that exact calendar date is written in the source as `2026-03-31`,
  `31 March 2026` or `March 31, 2026`. Every other date is removed — including checklist due dates,
  which are therefore never invented — and the timing wording is preserved as text instead.
- Suggested internal target dates are never presented as source deadlines.
- The number of removals is appended to the confidence rationale shown in the UI, and the confidence
  card names the producer: *Hosted AI model*, *Deterministic engine (no external AI call)*, or
  *Seeded demo record*.

This is a single validation stage, not a multi-agent system — we deliberately did not build one.

## Challenges

- **Hallucinated dates were the real enemy.** In live testing the hosted model produced plausible
  checklist due dates that did not appear anywhere in the document. Prompting alone did not fix it;
  the grounding pass, which mechanically deletes any date not written in the source, did.
- **Keeping two engines honest about being the same product.** Getting the deterministic fallback to
  emit exactly the hosted schema — so that no view has to branch on mode — took more iteration than
  the model integration itself.
- **Being precise about privacy.** Clicking *Run analysis* uploads your text to the server, which may
  forward it to the gateway, even when the offline engine ultimately produces the result. Saying that
  plainly in the UI and README was more work than hiding it would have been.
- **Demo reliability without a backend.** Seeded, resettable local state gives a full product on first
  load with no accounts and no keys.

## Accomplishments

- Evidence is verifiable by the judge on screen: click an obligation and the quote highlights inside
  the original text.
- The product degrades gracefully to a fully functional offline mode instead of showing an error.
- Honest self-labelling throughout: every record says which engine produced it and what was removed.
- A complete, enterprise-feeling workflow — dashboard, analysis, tasks, audit timeline — not a single
  summarise box.

## What we learned

Trust in an AI workflow product is an engineering property, not a copy problem. The features that
made the app credible were the ones that *delete* model output: substring-checked evidence and
source-checked dates. We also learned to design the fallback first — once the deterministic engine
defined the schema, the model had a contract to satisfy rather than a blank page to fill.

## What's next

- Multi-user workspaces with a real database, roles and shared task ownership.
- PDF and email ingestion with layout-aware extraction.
- Diffing successive versions of the same bulletin or contract.
- Calendar and ticketing integrations so obligations land where teams already work.
- Evaluation harness scoring grounding precision and recall on a labelled notice corpus.

## Target users & impact

Compliance analysts, payments and card-scheme risk teams, vendor-management and DPA reviewers, and
operations leads at fintechs and small banks who receive regulatory traffic but have no dedicated
regtech budget. The impact is triage speed with an audit trail: the first pass at "what does this
require, by when, and who owns it" arrives in seconds and every claim is traceable to a line in the
source document.

## Trust / limitations

- **Not legal advice.** ComplyFlow describes operational obligations found in a document and is built
  for human review.
- No authentication, no multi-user backend, no database; the workspace is browser-local and resets
  when storage is cleared or a different browser is used.
- The deterministic engine is rule-based triage: it matches explicit wording and often misses implied
  or purely relative requirements, its risk scoring is coarse, and its summaries are templated.
- Grounding removes unsupported content but cannot verify that retained content was interpreted
  correctly.
- All demo documents, issuers and bulletins were written for this showcase. They are illustrative and
  imply **no affiliation with, or endorsement by, any regulator, card scheme or company.**
- We report no production usage metrics, customers or accuracy benchmarks.

## Tech stack

TanStack Start v1 · React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · shadcn/ui · Zod ·
`createServerFn` server logic · Lovable AI gateway (`google/gemini-3.8-flash`) · browser
`localStorage` persistence.

## Live app

https://complyflow-copilot.lovable.app

## Judge demo

https://complyflow-copilot.lovable.app/judge-demo
