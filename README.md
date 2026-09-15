# ComplyFlow AI

**Live prototype:** https://complyflow-copilot.lovable.app  
**Judge demo:** https://complyflow-copilot.lovable.app/judge-demo

> Turn incoming regulatory change into evidence-backed execution.

ComplyFlow AI is a regulatory change operations copilot. It helps teams move from an incoming regulatory notice, public guidance, vendor change or internal policy update to structured obligations, source evidence, human review, accountable owners, implementation tasks and an audit-style trail.

**ComplyFlow AI is a prototype and is not legal advice.**

## Why it is different

The product deliberately separates mechanically checked evidence from judgement-based drafts. Every extracted obligation that survives the grounding step must be backed by a verbatim excerpt from the submitted source. Unsupported calendar dates are removed. Summaries, risk scores, suggested owners and implementation plans remain drafts for human review.

## Prototype capabilities

- Public HTTP(S) URL import with an imported-content review step before analysis
- `.txt` / `.md` upload and pasted-text ingestion
- Hosted structured analysis with Zod validation when the hosted model path is configured
- Deterministic browser-based offline engine
- Organisation relevance context
- Evidence-backed obligations and source highlighting
- Human-review boundary for risk, owners and plans
- Checklist status and audit-style activity tracking
- JSON / CSV handoff

## Quick start

Requires Node.js 20+.

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
npm run preview
```

## Analysis and grounding

Hosted analysis is implemented as a server function. A separate grounding layer checks model output against the submitted text before it is stored:

- an obligation is retained only when its evidence is a literal source substring, with case/whitespace normalization;
- calendar dates are retained only when supported by accepted exact source forms;
- unsupported obligations and dates are removed and counted;
- judgement-based outputs are not presented as mechanically grounded facts.

The deterministic engine in `src/lib/local-engine.ts` is rule-based, not an AI model. It provides a browser-local fallback and is intentionally described as such.

## Data and prototype boundaries

- No authentication or multi-user backend in the current prototype.
- No shared production database; demo workspace state is browser-local.
- Running hosted analysis may send submitted document text to the configured hosted AI gateway.
- Only **Run offline engine** guarantees that no analysis request leaves the browser.
- Jira, ServiceNow, enterprise document stores, email monitoring, SSO/RBAC, persistent audit storage and customer-controlled deployment are production-roadmap capabilities, not current live integrations.

## Production direction

The roadmap supports two deployment patterns:

1. **ComplyFlow Cloud** — managed SaaS for teams that want a managed operating environment.
2. **ComplyFlow Private** — customer-controlled deployment for regulated enterprises, with enterprise identity, persistent audit storage, customer-approved models and private connectors as roadmap capabilities.

## Architecture

The prototype uses TanStack Start, React 19, Vite, TypeScript, Tailwind and shadcn/ui. Server logic uses `createServerFn`; structured hosted output is schema-validated with Zod. The grounding layer and deterministic offline engine are separate from hosted model execution.

Conceptual workflow:

```text
Sources
  -> Organisation relevance
  -> Structured analysis
  -> Evidence grounding
  -> Human review
  -> Owners / checklist
  -> Handoff
  -> Audit trail
```

## Judge path

For the strongest demo path:

1. View the Organisation Profile.
2. Open the Compliance Inbox.
3. Inspect the DORA hero analysis.
4. Select an obligation and inspect the matching source evidence.
5. Review risk, owners and checklist.
6. Change a checklist status and inspect the audit trail.
7. Open Review & Handoff and inspect JSON/CSV export.
8. Visit How It Works for prototype boundaries and the deployment roadmap.

No login or API key is required for the seeded demo.