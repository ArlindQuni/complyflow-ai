# ComplyFlow AI — pitch deck content (9 slides)

Judging weights this deck is built against: **Innovation 20% · Technical Implementation 25% ·
Problem Solving & Impact 25% · UX 15% · Presentation & Demo 15%.**

---

## Slide 1 — ComplyFlow AI

**Bullets**
- The compliance operations copilot.
- One notice in → summary, dates, obligations, owners, plan, checklist, audit trail out.
- Nothing is shown that cannot be quoted from the source document.
- Live: complyflow-copilot.lovable.app · Judge demo: /judge-demo

**Visual:** full-bleed screenshot of the analysis detail page with an evidence quote highlighted.

**Speaker note:** Open on the product, not the problem — judges see in three seconds that this is a
finished workflow tool. Say the URL once and move on.

---

## Slide 2 — The problem (Impact 25%)

**Bullets**
- Compliance teams receive constant notices, scheme bulletins, contract changes and policy updates.
- Each one needs manual triage into dates, obligations, owners and tasks — days of work, done
  inconsistently.
- Generic AI summarisers are worse than nothing here: one invented deadline breaks the audit trail.
- Small fintechs and banks get the same regulatory traffic with no regtech budget.

**Visual:** a wall of dense notice text on the left, an empty owner/date/task table on the right.

**Speaker note:** Land the specific failure mode — hallucinated deadlines — because it sets up the
innovation slide.

---

## Slide 3 — What it does

**Bullets**
- Summary and key points, then typed dated items sorted by days remaining.
- Obligations with verbatim evidence, categories and suggested owners.
- Explainable 0–100 risk score, implementation plan, tracked checklist, draft response.
- Activity timeline records every status change as an audit entry.

**Visual:** three-panel screenshot strip — dashboard, analysis detail, tasks view.

**Speaker note:** Nine outputs, one paste. Don't read the list; point at the strip and name the
through-line: document to accountable plan.

---

## Slide 4 — Innovation: grounding that deletes (Innovation 20%)

**Bullets**
- Every result passes a grounding stage before it is stored.
- Obligation kept only if its evidence is a literal substring of the submitted text.
- Date kept only if that exact date is written in the source — checklist due dates are never invented.
- Removals are counted and shown in the confidence card; internal targets are never labelled as
  source deadlines.

**Visual:** before/after of one result — model output with three plausible dates, final output with
them removed and the wording preserved.

**Speaker note:** This is the differentiator. We found the hallucinated dates in live testing;
prompting didn't fix it, mechanical deletion did. Trust is an engineering property.

---

## Slide 5 — Technical architecture (Technical 25%)

**Bullets**
- TanStack Start v1, React 19, TypeScript strict, Vite, Tailwind v4, shadcn/ui.
- Server function → Lovable AI gateway, `google/gemini-3.8-flash`, JSON-object response, 120s abort.
- Zod validation → grounding → normalise → browser `localStorage` workspace.
- Key is server-only (no `VITE_` prefix); no database, no edge functions, no paid services.

**Visual:** the pipeline diagram — ingest → analyse → validate → ground → normalise → persist →
present.

**Speaker note:** Keep it to the boundaries: what runs on the server, what runs in the browser, where
the secret lives. Be explicit that this is one validated pipeline, not a multi-agent system.

---

## Slide 6 — Reliability: dual engine (Technical 25%)

**Bullets**
- Hosted AI path when a key is configured; deterministic rule-based engine otherwise.
- Both emit the same schema, so no view branches on mode.
- Fallback triggers on missing key, failure or timeout — or on demand via "Run offline engine".
- The confidence card names the producer: hosted model, deterministic engine, or seeded demo record.

**Visual:** two arrows converging into one schema box, with the confidence card screenshot beside it.

**Speaker note:** Demoable on venue Wi-Fi with no key. Also state the privacy fact plainly: Run
analysis uploads your text; only Run offline engine sends nothing.

---

## Slide 7 — UX (UX 15%)

**Bullets**
- Enterprise-calm design system: custom tokens, risk colour scale, monospace labels.
- Click an obligation and its quote highlights in the original text — verification in one click.
- Real empty, loading and error states; responsive from phone to desktop.
- Seeded workspace means the product is complete on first load, with a one-click Reset demo.

**Visual:** side-by-side desktop and mobile screenshots of the analysis detail page.

**Speaker note:** Emphasise that the evidence highlight is a UX decision as much as a technical one —
it makes the trust guarantee visible rather than claimed.

---

## Slide 8 — Impact, users and honest limits (Impact 25%)

**Bullets**
- Users: compliance analysts, payments/card-scheme risk, vendor and DPA reviewers, fintech ops leads.
- Value: first-pass triage in seconds with every claim traceable to a source line.
- Not legal advice; built for human review.
- No auth, no shared backend, browser-local storage; demo documents are illustrative with no
  affiliation implied; no production metrics claimed.

**Visual:** a simple two-column "what it replaces / what it does not replace" layout.

**Speaker note:** Judges reward candour. Say the limitations out loud — they make the grounding claim
credible.

---

## Slide 9 — Demo and what's next (Presentation 15%)

**Bullets**
- Live now, no login, no key: complyflow-copilot.lovable.app · /judge-demo
- Next: multi-user workspaces with a real database and roles.
- Next: PDF/email ingestion, version diffing of bulletins and contracts.
- Next: calendar and ticketing integrations; a grounding precision/recall evaluation harness.

**Visual:** QR code to the live app beside a single dashboard screenshot.

**Speaker note:** Close by inviting them to open it during judging and reset the demo themselves.
Leave the QR on screen through Q&A.
