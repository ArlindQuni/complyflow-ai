import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Copy,
  FileText,
  History,
  ListChecks,
  Mail,
  Quote,
  Route as RouteIcon,
  Users,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  ConfidenceIndicator,
  DueChip,
  EvidenceDocument,
  LegalNotice,
  RiskBadge,
  RiskMeter,
  SectionCard,
  Stat,
  StatusPill,
} from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fmtDate, fmtDateTime } from "@/lib/format";
import { useCompliance } from "@/lib/store";
import { SOURCE_LABEL, STATUS_LABEL, type TaskStatus } from "@/lib/types";

export const Route = createFileRoute("/analyses/$analysisId")({
  head: () => ({
    meta: [
      { title: "Analysis — ComplyFlow AI" },
      {
        name: "description",
        content:
          "Obligations, deadlines, risk score, owners, implementation plan and audit trail for a compliance document.",
      },
      { property: "og:title", content: "Analysis — ComplyFlow AI" },
      {
        property: "og:description",
        content: "Evidence-backed compliance obligations, owners and checklist for a single document.",
      },
    ],
  }),
  component: AnalysisPage,
});

const STATUSES: TaskStatus[] = ["not_started", "in_progress", "blocked", "done"];

function AnalysisPage() {
  const { analysisId } = Route.useParams();
  const { getAnalysis, setTaskStatus, logEvent } = useCompliance();
  const analysis = getAnalysis(analysisId);
  const [active, setActive] = useState<string | undefined>(undefined);

  if (!analysis) {
    return (
      <AppShell>
        <div className="panel mx-auto max-w-lg p-8 text-center">
          <AlertTriangle className="mx-auto size-6 text-risk-high" aria-hidden />
          <h1 className="mt-3 text-lg font-semibold text-foreground">Analysis not found</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This analysis is not in your demo workspace. It may have been cleared, or the link may be
            from another session.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/new">Run a new analysis</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const done = analysis.checklist.filter((c) => c.status === "done").length;
  const pct = analysis.checklist.length
    ? Math.round((done / analysis.checklist.length) * 100)
    : 0;

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${SOURCE_LABEL[analysis.sourceType]} · ${analysis.id}`}
        title={analysis.title}
        description={`${analysis.issuer} · ${analysis.jurisdiction} · received ${fmtDate(analysis.receivedAt)}`}
        actions={
          <>
            <RiskBadge level={analysis.risk.level} score={analysis.risk.score} />
            <Button asChild variant="outline" size="sm">
              <Link to="/tasks">Open tasks</Link>
            </Button>
          </>
        }
      />

      {analysis.demo && (
        <p className="mb-4 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
          Seeded demo record. The document text was written for this showcase and implies no
          affiliation with, or endorsement by, any regulator, card scheme or company named in it.
        </p>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Obligations" value={analysis.obligations.length} hint="each with a source excerpt" />
        <Stat label="Dated items" value={analysis.deadlines.length} hint={`effective ${fmtDate(analysis.effectiveDate)}`} />
        <Stat
          label="Checklist"
          value={`${done}/${analysis.checklist.length}`}
          hint={`${pct}% complete`}
          tone={pct === 100 ? "good" : "default"}
        />
        <Stat
          label="Risk"
          value={`${analysis.risk.score}`}
          hint={analysis.risk.level}
          tone={
            analysis.risk.level === "critical"
              ? "critical"
              : analysis.risk.level === "high"
                ? "warning"
                : "default"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Summary" description="Plain-English read of the document." icon={FileText}>
            <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
            {analysis.keyPoints.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {analysis.keyPoints.map((k) => (
                  <li key={k} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Obligations & evidence"
            description="Hover an obligation to highlight the wording it came from in the source document."
            icon={Quote}
          >
            {analysis.obligations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No explicit obligations were detected in this document.
              </p>
            ) : (
              <ul className="space-y-3">
                {analysis.obligations.map((o) => (
                  <li
                    key={o.id}
                    onMouseEnter={() => setActive(o.evidence)}
                    onMouseLeave={() => setActive(undefined)}
                    className="rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:border-brand/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{o.text}</p>
                      <DueChip date={o.dueDate} />
                    </div>
                    <blockquote className="mt-2.5 border-l-2 border-brand/50 pl-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
                      “{o.evidence}”
                    </blockquote>
                    <div className="mt-2.5 flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
                      <span className="rounded border border-border px-1.5 py-0.5">{o.category}</span>
                      <span className="rounded border border-border px-1.5 py-0.5">{o.suggestedOwner}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Implementation plan"
            description="Sequenced steps generated from the obligations above."
            icon={RouteIcon}
          >
            <ol className="space-y-3">
              {analysis.plan.map((p) => (
                <li key={p.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-[11px] font-semibold text-brand">
                    {p.order}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{p.detail}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {p.owner} · effort {p.effort}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard
            title="Checklist"
            description="Status changes are written to the audit trail."
            icon={ListChecks}
            action={<span className="font-mono text-xs text-muted-foreground">{pct}% complete</span>}
          >
            <ul className="divide-y divide-border">
              {analysis.checklist.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {c.owner} · {fmtDate(c.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DueChip date={c.dueDate} status={c.status} />
                    <StatusPill status={c.status} />
                    <Select
                      value={c.status}
                      onValueChange={(v) => setTaskStatus(analysis.id, c.id, v as TaskStatus)}
                    >
                      <SelectTrigger className="h-8 w-[9.5rem] text-xs" aria-label={`Set status for ${c.title}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Draft response"
            description="An acknowledgement you can edit and send. Review before use."
            icon={Mail}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(analysis.draftResponse);
                  logEvent(analysis.id, "Draft response copied", "Copied to clipboard for review");
                  toast.success("Draft copied to clipboard");
                }}
              >
                <Copy className="size-3.5" aria-hidden />
                Copy
              </Button>
            }
          >
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-secondary/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
              {analysis.draftResponse}
            </pre>
          </SectionCard>

          <SectionCard
            title="Source document"
            description="Cited excerpts are highlighted in the original text."
            icon={ClipboardList}
          >
            <EvidenceDocument
              text={analysis.rawText}
              citations={analysis.obligations.map((o) => o.evidence)}
              activeCitation={active}
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Risk assessment" description={analysis.risk.rationale}>
            <RiskMeter score={analysis.risk.score} level={analysis.risk.level} />
            <ul className="mt-4 space-y-2">
              {analysis.risk.factors.map((f) => (
                <li key={f.label} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {f.weight > 0 ? `+${f.weight}` : f.weight}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <ConfidenceIndicator
            score={analysis.confidence.score}
            rationale={analysis.confidence.rationale}
            model={analysis.confidence.model}
          />

          <SectionCard title="Key dates" icon={CalendarClock}>
            {analysis.deadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No dates were stated in this document.</p>
            ) : (
              <ul className="space-y-2">
                {analysis.deadlines.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div>
                      <p className="text-sm text-foreground">{d.label}</p>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {d.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-foreground">{fmtDate(d.date)}</p>
                      <DueChip date={d.date} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Suggested owners" icon={Users}>
            <ul className="space-y-2">
              {analysis.owners.map((o) => (
                <li key={o.team} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <p className="text-sm font-medium text-foreground">{o.team}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.reason}</p>
                  {o.scope && (
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">scope: {o.scope}</p>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Audit trail" description="Every action recorded, newest last." icon={History}>
            <ol className="space-y-3">
              {analysis.timeline.map((t) => (
                <li key={t.id} className="relative pl-5">
                  <span className="absolute left-0 top-1.5 size-2 rounded-full bg-brand" />
                  <p className="text-sm font-medium text-foreground">{t.action}</p>
                  {t.detail && <p className="mt-0.5 text-xs text-muted-foreground">{t.detail}</p>}
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {fmtDateTime(t.at)} · {t.actor}
                  </p>
                </li>
              ))}
            </ol>
          </SectionCard>

          <LegalNotice />
        </div>
      </div>
    </AppShell>
  );
}
