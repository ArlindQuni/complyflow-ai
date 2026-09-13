# ComplyFlow AI — demo video script (3:30 target, 4:00 hard cap)

**Recording setup:** 1920×1080, browser zoom 100%, no bookmarks bar. Open
https://complyflow-copilot.lovable.app and click **Reset demo** in the header before you start.
Keep the cursor slow and deliberate. Speak the lines below; they contain no unverified claims.

---

## 0:00 — 0:25 · Problem hook

**On screen:** landing page `/`, scroll slowly through the hero and value props.

> "A compliance team opens a regulatory notice, a card-scheme bulletin or a contract amendment, and
> then spends days turning it into dates, obligations, owners and tasks. Generic AI summarisers make
> that worse, because one invented deadline destroys the audit trail. ComplyFlow AI is a compliance
> operations copilot that turns one document into a working plan — and refuses to show you anything
> it cannot quote from the source. It is not legal advice; it is triage for human review."

## 0:25 — 0:50 · The workspace

**On screen:** click **Dashboard** in the header.

> "This is the portfolio view. Four documents already ingested, their obligation counts, upcoming
> dated items, and open and overdue tasks across all of them. No login, no API key — the demo
> workspace is seeded and lives in your browser."

Hover the overdue task counter, then hover the highest-risk card.

## 0:50 — 1:20 · Summary and deadlines

**On screen:** open the highest-risk seeded analysis (risk 86). Land on the detail page.

> "Here's a full result. Plain-English summary at the top, then key points. Below it, the dated
> items the document actually contains — typed as effective, submission, remediation or notification,
> sorted by days remaining."

Scroll to the key-dates block and pause two seconds.

## 1:20 — 1:50 · Evidence-backed obligations

**On screen:** scroll to Obligations, click one obligation so its evidence highlights inside the
original document text.

> "This is the trust anchor. Every obligation carries a verbatim excerpt, and clicking it highlights
> that exact line in the source. Before any result is stored, a grounding pass checks that the quote
> is a literal substring of your text. If it isn't, the obligation is deleted — not flagged, deleted
> — and the count of removals is written into the confidence card."

## 1:50 — 2:10 · Risk rationale

**On screen:** scroll to the risk score, weighted factors and rationale.

> "Risk is a nought-to-one-hundred score with weighted factors and a written rationale, so a reviewer
> can disagree with it specifically rather than in general. Hard external deadlines with penalties
> score above eighty; internal or contained items sit in the middle; informational notices score low."

## 2:10 — 2:40 · Owners, plan, checklist

**On screen:** scroll through suggested owners and the implementation plan, then change one checklist
task's status.

> "Suggested owners by obligation category, then an ordered implementation plan with effort per step,
> then the checklist. Watch what happens when I move this task to in progress."

## 2:40 — 3:00 · Response and audit trail

**On screen:** scroll to the activity timeline to show the new entry, then to the draft response.

> "The timeline picks it up immediately — that's the audit trail. And here's a draft acknowledgement
> you can send back to the issuer. Note the confidence card: it names which engine produced this
> record and what grounding removed."

## 3:00 — 3:20 · Architecture, fallback, grounding

**On screen:** click **New analysis** `/new`, load a built-in sample document, click **Run offline
engine**, land on the result. Then click **How it works**.

> "Live analysis: when a hosted key is configured, the document goes to a server function that calls
> the Lovable AI gateway with Gemini 3.8 Flash, bounded at a two-minute timeout. If that isn't
> available or fails, the same schema is produced by a deterministic rule-based engine in the browser
> — that's what I just ran on purpose. Both paths go through the same Zod validation and the same
> grounding check. To be precise: Run analysis does upload your text; only Run offline engine sends
> nothing."

Show the pipeline diagram on `/how-it-works`: ingest → extract → classify → deadline and obligation
detection → risk scoring → action plan → audit trail.

## 3:20 — 3:35 · Impact and close

**On screen:** back to `/dashboard`.

> "For a compliance analyst, this is the first pass — what does this document require, by when, and
> who owns it — in seconds, with every claim traceable to a line in the source. Try it yourself at
> complyflow-copilot.lovable.app, and the three-minute judge walkthrough is at slash judge-demo.
> Thanks for watching."

---

## Honesty notes (say if asked, do not skip if you have time)

- Demo documents were written for this showcase; no affiliation with any regulator, card scheme or
  company is implied.
- The workspace is browser-local; there is no account system or shared backend.
- The deterministic engine is rule-based triage, not a model, and the UI labels which mode produced
  each record.
