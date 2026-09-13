# ComplyFlow AI — Devpost submission copy

## Project name
ComplyFlow AI

## Tagline
The compliance operations copilot that turns a regulatory notice into an evidence-backed workflow.

## Inspiration / Problem
Compliance and payments-risk teams receive a constant stream of notices, scheme bulletins, contract amendments and internal policy updates. Each one has to be read, understood, dated, split into obligations, assigned to owners and tracked to completion. That triage is slow and repetitive, and a generic AI summariser can be dangerous when a plausible but invented deadline enters the workflow.

We wanted to build an AI workflow tool that mechanically removes unsupported quotes and dates before they are presented.

## What it does
ComplyFlow produces a plain-English summary, dated items, obligations with verbatim evidence, an explainable risk score, suggested owners, an implementation plan, a tracked checklist, a draft acknowledgement and an audit-style timeline. The evidence can be highlighted in the original source text.

## How we built it
TanStack Start v1, React 19, Vite, TypeScript strict, Tailwind CSS v4 and shadcn/ui. A `createServerFn` handler optionally calls the Lovable AI gateway with `google/gemini-3.8-flash`; a deterministic rule-based engine provides the same output shape without an API key. Zod validation and a source-grounding stage run before persistence. The demo workspace is stored in browser localStorage.

## Technical differentiation
Every obligation survives only if its evidence is a literal substring of the submitted text. Every date survives only if that exact calendar date is written in the source. Unsupported obligations and dates are removed and counted in the confidence rationale. The UI identifies whether a record came from hosted AI, the deterministic engine or seeded demo data.

This is a single validated pipeline, not a multi-agent system.

## Challenges
- Preventing plausible but unsupported deadlines required mechanical grounding rather than prompting alone.
- Making hosted and deterministic modes emit the same schema kept the downstream product mode-agnostic.
- Demo reliability required a complete no-key path and seeded resettable state.

## Accomplishments
- Evidence is verifiable on screen by highlighting the exact source quote.
- Full offline fallback keeps the workflow usable without an AI key.
- The product covers dashboard, analysis, tasks and audit timeline rather than stopping at summarisation.

## What we learned
Trust in an AI workflow product is an engineering property. The most important reliability features are the ones that delete unsupported model output and expose provenance to the reviewer.

## What's next
Multi-user workspaces, PDF/email ingestion, bulletin-version diffing, calendar/ticketing integrations and an evaluation harness for grounding precision/recall.

## Target users & impact
Compliance analysts, payments/card-scheme risk teams, vendor-management and DPA reviewers, and operations leads at regulated companies. The intended value is faster first-pass triage with every retained evidence claim traceable to the source.

## Trust / limitations
Not legal advice; human review is required. No auth or shared backend; browser-local persistence only. The deterministic engine is rule-based and can miss implied requirements. Demo documents are illustrative and imply no affiliation or endorsement. No production customer or accuracy metrics are claimed.

## Tech stack
TanStack Start v1 · React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Zod · Lovable AI gateway · browser localStorage.

## Live app
https://complyflow-copilot.lovable.app

## Judge demo
https://complyflow-copilot.lovable.app/judge-demo
