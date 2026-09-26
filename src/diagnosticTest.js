import { buildDiagnostic } from "./diagnosticEngine";

const testAnswers = {
  assessment_scope: "Our overall sales operation",
  buyer_type: "Businesses or organizations",

  sales_sources: [
    "Referrals",
    "Outbound email",
    "Website / search",
    "Partners / distributors"
  ],

  top_sources: [
    "Referrals",
    "Partners / distributors",
    "Outbound email"
  ],

  source_objectives:
    "We have a specific intended result for each important activity",

  source_objective_verification: [
    "Qualified lead",
    "Scheduled conversation",
    "Request for estimate or quote"
  ],

  source_evidence:
    "We track the results of each important source",

  source_evidence_verification: [
    "Recorded inquiries",
    "Qualified leads",
    "Meetings or appointments",
    "Source-to-sale conversion",
    "CRM records",
    "Orders or revenue",
    "Customer-source tracking"
  ],

  process_clarity:
    "We have a clear, deliberate process",

  process_steps: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Learning about needs or requirements",
    "Consultation or meeting",
    "Demo or presentation",
    "Proposal",
    "Customer internal review or approval",
    "Negotiation",
    "Contract or agreement"
  ],

  process_order: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Learning about needs or requirements",
    "Consultation or meeting",
    "Demo or presentation",
    "Proposal",
    "Customer internal review or approval",
    "Negotiation",
    "Contract or agreement"
  ],

  different_path: "No",

  step_objectives:
    "Yes, for essentially every important step",

  step_objective_verification: [
    "Understand the buyer's situation",
    "Determine fit",
    "Establish interest",
    "Identify decision participants",
    "Agree on the next step",
    "Establish scope and price",
    "Obtain approval"
  ],

  step_evidence:
    "We use defined evidence or measures",

  buyer_understanding:
    "We have deliberately worked out what buyers need to understand",

  buyer_preference:
    "We have recognizable evidence of buyer preference",

  preference_evidence: [
    "The buyer explicitly expresses preference",
    "The buyer advances us to a shortlist or next stage",
    "The buyer agrees to a meaningful next step",
    "The buyer asks serious evaluation questions"
  ],

  buyer_value:
    "We deliberately establish and verify perceived value",

  value_evidence: [
    "The buyer confirms the value",
    "The buyer's actions indicate sufficient value",
    "The buyer accepts the business case",
    "The buyer advances despite alternatives"
  ],

  buyer_benefit:
    "We deliberately identify and establish why the buyer wants to proceed",

  resolution:
    "We deliberately identify and resolve remaining issues",

  resolution_details: [
    "Price",
    "Scope or specifications",
    "Timing",
    "Implementation",
    "Risk",
    "Contract terms",
    "Procurement requirements",
    "Internal approval"
  ],

  readiness_evidence:
    "The buyer explicitly says they want to proceed",

  stall_point:
    "No consistent pattern",

  weak_result_response:
    "We investigate causes before deciding what to change",

  testing:
    "We compare deliberate changes against meaningful evidence",

  testing_verification: [
    "What result is occurring before the change",
    "What specifically is being changed",
    "What improvement is expected",
    "What evidence will indicate whether it worked",
    "A comparison afterward"
  ],

  execution:
    "We verify execution and address deviations"
};

const result = buildDiagnostic(testAnswers);

console.log("SAGE STRONG-COMPANY TEST");

console.log(
  "STRENGTHS:",
  result.strengths.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title
  }))
);

console.log(
  "ALL ATTENTION FINDINGS:",
  result.attentionFindings.map((item) => ({
    id: item.id,
    type: item.type,
    priority: item.priority,
    corroboration: item.corroboration,
    effectivePriority: item.effectivePriority,
    title: item.title
  }))
);

console.log(
  "PRIORITY FINDINGS:",
  result.priorityFindings.map((item) => ({
    id: item.id,
    type: item.type,
    effectivePriority: item.effectivePriority,
    title: item.title,
    support: item.support,
    direction: item.direction
  }))
);

console.log("BUILD PATH:", result.buildPath);

export default result;
