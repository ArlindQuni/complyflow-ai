import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FileSearch,
  Gauge,
  History,
  Mail,
  Quote,
  Route as RouteIcon,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { LegalNotice } from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ComplyFlow AI — compliance operations copilot" },
      {
        name: "description",
        content:
          "Turn regulatory notices, scheme bulletins and contract changes into obligations, deadlines, owners and an audit-ready checklist. No sign-in required.",
      },
      { property: "og:title", content: "ComplyFlow AI — compliance operations copilot" },
      {
        property: "og:description",
        content:
          "Paste a compliance document and get evidence-backed obligations, a risk score, owners, a plan and an audit trail.",
      },
    ],
  }),
  component: Landing,
});

const OUTPUTS = [
  { icon: FileSearch, title: "Plain-English summary", body: "What the document actually changes, without the legalese." },
  { icon: CalendarClock, title: "Dates that matter", body: "Effective dates, submission windows and remediation deadlines." },
  { icon: Quote, title: "Obligations with evidence", body: "Every obligation quotes the exact wording it came from." },
  { icon: Gauge, title: "Risk score with rationale", body: "Weighted factors you can challenge, not a black-box number." },
  { icon: Users, title: "Owner suggestions", body: "Routed to the teams that run the affected controls." },
  { icon: RouteIcon, title: "Implementation plan", body: "A sequenced set of steps with owners and effort." },
  { icon: ClipboardList, title: "Working checklist", body: "Status tracking across every open obligation." },
  { icon: Mail, title: "Draft response", body: "An acknowledgement ready for review and sending." },
  { icon: History, title: "Audit trail", body: "Who did what, when — captured automatically." },
];

const PIPELINE = [
  "Ingest",
  "Extract",
  "Classify",
  "Detect deadlines & obligations",
  "Score risk",
  "Plan actions",
  "Audit trail",
];

function Landing() {
  return (
    <AppShell>
      <section className="grid-backdrop panel overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
        <p className="label-mono">Compliance operations copilot</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Turn a compliance document into an owned, dated, evidence-backed plan.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Paste a regulatory notice, card-scheme bulletin, vendor contract change or internal policy
          update. ComplyFlow extracts the obligations, quotes the source wording behind each one,
          scores the operational risk and opens a tracked checklist with an audit trail.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/judge-demo">
              Run the 3-minute demo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/new">Analyse your own document</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {PIPELINE.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              <span className="rounded border border-border bg-secondary/60 px-2 py-1">{p}</span>
              {i < PIPELINE.length - 1 && <span aria-hidden>→</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Nine outputs from one paste
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Structured, reviewable and traceable — designed for a compliance team that has to evidence
          its decisions, not just read a summary.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OUTPUTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="panel p-5">
              <span className="flex size-8 items-center justify-center rounded-md bg-brand-soft text-brand">
                <Icon className="size-4" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <p className="label-mono">Works without keys</p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            Hosted model when available, deterministic engine when not
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyses normally run through a hosted language model with a strict structured-output
            schema. If that is unavailable — no key, rate limit, offline room — ComplyFlow falls back
            to an on-device rule engine that produces the same structure from explicit wording in the
            text. The demo never breaks mid-presentation.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link to="/how-it-works">See the architecture</Link>
          </Button>
        </div>
        <div className="panel p-6">
          <p className="label-mono">Scope</p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            An operations tool, not a legal opinion
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ComplyFlow organises work and evidence for qualified people to review. Demo documents are
            written for this showcase and are illustrative only — they are not issued by, and imply no
            affiliation with, any regulator, card scheme or company.
          </p>
          <LegalNotice className="mt-4" />
        </div>
      </section>
    </AppShell>
  );
}
