import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, RotateCcw } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { LegalNotice, RiskBadge, SectionCard } from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import { useCompliance } from "@/lib/store";

export const Route = createFileRoute("/judge-demo")({
  head: () => ({
    meta: [
      { title: "Judge demo — ComplyFlow AI" },
      {
        name: "description",
        content:
          "A scripted three-minute walkthrough of ComplyFlow AI: ingest, obligations with evidence, risk scoring, task tracking and audit trail.",
      },
      { property: "og:title", content: "Judge demo — ComplyFlow AI" },
      {
        property: "og:description",
        content:
          "Three minutes, five steps, no sign-in: see the whole compliance workflow end to end.",
      },
    ],
  }),
  component: JudgeDemo,
});

function JudgeDemo() {
  const { analyses, resetDemo } = useCompliance();
  const [checked, setChecked] = useState<number[]>([]);

  const headline = [...analyses].sort((a, b) => b.risk.score - a.risk.score)[0];

  const steps = [
    {
      time: "0:00 – 0:30",
      title: "Start on the dashboard",
      body: "Four seeded documents are already in the workspace with live risk scores, open obligations and the next dated commitment across the portfolio.",
      cta: { label: "Open dashboard", to: "/dashboard" as const },
    },
    {
      time: "0:30 – 1:15",
      title: "Open the highest-risk item",
      body: headline
        ? `${headline.title} scores ${headline.risk.score}/100. Show the summary, the dated items, and hover an obligation to highlight the exact source wording it was extracted from.`
        : "Open the highest-scoring analysis and show the summary, dated items and evidence highlighting.",
      cta: headline
        ? { label: "Open analysis", to: "/analyses/$analysisId" as const, params: { analysisId: headline.id } }
        : undefined,
    },
    {
      time: "1:15 – 2:00",
      title: "Move a task and show the audit trail",
      body: "Change a checklist item to In progress. The event is written to the audit trail with actor, action and timestamp — nothing is silently mutated.",
      cta: { label: "Open tasks", to: "/tasks" as const },
    },
    {
      time: "2:00 – 2:40",
      title: "Run a live analysis",
      body: "Load a sample document and run it. The pipeline shows ingest, extract, classify, deadline and obligation detection, risk scoring and plan generation, then lands on a fresh analysis.",
      cta: { label: "New analysis", to: "/new" as const },
    },
    {
      time: "2:40 – 3:00",
      title: "Close on the architecture",
      body: "Explain the hosted-model path, the deterministic fallback engine, the structured-output schema and the evidence rule that keeps every obligation traceable.",
      cta: { label: "How it works", to: "/how-it-works" as const },
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Judging path"
        title="Three-minute demo"
        description="A scripted route through every part of the product. No sign-in, no API keys, no setup — the workspace is already seeded."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetDemo();
              setChecked([]);
            }}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset to a clean demo
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Run sheet" description="Tick each step as you present it." icon={Clock}>
          <ol className="space-y-3">
            {steps.map((s, i) => {
              const isDone = checked.includes(i);
              return (
                <li
                  key={s.title}
                  className="rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:border-brand/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <button
                        type="button"
                        aria-label={isDone ? `Mark step ${i + 1} not done` : `Mark step ${i + 1} done`}
                        onClick={() =>
                          setChecked((prev) =>
                            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                          )
                        }
                        className="mt-0.5 text-brand"
                      >
                        {isDone ? (
                          <CheckCircle2 className="size-5" aria-hidden />
                        ) : (
                          <Circle className="size-5 text-muted-foreground" aria-hidden />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p className="label-mono">{s.time}</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">{s.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                      </div>
                    </div>
                    {s.cta &&
                      ("params" in s.cta && s.cta.params ? (
                        <Button asChild size="sm" variant="outline">
                          <Link to={s.cta.to} params={s.cta.params}>
                            {s.cta.label}
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline">
                          <Link to={s.cta.to}>{s.cta.label}</Link>
                        </Button>
                      ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Seeded workspace" description="What is already loaded before you start.">
            <ul className="space-y-2">
              {analyses.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {a.id} · {a.obligations.length} obligations · {a.checklist.length} tasks
                    </p>
                  </div>
                  <RiskBadge level={a.risk.level} score={a.risk.score} />
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Talking points">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {[
                "Every obligation quotes verbatim source text — no unattributable claims.",
                "Risk scores are weighted factors, shown and challengeable.",
                "Task changes write to an audit trail with actor and timestamp.",
                "Hosted model with a strict schema; deterministic engine as fallback.",
                "Positioned as a compliance operations copilot, not legal advice.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </SectionCard>

          <LegalNotice />
        </div>
      </div>
    </AppShell>
  );
}
