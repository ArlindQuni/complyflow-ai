import type { AiAnalysis } from "./analyze.functions";

/**
 * Deterministic, dependency-free analysis engine.
 *
 * It runs entirely in the browser and is used whenever the hosted model is not
 * reachable (no API key, rate limit, offline judging laptop). Same output shape
 * as the model, so every downstream view is identical.
 */

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
};

function pad(n: string) {
  return n.length === 1 ? `0${n}` : n;
}

interface FoundDate {
  iso: string;
  index: number;
  raw: string;
}

function findDates(text: string): FoundDate[] {
  const out: FoundDate[] = [];
  const long = /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})\b/gi;
  const iso = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = long.exec(text))) {
    const month = MONTHS[m[2]!.toLowerCase()]!;
    out.push({ iso: `${m[3]}-${month}-${pad(m[1]!)}`, index: m.index, raw: m[0] });
  }
  while ((m = iso.exec(text))) {
    out.push({ iso: m[0], index: m.index, raw: m[0] });
  }
  return out.sort((a, b) => a.index - b.index);
}

function sentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.;:])\s+(?=[A-Z(])/))
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
}

function clip(s: string, words = 34) {
  const parts = s.split(/\s+/);
  return parts.length <= words ? s : parts.slice(0, words).join(" ");
}

const OBLIGATION_HINT =
  /\b(must|shall|are required to|is required to|required to|should|may not|will be|firms? must|entities shall|customers must|obligated)\b/i;

const CATEGORY_RULES: { re: RegExp; category: string; owner: string }[] = [
  { re: /\b(report|reporting|submit|submission|notify|notification|register)\b/i, category: "Regulatory reporting", owner: "Regulatory Reporting" },
  { re: /\b(dispute|chargeback|presentment|fraud|ratio|monitoring|acquirer)\b/i, category: "Disputes & fraud", owner: "Payments Risk" },
  { re: /\b(data|residency|personal data|processor|sub-processor|breach|scc|privacy|retention)\b/i, category: "Data protection", owner: "Privacy Office" },
  { re: /\b(contract|amendment|clause|agreement|objection|service level|fees?)\b/i, category: "Contract change", owner: "Legal & Vendor Management" },
  { re: /\b(due diligence|kyc|aml|beneficial owner|onboarding|source of (wealth|funds)|sanctions)\b/i, category: "Financial crime", owner: "Financial Crime Compliance" },
  { re: /\b(policy|approve|governance|board|management body|attest)\b/i, category: "Governance", owner: "Compliance Ops" },
];

function classify(s: string) {
  for (const r of CATEGORY_RULES) if (r.re.test(s)) return r;
  return { category: "General compliance", owner: "Compliance Ops" };
}

function detectSourceType(text: string): AiAnalysis["sourceType"] {
  const t = text.toLowerCase();
  if (/\b(visa|mastercard|card scheme|acquirer|bulletin|announcement an)\b/.test(t)) return "card_scheme_bulletin";
  if (/\b(amendment|master services agreement|dpa|addendum|sub-processor)\b/.test(t)) return "contract_change";
  if (/\b(internal policy|policy update|version \d)\b/.test(t)) return "policy_update";
  if (/\b(authority|regulation|directive|supervisory|consultation|policy statement)\b/.test(t)) return "regulatory_notice";
  return "internal_comms";
}

function detectJurisdiction(text: string) {
  const t = text.toLowerCase();
  if (/\b(fca|united kingdom|uk\b|sterling|gbp)\b/.test(t)) return "United Kingdom";
  if (/\b(eu|european|dora|gdpr|esas?|eur)\b/.test(t)) return "European Union";
  if (/\b(united states|usd|ccpa|occ|finra)\b/.test(t)) return "United States";
  return "Global / not stated";
}

function detectIssuer(text: string, fallback: string) {
  const first = text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 3);
  if (!first) return fallback;
  const head = first.split(/[—–\-:|]/)[0]!.trim();
  return head.length > 2 && head.length < 70 ? head.replace(/\s+/g, " ") : fallback;
}

function titleOf(text: string, supplied?: string) {
  if (supplied?.trim()) return supplied.trim();
  const subject = text.match(/^\s*subject:\s*(.+)$/im);
  if (subject) return clip(subject[1]!.trim(), 14);
  const first = text.split("\n").map((l) => l.trim()).find((l) => l.length > 8);
  return first ? clip(first, 14) : "Untitled compliance document";
}

function deadlineType(context: string): AiAnalysis["deadlines"][number]["type"] {
  if (/\b(submit|submission|report|return|questionnaire|respond)\b/i.test(context)) return "submission";
  if (/\b(notify|notification|inform|acknowledge)\b/i.test(context)) return "notification";
  if (/\b(remediat|readiness|implement|deploy|test)\b/i.test(context)) return "remediation";
  return "effective";
}

function deadlineLabel(context: string) {
  const cleaned = clip(context.replace(/\s+/g, " ").trim(), 16);
  return cleaned.length > 6 ? cleaned : "Date referenced in the document";
}

export function analyzeLocally(text: string, suppliedTitle?: string): AiAnalysis {
  const lines = sentences(text);
  const dates = findDates(text);

  // ---- deadlines -------------------------------------------------------
  const seen = new Set<string>();
  const deadlines: AiAnalysis["deadlines"] = [];
  for (const d of dates) {
    if (seen.has(d.iso)) continue;
    seen.add(d.iso);
    const contextLine =
      lines.find((l) => l.includes(d.raw)) ??
      (text.slice(Math.max(0, d.index - 140), d.index + 80).split("\n").pop() as string);
    deadlines.push({ label: deadlineLabel(contextLine), date: d.iso, type: deadlineType(contextLine) });
    if (deadlines.length >= 6) break;
  }

  const effectiveMatch = text.match(/(effective|implementation|applies from)[^\n]{0,40}?((\d{1,2}\s+[A-Za-z]+\s+\d{4})|(\d{4}-\d{2}-\d{2}))/i);
  let effectiveDate: string | null = null;
  if (effectiveMatch) {
    const inner = findDates(effectiveMatch[0]);
    effectiveDate = inner[0]?.iso ?? null;
  }
  if (!effectiveDate) effectiveDate = deadlines[0]?.date ?? null;

  // ---- obligations -----------------------------------------------------
  const obligations: AiAnalysis["obligations"] = [];
  // Requirements are written either as "must / shall" sentences or as numbered
  // and bulleted change items under a lead-in such as "Firms must:".
  const LIST_ITEM = /^\s*(?:[-•*]|\(?[a-z0-9]{1,2}[.)])\s+/i;
  const candidates = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 28);
  for (const s of candidates) {
    if (obligations.length >= 8) break;
    const isListRequirement = LIST_ITEM.test(s) && s.length > 40;
    if (!OBLIGATION_HINT.test(s) && !isListRequirement) continue;
    const evidence = clip(s, 38);
    if (!text.includes(evidence)) continue;
    const { category, owner } = classify(s);
    const nearby = findDates(s)[0]?.iso ?? null;
    obligations.push({
      text: clip(s.replace(/^[-•\d.()\s]+/, ""), 40),
      evidence,
      category,
      suggestedOwner: owner,
      dueDate: nearby,
    });
  }

  // ---- risk ------------------------------------------------------------
  const hasPenalty = /\b(fine|penalt|assessment|non-compliance|sanction|usd|eur|£|\$)\b/i.test(text);
  const hasExternalDeadline = deadlines.some((d) => d.type !== "effective");
  const soonest = deadlines
    .map((d) => Math.round((new Date(`${d.date}T12:00:00Z`).getTime() - Date.now()) / 86_400_000))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b)[0];

  const factors: AiAnalysis["risk"]["factors"] = [];
  let score = 28;
  if (hasExternalDeadline) {
    score += 24;
    factors.push({ label: "External deadline", weight: 24, note: "The document sets dates owed to a third party or authority." });
  }
  if (hasPenalty) {
    score += 22;
    factors.push({ label: "Financial or regulatory exposure", weight: 22, note: "Fines, assessments or penalties are referenced in the text." });
  }
  if (obligations.length >= 5) {
    score += 12;
    factors.push({ label: "Breadth of change", weight: 12, note: `${obligations.length} distinct obligations detected across teams.` });
  }
  if (typeof soonest === "number" && soonest <= 45) {
    score += 14;
    factors.push({ label: "Short runway", weight: 14, note: "At least one dated item falls within the next 45 days." });
  }
  if (/\b(internal|policy update|guidance|informational|for awareness)\b/i.test(text) && !hasPenalty) {
    score -= 10;
    factors.push({ label: "Internally contained", weight: -10, note: "Change appears internal with no external enforcement." });
  }
  score = Math.max(8, Math.min(96, score));

  const rationale = `${obligations.length} obligations and ${deadlines.length} dated items were detected. ${
    hasPenalty ? "The text references financial or regulatory consequences. " : "No explicit penalties were found. "
  }${hasExternalDeadline ? "At least one deadline is owed externally." : "Deadlines appear to be effective dates rather than submissions."}`;

  // ---- owners ----------------------------------------------------------
  const ownerMap = new Map<string, { team: string; reason: string; scope: string }>();
  for (const o of obligations) {
    if (!ownerMap.has(o.suggestedOwner)) {
      ownerMap.set(o.suggestedOwner, {
        team: o.suggestedOwner,
        reason: `Owns ${o.category.toLowerCase()} obligations found in this document.`,
        scope: o.category,
      });
    }
  }
  const owners = [...ownerMap.values()];
  if (owners.length === 0) {
    owners.push({ team: "Compliance Ops", reason: "Default owner while the document is triaged.", scope: "Triage" });
  }

  // ---- plan ------------------------------------------------------------
  const plan: AiAnalysis["plan"] = [
    { title: "Confirm applicability and scope", detail: "Validate which entities, portfolios and products the document applies to, and record the decision.", owner: owners[0]!.team, effort: "S" },
    { title: "Assign obligation owners", detail: `Distribute the ${obligations.length} extracted obligations to the suggested teams and confirm acceptance.`, owner: "Compliance Ops", effort: "S" },
    { title: "Run a gap assessment", detail: "Compare each obligation against current controls, procedures and system capability.", owner: owners[1]?.team ?? owners[0]!.team, effort: "M" },
    { title: "Build the delivery plan", detail: "Sequence the change work against the earliest dated item and secure resourcing.", owner: "Change Delivery", effort: "M" },
    { title: "Evidence and attest", detail: "Capture artefacts for each obligation and log completion in the audit trail.", owner: "Compliance Ops", effort: "M" },
  ];
  if (hasExternalDeadline) {
    plan.push({ title: "Prepare the external submission", detail: "Draft, review and file the response or report before the stated date.", owner: "Regulatory Reporting", effort: "M" });
  }

  // ---- checklist -------------------------------------------------------
  const checklist: AiAnalysis["checklist"] = obligations.slice(0, 8).map((o) => ({
    title: clip(o.text, 18),
    owner: o.suggestedOwner,
    dueDate: o.dueDate ?? effectiveDate,
  }));
  while (checklist.length < 4) {
    checklist.push({
      title: ["Log document in the compliance register", "Confirm impacted business units", "Schedule readiness review", "Archive source document and evidence"][checklist.length]!,
      owner: "Compliance Ops",
      dueDate: effectiveDate,
    });
  }

  const title = titleOf(text, suppliedTitle);
  const issuer = detectIssuer(text, "Unknown issuer");

  const keyPoints = [
    effectiveDate ? `Effective or first key date: ${effectiveDate}.` : "No explicit effective date was stated.",
    `${obligations.length} obligations were extracted, each linked to a verbatim excerpt.`,
    `Suggested owners: ${owners.map((o) => o.team).join(", ")}.`,
    hasPenalty ? "The document references financial or regulatory consequences for non-compliance." : "No penalties were referenced in the text.",
  ];

  const summary = `${issuer} issued a ${detectSourceType(text).replace(/_/g, " ")} covering ${title.toLowerCase()}. ${
    effectiveDate ? `Key date on record: ${effectiveDate}. ` : ""
  }ComplyFlow extracted ${obligations.length} operational obligations across ${owners.length} team${owners.length === 1 ? "" : "s"} and scored the change ${score}/100 for operational risk. Every obligation below is backed by an excerpt from the submitted text for review by a qualified person.`;

  const confidence = Math.max(
    0.35,
    Math.min(0.9, 0.45 + (obligations.length >= 3 ? 0.15 : 0) + (deadlines.length >= 2 ? 0.15 : 0) + (effectiveDate ? 0.1 : 0)),
  );

  return {
    title,
    issuer,
    sourceType: detectSourceType(text),
    jurisdiction: detectJurisdiction(text),
    summary,
    keyPoints,
    effectiveDate,
    deadlines,
    obligations,
    risk: { score, rationale, factors },
    owners,
    plan,
    checklist,
    draftResponse: `Subject: Acknowledgement — ${title}

Thank you for the notice dated ${effectiveDate ?? "the date stated in your communication"}.

We confirm receipt and have logged it in our compliance change register. Our initial review identified ${obligations.length} operational obligations, which have been assigned to ${owners
      .map((o) => o.team)
      .join(", ")} for impact assessment.

We will confirm our implementation approach ahead of the earliest date referenced in the document and will contact you if we require clarification on scope or evidence expectations.

Kind regards,
Compliance Operations`,
    confidence: {
      score: confidence,
      rationale:
        "Produced by the deterministic on-device engine: obligations and dates are matched from explicit wording in the text. Implied or relative requirements may be missed, so treat this as a triage draft for human review.",
    },
  };
}
