import { buildDiagnostic } from "./diagnosticEngine";

const testAnswers = {
  assessment_scope: "Our overall sales operation",
  buyer_type: "Businesses or organizations",

  sales_sources: [
    "Referrals",
    "Outbound email",
    "Website / search"
  ],

  top_sources: [
    "Referrals",
    "Outbound email"
  ],

  // Claims strong source discipline...
  source_objectives:
    "We have a specific intended result for each important activity",

  source_objective_verification: [
    "Qualified lead",
    "Scheduled conversation"
  ],

  // ...but later reveals weak verification.
  source_evidence:
    "We rely mostly on experience or judgment",

  process_clarity:
    "We have a clear, deliberate process",

  process_steps: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Consultation or meeting",
    "Demo or presentation",
    "Proposal",
    "Negotiation",
    "Contract or agreement"
  ],

  process_order: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Consultation or meeting",
    "Demo or presentation",
    "Proposal",
    "Negotiation",
    "Contract or agreement"
  ],

  different_path: "No",

  // Claims defined advancement...
  step_objectives:
    "Yes, for essentially every important step",

  step_objective_verification: [
    "Understand the buyer's situation",
    "Determine fit",
    "Establish interest",
    "Agree on the next step"
  ],

  // ...but actual advancement is judged subjectively.
  step_evidence:
    "We rely primarily on salesperson judgment",

  buyer_understanding:
    "We have deliberately worked out what buyers need to understand",

  // Claims buyer preference is recognized...
  buyer_preference:
    "We have recognizable evidence of buyer preference",

  preference_evidence: [
    "The buyer agrees to a meaningful next step"
  ],

  // ...but value is still assumed rather than verified.
  buyer_value:
    "We mainly explain our value and assume the buyer understands",

  buyer_benefit:
    "We deliberately identify and establish why the buyer wants to proceed",

  resolution:
    "We deliberately identify and resolve remaining issues",

  resolution_details: [
    "Price",
    "Scope or specifications",
    "Internal approval",
    "Contract terms"
  ],

  // Contradicts the claimed deliberate resolution discipline.
  readiness_evidence:
    "The salesperson judges that they are ready",

  stall_point: "Proposal",

  stall_reason: [
    "Price becomes a problem",
    "Customer stops responding"
  ],

  // Company believes it knows the problem, but evidence is weak.
  stall_confidence:
    "It is mainly salesperson judgment",

  // Claims disciplined diagnosis...
  weak_result_response:
    "We investigate causes before deciding what to change",

  // ...and claims disciplined testing...
  testing:
    "We compare deliberate changes against meaningful evidence",

  // ...but the claimed testing process is incomplete.
  testing_verification: [
    "What specifically is being changed",
    "What improvement is expected"
  ],

  execution:
    "We verify execution and address deviations"
};

const result = buildDiagnostic(testAnswers);

console.log("SAGE CONTRADICTION TEST");

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
