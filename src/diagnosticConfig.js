export const stages = [
  { id: "business", label: "Your Business" },
  { id: "begin", label: "How Sales Begin" },
  { id: "move", label: "How Sales Move" },
  { id: "buyer", label: "How Buyers Progress" },
  { id: "improve", label: "Improvement" },
  { id: "execution", label: "Execution" }
];

export const sourceOptions = [
  "Referrals",
  "Existing customers",
  "Outbound calls",
  "Outbound email",
  "Website / search",
  "Advertising",
  "Email campaigns",
  "Social media",
  "Networking",
  "Events / trade shows",
  "Partners / distributors",
  "Channel partners / resellers",
  "Industry associations",
  "Other",
  "Not sure"
];

export const processStepOptions = [
  "Initial response or contact",
  "Qualification / determining fit",
  "Learning about the customer's needs or situation",
  "Consultation or meeting",
  "Demonstration or presentation",
  "Sample, trial, or test",
  "Site visit or assessment",
  "Estimate or quote",
  "Proposal",
  "Follow-up or nurturing",
  "Customer's internal review or approval",
  "Negotiation",
  "Contract or agreement",
  "Order or payment",
  "Other"
];

export const questions = [
  {
    id: "assessment_scope",
    stage: "business",
    title: "What are we assessing?",
    help: "Choose the part of your sales operation you want SAGE to examine.",
    type: "single",
    options: [
      "Our overall sales operation",
      "One product or service",
      "One customer group or market",
      "One sales team or division",
      "Other"
    ],
    followUp: {
      id: "assessment_scope_detail",
      when: (answers) =>
        answers.assessment_scope &&
        answers.assessment_scope !== "Our overall sales operation",
      title: "Briefly identify what you're assessing.",
      help: "One sentence is enough.",
      type: "text",
      optional: false
    }
  },

  {
    id: "buyer_type",
    stage: "business",
    title: "Who primarily buys what you sell?",
    help: "Choose the answer that best describes the business you're assessing.",
    type: "single",
    options: [
      "Businesses or organizations",
      "Government or nonprofit organizations",
      "Dealers, distributors, or other intermediaries",
      "A meaningful mix of these",
      "Other B2B buyers"
    ]
  },

  {
    id: "sales_sources",
    stage: "begin",
    title: "How does new business typically find its way to you?",
    help: "Select every source that makes a meaningful contribution to sales.",
    type: "multi",
    options: sourceOptions
  },

  {
    id: "top_sources",
    stage: "begin",
    title: "Which of these currently contribute most to sales?",
    help: "Choose up to three. If you don't know, say so—that is useful information.",
    type: "dynamicMulti",
    sourceAnswer: "sales_sources",
    maxSelections: 3,
    additionalOptions: ["We don't know which contribute most"]
  },

  {
    id: "source_objectives",
    stage: "begin",
    title:
      "For those important sales activities, how clear are you about what each one is supposed to produce?",
    help:
      "Think beyond “generate sales.” What specific response or result should each activity create?",
    type: "single",
    options: [
      "Each important activity has a specific intended result",
      "Some do, but others are less clearly defined",
      "We generally know what we want, but it isn't specifically defined",
      "We mostly perform the activities and judge the results afterward"
    ],
    followUp: {
      id: "source_objective_verification",
      when: (answers) =>
        [
          "Each important activity has a specific intended result",
          "Some do, but others are less clearly defined"
        ].includes(answers.source_objectives),
      title: "What are your most important sources mainly expected to produce?",
      help:
        "We'll use the sources you identified earlier. Choose the closest intended result for each.",
      type: "sourceOutcomeMap",
      options: [
        "Awareness or attention",
        "Inquiry or response",
        "Qualified lead",
        "Scheduled conversation or meeting",
        "Request for estimate or quote",
        "Request for demonstration or consultation",
        "Other defined result"
      ]
    }
  },

  {
    id: "source_evidence",
    stage: "begin",
    title: "How do you know which ways of generating business are actually working?",
    help: "Choose the answer that best describes your current practice.",
    type: "single",
    options: [
      "We track the result of each important source",
      "We track some sources but not others",
      "We rely mostly on experience or judgment",
      "We don't really know"
    ],
    followUp: {
      id: "source_evidence_verification",
      when: (answers) =>
        [
          "We track the result of each important source",
          "We track some sources but not others"
        ].includes(answers.source_evidence),
      title: "What do you normally use to determine whether a source is working?",
      help: "Select all that apply.",
      type: "multi",
      options: [
        "Recorded inquiries or responses",
        "Qualified leads",
        "Scheduled meetings",
        "Source-to-sale conversion",
        "CRM or sales-system records",
        "Orders or revenue",
        "Customer-source tracking",
        "Another recorded measure"
      ]
    }
  },

  {
    id: "process_clarity",
    stage: "move",
    title:
      "After a potential buyer shows real interest, how clearly can you describe what usually happens from there until they buy—or the opportunity ends?",
    help:
      "Think about what actually happens in your business, whether or not you have ever formally mapped a sales process.",
    type: "single",
    options: [
      "We have a clear, deliberate process",
      "There is a general process, but it varies",
      "It depends heavily on the salesperson or situation",
      "We have never really mapped it",
      "Not sure"
    ]
  },

  {
    id: "process_steps",
    stage: "move",
    title:
      "After a buyer shows real interest, what usually happens before the opportunity is won or lost?",
    help:
      "Select the major activities that commonly happen in your business. These may include contact, learning about the buyer, meetings, quotes, proposals, follow-up, negotiation, or an order.",
    type: "multi",
    options: processStepOptions,
    followUp: {
      id: "process_order",
      when: (answers) =>
        Array.isArray(answers.process_steps) &&
        answers.process_steps.length > 0,
      title: "Put those steps in the order they usually happen.",
      help:
        "You can also tell us if the order changes or there is no consistent order.",
      type: "order",
      sourceAnswer: "process_steps",
      additionalOptions: [
        "The order sometimes changes",
        "There is no consistent order"
      ]
    }
  },

  {
    id: "different_path",
    stage: "move",
    title:
      "Do any of your important sources of new business follow a substantially different sales path?",
    help:
      "We're interested only in meaningful differences—not every small variation.",
    type: "single",
    options: ["No", "Yes", "Not sure"],
    followUp: {
      id: "different_path_steps",
      when: (answers) => answers.different_path === "Yes",
      title: "Which important source follows the different path?",
      help:
        "Identify only the most important different path. We won't ask you to map every variation.",
      type: "differentPath"
    }
  },

  {
    id: "step_objectives",
    stage: "move",
    title:
      "For the major sales activities you just identified, have you defined what each one should accomplish before the opportunity moves forward?",
    help:
      "We mean the result of that activity—not the final sale. For example, a meeting might need to establish fit and agreement on the next step.",
    type: "single",
    options: [
      "Yes, for essentially every important step",
      "For some steps",
      "The results are generally understood but not specifically defined",
      "No"
    ],
    followUp: {
      id: "step_objective_verification",
      when: (answers) =>
        [
          "Yes, for essentially every important step",
          "For some steps"
        ].includes(answers.step_objectives),
      title: "Let's verify a few important steps.",
      help:
        "For the significant steps you identified, choose what each mainly needs to accomplish.",
      type: "stepOutcomeMap"
    }
  },

  {
    id: "step_evidence",
    stage: "move",
    title:
      "How do you know whether those sales activities achieved the result you expected?",
    help:
      "Think about observable buyer response, a clear next commitment, measurable results, or other reliable evidence.",
    type: "single",
    options: [
      "We use defined evidence or measures",
      "We have evidence for some steps",
      "We rely primarily on salesperson judgment",
      "We generally assume success if the opportunity continues",
      "We don't evaluate individual steps this way"
    ]
  },

  {
    id: "buyer_understanding",
    stage: "buyer",
    title:
      "Before a buyer chooses you, have you defined what they need to understand or conclude about your company or offer?",
    help:
      "For example: why you are relevant, how you differ, whether the value is sufficient, what evidence supports your claims, and what risks or alternatives they are weighing.",
    type: "single",
    options: [
      "We have deliberately worked this out",
      "We understand much of it, but it isn't fully developed",
      "It is largely left to individual salespeople",
      "We have not examined it this way"
    ]
  },

  {
    id: "buyer_preference",
    stage: "buyer",
    title:
      "How do you know when a buyer has moved from simply being interested to actually favoring your company or offer?",
    help:
      "We're asking about evidence of preference—not whether the conversation merely seems positive.",
    type: "single",
    options: [
      "We have recognizable evidence of buyer preference",
      "We have some indicators, but they aren't consistent",
      "We mostly infer it from the conversation",
      "We don't distinguish interest from preference",
      "Not sure"
    ],
    followUp: {
      id: "preference_evidence",
      when: (answers) =>
        answers.buyer_preference ===
        "We have recognizable evidence of buyer preference",
      title: "What usually indicates that preference?",
      help: "Select all that genuinely apply.",
      type: "multi",
      options: [
        "Buyer explicitly expresses a preference",
        "Buyer includes us on a shortlist or advances us in their evaluation",
        "Buyer agrees to a meaningful next step",
        "Buyer asks detailed questions consistent with serious evaluation",
        "Buyer compares alternatives with us directly",
        "Another observable indication"
      ]
    }
  },

  {
    id: "buyer_value",
    stage: "buyer",
    title:
      "How do you know buyers perceive enough value in your offer to justify choosing it over alternatives?",
    help:
      "Explaining value and knowing the buyer perceives value are different things.",
    type: "single",
    options: [
      "We deliberately establish and verify perceived value",
      "We address value but don't consistently verify it",
      "We mainly explain our value and assume the buyer understands",
      "We haven't defined how to determine this",
      "Not sure"
    ],
    followUp: {
      id: "value_evidence",
      when: (answers) =>
        answers.buyer_value ===
        "We deliberately establish and verify perceived value",
      title: "What tells you the buyer sees sufficient value?",
      help: "Select all that genuinely apply.",
      type: "multi",
      options: [
        "The buyer directly confirms it",
        "The buyer's actions clearly indicate it",
        "The buyer accepts the business case or justification",
        "The buyer advances despite having alternatives",
        "Another observable indication"
      ]
    }
  },

  {
    id: "buyer_benefit",
    stage: "buyer",
    title:
      "Beyond the rational value of your offer, how deliberately do you address why the buyer would actually want to proceed?",
    help:
      "Consider what changes for the buyer, why it matters to them, and why proceeding is worthwhile.",
    type: "single",
    options: [
      "We deliberately identify and establish this",
      "We address it in some situations",
      "It depends mostly on the salesperson",
      "We focus primarily on the rational business case",
      "We have not examined this separately"
    ]
  },

  {
    id: "resolution",
    stage: "buyer",
    title:
      "Before a serious buyer is willing to proceed, how deliberately do you identify and resolve what still stands in the way?",
    type: "single",
    options: [
      "We deliberately identify and resolve remaining issues",
      "We usually address them, but the approach varies",
      "We mainly address issues when the buyer raises them",
      "Important issues often emerge late",
      "We have no consistent approach",
      "Not sure"
    ],
    followUp: {
      id: "resolution_details",
      when: (answers) =>
        [
          "We deliberately identify and resolve remaining issues",
          "We usually address them, but the approach varies",
          "We mainly address issues when the buyer raises them",
          "Important issues often emerge late"
        ].includes(answers.resolution),
      title: "What most commonly remains to be resolved?",
      help: "Select the issues that commonly matter in your sales.",
      type: "multi",
      options: [
        "Price",
        "Scope or specifications",
        "Fit",
        "Timing",
        "Implementation",
        "Risk",
        "Contract terms",
        "Procurement requirements",
        "Technical or security requirements",
        "Internal approval",
        "Budget or financing",
        "Comparison with another option",
        "Questions or concerns",
        "Other",
        "It varies too much to say",
        "Not sure"
      ]
    }
  },

  {
    id: "readiness_evidence",
    stage: "buyer",
    title:
      "What most clearly tells you the customer is willing to proceed and work through the final buying details?",
    type: "single",
    options: [
      "They explicitly say they want to proceed",
      "They begin negotiating details",
      "They request an agreement or contract",
      "They seek final internal approval",
      "They confirm timing or implementation",
      "They provide purchasing information",
      "They place an order or deposit",
      "The salesperson judges that they are ready",
      "We have no consistent indicator",
      "Other"
    ]
  },

  {
    id: "stall_point",
    stage: "buyer",
    title:
      "Where do promising sales opportunities most often slow down, stall, or disappear?",
    help:
      "We'll show the sales steps you identified earlier so you can choose the relevant point.",
    type: "dynamicSingle",
    sourceAnswer: "process_steps",
    additionalOptions: [
      "At several points",
      "There is no noticeable pattern",
      "We don't know"
    ],
    followUp: {
      id: "stall_reason",
      when: (answers) =>
        answers.stall_point &&
        ![
          "There is no noticeable pattern",
          "We don't know"
        ].includes(answers.stall_point),
      title: "What most commonly happens there?",
      help: "Choose up to three.",
      type: "multi",
      maxSelections: 3,
      options: [
        "Customer stops responding",
        "Customer postpones the decision",
        "Price becomes a problem",
        "Customer chooses another option",
        "Customer decides the need is not important enough",
        "Customer cannot obtain approval",
        "Budget becomes unavailable",
        "Timing changes",
        "Questions or concerns remain unresolved",
        "Customer does not see enough difference between us and alternatives",
        "We lose momentum or follow-up",
        "We determine the opportunity is not a good fit",
        "We don't know",
        "Other"
      ],
      nextFollowUp: {
        id: "stall_confidence",
        title: "How confident are you that these are the actual reasons?",
        type: "single",
        options: [
          "Customers commonly tell us directly",
          "Our records or data support this",
          "We see a strong and consistent pattern",
          "It is mainly salesperson judgment",
          "It is mostly our best guess",
          "We don't know"
        ]
      }
    }
  },

  {
    id: "weak_result_response",
    stage: "improve",
    title: "When a sales result is weaker than expected, what normally happens next?",
    help: "Choose the answer that most closely reflects your usual practice.",
    type: "single",
    options: [
      "We investigate possible causes before deciding what to change",
      "We review the situation, but the process is informal",
      "We usually act on the most likely explanation",
      "We tend to change tactics or push for more activity",
      "It varies considerably"
    ]
  },

  {
    id: "testing",
    stage: "improve",
    title:
      "When you change how you sell, how do you determine whether the change actually improved performance?",
    help:
      "Think about what was happening before, what was deliberately changed, and what happened afterward.",
    type: "single",
    options: [
      "We compare deliberate changes against meaningful evidence",
      "We measure some changes but not systematically",
      "We judge primarily from experience and overall results",
      "We rarely test changes in a structured way",
      "Not sure"
    ],
    followUp: {
      id: "testing_verification",
      when: (answers) =>
        answers.testing ===
        "We compare deliberate changes against meaningful evidence",
      title: "When testing an important change, which of these do you normally establish?",
      help: "Select all that apply.",
      type: "multi",
      options: [
        "What result is occurring before the change",
        "What specifically is being changed",
        "What improvement is expected",
        "What evidence will indicate whether it worked",
        "A comparison afterward",
        "We do all of these",
        "It varies"
      ]
    }
  },

  {
    id: "execution",
    stage: "execution",
    title:
      "How confident are you that your sales approach is being executed consistently as intended?",
    help:
      "Consider whether the necessary work actually gets done—not merely whether a process exists.",
    type: "single",
    options: [
      "We verify execution and address deviations",
      "Execution is generally consistent, with some variation",
      "It varies significantly by person or situation",
      "We don't have enough visibility to know"
    ],
    followUp: {
      id: "execution_exposures",
      when: (answers) =>
        [
          "Execution is generally consistent, with some variation",
          "It varies significantly by person or situation",
          "We don't have enough visibility to know"
        ].includes(answers.execution),
      title: "Which of these appear to contribute?",
      help: "Select all that appear relevant. It's fine to choose “Not sure.”",
      type: "multi",
      options: [
        "Important sales work is performed inconsistently",
        "People concentrate on work they prefer and neglect other necessary work",
        "Viable opportunities are sometimes abandoned too soon",
        "Some people lack the skills required for important sales work",
        "Necessary information is unavailable or difficult to access",
        "Data or tracking is inadequate",
        "Technology or tools create problems",
        "Procedures or responsibilities are unclear",
        "Coordination between people or departments is weak",
        "Management follow-through is inconsistent",
        "Other",
        "Not sure"
      ]
    }
  },

  {
    id: "additional_context",
    stage: "execution",
    title:
      "Is there something important about the way your business sells that these questions did not capture?",
    help:
      "Optional. For example: an unusual buying process, regulatory requirement, highly seasonal selling, or another condition that materially changes how sales work.",
    type: "textarea",
    optional: true
  }
];

export const guideTopics = {
  salesSources: "Map How Your Business Sells / Sales Lines",
  objectives: "Define the Objective of Each Step",
  evidence: "Evidence and Verification",
  buyerProgression: "Cross-Through Points",
  resolution: "Confirmation",
  causes: "Drivers and Barriers",
  testing: "Discovery and Testing",
  execution: "System vs. Execution"
};
