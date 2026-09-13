import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { groundAnalysis } from "./grounding";

/** Upper bound on the gateway call so a stalled request cannot hang the page. */
const REQUEST_TIMEOUT_MS = 120_000;

const AnalyzeInput = z.object({
  text: z.string().min(40, "Paste at least a few sentences of the document."),
  title: z.string().optional(),
});

const AiSchema = z.object({
  title: z.string().default("Untitled compliance document"),
  issuer: z.string().default("Unknown issuer"),
  sourceType: z
    .enum([
      "regulatory_notice",
      "card_scheme_bulletin",
      "contract_change",
      "policy_update",
      "internal_comms",
    ])
    .default("regulatory_notice"),
  jurisdiction: z.string().default("Not stated"),
  summary: z.string().default(""),
  keyPoints: z.array(z.string()).default([]),
  effectiveDate: z.string().nullable().optional(),
  deadlines: z
    .array(
      z.object({
        label: z.string(),
        date: z.string(),
        type: z
          .enum(["effective", "submission", "remediation", "notification"])
          .default("effective"),
      }),
    )
    .default([]),
  obligations: z
    .array(
      z.object({
        text: z.string(),
        evidence: z.string().default(""),
        category: z.string().default("General"),
        suggestedOwner: z.string().default("Compliance Ops"),
        dueDate: z.string().nullable().optional(),
      }),
    )
    .default([]),
  risk: z
    .object({
      score: z.number().min(0).max(100).default(50),
      rationale: z.string().default(""),
      factors: z
        .array(
          z.object({
            label: z.string(),
            weight: z.number().default(10),
            note: z.string().default(""),
          }),
        )
        .default([]),
    })
    .default({ score: 50, rationale: "", factors: [] }),
  owners: z
    .array(
      z.object({
        team: z.string(),
        reason: z.string().default(""),
        scope: z.string().default(""),
      }),
    )
    .default([]),
  plan: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string().default(""),
        owner: z.string().default("Compliance Ops"),
        effort: z.enum(["S", "M", "L"]).default("M"),
      }),
    )
    .default([]),
  checklist: z
    .array(
      z.object({
        title: z.string(),
        owner: z.string().default("Compliance Ops"),
        dueDate: z.string().nullable().optional(),
      }),
    )
    .default([]),
  draftResponse: z.string().default(""),
  confidence: z
    .object({ score: z.number().min(0).max(1).default(0.7), rationale: z.string().default("") })
    .default({ score: 0.7, rationale: "" }),
});

export type AiAnalysis = z.infer<typeof AiSchema>;

const MODEL = "google/gemini-3.8-flash";

const SYSTEM_PROMPT = `You are ComplyFlow AI, a compliance operations copilot used by risk, legal and payments teams.
You convert regulatory notices, card scheme bulletins, contract change notices and internal policy updates into an actionable compliance workflow.

Hard rules:
- You are NOT giving legal advice. Never say "you must legally" — describe operational obligations found in the document.
- Every obligation MUST include an "evidence" field containing a VERBATIM substring copied exactly from the source document (no paraphrasing, no ellipsis, 8-40 words). If you cannot quote it, do not output the obligation.
- Only use dates that appear in the document, in ISO YYYY-MM-DD format. If a date is relative (e.g. "within 30 days of notice"), put the wording in the label and omit the date only if no anchor date exists.
- risk.score is 0-100: 80+ only when there are hard external deadlines AND financial/regulatory penalties; 60-79 for firm external deadlines; 35-59 for contained or internal changes; under 35 for informational items.
- confidence.score (0-1) reflects how explicit the document is. Lower it when dates or obligations are implied rather than stated, and say why in confidence.rationale.
- Produce 3-8 obligations, 3-7 plan steps, 4-8 checklist items, and a professional draft acknowledgement/response email in draftResponse.

Reply with a single JSON object only, matching exactly these keys:
{"title":string,"issuer":string,"sourceType":"regulatory_notice"|"card_scheme_bulletin"|"contract_change"|"policy_update"|"internal_comms","jurisdiction":string,"summary":string,"keyPoints":string[],"effectiveDate":string|null,"deadlines":[{"label":string,"date":string,"type":"effective"|"submission"|"remediation"|"notification"}],"obligations":[{"text":string,"evidence":string,"category":string,"suggestedOwner":string,"dueDate":string|null}],"risk":{"score":number,"rationale":string,"factors":[{"label":string,"weight":number,"note":string}]},"owners":[{"team":string,"reason":string,"scope":string}],"plan":[{"title":string,"detail":string,"owner":string,"effort":"S"|"M"|"L"}],"checklist":[{"title":string,"owner":string,"dueDate":string|null}],"draftResponse":string,"confidence":{"score":number,"rationale":string}}`;

function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? raw) as string;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The model did not return structured output.");
  return JSON.parse(candidate.slice(start, end + 1));
}

export const analyzeDocument = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AnalyzeInput.parse(data))
  .handler(async ({ data }): Promise<AiAnalysis> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "AI is not configured for this deployment. Use the seeded demo documents to explore ComplyFlow.",
      );
    }

    const document = data.text.slice(0, 60000);

    // Bounded so a stalled upstream cannot hang the request forever; generous
    // enough that a normal generation (~25s observed in production) is never cut off.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `${data.title ? `Working title supplied by the user: ${data.title}\n\n` : ""}Analyse the following document and return the JSON object.\n\n---BEGIN DOCUMENT---\n${document}\n---END DOCUMENT---`,
            },
          ],
        }),
      });
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        throw new Error(
          `The AI service did not respond within ${Math.round(REQUEST_TIMEOUT_MS / 1000)} seconds. Try again, or run the offline engine.`,
        );
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) {
        throw new Error("The AI service is rate limited right now. Wait a moment and try again.");
      }
      if (res.status === 402) {
        throw new Error(
          "AI credits for this workspace are exhausted. Add credits in Lovable to run new analyses — seeded demo analyses still work.",
        );
      }
      throw new Error(`Analysis failed (${res.status}). ${body.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("The AI service returned an empty response.");

    // Never trust model output: drop unquotable obligations and unverifiable dates.
    return groundAnalysis(AiSchema.parse(extractJson(content)), data.text).analysis;
  });
