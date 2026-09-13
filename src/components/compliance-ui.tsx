import { cn } from "@/lib/utils";
import { RISK_LABEL, STATUS_LABEL, type RiskLevel, type TaskStatus } from "@/lib/types";
import { daysUntil } from "@/lib/format";
import { ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const riskStyles: Record<RiskLevel, string> = {
  critical: "bg-risk-critical-soft text-risk-critical border-risk-critical/30",
  high: "bg-risk-high-soft text-risk-high border-risk-high/30",
  medium: "bg-risk-medium-soft text-risk-medium border-risk-medium/30",
  low: "bg-risk-low-soft text-risk-low border-risk-low/30",
};

export function RiskBadge({
  level,
  score,
  className,
}: {
  level: RiskLevel;
  score?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        riskStyles[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {RISK_LABEL[level]}
      {typeof score === "number" && <span className="font-mono text-[11px] opacity-80">{score}</span>}
    </span>
  );
}

export function RiskMeter({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="label-mono">Risk score</span>
        <span className="font-mono text-2xl font-semibold text-foreground">
          {score}
          <span className="text-sm text-muted-foreground">/100</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", {
            "bg-risk-critical": level === "critical",
            "bg-risk-high": level === "high",
            "bg-risk-medium": level === "medium",
            "bg-risk-low": level === "low",
          })}
          style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

export function ConfidenceIndicator({
  score,
  rationale,
  model,
  compact,
}: {
  score: number;
  rationale?: string;
  model?: string;
  compact?: boolean;
}) {
  const pct = Math.round(score * 100);
  const band = pct >= 85 ? "High" : pct >= 65 ? "Moderate" : "Low";
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground">
        <Sparkles className="size-3" aria-hidden />
        AI confidence {pct}%
      </span>
    );
  }
  return (
    <div className="rounded-lg border border-border bg-secondary/60 p-4">
      <div className="flex items-center justify-between">
        <span className="label-mono">AI confidence</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {pct}% · {band}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      {rationale && <p className="mt-3 text-sm text-muted-foreground">{rationale}</p>}
      {model && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-foreground">
            {model === "complyflow/deterministic-engine"
              ? "Deterministic engine (no external AI call)"
              : model === "seeded demo record"
                ? "Seeded demo record"
                : "Hosted AI model"}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">source: {model}</span>
        </div>
      )}
    </div>
  );
}

const statusStyles: Record<TaskStatus, string> = {
  not_started: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-accent text-accent-foreground border-brand/30",
  blocked: "bg-risk-critical-soft text-risk-critical border-risk-critical/30",
  done: "bg-risk-low-soft text-risk-low border-risk-low/30",
};

export function StatusPill({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function DueChip({ date, status }: { date?: string | undefined; status?: TaskStatus }) {
  const days = daysUntil(date);
  if (days === null) return <span className="font-mono text-xs text-muted-foreground">no date</span>;
  const done = status === "done";
  const tone = done
    ? "text-muted-foreground"
    : days < 0
      ? "text-risk-critical font-semibold"
      : days <= 14
        ? "text-risk-high font-semibold"
        : "text-muted-foreground";
  return (
    <span className={cn("font-mono text-xs", tone)}>
      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "due today" : `in ${days}d`}
    </span>
  );
}

/** Renders the source document with each cited evidence snippet highlighted. */
export function EvidenceDocument({
  text,
  citations,
  activeCitation,
}: {
  text: string;
  citations: string[];
  activeCitation?: string | undefined;
}) {
  const marks: { start: number; end: number; quote: string }[] = [];
  for (const q of citations) {
    if (!q || q.length < 8) continue;
    const idx = text.indexOf(q);
    if (idx === -1) continue;
    if (marks.some((m) => idx < m.end && idx + q.length > m.start)) continue;
    marks.push({ start: idx, end: idx + q.length, quote: q });
  }
  marks.sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let cursor = 0;
  marks.forEach((m, i) => {
    if (m.start > cursor) parts.push(<span key={`t${i}`}>{text.slice(cursor, m.start)}</span>);
    parts.push(
      <mark
        key={`m${i}`}
        id={`evidence-${i}`}
        className={cn(
          "rounded px-0.5 py-px transition-colors",
          activeCitation === m.quote
            ? "bg-brand/35 outline outline-2 outline-brand"
            : "bg-brand/15 text-foreground",
        )}
      >
        {text.slice(m.start, m.end)}
      </mark>,
    );
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(<span key="tail">{text.slice(cursor)}</span>);

  return (
    <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-secondary/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground">
      {parts}
    </pre>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: typeof ShieldCheck;
}) {
  return (
    <section className={cn("panel p-5 sm:p-6", className)}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Icon className="size-4" aria-hidden />
            </span>
          )}
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "critical" | "warning" | "good";
}) {
  return (
    <div className="panel p-4">
      <p className="label-mono">{label}</p>
      <p
        className={cn("mt-2 font-mono text-2xl font-semibold", {
          "text-foreground": tone === "default",
          "text-risk-critical": tone === "critical",
          "text-risk-high": tone === "warning",
          "text-risk-low": tone === "good",
        })}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function LegalNotice({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs text-muted-foreground", className)}>
      <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        ComplyFlow AI is a compliance operations copilot. It drafts and organises work for review by
        qualified people — it does not provide legal advice, and every obligation links back to the
        text it was extracted from.
      </span>
    </p>
  );
}
