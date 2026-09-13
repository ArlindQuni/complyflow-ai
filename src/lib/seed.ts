import type { Analysis } from "./types";

const VISA_TEXT = `VISA BUSINESS NEWS — ARTICLE ID: AI11422
Subject: Global Acquirer Monitoring Program (VAMP) — Ratio Threshold Changes and Enhanced Evidence Requirements
Effective Date: 1 January 2027
Distribution: Acquirers, Payment Facilitators, Marketplaces

Visa is updating the Visa Acquirer Monitoring Program (VAMP) for all regions. Effective 1 January 2027, the VAMP ratio threshold for "Excessive" acquirer status will be lowered from 0.50% to 0.30%, calculated as the combined count of fraud (TC40) and non-fraud dispute (TC15) transactions divided by total settled transaction count in the prior calendar month.

Acquirers must implement the following:
1. Acquirers must submit an updated remediation plan for any merchant that exceeds the "Above Standard" threshold of 0.15% for two consecutive months. Plans must be submitted through Visa Online within 30 calendar days of notification.
2. Acquirers must retain supporting dispute evidence for a minimum of 24 months and produce it to Visa within 10 business days of a written request.
3. Payment facilitators are required to report sponsored-merchant level ratios monthly beginning with the February 2027 reporting cycle.
4. Enumeration attack monitoring becomes mandatory: acquirers must deploy velocity controls on card-testing patterns and attest to deployment by 31 March 2027.

Non-compliance may result in monthly fines beginning at USD 10 per dispute above threshold, escalating to USD 50 per dispute after three consecutive months in "Excessive" status, and may lead to portfolio-level review.

Questions should be directed to your Visa Regional Risk Representative. Acknowledgement of receipt is requested within 15 business days.`;

const DORA_TEXT = `EUROPEAN SUPERVISORY AUTHORITIES — JOINT COMMUNICATION
Reference: ESA-2026-JC-014
Subject: Register of Information under DORA Article 28(3) — 2027 reporting cycle and data quality expectations
Date of publication: 2 September 2026

Financial entities in scope of Regulation (EU) 2022/2554 (DORA) are reminded that the annual Register of Information on contractual arrangements with ICT third-party service providers must be submitted to the competent authority by 31 March 2027, with a data reference date of 31 December 2026.

Entities shall:
(a) ensure every ICT third-party service provider is identified by a valid LEI, and where the provider is not an EU entity, an EUID or equivalent identifier is supplied;
(b) classify each contractual arrangement as supporting a critical or important function, and maintain the documented rationale for that classification;
(c) report intra-group ICT arrangements on the same basis as third-party arrangements;
(d) remediate data quality errors flagged by the competent authority within 20 working days of feedback.

Entities are further reminded that exit strategies for arrangements supporting critical or important functions must be documented and tested at least annually, and that the management body retains ultimate accountability for ICT third-party risk.

The ESAs will publish updated validation rules in November 2026. Entities should plan extraction and reconciliation activities accordingly.`;

const VENDOR_TEXT = `CONTRACT AMENDMENT NOTICE — NorthPeak Cloud Services Ltd.
To: All Enterprise (Tier 2) customers
Amendment effective: 15 November 2026
Notice period: 60 days

NorthPeak is amending the Data Processing Addendum (DPA) and Service Level Agreement attached to your Master Services Agreement.

Summary of changes:
- Sub-processor list expanded to include Helix Analytics Inc. (United States) for telemetry aggregation. Customers may object in writing within 30 days of this notice.
- Breach notification window changed from 24 hours to 72 hours after NorthPeak becomes aware of a personal data breach.
- Service credits for Severity 1 incidents reduced from 10% to 5% of monthly fees.
- Standard Contractual Clauses updated to reflect the 2021 EU SCC module 3 for processor-to-processor transfers.
- Data deletion on termination extended from 30 days to 45 days.

Continued use of the Services after the effective date constitutes acceptance. Customers wishing to object to the new sub-processor must email legal@northpeak.example within 30 days of this notice.`;

const AML_TEXT = `INTERNAL POLICY UPDATE — Financial Crime Compliance
Policy: FCC-04 Customer Due Diligence Standard, version 6.0
Approved: 20 August 2026 | Implementation deadline: 31 October 2026

Version 6.0 introduces the following changes to the CDD standard:
1. Enhanced due diligence is now mandatory for all customers with beneficial ownership in a jurisdiction on the internal High Risk Jurisdiction List, regardless of expected transaction volume.
2. Source of wealth evidence must be collected and independently corroborated for all customers with an aggregate expected annual turnover above EUR 1,000,000.
3. Periodic review cycles shortened: high risk 6 months (previously 12), medium risk 18 months, low risk 36 months.
4. All first-line staff completing CDD must complete the refreshed training module by 31 October 2026; completion is tracked by Learning & Development.
5. Quality assurance sampling increases from 5% to 10% of onboarding files per month.

Business units must confirm readiness to the MLRO by 10 October 2026 and report any implementation gaps with a dated remediation plan.`;

const RAW_SEED: Analysis[] = [
  {
    id: "cf-1042",
    title: "VAMP threshold reduction to 0.30% and enhanced evidence retention",
    issuer: "Visa",
    sourceType: "card_scheme_bulletin",
    jurisdiction: "Global",
    receivedAt: "2026-09-04T09:12:00.000Z",
    createdAt: "2026-09-04T09:20:00.000Z",
    rawText: VISA_TEXT,
    summary:
      "Visa is tightening its acquirer monitoring program. From 1 January 2027 the combined fraud and dispute ratio that puts an acquirer into 'Excessive' status drops from 0.50% to 0.30%. Acquirers must file merchant remediation plans faster, keep dispute evidence for two years, report sponsored-merchant ratios monthly, and attest to card-testing controls by 31 March 2027. Fines start at USD 10 per excess dispute and escalate.",
    keyPoints: [
      "Excessive threshold drops 0.50% → 0.30% on 1 January 2027",
      "Remediation plans due within 30 calendar days of notification",
      "Dispute evidence retention extended to 24 months, produced in 10 business days",
      "Enumeration/card-testing control attestation due 31 March 2027",
      "Acknowledgement of receipt requested within 15 business days",
    ],
    effectiveDate: "2027-01-01",
    deadlines: [
      { id: "d1", label: "New VAMP ratio thresholds take effect", date: "2027-01-01", type: "effective" },
      { id: "d2", label: "Acknowledge receipt to Visa regional risk rep", date: "2026-09-25", type: "notification" },
      { id: "d3", label: "First sponsored-merchant monthly report (Feb cycle)", date: "2027-02-28", type: "submission" },
      { id: "d4", label: "Enumeration control deployment attestation", date: "2027-03-31", type: "remediation" },
    ],
    obligations: [
      {
        id: "o1",
        text: "Recalculate portfolio and merchant-level VAMP ratios against the new 0.30% excessive and 0.15% above-standard thresholds.",
        evidence:
          "the VAMP ratio threshold for \"Excessive\" acquirer status will be lowered from 0.50% to 0.30%",
        category: "Monitoring",
        suggestedOwner: "Payments Risk",
        dueDate: "2026-11-15",
      },
      {
        id: "o2",
        text: "Submit remediation plans via Visa Online within 30 calendar days for merchants above 0.15% for two consecutive months.",
        evidence:
          "Plans must be submitted through Visa Online within 30 calendar days of notification.",
        category: "Reporting",
        suggestedOwner: "Merchant Risk Operations",
        dueDate: "2026-12-15",
      },
      {
        id: "o3",
        text: "Extend dispute evidence retention to 24 months with a 10-business-day production SLA.",
        evidence:
          "retain supporting dispute evidence for a minimum of 24 months and produce it to Visa within 10 business days",
        category: "Records",
        suggestedOwner: "Disputes & Chargebacks",
        dueDate: "2026-12-01",
      },
      {
        id: "o4",
        text: "Deploy velocity controls for card-testing/enumeration patterns and prepare the attestation package.",
        evidence:
          "acquirers must deploy velocity controls on card-testing patterns and attest to deployment by 31 March 2027",
        category: "Controls",
        suggestedOwner: "Fraud Engineering",
        dueDate: "2027-03-15",
      },
    ],
    risk: {
      score: 86,
      level: "critical",
      rationale:
        "Financial penalties accrue per dispute and escalate monthly, the threshold change affects the entire acquiring portfolio, and two separate attestations carry hard external deadlines inside the next two quarters.",
      factors: [
        { label: "Financial exposure", weight: 30, note: "USD 10–50 per excess dispute, escalating monthly" },
        { label: "Scope", weight: 22, note: "Whole acquiring portfolio plus sponsored merchants" },
        { label: "Deadline pressure", weight: 20, note: "Effective in under 4 months" },
        { label: "Engineering dependency", weight: 14, note: "Velocity controls require release capacity" },
      ],
    },
    owners: [
      { team: "Payments Risk", reason: "Owns scheme ratio monitoring and thresholds", scope: "Ratio recalculation and portfolio impact model" },
      { team: "Fraud Engineering", reason: "Owns velocity and card-testing controls", scope: "Enumeration controls and attestation evidence" },
      { team: "Disputes & Chargebacks", reason: "Owns evidence lifecycle", scope: "24-month retention and production SLA" },
    ],
    plan: [
      { id: "p1", order: 1, title: "Model portfolio impact at 0.30%", detail: "Re-run the last 12 months of TC40/TC15 data against the new thresholds and list merchants that would flip to Above Standard or Excessive.", owner: "Payments Risk", effort: "M" },
      { id: "p2", order: 2, title: "Acknowledge the bulletin", detail: "Send formal acknowledgement to the Visa regional risk representative and log it in the compliance register.", owner: "Compliance Ops", effort: "S" },
      { id: "p3", order: 3, title: "Rebuild merchant alerting", detail: "Update monitoring thresholds and alerting so merchant risk sees two-consecutive-month breaches on day one of each cycle.", owner: "Payments Risk", effort: "M" },
      { id: "p4", order: 4, title: "Extend evidence retention", detail: "Change dispute evidence retention policy to 24 months, update storage lifecycle rules, and document the 10-business-day production runbook.", owner: "Disputes & Chargebacks", effort: "M" },
      { id: "p5", order: 5, title: "Ship enumeration velocity controls", detail: "Deploy card-testing velocity rules, run a validation window, and capture screenshots and rule configs for the March attestation.", owner: "Fraud Engineering", effort: "L" },
      { id: "p6", order: 6, title: "Stand up sponsored-merchant reporting", detail: "Build the monthly PayFac sponsored-merchant ratio extract ahead of the February 2027 cycle.", owner: "Data & Reporting", effort: "M" },
    ],
    checklist: [
      { id: "c1", title: "Run 12-month ratio backtest at 0.30%", owner: "Payments Risk", dueDate: "2026-09-30", status: "done", obligationId: "o1" },
      { id: "c2", title: "Send acknowledgement to Visa rep", owner: "Compliance Ops", dueDate: "2026-09-25", status: "in_progress" },
      { id: "c3", title: "Update merchant alerting thresholds", owner: "Payments Risk", dueDate: "2026-11-15", status: "in_progress", obligationId: "o1" },
      { id: "c4", title: "Approve 24-month evidence retention change", owner: "Disputes & Chargebacks", dueDate: "2026-12-01", status: "not_started", obligationId: "o3" },
      { id: "c5", title: "Deploy card-testing velocity rules", owner: "Fraud Engineering", dueDate: "2027-02-28", status: "blocked", obligationId: "o4" },
      { id: "c6", title: "Draft sponsored-merchant monthly extract", owner: "Data & Reporting", dueDate: "2027-01-20", status: "not_started" },
    ],
    draftResponse: `Dear Visa Regional Risk Team,

We acknowledge receipt of Visa Business News article AI11422 regarding changes to the Visa Acquirer Monitoring Program effective 1 January 2027.

We have initiated an internal impact assessment covering: (i) recalculation of portfolio and merchant-level ratios against the revised 0.30% Excessive and 0.15% Above Standard thresholds; (ii) extension of dispute evidence retention to 24 months with a 10-business-day production capability; (iii) deployment of enumeration/card-testing velocity controls ahead of the 31 March 2027 attestation; and (iv) establishment of monthly sponsored-merchant ratio reporting from the February 2027 cycle.

A named owner has been assigned to each workstream and progress is tracked in our compliance register. We will contact you should clarification on the reporting format for sponsored-merchant ratios be required.

Kind regards,
Compliance Operations`,
    confidence: {
      score: 0.93,
      rationale:
        "Dates, thresholds and penalty amounts are stated explicitly in the source text; each obligation maps to a verbatim quote. Lower certainty only on internal owner assignment, which is heuristic.",
      model: "seeded demo record",
    },
    timeline: [
      { id: "t1", at: "2026-09-04T09:12:00.000Z", actor: "Ingest", action: "Document received", detail: "Pasted from Visa Business News email" },
      { id: "t2", at: "2026-09-04T09:12:40.000Z", actor: "ComplyFlow AI", action: "Analysis completed", detail: "4 obligations, 4 deadlines, risk 86/100" },
      { id: "t3", at: "2026-09-04T11:02:00.000Z", actor: "A. Quni", action: "Owners confirmed", detail: "Payments Risk accepted as primary owner" },
      { id: "t4", at: "2026-09-08T15:41:00.000Z", actor: "Payments Risk", action: "Task completed", detail: "Run 12-month ratio backtest at 0.30%" },
      { id: "t5", at: "2026-09-11T08:15:00.000Z", actor: "Fraud Engineering", action: "Task blocked", detail: "Velocity rules waiting on Q4 release slot" },
    ],
    demo: true,
  },
  {
    id: "cf-1039",
    title: "DORA Register of Information — 2027 submission and data quality expectations",
    issuer: "European Supervisory Authorities",
    sourceType: "regulatory_notice",
    jurisdiction: "European Union",
    receivedAt: "2026-09-02T07:30:00.000Z",
    createdAt: "2026-09-02T07:44:00.000Z",
    rawText: DORA_TEXT,
    summary:
      "The ESAs confirm the annual DORA Register of Information is due to the competent authority by 31 March 2027, with data as at 31 December 2026. Every ICT provider needs a valid identifier, every arrangement needs a critical-or-important classification with documented rationale, intra-group arrangements are in scope, and authority-flagged data errors must be fixed within 20 working days. Updated validation rules land in November 2026.",
    keyPoints: [
      "Submission deadline 31 March 2027, reference date 31 December 2026",
      "Valid LEI required for every ICT third-party provider",
      "Critical/important classification rationale must be documented",
      "Intra-group arrangements reported on the same basis",
      "Data quality feedback remediated within 20 working days",
    ],
    effectiveDate: "2027-03-31",
    deadlines: [
      { id: "d1", label: "Data reference date for the register", date: "2026-12-31", type: "effective" },
      { id: "d2", label: "Register of Information submission", date: "2027-03-31", type: "submission" },
      { id: "d3", label: "ESA validation rules published — rerun extracts", date: "2026-11-30", type: "remediation" },
    ],
    obligations: [
      {
        id: "o1",
        text: "Ensure every ICT third-party provider record carries a valid LEI, or EUID/equivalent for non-EU providers.",
        evidence:
          "ensure every ICT third-party service provider is identified by a valid LEI, and where the provider is not an EU entity, an EUID or equivalent identifier is supplied",
        category: "Data quality",
        suggestedOwner: "Third-Party Risk Management",
        dueDate: "2026-12-15",
      },
      {
        id: "o2",
        text: "Classify each contractual arrangement as supporting a critical or important function and retain the documented rationale.",
        evidence:
          "classify each contractual arrangement as supporting a critical or important function, and maintain the documented rationale for that classification",
        category: "Classification",
        suggestedOwner: "Operational Resilience",
        dueDate: "2026-12-31",
      },
      {
        id: "o3",
        text: "Include intra-group ICT arrangements in the register on the same basis as external arrangements.",
        evidence: "report intra-group ICT arrangements on the same basis as third-party arrangements",
        category: "Scope",
        suggestedOwner: "Group Procurement",
        dueDate: "2027-01-31",
      },
      {
        id: "o4",
        text: "Document and test exit strategies annually for arrangements supporting critical or important functions.",
        evidence:
          "exit strategies for arrangements supporting critical or important functions must be documented and tested at least annually",
        category: "Resilience",
        suggestedOwner: "Operational Resilience",
        dueDate: "2027-02-28",
      },
    ],
    risk: {
      score: 71,
      level: "high",
      rationale:
        "A hard regulatory submission date with supervisory visibility and a known history of data-quality rejections. Impact is mostly remediation effort and supervisory attention rather than immediate financial penalty.",
      factors: [
        { label: "Regulatory visibility", weight: 26, note: "Direct submission to the competent authority" },
        { label: "Data dependency", weight: 20, note: "Register spans procurement, TPRM and legal systems" },
        { label: "Deadline pressure", weight: 15, note: "Reference date 31 Dec 2026, filing 31 Mar 2027" },
        { label: "Rework likelihood", weight: 10, note: "Validation rules change in November 2026" },
      ],
    },
    owners: [
      { team: "Third-Party Risk Management", reason: "Owns the vendor inventory and identifiers", scope: "LEI completeness and register extract" },
      { team: "Operational Resilience", reason: "Owns critical/important function mapping", scope: "Classification rationale and exit testing" },
      { team: "Legal", reason: "Owns contractual data points", scope: "Contract metadata and intra-group arrangements" },
    ],
    plan: [
      { id: "p1", order: 1, title: "Freeze the vendor inventory scope", detail: "Agree the population of ICT arrangements in scope at the 31 December 2026 reference date, including intra-group.", owner: "Third-Party Risk Management", effort: "M" },
      { id: "p2", order: 2, title: "LEI completeness sweep", detail: "Identify missing or invalid identifiers and chase providers; record EUID or equivalent for non-EU entities.", owner: "Third-Party Risk Management", effort: "M" },
      { id: "p3", order: 3, title: "Refresh critical/important classification", detail: "Re-approve classification for each arrangement and store the written rationale with the approver and date.", owner: "Operational Resilience", effort: "L" },
      { id: "p4", order: 4, title: "Dry-run the extract against new validation rules", detail: "Once the November 2026 rules are published, run the full extract and clear validation errors before year end.", owner: "Data & Reporting", effort: "M" },
      { id: "p5", order: 5, title: "Exit strategy testing", detail: "Complete annual exit testing for critical arrangements and file the evidence pack.", owner: "Operational Resilience", effort: "L" },
    ],
    checklist: [
      { id: "c1", title: "Confirm in-scope arrangement population", owner: "Third-Party Risk Management", dueDate: "2026-10-15", status: "in_progress", obligationId: "o3" },
      { id: "c2", title: "Resolve 37 missing LEIs", owner: "Third-Party Risk Management", dueDate: "2026-12-15", status: "in_progress", obligationId: "o1" },
      { id: "c3", title: "Re-approve critical/important classifications", owner: "Operational Resilience", dueDate: "2026-12-31", status: "not_started", obligationId: "o2" },
      { id: "c4", title: "Dry-run extract on Nov validation rules", owner: "Data & Reporting", dueDate: "2026-12-10", status: "not_started" },
      { id: "c5", title: "Complete exit testing for 9 critical vendors", owner: "Operational Resilience", dueDate: "2027-02-28", status: "not_started", obligationId: "o4" },
    ],
    draftResponse: `To: ICT Third-Party Risk Steering Committee
Subject: DORA Register of Information — 2027 cycle readiness

Following the ESAs' joint communication ESA-2026-JC-014, we have opened the 2027 Register of Information cycle with a data reference date of 31 December 2026 and a filing date of 31 March 2027.

Workstreams now underway: identifier completeness across the ICT provider inventory; re-approval of critical/important function classifications with documented rationale; inclusion of intra-group arrangements on the same basis as external arrangements; and an extract dry-run once the updated validation rules are published in November 2026.

We will report completeness metrics to this committee monthly and escalate any provider that cannot supply a valid identifier by 15 December 2026.

Operational Resilience & Third-Party Risk Management`,
    confidence: {
      score: 0.89,
      rationale:
        "Obligations and dates are quoted directly from the communication. The internal task breakdown is inferred from standard register-cycle practice and should be reviewed by the register owner.",
      model: "seeded demo record",
    },
    timeline: [
      { id: "t1", at: "2026-09-02T07:30:00.000Z", actor: "Ingest", action: "Document received", detail: "Uploaded PDF text" },
      { id: "t2", at: "2026-09-02T07:30:35.000Z", actor: "ComplyFlow AI", action: "Analysis completed", detail: "4 obligations, 3 deadlines, risk 71/100" },
      { id: "t3", at: "2026-09-03T13:20:00.000Z", actor: "Legal", action: "Comment added", detail: "Intra-group scope confirmed with group entities" },
      { id: "t4", at: "2026-09-09T10:05:00.000Z", actor: "TPRM", action: "Task progressed", detail: "Missing LEIs reduced from 52 to 37" },
    ],
    demo: true,
  },
  {
    id: "cf-1036",
    title: "NorthPeak Cloud DPA amendment — new sub-processor and 72-hour breach window",
    issuer: "NorthPeak Cloud Services Ltd.",
    sourceType: "contract_change",
    jurisdiction: "EU / UK",
    receivedAt: "2026-08-28T16:05:00.000Z",
    createdAt: "2026-08-28T16:11:00.000Z",
    rawText: VENDOR_TEXT,
    summary:
      "A Tier 2 cloud vendor is amending its DPA and SLA from 15 November 2026. A US sub-processor is added for telemetry, the breach notification window widens from 24 to 72 hours, Severity 1 service credits halve, and post-termination deletion moves to 45 days. Objection to the new sub-processor must be raised in writing within 30 days, so the decision point arrives well before the effective date.",
    keyPoints: [
      "New US sub-processor: Helix Analytics Inc. (telemetry)",
      "Objection window: 30 days from notice",
      "Breach notification degrades from 24h to 72h",
      "Severity 1 service credits cut from 10% to 5%",
      "Data deletion on termination extended to 45 days",
    ],
    effectiveDate: "2026-11-15",
    deadlines: [
      { id: "d1", label: "Deadline to object to new sub-processor", date: "2026-09-27", type: "notification" },
      { id: "d2", label: "Amendment takes effect (silence = acceptance)", date: "2026-11-15", type: "effective" },
    ],
    obligations: [
      {
        id: "o1",
        text: "Assess the new US sub-processor for transfer risk and decide whether to object in writing within 30 days.",
        evidence:
          "Customers may object in writing within 30 days of this notice.",
        category: "Vendor risk",
        suggestedOwner: "Privacy Office",
        dueDate: "2026-09-27",
      },
      {
        id: "o2",
        text: "Update the internal incident response plan for the degraded 72-hour vendor notification window against the 72-hour GDPR regulator clock.",
        evidence:
          "Breach notification window changed from 24 hours to 72 hours after NorthPeak becomes aware of a personal data breach.",
        category: "Incident response",
        suggestedOwner: "Security Incident Response",
        dueDate: "2026-11-01",
      },
      {
        id: "o3",
        text: "Reassess availability and credit assumptions in the service continuity model following the Severity 1 credit reduction.",
        evidence: "Service credits for Severity 1 incidents reduced from 10% to 5% of monthly fees.",
        category: "Commercial",
        suggestedOwner: "Vendor Management",
        dueDate: "2026-10-31",
      },
      {
        id: "o4",
        text: "Record the updated SCC module and 45-day deletion period in the RoPA and vendor register.",
        evidence: "Data deletion on termination extended from 30 days to 45 days.",
        category: "Records",
        suggestedOwner: "Privacy Office",
        dueDate: "2026-11-15",
      },
    ],
    risk: {
      score: 58,
      level: "medium",
      rationale:
        "The objection window is short and silence constitutes acceptance, but the underlying change is contained to one vendor. The breach-window change is the material item because it consumes the entire regulator notification budget.",
      factors: [
        { label: "Acceptance by silence", weight: 20, note: "Decision needed before 27 September 2026" },
        { label: "Regulatory interaction", weight: 18, note: "72h vendor window vs 72h GDPR clock" },
        { label: "Blast radius", weight: 12, note: "Single vendor, production telemetry" },
        { label: "Commercial impact", weight: 8, note: "Halved Severity 1 credits" },
      ],
    },
    owners: [
      { team: "Privacy Office", reason: "Owns sub-processor approval and transfer assessments", scope: "Objection decision and RoPA update" },
      { team: "Security Incident Response", reason: "Owns breach timelines", scope: "IR playbook change for vendor-sourced breaches" },
      { team: "Vendor Management", reason: "Owns the commercial relationship", scope: "Credits, SLA and negotiation" },
    ],
    plan: [
      { id: "p1", order: 1, title: "Transfer risk assessment for Helix Analytics", detail: "Check data categories in telemetry, run the transfer impact assessment and confirm SCC module 3 coverage.", owner: "Privacy Office", effort: "M" },
      { id: "p2", order: 2, title: "Objection go/no-go", detail: "Decide before 27 September whether to object; if not objecting, record the accepted-risk rationale with sign-off.", owner: "Privacy Office", effort: "S" },
      { id: "p3", order: 3, title: "Negotiate the breach window", detail: "Request a contractual carve-out keeping 24-hour notification for incidents affecting personal data.", owner: "Vendor Management", effort: "M" },
      { id: "p4", order: 4, title: "Update the IR playbook", detail: "Adjust internal detection and escalation timings to preserve the 72-hour regulator deadline.", owner: "Security Incident Response", effort: "M" },
      { id: "p5", order: 5, title: "Update registers", detail: "Reflect the sub-processor, SCC module and 45-day deletion period in the RoPA and vendor register.", owner: "Privacy Office", effort: "S" },
    ],
    checklist: [
      { id: "c1", title: "Complete transfer impact assessment", owner: "Privacy Office", dueDate: "2026-09-20", status: "done", obligationId: "o1" },
      { id: "c2", title: "Objection decision signed off", owner: "Privacy Office", dueDate: "2026-09-26", status: "in_progress", obligationId: "o1" },
      { id: "c3", title: "Send breach-window carve-out request", owner: "Vendor Management", dueDate: "2026-10-10", status: "not_started", obligationId: "o2" },
      { id: "c4", title: "Update IR playbook timings", owner: "Security Incident Response", dueDate: "2026-11-01", status: "not_started", obligationId: "o2" },
      { id: "c5", title: "Update RoPA and vendor register", owner: "Privacy Office", dueDate: "2026-11-15", status: "not_started", obligationId: "o4" },
    ],
    draftResponse: `To: legal@northpeak.example
Subject: Tier 2 amendment notice dated 15 September 2026 — response

Thank you for the amendment notice to our Data Processing Addendum and Service Level Agreement.

We do not object to the addition of Helix Analytics Inc. as a sub-processor, subject to written confirmation that (i) telemetry transferred to Helix excludes end-customer personal data beyond pseudonymised identifiers, and (ii) SCC module 3 is executed with Helix prior to 15 November 2026.

We do, however, request a carve-out to the revised notification clause: for incidents involving personal data we require notification without undue delay and in any event within 24 hours of your awareness, as the 72-hour window consumes our entire statutory reporting period under Article 33 GDPR.

Please confirm both points in writing before the effective date.

Vendor Management & Privacy Office`,
    confidence: {
      score: 0.85,
      rationale:
        "Contract terms and dates are explicit. The objection deadline is calculated from the notice date, which should be confirmed against the received email header.",
      model: "seeded demo record",
    },
    timeline: [
      { id: "t1", at: "2026-08-28T16:05:00.000Z", actor: "Ingest", action: "Document received", detail: "Forwarded from vendor management inbox" },
      { id: "t2", at: "2026-08-28T16:05:30.000Z", actor: "ComplyFlow AI", action: "Analysis completed", detail: "4 obligations, 2 deadlines, risk 58/100" },
      { id: "t3", at: "2026-09-01T09:30:00.000Z", actor: "Privacy Office", action: "Task completed", detail: "Transfer impact assessment completed" },
      { id: "t4", at: "2026-09-10T14:12:00.000Z", actor: "A. Quni", action: "Draft response edited", detail: "Added 24-hour carve-out request" },
    ],
    demo: true,
  },
  {
    id: "cf-1031",
    title: "CDD Standard v6.0 — mandatory EDD expansion and shorter review cycles",
    issuer: "Financial Crime Compliance (internal)",
    sourceType: "policy_update",
    jurisdiction: "Group-wide",
    receivedAt: "2026-08-21T08:00:00.000Z",
    createdAt: "2026-08-21T08:09:00.000Z",
    rawText: AML_TEXT,
    summary:
      "Version 6.0 of the customer due diligence standard must be implemented by 31 October 2026. Enhanced due diligence becomes mandatory wherever beneficial ownership touches a high-risk jurisdiction, source of wealth must be independently corroborated above EUR 1m expected turnover, high-risk review cycles halve to six months, refreshed training is mandatory, and QA sampling doubles to 10%.",
    keyPoints: [
      "Implementation deadline 31 October 2026",
      "EDD mandatory for high-risk-jurisdiction beneficial ownership",
      "Source of wealth corroboration above EUR 1m turnover",
      "High-risk review cycle 12 → 6 months",
      "Readiness confirmation to the MLRO by 10 October 2026",
    ],
    effectiveDate: "2026-10-31",
    deadlines: [
      { id: "d1", label: "Readiness confirmation to MLRO", date: "2026-10-10", type: "notification" },
      { id: "d2", label: "Training completion for first-line staff", date: "2026-10-31", type: "remediation" },
      { id: "d3", label: "Standard v6.0 in force", date: "2026-10-31", type: "effective" },
    ],
    obligations: [
      {
        id: "o1",
        text: "Apply enhanced due diligence to every customer with beneficial ownership in a high-risk jurisdiction, irrespective of expected volume.",
        evidence:
          "Enhanced due diligence is now mandatory for all customers with beneficial ownership in a jurisdiction on the internal High Risk Jurisdiction List, regardless of expected transaction volume.",
        category: "Onboarding",
        suggestedOwner: "KYC Operations",
        dueDate: "2026-10-31",
      },
      {
        id: "o2",
        text: "Collect and independently corroborate source of wealth above EUR 1,000,000 expected annual turnover.",
        evidence:
          "Source of wealth evidence must be collected and independently corroborated for all customers with an aggregate expected annual turnover above EUR 1,000,000.",
        category: "Onboarding",
        suggestedOwner: "KYC Operations",
        dueDate: "2026-10-31",
      },
      {
        id: "o3",
        text: "Reconfigure periodic review scheduling to 6/18/36 months by risk rating.",
        evidence: "Periodic review cycles shortened: high risk 6 months (previously 12), medium risk 18 months, low risk 36 months.",
        category: "Systems",
        suggestedOwner: "Financial Crime Technology",
        dueDate: "2026-10-24",
      },
      {
        id: "o4",
        text: "Increase onboarding QA sampling from 5% to 10% of files per month.",
        evidence: "Quality assurance sampling increases from 5% to 10% of onboarding files per month.",
        category: "Assurance",
        suggestedOwner: "Financial Crime QA",
        dueDate: "2026-11-01",
      },
    ],
    risk: {
      score: 44,
      level: "medium",
      rationale:
        "Internal policy with a firm near-term implementation date. Main exposure is capacity: shorter review cycles and doubled QA sampling increase steady-state workload rather than creating immediate external penalty.",
      factors: [
        { label: "Operational capacity", weight: 18, note: "Review population roughly doubles for high risk" },
        { label: "Deadline pressure", weight: 14, note: "Implementation by 31 October 2026" },
        { label: "System change", weight: 8, note: "Review scheduler reconfiguration" },
        { label: "External exposure", weight: 4, note: "Internal standard, no direct regulator filing" },
      ],
    },
    owners: [
      { team: "KYC Operations", reason: "Executes CDD and EDD", scope: "Procedure updates and case handling" },
      { team: "Financial Crime Technology", reason: "Owns the review scheduler", scope: "Cycle reconfiguration and backfill plan" },
      { team: "Learning & Development", reason: "Owns training delivery", scope: "Refreshed module completion tracking" },
    ],
    plan: [
      { id: "p1", order: 1, title: "Size the impacted population", detail: "Count customers that move into mandatory EDD and high-risk 6-month cycles, and model the resulting case volume.", owner: "Financial Crime MI", effort: "M" },
      { id: "p2", order: 2, title: "Update procedures and checklists", detail: "Rewrite CDD/EDD procedures, screening checklists and source-of-wealth evidence standards for v6.0.", owner: "KYC Operations", effort: "M" },
      { id: "p3", order: 3, title: "Reconfigure the review scheduler", detail: "Set 6/18/36-month cycles, agree the backfill approach for customers already overdue under the new cycle.", owner: "Financial Crime Technology", effort: "M" },
      { id: "p4", order: 4, title: "Deliver refreshed training", detail: "Publish the module, track completion and escalate non-completers to line managers weekly.", owner: "Learning & Development", effort: "S" },
      { id: "p5", order: 5, title: "Confirm readiness to the MLRO", detail: "Submit the readiness statement with any gaps and a dated remediation plan by 10 October 2026.", owner: "Compliance Ops", effort: "S" },
    ],
    checklist: [
      { id: "c1", title: "Population impact model delivered", owner: "Financial Crime MI", dueDate: "2026-09-12", status: "done", obligationId: "o1" },
      { id: "c2", title: "Rewrite CDD/EDD procedures", owner: "KYC Operations", dueDate: "2026-10-05", status: "in_progress", obligationId: "o2" },
      { id: "c3", title: "Reconfigure review scheduler", owner: "Financial Crime Technology", dueDate: "2026-10-24", status: "in_progress", obligationId: "o3" },
      { id: "c4", title: "Training completion ≥ 95%", owner: "Learning & Development", dueDate: "2026-10-31", status: "not_started" },
      { id: "c5", title: "Submit MLRO readiness confirmation", owner: "Compliance Ops", dueDate: "2026-10-10", status: "not_started" },
      { id: "c6", title: "Move QA sampling to 10%", owner: "Financial Crime QA", dueDate: "2026-11-01", status: "not_started", obligationId: "o4" },
    ],
    draftResponse: `To: Money Laundering Reporting Officer
Subject: FCC-04 CDD Standard v6.0 — business unit readiness

We confirm that implementation of CDD Standard v6.0 is underway across onboarding and periodic review operations, with target completion by 31 October 2026.

Status: the impacted customer population has been sized; procedures and evidence standards are being rewritten; the review scheduler reconfiguration to 6/18/36-month cycles is in build; and the refreshed training module is scheduled for release with weekly completion tracking.

One gap is currently forecast: the backfill of customers who become immediately overdue under the shortened high-risk cycle. A dated remediation plan covering that population will accompany our formal readiness confirmation on 10 October 2026.

Financial Crime Compliance — Business Readiness`,
    confidence: {
      score: 0.91,
      rationale:
        "All obligations, thresholds and dates are explicit in the policy text. Owner mapping follows the standard internal RACI and should be confirmed by the policy owner.",
      model: "seeded demo record",
    },
    timeline: [
      { id: "t1", at: "2026-08-21T08:00:00.000Z", actor: "Ingest", action: "Document received", detail: "Policy circulated by FCC" },
      { id: "t2", at: "2026-08-21T08:00:22.000Z", actor: "ComplyFlow AI", action: "Analysis completed", detail: "4 obligations, 3 deadlines, risk 44/100" },
      { id: "t3", at: "2026-08-25T12:00:00.000Z", actor: "KYC Operations", action: "Owners confirmed", detail: "Procedure rewrite assigned" },
      { id: "t4", at: "2026-09-12T16:45:00.000Z", actor: "Financial Crime MI", action: "Task completed", detail: "Population impact model delivered" },
    ],
    demo: true,
  },
];

/**
 * Seed records use short local ids (o1, c2, …) for readability. Namespacing them
 * per analysis keeps ids unique once several analyses render in one list.
 */
export const SEED_ANALYSES: Analysis[] = RAW_SEED.map((a) => {
  const ns = (id: string) => `${a.id}-${id}`;
  return {
    ...a,
    deadlines: a.deadlines.map((d) => ({ ...d, id: ns(d.id) })),
    obligations: a.obligations.map((o) => ({ ...o, id: ns(o.id) })),
    plan: a.plan.map((p) => ({ ...p, id: ns(p.id) })),
    checklist: a.checklist.map((c) => ({
      ...c,
      id: ns(c.id),
      obligationId: c.obligationId ? ns(c.obligationId) : undefined,
    })),
    timeline: a.timeline.map((t) => ({ ...t, id: ns(t.id) })),
  };
});

export const SAMPLE_DOCUMENTS = [
  {
    id: "sample-fca",
    label: "FCA consultation — operational incident reporting",
    description: "UK regulatory notice with a consultation close date and reporting thresholds.",
    text: `FINANCIAL CONDUCT AUTHORITY — POLICY STATEMENT PS26/9
Subject: Operational incident and third-party reporting requirements
Publication date: 8 September 2026
Implementation date: 1 July 2027

The FCA is introducing a standardised operational incident reporting regime for all regulated firms.

Firms must:
1. Submit an initial incident report to the FCA as soon as practicable and no later than 24 hours after determining that an operational incident meets the reporting threshold.
2. Submit an intermediate report when the incident is contained and a final report within 30 business days of the incident being closed.
3. Maintain and keep current a register of critical third-party arrangements, including material subcontractors, and notify the FCA of any new arrangement supporting a critical business service within 10 business days of execution.
4. Ensure that the governing body approves the firm's incident reporting policy annually and records that approval.

A reporting threshold is met where the incident causes, or is likely to cause, intolerable harm to consumers, risk to market integrity, or a disruption exceeding the firm's stated impact tolerance for an important business service.

Firms should complete a readiness self-assessment before 31 March 2027. The FCA expects firms to test the reporting pathway at least once before the implementation date.`,
  },
  {
    id: "sample-mastercard",
    label: "Mastercard bulletin — dispute evidence standards",
    description: "Card scheme bulletin with fee changes and a phased rollout.",
    text: `MASTERCARD ANNOUNCEMENT — AN 8842
Subject: Dispute Resolution Initiative — evidence standards and fee changes
Effective: 17 April 2027 (Phase 1), 16 October 2027 (Phase 2)

Phase 1 (17 April 2027):
- Issuers must supply cardholder-provided evidence in a structured format for reason codes 4853 and 4837. Free-text-only submissions will be rejected.
- Acquirers must respond to a second presentment request within 30 calendar days; the current 45-day window is withdrawn.
- A new Dispute Administration Fee of USD 0.50 per dispute applies to the issuer.

Phase 2 (16 October 2027):
- Pre-arbitration submissions must include the collaboration case identifier. Submissions without it will be closed without adjudication.
- Acquirers must provide compelling evidence 3.0 data elements for all merchant categories, extending the current pilot scope.

Customers must confirm implementation readiness through the Mastercard Connect readiness questionnaire by 28 February 2027. Failure to meet Phase 1 requirements may result in non-compliance assessments of USD 2,500 per month.`,
  },
  {
    id: "sample-dpa",
    label: "SaaS vendor DPA change — data residency",
    description: "Contract change with a short objection window.",
    text: `AMENDMENT NOTICE — Lumen Data Platform
Effective: 1 December 2026
Notice date: 10 September 2026

We are updating the Data Processing Addendum for all Business and Enterprise plans.

1. Primary data residency for EU customers moves from Frankfurt (eu-central-1) to a multi-region configuration spanning Frankfurt and Dublin. Customers requiring single-region residency must opt in to the Residency Lock add-on before 1 December 2026.
2. Support access model changes to follow-the-sun, meaning support personnel located in India and Brazil may access customer content under the updated Standard Contractual Clauses.
3. Audit rights are amended: on-site audits are replaced with an annual SOC 2 Type II report and a customer questionnaire, save where a supervisory authority requires otherwise.
4. Retention of platform audit logs is extended from 90 days to 400 days at no additional charge.

Objections to the changes in sections 1 and 2 must be submitted in writing within 30 days of the notice date. Absent objection, the amended DPA applies from the effective date.`,
  },
];
