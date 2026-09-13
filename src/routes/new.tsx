import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Sparkles, Upload, Zap } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { LegalNotice, SectionCard } from "@/components/compliance-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzeDocument } from "@/lib/analyze.functions";
import { groundAnalysis } from "@/lib/grounding";
import { analyzeLocally } from "@/lib/local-engine";
import { SAMPLE_DOCUMENTS } from "@/lib/seed";
import { toAnalysis, useCompliance } from "@/lib/store";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "New analysis — ComplyFlow AI" },
      {
        name: "description",
        content:
          "Paste a regulatory notice, scheme bulletin or contract change and turn it into obligations, deadlines, owners and a checklist.",
      },
      { property: "og:title", content: "New analysis — ComplyFlow AI" },
      {
        property: "og:description",
        content: "Turn a compliance document into an evidence-backed action plan in seconds.",
      },
    ],
  }),
  component: NewAnalysisPage,
});

const STAGES = [
  "Ingesting document",
  "Extracting clauses",
  "Classifying source",
  "Detecting deadlines & obligations",
  "Scoring risk",
  "Building action plan",
];

function NewAnalysisPage() {
  const navigate = useNavigate();
  const { addAnalysis } = useCompliance();
  const runRemote = useServerFn(analyzeDocument);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const tooShort = text.trim().length < 40;

  async function run(forceLocal = false) {
    if (tooShort) {
      setError("Paste at least a few sentences of the document before running an analysis.");
      return;
    }
    setBusy(true);
    setError(null);
    setStage(0);
    const ticker = window.setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 550);
    const started = performance.now();

    try {
      let ai;
      let mode: "model" | "deterministic" = "model";
      const local = () => groundAnalysis(analyzeLocally(text, title), text).analysis;
      if (forceLocal) {
        ai = local();
        mode = "deterministic";
      } else {
        try {
          ai = await runRemote({ data: { text, title: title || undefined } });
        } catch {
          ai = local();
          mode = "deterministic";
        }
      }

      const record = toAnalysis(ai, text, performance.now() - started);
      if (mode === "deterministic") {
        record.confidence = {
          ...record.confidence,
          model: "complyflow/deterministic-engine",
        };
      }
      addAnalysis(record);
      toast.success("Analysis complete", {
        description:
          mode === "deterministic"
            ? "Produced by the on-device deterministic engine."
            : "Produced by the hosted model with evidence citations.",
      });
      navigate({ to: "/analyses/$analysisId", params: { analysisId: record.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "The analysis could not be completed.");
    } finally {
      window.clearInterval(ticker);
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    const content = await file.text();
    setText(content.slice(0, 60000));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Ingest"
        title="New analysis"
        description="Paste the document text, or start from a sample. ComplyFlow extracts obligations, dates, owners and a checklist — each traceable to the source wording."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Document text"
          description="Plain text works best. Run analysis sends your document to this app's server, which may forward it to the hosted AI service — that can happen even if the result later comes from the offline engine. Only Run offline engine keeps the text in your browser."
          icon={FileText}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="doc-title" className="label-mono">
                Working title (optional)
              </label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheme bulletin — dispute evidence standards"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="doc-text" className="label-mono">
                Document
              </label>
              <Textarea
                id="doc-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={16}
                placeholder="Paste the notice, bulletin, amendment or policy update here…"
                className="mt-1.5 font-mono text-[12.5px] leading-relaxed"
              />
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-muted-foreground">
                  {text.trim().length.toLocaleString()} characters
                </p>
                <label className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground">
                  <Upload className="size-3.5" aria-hidden />
                  Upload .txt / .md
                  <input
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void onFile(f);
                    }}
                  />
                </label>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-risk-critical/30 bg-risk-critical-soft p-3 text-sm text-risk-critical"
              >
                {error}
              </div>
            )}

            {busy && (
              <div className="rounded-lg border border-border bg-secondary/60 p-4">
                <p className="label-mono mb-2">Pipeline</p>
                <ol className="space-y-1.5">
                  {STAGES.map((s, i) => (
                    <li
                      key={s}
                      className={
                        i <= stage
                          ? "flex items-center gap-2 text-sm text-foreground"
                          : "flex items-center gap-2 text-sm text-muted-foreground"
                      }
                    >
                      {i === stage ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => void run(false)} disabled={busy || tooShort}>
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                {busy ? "Analysing…" : "Run analysis"}
              </Button>
              <Button variant="outline" onClick={() => void run(true)} disabled={busy || tooShort}>
                <Zap className="size-4" aria-hidden />
                Run offline engine
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setText("");
                  setTitle("");
                  setError(null);
                }}
                disabled={busy}
              >
                Clear
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              <strong className="font-medium text-foreground">Run analysis</strong> uploads the text
              to the server and may send it to the hosted AI service.{" "}
              <strong className="font-medium text-foreground">Run offline engine</strong> is the only
              option that makes no analysis request at all. Either way, obligations without a
              verbatim quote from your text are dropped, and dates that are not written in the
              document are removed rather than estimated.
            </p>

            <LegalNotice />
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Start from a sample"
            description="Illustrative documents written for this demo. They are not issued by, or affiliated with, any named company or regulator."
          >
            <ul className="space-y-2">
              {SAMPLE_DOCUMENTS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setText(s.text);
                      setTitle(s.label);
                      setError(null);
                    }}
                    className="w-full rounded-lg border border-border bg-secondary/40 p-3 text-left transition-colors hover:border-brand/40 hover:bg-accent"
                  >
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="What you get back">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {[
                "Plain-English summary and key points",
                "Effective date and every dated commitment",
                "Obligations with verbatim source excerpts",
                "Risk score with weighted rationale",
                "Suggested owning teams",
                "Sequenced implementation plan",
                "Working checklist with status",
                "Draft acknowledgement email",
                "Audit-ready activity timeline",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                  {i}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
