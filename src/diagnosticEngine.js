import {
  evaluateDirectFindings,
  evaluateCrossAnswerFindings,
  findingTypes
} from "./diagnosticRules";

// --------------------------------------------------
// BASIC HELPERS
// --------------------------------------------------

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function hasAnswer(value) {
  if (Array.isArray(value)) return value.length > 0;

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

// --------------------------------------------------
// SUPPORTED STRENGTHS
// --------------------------------------------------

function evaluateAdditionalStrengths(answers) {
  const strengths = [];

  if (
    answers.process_clarity === "We have a clear, deliberate process" &&
    answers.step_objectives ===
      "Yes, for essentially every important step" &&
    answers.step_evidence === "We use defined evidence or measures"
  ) {
    strengths.push({
      id: "operational_process_strength",
      type: findingTypes.SOLID,
      title:
        "The major sales process appears deliberately structured and measurable.",
      support:
        "You described a clear process, defined results for essentially every important step, and defined evidence or measures for determining whether those results occur.",
      why:
        "This gives the business a stronger basis for managing opportunity progression rather than merely completing sales activities.",
      guideTopic: "Define the Objective of Each Step",
      priority: 0
    });
  }

  if (
    answers.buyer_preference ===
      "We have recognizable evidence of buyer preference" &&
    hasAnswer(answers.preference_evidence)
  ) {
    strengths.push({
      id: "preference_strength",
      type: findingTypes.SOLID,
      title:
        "Buyer preference is deliberately distinguished from simple interest.",
      support:
        "You identified recognizable evidence used to determine when buyers begin favoring your company or offer.",
      why:
        "This gives the business a more meaningful indication of buyer progression than positive conversation alone.",
      guideTopic: "Cross-Through Points",
      priority: 0
    });
  }

  if (
    answers.buyer_value ===
      "We deliberately establish and verify perceived value" &&
    hasAnswer(answers.value_evidence)
  ) {
    strengths.push({
      id: "value_strength",
      type: findingTypes.SOLID,
      title:
        "The business deliberately verifies buyer-perceived value.",
      support:
        "You indicated that perceived value is deliberately established and identified observable evidence used to verify it.",
      why:
        "This distinguishes communicating value from determining whether the buyer actually sees enough value to choose the offer.",
      guideTopic: "Cross-Through Points",
      priority: 0
    });
  }

  if (
    answers.resolution ===
      "We deliberately identify and resolve remaining issues" &&
    ![
      "The salesperson judges that they are ready",
      "We have no consistent indicator"
    ].includes(answers.readiness_evidence)
  ) {
    strengths.push({
      id: "resolution_strength",
      type: findingTypes.SOLID,
      title:
        "Remaining buying issues appear to be addressed deliberately.",
      support:
        "You indicated that remaining issues are deliberately identified and resolved and identified an observable indication of buyer willingness to proceed.",
      why:
        "This reduces the likelihood that unresolved requirements or concerns remain hidden until the final stages of the sale.",
      guideTopic: "Confirmation",
      priority: 0
    });
  }

  const testingVerification = answers.testing_verification || [];

  const testingVerified =
    testingVerification.includes("We do all of these") ||
    [
      "What result is occurring before the change",
      "What specifically is being changed",
      "What improvement is expected",
      "What evidence will indicate whether it worked",
      "A comparison afterward"
    ].every((item) => testingVerification.includes(item));

  if (
    answers.testing ===
      "We compare deliberate changes against meaningful evidence" &&
    testingVerified
  ) {
    strengths.push({
      id: "testing_strength",
      type: findingTypes.SOLID,
      title:
        "Important sales changes are evaluated through a deliberate test discipline.",
      support:
        "Your answers establish the prior condition, deliberate change, expected result, evidence, and comparison afterward.",
      why:
        "This gives the business a stronger basis for learning whether a change actually improved performance.",
      guideTopic: "Discovery and Testing",
      priority: 0
    });
  }

  if (
    answers.execution ===
    "We verify execution and address deviations"
  ) {
    strengths.push({
      id: "execution_strength",
      type: findingTypes.SOLID,
      title:
        "The business actively verifies whether the sales approach is executed as intended.",
      support:
        "You indicated that execution is verified and deviations are addressed.",
      why:
        "Execution visibility helps distinguish problems in the design of the sales system from problems in how the system is being worked.",
      guideTopic: "System vs. Execution",
      priority: 0
    });
  }

  return strengths;
}

// --------------------------------------------------
// FINDING RELATIONSHIPS / DEDUPLICATION
// --------------------------------------------------

const supersedes = {
  clear_process_contradiction: [
    "partial_step_objectives",
    "informal_step_objectives",
    "subjective_step_evidence",
    "continuation_assumption",
    "no_step_evidence"
  ],

  defined_but_unverified_sources: [
    "source_assumption",
    "unknown_source_effectiveness"
  ],

  value_communication_verification_gap: [
    "value_assumed",
    "value_undefined",
    "value_unknown"
  ],

  system_execution_gap: [
    "execution_variation"
  ],

  undefined_system_execution: [
    "execution_variation"
  ],

  testing_claim_contradiction: [
    "testing_incomplete"
  ]
};

function removeSupersededFindings(findings) {
  const activeIds = new Set(findings.map((item) => item.id));
  const removedIds = new Set();

  findings.forEach((item) => {
    const replacements = supersedes[item.id] || [];

    replacements.forEach((id) => {
      if (activeIds.has(id)) {
        removedIds.add(id);
      }
    });
  });

  return findings.filter((item) => !removedIds.has(item.id));
}

// --------------------------------------------------
// RELATED-FINDING CONSOLIDATION
// --------------------------------------------------

function consolidateRelatedFindings(findings) {
  let result = [...findings];

  const hasFinding = (id) =>
    result.some((item) => item.id === id);

  const getFinding = (id) =>
    result.find((item) => item.id === id);

  if (
    hasFinding("stall_cause_unverified") &&
    hasFinding("cause_assumption")
  ) {
    const primary = getFinding("stall_cause_unverified");
    const supporting = getFinding("cause_assumption");

    result = result.map((item) => {
      if (item.id !== "stall_cause_unverified") {
        return item;
      }

      return {
        ...primary,
        title:
          "Suspected causes of sales breakdowns are being treated as more established than the evidence supports.",
        support:
          `${primary.support} You also indicated that when results are weak, the business usually acts on the most likely explanation before the cause has been fully established.`,
        why:
          "The business may correctly recognize where an opportunity is breaking down while still misidentifying why. Acting on a plausible explanation before verifying the cause can lead to changes that do not address the actual barrier.",
        direction:
          "Treat suspected causes as hypotheses. Investigate and establish evidence before deciding what should change.",
        improvementEvidence:
          "Important explanations for sales breakdowns are supported by buyer feedback, records, testing, or another reliable pattern before corrective action is selected.",
        priority:
          Math.max(
            primary.priority || 0,
            supporting.priority || 0
          ) + 1
      };
    });

    result = result.filter(
      (item) => item.id !== "cause_assumption"
    );
  }

  return result;
}

// --------------------------------------------------
// CORROBORATION
// --------------------------------------------------

const corroborationGroups = [
  {
    ids: [
      "unmapped_process",
      "unknown_process",
      "variable_process",
      "no_step_objectives",
      "informal_step_objectives",
      "partial_step_objectives",
      "subjective_step_evidence",
      "continuation_assumption",
      "no_step_evidence",
      "clear_process_contradiction"
    ]
  },

  {
    ids: [
      "partial_source_objectives",
      "undefined_source_objectives",
      "partial_source_evidence",
      "source_assumption",
      "unknown_source_effectiveness",
      "defined_but_unverified_sources"
    ]
  },

  {
    ids: [
      "buyer_requirements_undefined",
      "buyer_progression_individual",
      "preference_undefined",
      "preference_unverified",
      "preference_unknown",
      "value_assumed",
      "value_undefined",
      "value_unknown",
      "value_communication_verification_gap",
      "benefit_incomplete",
      "resolution_incomplete",
      "resolution_unknown",
      "readiness_unverified"
    ]
  },

  {
    ids: [
      "stall_unknown",
      "stall_cause_unverified",
      "stall_cause_unknown",
      "cause_assumption",
      "activity_response",
      "testing_incomplete",
      "testing_unknown",
      "testing_claim_contradiction"
    ]
  },

  {
    ids: [
      "execution_variation",
      "execution_unknown",
      "system_execution_gap",
      "undefined_system_execution"
    ]
  }
];

function applyCorroboration(findings) {
  return findings.map((item) => {
    let corroboration = 0;

    corroborationGroups.forEach((group) => {
      if (!group.ids.includes(item.id)) return;

      const relatedCount = findings.filter(
        (candidate) =>
          candidate.id !== item.id &&
          group.ids.includes(candidate.id)
      ).length;

      corroboration += Math.min(relatedCount, 2);
    });

    return {
      ...item,
      corroboration,
      effectivePriority:
        (item.priority || 0) + corroboration
    };
  });
}

// --------------------------------------------------
// PRIORITY SELECTION
// --------------------------------------------------

const findingDomains = {
  unknown_source_contribution: "sources",
  partial_source_objectives: "sources",
  undefined_source_objectives: "sources",
  partial_source_evidence: "sources",
  source_assumption: "sources",
  unknown_source_effectiveness: "sources",
  defined_but_unverified_sources: "sources",

  unmapped_process: "process",
  unknown_process: "process",
  variable_process: "process",
  no_step_objectives: "process",
  informal_step_objectives: "process",
  partial_step_objectives: "process",
  subjective_step_evidence: "process",
  continuation_assumption: "process",
  no_step_evidence: "process",
  clear_process_contradiction: "process",

  buyer_requirements_undefined: "buyer",
  buyer_progression_individual: "buyer",
  preference_undefined: "buyer",
  preference_unverified: "buyer",
  preference_unknown: "buyer",
  value_assumed: "buyer",
  value_undefined: "buyer",
  value_unknown: "buyer",
  value_communication_verification_gap: "buyer",
  benefit_incomplete: "buyer",
  resolution_incomplete: "buyer",
  resolution_unknown: "buyer",
  readiness_unverified: "buyer",

  stall_unknown: "performance",
  stall_cause_unverified: "performance",
  stall_cause_unknown: "performance",

  cause_assumption: "improvement",
  activity_response: "improvement",
  testing_incomplete: "improvement",
  testing_unknown: "improvement",
  testing_claim_contradiction: "improvement",

  execution_variation: "execution",
  execution_unknown: "execution",
  system_execution_gap: "execution",

  undefined_system_execution: "process"
};

const structuralPriority = {
  process: 4,
  sources: 3,
  buyer: 2,
  performance: 1,
  improvement: 1,
  execution: 1
};

function selectPriorityFindings(findings) {
  const actionable = findings
    .filter((item) => item.type !== findingTypes.SOLID)
    .map((item) => {
      const domain =
        findingDomains[item.id] || "other";

      return {
        ...item,
        domain,
        selectionPriority:
          (item.effectivePriority ||
            item.priority ||
            0) +
          (structuralPriority[domain] || 0)
      };
    });

  const sorted = [...actionable].sort((a, b) => {
    if (
      b.selectionPriority !==
      a.selectionPriority
    ) {
      return (
        b.selectionPriority -
        a.selectionPriority
      );
    }

    return (
      (b.effectivePriority || 0) -
      (a.effectivePriority || 0)
    );
  });

  if (sorted.length <= 3) {
    return sorted;
  }

  const selected = [];
  const domainCounts = {};

  // First pass:
  // Represent materially different diagnostic domains.
  for (const item of sorted) {
    const count =
      domainCounts[item.domain] || 0;

    if (count === 0) {
      selected.push(item);
      domainCounts[item.domain] = 1;
    }

    if (selected.length === 5) break;
  }

  // Second pass:
  // Fill remaining positions with the strongest
  // remaining findings, allowing at most two
  // findings from the same diagnostic domain.
  if (selected.length < 5) {
    for (const item of sorted) {
      if (
        selected.some(
          (chosen) => chosen.id === item.id
        )
      ) {
        continue;
      }

      const count =
        domainCounts[item.domain] || 0;

      if (count < 2) {
        selected.push(item);
        domainCounts[item.domain] =
          count + 1;
      }

      if (selected.length === 5) break;
    }
  }

  return selected;
}

// --------------------------------------------------
// CURRENT SALES SYSTEM RECONSTRUCTION
// --------------------------------------------------

function buildCurrentSystem(answers) {
  const scope =
    answers.assessment_scope_detail ||
    answers.assessment_scope ||
    "the sales operation";

  const sources =
    Array.isArray(answers.sales_sources)
      ? answers.sales_sources.filter(
          (source) => source !== "Not sure"
        )
      : [];

  const importantSources =
    Array.isArray(answers.top_sources)
      ? answers.top_sources.filter(
          (source) =>
            source !==
            "We don't know which contribute most"
        )
      : [];

  const processSteps =
    Array.isArray(answers.process_steps)
      ? answers.process_steps
      : [];

  const orderedSteps =
    Array.isArray(answers.process_order)
      ? answers.process_order
      : processSteps;

  return {
    scope,
    buyerType: answers.buyer_type || null,
    sources,
    importantSources,
    processSteps: orderedSteps,
    processClarity:
      answers.process_clarity || null,
    differentPath:
      answers.different_path || null,
    stallPoint:
      answers.stall_point || null
  };
}

// --------------------------------------------------
// BUILD PATH
// --------------------------------------------------

const buildPathMap = {
  unknown_source_contribution: {
    id: "establish_source_visibility",
    title:
      "Establish which opportunity sources materially contribute",
    guideTopic:
      "Map How Your Business Sells / Sales Lines"
  },

  partial_source_objectives: {
    id: "define_source_results",
    title:
      "Define the intended results of important opportunity sources",
    guideTopic:
      "Define the Objective of Each Step"
  },

  undefined_source_objectives: {
    id: "define_source_results",
    title:
      "Define the intended results of important opportunity sources",
    guideTopic:
      "Define the Objective of Each Step"
  },

  partial_source_evidence: {
    id: "verify_sources",
    title:
      "Establish evidence for important opportunity sources",
    guideTopic:
      "Evidence and Verification"
  },

  source_assumption: {
    id: "verify_sources",
    title:
      "Replace assumptions about source effectiveness with evidence",
    guideTopic:
      "Evidence and Verification"
  },

  unknown_source_effectiveness: {
    id: "verify_sources",
    title:
      "Establish how source effectiveness will be determined",
    guideTopic:
      "Evidence and Verification"
  },

  defined_but_unverified_sources: {
    id: "connect_source_evidence",
    title:
      "Connect source objectives to evidence of their results",
    guideTopic:
      "Evidence and Verification"
  },

  unmapped_process: {
    id: "map_sales_path",
    title:
      "Map the major path opportunities follow through the sale",
    guideTopic:
      "Map How Your Business Sells / Sales Lines"
  },

  unknown_process: {
    id: "map_sales_path",
    title:
      "Reconstruct the actual sales path",
    guideTopic:
      "Map How Your Business Sells / Sales Lines"
  },

  variable_process: {
    id: "clarify_variation",
    title:
      "Distinguish deliberate process variation from individual habit",
    guideTopic:
      "Define the Objective of Each Step"
  },

  no_step_objectives: {
    id: "define_advancement",
    title:
      "Establish advancement objectives for important sales steps",
    guideTopic:
      "Define the Objective of Each Step"
  },

  informal_step_objectives: {
    id: "define_advancement",
    title:
      "Turn informal step expectations into explicit advancement objectives",
    guideTopic:
      "Define the Objective of Each Step"
  },

  partial_step_objectives: {
    id: "define_advancement",
    title:
      "Complete the advancement objectives across important sales steps",
    guideTopic:
      "Define the Objective of Each Step"
  },

  subjective_step_evidence: {
    id: "verify_advancement",
    title:
      "Establish observable evidence of sales-step advancement",
    guideTopic:
      "Evidence and Verification"
  },

  continuation_assumption: {
    id: "verify_advancement",
    title:
      "Distinguish successful advancement from simple opportunity continuation",
    guideTopic:
      "Evidence and Verification"
  },

  no_step_evidence: {
    id: "verify_advancement",
    title:
      "Establish evidence for important process-step outcomes",
    guideTopic:
      "Evidence and Verification"
  },

  clear_process_contradiction: {
    id: "operationalize_process",
    title:
      "Operationalize the existing process with defined outcomes and evidence",
    guideTopic:
      "Define the Objective of Each Step"
  },

  buyer_requirements_undefined: {
    id: "define_buyer_progression",
    title:
      "Define what buyers must understand and conclude",
    guideTopic: "Cross-Through Points"
  },

  buyer_progression_individual: {
    id: "define_buyer_progression",
    title:
      "Establish common buyer-progression outcomes",
    guideTopic: "Cross-Through Points"
  },

  preference_undefined: {
    id: "establish_preference",
    title:
      "Define how buyer preference will be established and recognized",
    guideTopic: "Cross-Through Points"
  },

  preference_unverified: {
    id: "establish_preference",
    title:
      "Replace inferred buyer preference with observable evidence",
    guideTopic: "Cross-Through Points"
  },

  preference_unknown: {
    id: "establish_preference",
    title:
      "Determine how buyer preference can be recognized",
    guideTopic: "Cross-Through Points"
  },

  value_assumed: {
    id: "verify_value",
    title:
      "Establish how buyer-perceived value will be verified",
    guideTopic: "Cross-Through Points"
  },

  value_undefined: {
    id: "verify_value",
    title:
      "Define evidence of sufficient buyer-perceived value",
    guideTopic: "Cross-Through Points"
  },

  value_unknown: {
    id: "verify_value",
    title:
      "Determine how buyer-perceived value can be verified",
    guideTopic: "Cross-Through Points"
  },

  value_communication_verification_gap: {
    id: "verify_value",
    title:
      "Connect the value approach to evidence of buyer-perceived value",
    guideTopic: "Cross-Through Points"
  },

  benefit_incomplete: {
    id: "strengthen_reason_to_act",
    title:
      "Establish the buyer's meaningful reason to act",
    guideTopic: "Cross-Through Points"
  },

  resolution_incomplete: {
    id: "strengthen_resolution",
    title:
      "Establish how remaining buying issues will be surfaced and resolved",
    guideTopic: "Confirmation"
  },

  resolution_unknown: {
    id: "strengthen_resolution",
    title:
      "Examine how remaining buying issues are currently resolved",
    guideTopic: "Confirmation"
  },

  readiness_unverified: {
    id: "verify_readiness",
    title:
      "Define observable evidence of buyer willingness to proceed",
    guideTopic: "Confirmation"
  },

  stall_unknown: {
    id: "locate_breakdown",
    title:
      "Establish where promising opportunities stop advancing",
    guideTopic:
      "Evidence and Verification"
  },

  stall_cause_unverified: {
    id: "investigate_breakdown",
    title:
      "Test the suspected causes of opportunity breakdown",
    guideTopic: "Drivers and Barriers"
  },

  stall_cause_unknown: {
    id: "investigate_breakdown",
    title:
      "Investigate why opportunities break down at the identified point",
    guideTopic: "Drivers and Barriers"
  },

  cause_assumption: {
    id: "investigate_causes",
    title:
      "Separate suspected causes from established causes",
    guideTopic: "Drivers and Barriers"
  },

  activity_response: {
    id: "diagnose_before_change",
    title:
      "Diagnose weak results before changing tactics or increasing activity",
    guideTopic: "Drivers and Barriers"
  },

  testing_incomplete: {
    id: "establish_testing",
    title:
      "Use deliberate testing for important sales changes",
    guideTopic: "Discovery and Testing"
  },

  testing_unknown: {
    id: "establish_testing",
    title:
      "Establish a method for determining whether sales changes work",
    guideTopic: "Discovery and Testing"
  },

  testing_claim_contradiction: {
    id: "complete_testing",
    title:
      "Complete the evidence required for reliable sales testing",
    guideTopic: "Discovery and Testing"
  },

  execution_variation: {
    id: "address_execution",
    title:
      "Identify and correct material execution weaknesses",
    guideTopic: "System vs. Execution"
  },

  execution_unknown: {
    id: "establish_execution_visibility",
    title:
      "Establish visibility into execution of the sales approach",
    guideTopic: "System vs. Execution"
  },

  system_execution_gap: {
    id: "address_execution",
    title:
      "Strengthen execution before redesigning a viable process",
    guideTopic: "System vs. Execution"
  },

  undefined_system_execution: {
    id: "define_before_execution",
    title:
      "Define the required system before treating execution as the primary problem",
    guideTopic: "System vs. Execution"
  }
};

function buildPathFromFindings(
  priorityFindings
) {
  const steps = [];
  const seen = new Set();

  priorityFindings.forEach((item) => {
    const step = buildPathMap[item.id];

    if (!step || seen.has(step.id)) return;

    seen.add(step.id);
    steps.push(step);
  });

  return steps;
}

// --------------------------------------------------
// REPORT ASSEMBLY
// --------------------------------------------------

export function buildDiagnostic(answers) {
  const directFindings =
    evaluateDirectFindings(answers);

  const crossFindings =
    evaluateCrossAnswerFindings(answers);

  const additionalStrengths =
    evaluateAdditionalStrengths(answers);

  const combined = uniqueById([
    ...directFindings,
    ...crossFindings,
    ...additionalStrengths
  ]);

  const strengths = uniqueById(
    combined.filter(
      (item) =>
        item.type === findingTypes.SOLID
    )
  );

  let attentionFindings =
    combined.filter(
      (item) =>
        item.type !== findingTypes.SOLID
    );

  attentionFindings =
    removeSupersededFindings(
      attentionFindings
    );

  attentionFindings =
    consolidateRelatedFindings(
      attentionFindings
    );

  attentionFindings =
    applyCorroboration(
      attentionFindings
    );

  const priorityFindings =
    selectPriorityFindings(
      attentionFindings
    );

  const buildPath =
    buildPathFromFindings(
      priorityFindings
    );

  return {
    currentSystem:
      buildCurrentSystem(answers),

    strengths,

    attentionFindings,

    priorityFindings,

    buildPath,

    context: {
      additionalContext:
        answers.additional_context || null
    }
  };
}
