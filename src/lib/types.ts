export type RiskLevel = "critical" | "high" | "medium" | "low";

export type TaskStatus = "not_started" | "in_progress" | "blocked" | "done";

export type SourceType =
  | "regulatory_notice"
  | "card_scheme_bulletin"
  | "contract_change"
  | "policy_update"
  | "internal_comms";

export interface Obligation {
  id: string;
  text: string;
  evidence: string;
  category: string;
  suggestedOwner: string;
  dueDate?: string | undefined;
}

export interface Deadline {
  id: string;
  label: string;
  date: string;
  type: "effective" | "submission" | "remediation" | "notification";
}

export interface PlanStep {
  id: string;
  order: number;
  title: string;
  detail: string;
  owner: string;
  effort: "S" | "M" | "L";
}

export interface ChecklistItem {
  id: string;
  title: string;
  owner: string;
  dueDate?: string | undefined;
  status: TaskStatus;
  obligationId?: string | undefined;
}

export interface TimelineEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string | undefined;
}

export interface OwnerSuggestion {
  team: string;
  reason: string;
  scope: string;
}

export interface Analysis {
  id: string;
  title: string;
  issuer: string;
  sourceType: SourceType;
  jurisdiction: string;
  receivedAt: string;
  createdAt: string;
  rawText: string;
  summary: string;
  keyPoints: string[];
  effectiveDate?: string | undefined;
  deadlines: Deadline[];
  obligations: Obligation[];
  risk: {
    score: number;
    level: RiskLevel;
    rationale: string;
    factors: { label: string; weight: number; note: string }[];
  };
  owners: OwnerSuggestion[];
  plan: PlanStep[];
  checklist: ChecklistItem[];
  draftResponse: string;
  confidence: { score: number; rationale: string; model: string };
  timeline: TimelineEvent[];
  demo?: boolean | undefined;
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const SOURCE_LABEL: Record<SourceType, string> = {
  regulatory_notice: "Regulatory notice",
  card_scheme_bulletin: "Card scheme bulletin",
  contract_change: "Contract change",
  policy_update: "Policy update",
  internal_comms: "Compliance comms",
};

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}
