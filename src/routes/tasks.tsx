import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { DueChip, RiskBadge, SectionCard, Stat } from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompliance } from "@/lib/store";
import { STATUS_LABEL, type TaskStatus } from "@/lib/types";
import { daysUntil, fmtDate } from "@/lib/format";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Compliance task board — ComplyFlow AI" },
      {
        name: "description",
        content:
          "Every obligation-linked task across all analysed documents, with owner, due date and status.",
      },
      { property: "og:title", content: "Compliance task board — ComplyFlow AI" },
      {
        property: "og:description",
        content: "Owner, due date and status for every obligation-linked compliance task.",
      },
    ],
  }),
  component: TasksPage,
});

const STATUSES: TaskStatus[] = ["not_started", "in_progress", "blocked", "done"];

function TasksPage() {
  const { analyses, setTaskStatus } = useCompliance();
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("open");

  const all = analyses.flatMap((a) =>
    a.checklist.map((t) => ({
      ...t,
      analysisId: a.id,
      analysisTitle: a.title,
      riskLevel: a.risk.level,
    })),
  );
  const owners = Array.from(new Set(all.map((t) => t.owner))).sort();
  const filtered = all
    .filter((t) => (owner === "all" ? true : t.owner === owner))
    .filter((t) =>
      status === "all" ? true : status === "open" ? t.status !== "done" : t.status === status,
    )
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));

  const overdue = all.filter((t) => t.status !== "done" && (daysUntil(t.dueDate) ?? 99) < 0).length;
  const done = all.filter((t) => t.status === "done").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Execution"
        title="Task board"
        description="Each task traces back to an obligation and its quoted evidence. Status changes are written to the audit timeline."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total tasks" value={all.length} />
        <Stat label="Open" value={all.length - done} />
        <Stat label="Overdue" value={overdue} tone={overdue ? "critical" : "good"} />
        <Stat
          label="Completion"
          value={`${all.length ? Math.round((done / all.length) * 100) : 0}%`}
          tone="good"
        />
      </div>

      <SectionCard
        className="mt-6"
        title="All tasks"
        description={`${filtered.length} shown`}
        icon={ListChecks}
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger className="w-48" aria-label="Filter by owner">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All owners</SelectItem>
                {owners.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open only</SelectItem>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-foreground">No tasks match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the owner or status filter.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setOwner("all");
                setStatus("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{t.owner}</span>
                    <span>{fmtDate(t.dueDate)}</span>
                    <DueChip date={t.dueDate} status={t.status} />
                    <Link
                      to="/analyses/$analysisId"
                      params={{ analysisId: t.analysisId }}
                      className="truncate text-primary underline-offset-4 hover:underline"
                    >
                      {t.analysisTitle}
                    </Link>
                  </p>
                </div>
                <RiskBadge level={t.riskLevel} />
                <Select
                  value={t.status}
                  onValueChange={(v) => {
                    setTaskStatus(t.analysisId, t.id, v as TaskStatus);
                    toast.success("Status updated", { description: `Logged to the audit timeline.` });
                  }}
                >
                  <SelectTrigger className="w-40" aria-label={`Status for ${t.title}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </AppShell>
  );
}
