# ComplyFlow AI — 3-minute judge run sheet

No login. No API key. Works offline. The in-app version of this sheet is at `/judge-demo`.

**Before you start:** open the app at `/`. If the workspace looks edited, click "Reset demo" in the
header to restore the seeded data.

## 0:00 — 0:30 · The problem (landing page, `/`)

A compliance team receives a scheme bulletin or regulatory notice and spends days turning it into
owners, dates and tasks. ComplyFlow does that in one pass. Point out the "not legal advice"
positioning: this is a compliance operations copilot.

## 0:30 — 1:10 · The workspace (`/dashboard`)

Show the four seeded documents, the obligation count, the upcoming dated items and the open and
overdue tasks. Note that the dashboard is the portfolio view across every ingested document.

## 1:10 — 2:10 · A full result (open the highest-risk seeded analysis)

Walk down the detail page:

1. Plain-English summary and key points.
2. Key dates, typed and sorted, with days remaining.
3. Obligations — click one and show the **verbatim evidence excerpt** highlighted in the original
   document text. This is the trust anchor: nothing is asserted without a source line.
4. Risk score with weighted factors and rationale.
5. Suggested owners and the ordered implementation plan.
6. Checklist — change one task status live and scroll to the timeline to show the audit entry appear.
7. Draft acknowledgement response.
8. The confidence card, which states whether the record came from the hosted AI model, the
   deterministic engine, or is a seeded demo record.

## 2:10 — 2:50 · Live analysis (`/new`)

Load one of the built-in sample documents, run the analysis, and let the stage indicator play. If a
hosted key is configured it uses `google/gemini-3.8-flash`; otherwise it silently falls back to the
deterministic in-browser engine and still produces a complete evidence-backed result. Either way you
land on a new analysis page.

To force the offline path deliberately, click **Run offline engine** — useful if the venue Wi-Fi is
unreliable.

## 2:50 — 3:00 · Close (`/how-it-works`)

One screen showing the pipeline: ingest → extract → classify → deadline and obligation detection →
risk scoring → action plan → audit trail.

## Honesty notes to state out loud

- Demo documents were written for this showcase; they imply no affiliation with any regulator, card
  scheme or company.
- The workspace is stored in the browser only — no accounts, no shared backend.
- The deterministic engine is rule-based triage, not a model; the UI labels which mode produced
  each record.
