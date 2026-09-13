import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_ANALYSES } from "./seed";
import {
  riskLevelFromScore,
  type Analysis,
  type ChecklistItem,
  type TaskStatus,
} from "./types";
import type { AiAnalysis } from "./analyze.functions";

const STORAGE_KEY = "complyflow.workspace.v1";

interface Ctx {
  analyses: Analysis[];
  hydrated: boolean;
  getAnalysis: (id: string) => Analysis | undefined;
  addAnalysis: (a: Analysis) => void;
  setTaskStatus: (analysisId: string, taskId: string, status: TaskStatus) => void;
  logEvent: (analysisId: string, action: string, detail?: string, actor?: string) => void;
  resetDemo: () => void;
}

const ComplianceContext = createContext<Ctx | null>(null);

function load(): Analysis[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Analysis[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function ComplianceProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalyses] = useState<Analysis[]>(SEED_ANALYSES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = load();
    if (stored) setAnalyses(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    } catch {
      /* storage full or unavailable — the session still works in memory */
    }
  }, [analyses, hydrated]);

  const addAnalysis = useCallback((a: Analysis) => {
    setAnalyses((prev) => [a, ...prev]);
  }, []);

  const setTaskStatus = useCallback(
    (analysisId: string, taskId: string, status: TaskStatus) => {
      setAnalyses((prev) =>
        prev.map((a) => {
          if (a.id !== analysisId) return a;
          const task = a.checklist.find((t) => t.id === taskId);
          return {
            ...a,
            checklist: a.checklist.map((t) => (t.id === taskId ? { ...t, status } : t)),
            timeline: [
              ...a.timeline,
              {
                id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                at: new Date().toISOString(),
                actor: task?.owner ?? "Compliance Ops",
                action: "Task status changed",
                detail: `${task?.title ?? taskId} → ${status.replace("_", " ")}`,
              },
            ],
          };
        }),
      );
    },
    [],
  );

  const logEvent = useCallback(
    (analysisId: string, action: string, detail?: string, actor = "A. Quni") => {
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId
            ? {
                ...a,
                timeline: [
                  ...a.timeline,
                  {
                    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    at: new Date().toISOString(),
                    actor,
                    action,
                    detail,
                  },
                ],
              }
            : a,
        ),
      );
    },
    [],
  );

  const resetDemo = useCallback(() => {
    setAnalyses(SEED_ANALYSES);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      analyses,
      hydrated,
      getAnalysis: (id: string) => analyses.find((a) => a.id === id),
      addAnalysis,
      setTaskStatus,
      logEvent,
      resetDemo,
    }),
    [analyses, hydrated, addAnalysis, setTaskStatus, logEvent, resetDemo],
  );

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
}

export function useCompliance() {
  const ctx = useContext(ComplianceContext);
  if (!ctx) throw new Error("useCompliance must be used inside ComplianceProvider");
  return ctx;
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/** Turns the model output into a stored workspace record with ids, checklist state and an audit trail. */
export function toAnalysis(ai: AiAnalysis, rawText: string, durationMs: number): Analysis {
  const now = new Date().toISOString();
  const id = `cf-${Math.floor(Date.now() / 1000) % 100000}`;

  const obligations = ai.obligations.map((o) => ({
    id: uid("o"),
    text: o.text,
    evidence: o.evidence,
    category: o.category,
    suggestedOwner: o.suggestedOwner,
    dueDate: o.dueDate ?? undefined,
  }));

  const checklist: ChecklistItem[] = (
    ai.checklist.length > 0
      ? ai.checklist
      : obligations.map((o) => ({ title: o.text, owner: o.suggestedOwner, dueDate: o.dueDate }))
  ).map((c, i) => ({
    id: uid("c"),
    title: c.title,
    owner: c.owner,
    dueDate: c.dueDate ?? undefined,
    status: "not_started" as TaskStatus,
    obligationId: obligations[i]?.id,
  }));

  return {
    id,
    title: ai.title,
    issuer: ai.issuer,
    sourceType: ai.sourceType,
    jurisdiction: ai.jurisdiction,
    receivedAt: now,
    createdAt: now,
    rawText,
    summary: ai.summary,
    keyPoints: ai.keyPoints,
    effectiveDate: ai.effectiveDate ?? undefined,
    deadlines: ai.deadlines.map((d) => ({ id: uid("d"), ...d })),
    obligations,
    risk: {
      score: Math.round(ai.risk.score),
      level: riskLevelFromScore(ai.risk.score),
      rationale: ai.risk.rationale,
      factors: ai.risk.factors,
    },
    owners: ai.owners,
    plan: ai.plan.map((p, i) => ({ id: uid("p"), order: i + 1, ...p })),
    checklist,
    draftResponse: ai.draftResponse,
    confidence: {
      score: ai.confidence.score,
      rationale: ai.confidence.rationale,
      model: "google/gemini-3.8-flash",
    },
    timeline: [
      { id: uid("t"), at: now, actor: "Ingest", action: "Document received", detail: `${rawText.length.toLocaleString()} characters ingested` },
      {
        id: uid("t"),
        at: now,
        actor: "ComplyFlow AI",
        action: "Analysis completed",
        detail: `${obligations.length} obligations, ${ai.deadlines.length} deadlines, risk ${Math.round(ai.risk.score)}/100 · ${(durationMs / 1000).toFixed(1)}s`,
      },
    ],
  };
}
