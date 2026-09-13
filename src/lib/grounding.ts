import type { AiAnalysis } from "./analyze.functions";

/**
 * Source grounding.
 *
 * Model output is not trusted. Before an analysis reaches the workspace we
 * verify it against the submitted text:
 *
 * 1. An obligation is kept only when its evidence is a literal substring of the
 *    source (whitespace- and case-insensitive). Anything we cannot quote is dropped.
 * 2. A date is kept only when that exact calendar date is written in the source
 *    (ISO 2026-03-31, "31 March 2026", "March 31, 2026"). Every other date —
 *    including plausible internal target dates — is removed and the wording that
 *    described the timing is preserved as text instead.
 *
 * Checklist due dates are never invented: they survive only if the same
 * verification passes.
 */

const MONTHS: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

const pad = (n: string) => (n.length === 1 ? `0${n}` : n);

const MONTH_NAMES = Object.keys(MONTHS).join("|");

/** Every calendar date explicitly written in the source, as ISO strings. */
export function explicitSourceDates(text: string): Set<string> {
  const found = new Set<string>();

  for (const m of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) {
    found.add(`${m[1]}-${m[2]}-${m[3]}`);
  }
  // 31 March 2026
  for (const m of text.matchAll(
    new RegExp(String.raw`\b(\d{1,2})(?:st|nd|rd|th)?\s+(${MONTH_NAMES})\s+(\d{4})\b`, "gi"),
  )) {
    const month = MONTHS[m[2]!.toLowerCase()];
    if (month) found.add(`${m[3]}-${month}-${pad(m[1]!)}`);
  }
  // March 31, 2026
  for (const m of text.matchAll(
    new RegExp(String.raw`\b(${MONTH_NAMES})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b`, "gi"),
  )) {
    const month = MONTHS[m[1]!.toLowerCase()];
    if (month) found.add(`${m[3]}-${month}-${pad(m[2]!)}`);
  }

  return found;
}

const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

export interface GroundingReport {
  obligationsDropped: number;
  datesDropped: number;
}

export interface GroundedResult {
  analysis: AiAnalysis;
  report: GroundingReport;
}

export function groundAnalysis(ai: AiAnalysis, source: string): GroundedResult {
  const haystack = normalize(source);
  const allowed = explicitSourceDates(source);
  let obligationsDropped = 0;
  let datesDropped = 0;

  const keepDate = (date?: string | null): string | null => {
    if (!date) return null;
    if (allowed.has(date)) return date;
    datesDropped += 1;
    return null;
  };

  const obligations = ai.obligations.filter((o) => {
    const evidence = normalize(o.evidence ?? "");
    const ok = evidence.length >= 12 && haystack.includes(evidence);
    if (!ok) obligationsDropped += 1;
    return ok;
  });

  const extraKeyPoints: string[] = [];
  const deadlines = ai.deadlines.filter((d) => {
    if (allowed.has(d.date)) return true;
    datesDropped += 1;
    extraKeyPoints.push(`Timing stated without a verifiable date in the source: ${d.label}`);
    return false;
  });

  const analysis: AiAnalysis = {
    ...ai,
    effectiveDate: keepDate(ai.effectiveDate ?? null),
    deadlines,
    keyPoints: [...ai.keyPoints, ...extraKeyPoints],
    obligations: obligations.map((o) => ({ ...o, dueDate: keepDate(o.dueDate ?? null) })),
    checklist: ai.checklist.map((c) => ({ ...c, dueDate: keepDate(c.dueDate ?? null) })),
    confidence: {
      ...ai.confidence,
      rationale: [
        ai.confidence.rationale,
        obligationsDropped > 0
          ? `${obligationsDropped} obligation(s) were removed because their quoted evidence was not found verbatim in the submitted text.`
          : null,
        datesDropped > 0
          ? `${datesDropped} date(s) were removed because they are not written in the submitted text; the wording describing the timing is kept instead.`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    },
  };

  return { analysis, report: { obligationsDropped, datesDropped } };
}
