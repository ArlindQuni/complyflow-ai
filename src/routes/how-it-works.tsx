import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { LegalNotice, SectionCard } from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  ScanText,
  Tags,
  CalendarClock,
  Gauge,
  ListChecks,
  History,
  ShieldQuestion,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ComplyFlow AI works — pipeline and architecture" },
      {
        name: "description",
        content:
          "Ingest, extract, classify, detect deadlines and obligations, score risk, generate an action plan and write an audit trail.",
      },
      { property: "og:title", content: "How ComplyFlow AI works — pipeline and architecture" },
      {
        property: "og:description",
        content: "The seven-stage pipeline behind every ComplyFlow analysis, and its guardrails.",
      },
    ],
  }),
  component: HowItWorks,
});

const STAGES = [
  {
    icon: Inbox,
    name: "Ingest",
    detail:
      "Text is pasted or uploaded in the browser and posted to a server function. The document never touches client-side model keys.",
    output: "Normalised document text + metadata",
  },
  {
    icon: ScanText,
    name: "Extract",
    detail:
      "The model returns a structured object. Every obligation must carry a verbatim quote from the source; quotes that do not appear in the text are not highlighted.",
    output: "Obligations with evidence spans",
  },
  {
    icon: Tags,
    name: "Classify",
    detail:
      "Document type (regulatory notice, scheme bulletin, contract change, policy update), issuer and jurisdiction are identified so routing rules can apply.",
    output: "Type · issuer · jurisdiction",
  },
  {
    icon: CalendarClock,
    name: "Deadline detection",
    detail:
      "Effective dates, submission dates, notification windows and remediation dates are normalised to ISO dates and typed, so the dashboard can count days remaining.",
    output: "Typed, dated deadline set",
  },
  {
    icon: Gauge,
    name: "Risk scoring",
    detail:
      "A 0-100 score is produced from weighted factors — financial exposure, scope, deadline pressure, dependencies — each returned with a written rationale rather than an opaque number.",
    output: "Score + level + factor breakdown",
  },
  {
    icon: ListChecks,
    name: "Action plan",
    detail:
      "Obligations become an ordered implementation plan, an owner suggestion per workstream, a status-tracked checklist, and a draft acknowledgement you can send.",
    output: "Plan · owners · checklist · draft reply",
  },
  {
    icon: History,
    name: "Audit trail",
    detail:
      "Ingest, analysis, owner confirmation and every status change are appended to an immutable-style activity timeline that can be exported for evidence.",
    output: "Timestamped activity log",
  },
];

function HowItWorks() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Architecture"
        title="How ComplyFlow AI works"
        description="A deterministic wrapper around a language model: structured output, verbatim evidence, explicit confidence, and a full audit trail."
        actions={
          <Button asChild>
            <Link to="/new">Try it on a sample</Link>
          </Button>
        }
      />

      <div className="panel overflow-x-auto p-5">
        <div className="flex min-w-max items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {STAGES.map((s, i) => (
            <span key={s.name} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-secondary px-2.5 py-1.5 text-foreground">
                {s.name}
              </span>
              {i < STAGES.length - 1 && <span aria-hidden>→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {STAGES.map((s, i) => (
          <div key={s.name} className="panel p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <s.icon className="size-4.5" aria-hidden />
              </span>
              <div>
                <p className="label-mono">Stage {i + 1}</p>
                <h2 className="text-base font-semibold text-foreground">{s.name}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.detail}</p>
                <p className="mt-3 font-mono text-[11px] text-brand">output: {s.output}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Guardrails"
          description="What keeps the output trustworthy in a regulated workflow."
          icon={ShieldQuestion}
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Evidence or it didn't happen.</strong> Obligations are
              rendered next to the exact sentence they came from, highlighted inside the original text.
            </li>
            <li>
              <strong className="text-foreground">Stated confidence.</strong> Every analysis carries a
              confidence percentage and the reason for it, so reviewers know where to look hardest.
            </li>
            <li>
              <strong className="text-foreground">Human ownership.</strong> Owner suggestions are
              proposals; a person confirms them and the confirmation is logged.
            </li>
            <li>
              <strong className="text-foreground">No legal advice.</strong> The product organises
              compliance operations work; interpretation stays with qualified people.
            </li>
          </ul>
          <LegalNotice className="mt-5" />
        </SectionCard>

        <SectionCard title="Technical shape" description="How the demo is put together.">
          <dl className="space-y-3 text-sm">
            {[
              ["Frontend", "TypeScript, React 19, TanStack Router/Query, Tailwind v4, shadcn/ui"],
              ["Model call", "Server function → Lovable AI Gateway, JSON-object response mode"],
              ["Fallback engine", "If the model is unreachable, an on-device rule engine returns the same structure from explicit wording — the demo runs with no keys"],
              ["Validation", "Zod schema parse with safe defaults, so a malformed reply never breaks the UI"],
              ["State", "Workspace store persisted locally — no sign-in required for the demo"],
              ["Demo data", "Four seeded analyses with real-world source text, tasks and timelines"],
              ["Failure modes", "Rate limit, credit exhaustion and parse failures surface as readable errors"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0">
                <dt className="label-mono">{k}</dt>
                <dd className="text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>

      <SectionCard
        className="mt-6"
        title="3-minute demo path"
        description="Follow this order for a live walkthrough. Demo documents are illustrative and imply no affiliation with any regulator, card scheme or company."
        action={
          <Button asChild size="sm" variant="outline">
            <Link to="/judge-demo">Open the run sheet</Link>
          </Button>
        }
      >
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            ["0:00", "Open the dashboard", "Four seeded documents, risk-ranked, with open tasks and overdue counts."],
            ["0:30", "Open the Visa VAMP bulletin", "Summary, deadlines, and obligations with the quoted evidence highlighted in the source."],
            ["1:15", "Show risk and confidence", "Weighted factors with rationale, and a stated AI confidence of 93%."],
            ["1:45", "Move a task to Done", "The audit timeline gains a timestamped entry immediately."],
            ["2:15", "Run a live analysis", "Paste a sample bulletin on the New analysis page and watch the pipeline produce a fresh workflow."],
            ["2:45", "Close on architecture", "This page: ingest → extract → classify → deadlines → risk → plan → audit."],
          ].map(([t, title, detail]) => (
            <li key={t} className="rounded-md border border-border p-4">
              <p className="font-mono text-xs text-brand">{t}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            </li>
          ))}
        </ol>
      </SectionCard>
    </AppShell>
  );
}
