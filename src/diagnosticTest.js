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

  source_objectives:
    "We generally know what we want, but it isn't specifically defined",

  source_evidence:
    "We rely mostly on experience or judgment",

  process_clarity:
    "We have a clear, deliberate process",

  process_steps: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Consultation or meeting",
    "Proposal",
    "Negotiation",
    "Contract or agreement"
  ],

  process_order: [
    "Initial response or contact",
    "Qualification / determining fit",
    "Consultation or meeting",
    "Proposal",
    "Negotiation",
    "Contract or agreement"
  ],

  different_path: "No",

  step_objectives:
    "The results are generally understood but not specifically defined",

  step_evidence:
    "We rely primarily on salesperson judgment",

  buyer_understanding:
    "We understand much of it, but it isn't fully developed",

  buyer_preference:
    "We mostly infer it from the conversation",

  buyer_value:
    "We mainly explain our value and assume the buyer understands",

  buyer_benefit:
    "We focus primarily on the rational business case",

  resolution:
    "We usually address them, but the approach varies",

  resolution_details: [
    "Price",
    "Internal approval",
    "Questions or concerns"
  ],

  readiness_evidence:
    "The salesperson judges that they are ready",

  stall_point: "Proposal",

  stall_reason: [
    "Price becomes a problem",
    "Customer stops responding"
  ],

  stall_confidence:
    "It is mainly salesperson judgment",

  weak_result_response:
    "We usually act on the most likely explanation",

  testing:
    "We judge primarily from experience and overall results",

  execution:
    "Execution is generally consistent, with some variation"
};

const result = buildDiagnostic(testAnswers);

console.log("SAGE DIAGNOSTIC TEST");
console.log(JSON.stringify(result, null, 2));

export default result;
