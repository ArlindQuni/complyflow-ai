import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import {
  ConfidenceIndicator,
  DueChip,
  RiskBadge,
  SectionCard,
  Stat,
  StatusPill,
  LegalNotice,
} from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import { useCompliance } from "@/lib/store";
import { SOURCE_LABEL } from "@/lib/types";
import { daysUntil, fmtDate } from "@/lib/format";
import { AlarmClock, ArrowRight, FileText, Gauge, ListChecks, Inbox } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Compliance dashboard — ComplyFlow AI" },
      {
        name: "description",
        content:
          "Track regulatory notices, obligations, deadlines and open compliance tasks in one operational dashboard.",
      },
      { property: "og:title", content: "Compliance dashboard — ComplyFlow AI" },
      {
        property: "og:description",
        content: "Obligations, deadlines and task status across every ingested compliance document.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { analyses } = useCompliance();

  const tasks = analyses.flatMap((a) =>
    a.checklist.map((t) => ({ ...t, analysisId: a.id, analysisTitle: a.title })),
  );
  const open = tasks.filter((t) => t.status !== "done");
  const overdue = open.filter((t) => (daysUntil(t.dueDate) ?? 99) < 0);
  const obligations = analyses.reduce((n, a) => n + a.obligations.length, 0);
  const upcoming = analyses
    .flatMap((a) => a.deadlines.map((d) => ({ ...d, analysis: a })))
    .filter((d) => (daysUntil(d.date) ?? -999) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);
  const avgConfidence =
    analyses.length > 0
      ? analyses.reduce((n, a) => n + a.confidence.score, 0) / analyses.length
      : 0;

  if (analyses.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Compliance dashboard" />
        <div className="panel flex flex-col items-center justify-center gap-3 p-16 text-center">
          <Inbox className="size-8 text-muted-foreground" aria-hidden />
          <h2 className="text-lg font-semibold">No documents yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Paste a regulatory notice, scheme bulletin or contract change to generate an actionable
            workflow.
          </p>
          <Button asChild>
            <Link to="/new">Analyse a document</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Compliance dashboard"
        description="Every ingested notice, the obligations extracted from it, and who owes what by when."
        actions={
          <Button asChild>
            <Link to="/new">
              Analyse a document <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Documents analysed" value={analyses.length} hint={`${obligations} obligations extracted`} />
        <Stat
          label="Open tasks"
          value={open.length}
          hint={`${tasks.length - open.length} completed`}
          tone="default"
        />
        <Stat
          label="Overdue"
          value={overdue.length}
          hint="Past due against today"
          tone={overdue.length > 0 ? "critical" : "good"}
        />
        <Stat
          label="Avg AI confidence"
          value={`${Math.round(avgConfidence * 100)}%`}
          hint="Across all analyses"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Analysed documents"
            description="Ranked by risk score. Open one to see evidence-linked obligations."
            icon={FileText}
          >
            <ul className="divide-y divide-border">
              {[...analyses]
                .sort((a, b) => b.risk.score - a.risk.score)
                .map((a) => {
                  const openCount = a.checklist.filter((t) => t.status !== "done").length;
                  return (
                    <li key={a.id}>
                      <Link
                        to="/analyses/$analysisId"
                        params={{ analysisId: a.id }}
                        className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-4 transition-colors hover:bg-secondary/70"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <RiskBadge level={a.risk.level} score={a.risk.score} />
                          <span className="label-mono">{SOURCE_LABEL[a.sourceType]}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                        </div>
                        <p className="font-medium text-foreground group-hover:text-primary">{a.title}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>{a.issuer}</span>
                          <span>{a.jurisdiction}</span>
                          <span>Effective {fmtDate(a.effectiveDate)}</span>
                          <span>{a.obligations.length} obligations</span>
                          <span>{openCount} open tasks</span>
                          <ConfidenceIndicator score={a.confidence.score} compact />
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </SectionCard>

          <SectionCard
            title="Tasks needing attention"
            description="Open items sorted by due date across all documents."
            icon={ListChecks}
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/tasks">View all tasks</Link>
              </Button>
            }
          >
            {open.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Everything is closed out. Nice.
              </p>
            ) : (
              <ul className="space-y-2">
                {open
                  .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
                  .slice(0, 6)
                  .map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.owner} · {t.analysisTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <DueChip date={t.dueDate} status={t.status} />
                        <StatusPill status={t.status} />
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Upcoming deadlines" description="Detected in the source documents." icon={AlarmClock}>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No future deadlines detected.</p>
            ) : (
              <ol className="space-y-3">
                {upcoming.map((d) => (
                  <li key={`${d.analysis.id}-${d.id}`} className="border-l-2 border-brand/40 pl-3">
                    <p className="font-mono text-xs text-muted-foreground">
                      {fmtDate(d.date)} · in {daysUntil(d.date)}d
                    </p>
                    <p className="text-sm font-medium text-foreground">{d.label}</p>
                    <Link
                      to="/analyses/$analysisId"
                      params={{ analysisId: d.analysis.id }}
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      {d.analysis.issuer}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </SectionCard>

          <SectionCard title="Portfolio risk" description="Distribution of scored documents." icon={Gauge}>
            <ul className="space-y-3">
              {(["critical", "high", "medium", "low"] as const).map((level) => {
                const count = analyses.filter((a) => a.risk.level === level).length;
                const pct = Math.round((count / analyses.length) * 100);
                return (
                  <li key={level} className="flex items-center gap-3">
                    <RiskBadge level={level} className="w-24 justify-center" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground/70"
                        style={{ width: `${Math.max(pct, count ? 6 : 0)}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-xs text-muted-foreground">{count}</span>
                  </li>
                );
              })}
            </ul>
            <LegalNotice className="mt-5" />
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
