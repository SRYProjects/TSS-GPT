export const CT_ACTIONS = [
  "Create Presence",
  "Present the Offer and Value",
  "Confirm the Sale"
];

export const CT_POINTS = [
  { id: "awareness", point: "Awareness", result: "Engagement", label: "Awareness → Engagement" },
  { id: "alignment", point: "Alignment", result: "Favor", label: "Alignment → Favor" },
  { id: "resolution", point: "Resolution", result: "Perception of Value", label: "Resolution → Perception of Value" },
  { id: "decision", point: "Decision", result: "Perception of Benefit", label: "Decision → Perception of Benefit" }
];

export const ANSWER_STATES = {
  NO: "NO",
  UNKNOWN: "UNKNOWN",
  NO_VERIFICATION: "NO VERIFICATION",
  ESTABLISHED: "ESTABLISHED"
};

export const DEEP_DIVE_PERMISSION =
  "This is optional. You can see your plan at any time; unanswered depth is not treated as a weakness.";

export const SECTIONS = [
  { id: "foundation", label: "Foundation", shortLabel: "Foundation" },
  { id: "awareness", label: "Awareness → Engagement", shortLabel: "Awareness" },
  { id: "alignment", label: "Alignment → Favor", shortLabel: "Alignment" },
  { id: "resolution", label: "Resolution → Value", shortLabel: "Resolution" },
  { id: "decision", label: "Decision → Benefit", shortLabel: "Decision" },
  { id: "process", label: "Sales Process", shortLabel: "Process" },
  { id: "execution", label: "Capability & Execution", shortLabel: "Execution" }
];

export const DISCOVERY_GROUPS = {
  organic: {
    label: "People who come across you on their own",
    options: [
      "Organic search",
      "Social media (organic)",
      "Paid ads",
      "YouTube / video",
      "Press or PR",
      "Trade shows or events"
    ]
  },
  outbound: {
    label: "People you reach out to directly",
    options: [
      "Cold email",
      "Cold calls",
      "Cold LinkedIn",
      "Account-based outreach",
      "Targeted introduction emails"
    ]
  },
  vouched: {
    label: "People someone vouched for you to",
    options: [
      "Peer referral",
      "Existing customer told them",
      "Partner or affiliate",
      "Found your listing and reached out"
    ]
  }
};

export const FOUNDATION_QUESTIONS = [
  {
    id: "foundation.offer",
    section: "foundation",
    tier: "core",
    stateBearing: false,
    prompt: "What does your company sell?",
    example: "a service, a subscription, a physical product",
    type: "multi",
    options: ["Product", "Service", "Subscription", "Project / engagement", "Something else"]
  },
  {
    id: "foundation.buyer",
    section: "foundation",
    tier: "core",
    stateBearing: false,
    prompt: "Who normally does the buying?",
    example: "the business owner, a department head, a procurement team",
    type: "multi",
    options: [
      "Individual consumers",
      "Business owners",
      "Department leaders",
      "Procurement",
      "Technical staff",
      "Something else"
    ]
  },
  {
    id: "foundation.reason",
    section: "foundation",
    tier: "core",
    stateBearing: false,
    prompt: "In one line — why should someone consider you?",
    example: "It saves a full day of manual work every week.",
    type: "text"
  }
];

export const AWARENESS_QUESTIONS = [
  {
    id: "awareness.discover",
    section: "awareness",
    tier: "core",
    stateBearing: true,
    prompt: "How do they usually find out about you?",
    example: "Select every route that's real for you — these are your sales lines.",
    type: "groupedMulti",
    groups: DISCOVERY_GROUPS,
    options: [
      ...DISCOVERY_GROUPS.organic.options,
      ...DISCOVERY_GROUPS.outbound.options,
      ...DISCOVERY_GROUPS.vouched.options,
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "awareness.verify",
    section: "awareness",
    tier: "core",
    stateBearing: true,
    prompt: "What's the actual sign that they engaged — not just noticed you?",
    example: "they replied, booked a call, visited the site and did something",
    type: "single",
    options: [
      "They responded or replied",
      "They booked a meeting",
      "They asked a question",
      "Something else",
      "Not sure — we don't really track this"
    ]
  },
  {
    id: "awareness.care",
    section: "awareness",
    tier: "deep",
    stateBearing: true,
    prompt: "What makes them care enough to respond?",
    example: "they have a problem, they're curious, someone they trust said to look",
    type: "multi",
    options: [
      "A problem they recognize",
      "Urgency",
      "Curiosity / a good question",
      "Trust in whoever referred them",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "awareness.stop",
    section: "awareness",
    tier: "deep",
    stateBearing: true,
    prompt: "What normally stops them from responding?",
    example: "they're too busy, it doesn't feel relevant",
    type: "multi",
    options: [
      "No real urgency",
      "Not sure it's relevant to them",
      "Too busy",
      "Already using someone else",
      "Something else",
      "I'm not sure"
    ]
  }
];

export const ALIGNMENT_QUESTIONS = [
  {
    id: "alignment.why",
    section: "alignment",
    tier: "core",
    stateBearing: true,
    prompt: "What do you point to as the reason to pick you?",
    example: "lower cost, better results, more experience",
    type: "multi",
    options: [
      "Lower cost",
      "Better results",
      "More experience / expertise",
      "Better service",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "alignment.verify",
    section: "alignment",
    tier: "core",
    stateBearing: true,
    prompt: "How would you know they actually prefer you?",
    example: "they choose you when they had other options",
    type: "single",
    options: [
      "They chose you over a stated alternative",
      "They asked for you by name",
      "Repeat business",
      "Something else",
      "Not sure — we don't really track this"
    ]
  },
  {
    id: "alignment.present",
    section: "alignment",
    tier: "deep",
    stateBearing: true,
    prompt: "How do you actually present your offer to them?",
    example: "a conversation, a demo, a written proposal",
    type: "multi",
    options: [
      "A conversation",
      "A demo or walkthrough",
      "A written proposal",
      "Email",
      "The website",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "alignment.lose",
    section: "alignment",
    tier: "deep",
    stateBearing: true,
    prompt: "What could still pull them toward a competitor?",
    example: "price, an existing relationship, familiarity",
    type: "multi",
    options: [
      "Price",
      "An existing relationship elsewhere",
      "Familiarity with someone else",
      "Something else",
      "I'm not sure"
    ]
  }
];

export const RESOLUTION_QUESTIONS = [
  {
    id: "resolution.resolvehow",
    section: "resolution",
    tier: "core",
    stateBearing: true,
    prompt: "What do you do to resolve those doubts?",
    example: "a trial, references, a guarantee",
    type: "multi",
    options: [
      "Evidence or case studies",
      "A trial or demo",
      "References",
      "A guarantee",
      "Nothing formal — it's ad hoc",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "resolution.verify",
    section: "resolution",
    tier: "core",
    stateBearing: true,
    prompt: "How would you know they've landed on \"yes, it's worth it\"?",
    example: "they ask about next steps, request pricing",
    type: "single",
    options: [
      "They ask about next steps",
      "They request pricing or terms",
      "They seek internal approval",
      "Something else",
      "Not sure — we don't really track this"
    ]
  },
  {
    id: "resolution.resolve",
    section: "resolution",
    tier: "deep",
    stateBearing: true,
    prompt: "What do they still need to understand before deciding?",
    example: "exactly what they get, how results are measured, the cost",
    type: "multi",
    options: [
      "What they'll actually receive",
      "How results are measured",
      "The full cost",
      "How it compares to alternatives",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "resolution.giveup",
    section: "resolution",
    tier: "deep",
    stateBearing: true,
    prompt: "What do they have to give up, beyond price?",
    example: "time, effort to switch, some risk",
    type: "multi",
    options: [
      "Time",
      "Effort to switch or implement",
      "Risk of it not working",
      "Disruption to their routine",
      "Something else",
      "I'm not sure"
    ]
  }
];

export const DECISION_QUESTIONS = [
  {
    id: "decision.clear",
    section: "decision",
    tier: "core",
    stateBearing: true,
    prompt: "What do you do to clear that last hesitation?",
    example: "answer questions directly, clarify scope, negotiate terms",
    type: "multi",
    options: [
      "Answer remaining questions",
      "Clarify scope or terms",
      "Negotiate",
      "Nothing formal — it's ad hoc",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "decision.verify",
    section: "decision",
    tier: "core",
    stateBearing: true,
    prompt: "How would you know they've actually decided?",
    example: "a signature, a payment, a verbal yes",
    type: "single",
    options: [
      "Verbal commitment",
      "Signed agreement",
      "Payment received",
      "Something else",
      "Not sure — we don't really track this"
    ]
  },
  {
    id: "decision.want",
    section: "decision",
    tier: "deep",
    stateBearing: true,
    prompt: "What do they ultimately want this to do for them?",
    example: "save time, reduce risk, make more money",
    type: "multi",
    options: [
      "Save time",
      "Save or make money",
      "Reduce risk",
      "Look good / gain confidence internally",
      "Something else",
      "I'm not sure"
    ]
  },
  {
    id: "decision.hesitate",
    section: "decision",
    tier: "deep",
    stateBearing: true,
    prompt: "What could still make them hesitate, even now?",
    example: "needs approval, unclear terms, bad timing",
    type: "multi",
    options: [
      "Needs someone else's approval",
      "Unclear terms or scope",
      "Timing",
      "Competing priorities",
      "Something else",
      "I'm not sure"
    ]
  }
];

export const PROCESS_QUESTIONS = [
  {
    id: "process.steps",
    section: "process",
    tier: "core",
    stateBearing: true,
    prompt: "Which of these actually happen in your process?",
    example: "Tap all that apply, or add your own — this list is a starting point, not the full set.",
    type: "processSteps"
  },
  {
    id: "process.objectives",
    section: "process",
    tier: "deep",
    stateBearing: true,
    prompt: "For each step, what needs to happen for them to keep going?",
    example: "they agree to a follow-up call — miss this and the opportunity usually stalls",
    type: "stepObjectives"
  }
];

export const EXECUTION_QUESTIONS = [
  {
    id: "execution.capability",
    section: "execution",
    tier: "core",
    stateBearing: true,
    prompt: "Thinking about the sales activities that matter most right now — do you have what's needed to do them reliably?",
    example: "the right skill, enough time, the tools, the information",
    type: "single",
    options: [
      "Yes",
      "Partial — something important is missing",
      "No",
      "I don't know"
    ]
  },
  {
    id: "execution.consistency",
    section: "execution",
    tier: "core",
    stateBearing: true,
    prompt: "Is that work actually done consistently, or does it depend on who's doing it or how busy things get?",
    example: "done the same way every time vs. only when there's time for it",
    type: "single",
    options: [
      "Yes, consistently",
      "Partial — it varies",
      "No, it varies a lot",
      "I don't know"
    ]
  },
  {
    id: "execution.breakdown",
    section: "execution",
    tier: "deep",
    stateBearing: true,
    prompt: "For the activities that feel shakiest, what specifically is missing?",
    example: "skill, information, data, technology, people, or operational support",
    type: "capabilityBreakdown"
  },
  {
    id: "execution.other",
    section: "execution",
    tier: "deep",
    stateBearing: false,
    prompt: "Anything about capability or consistency that doesn't fit the above?",
    example: "",
    type: "textarea"
  }
];

export const QUESTIONS_BY_SECTION = {
  foundation: FOUNDATION_QUESTIONS,
  awareness: AWARENESS_QUESTIONS,
  alignment: ALIGNMENT_QUESTIONS,
  resolution: RESOLUTION_QUESTIONS,
  decision: DECISION_QUESTIONS,
  process: PROCESS_QUESTIONS,
  execution: EXECUTION_QUESTIONS
};

export const ALL_QUESTIONS = Object.values(QUESTIONS_BY_SECTION).flat();

export const QUESTION_BY_ID = Object.fromEntries(
  ALL_QUESTIONS.map((question) => [question.id, question])
);

export function coreQuestions(sectionId) {
  return (QUESTIONS_BY_SECTION[sectionId] || []).filter((question) => question.tier === "core");
}

export function deepQuestions(sectionId) {
  return (QUESTIONS_BY_SECTION[sectionId] || []).filter((question) => question.tier === "deep");
}

export function processStepOptions(answers) {
  const offer = Array.isArray(answers["foundation.offer"]) ? answers["foundation.offer"] : [];
  const productLike = offer.includes("Product") || offer.includes("Subscription");

  return productLike
    ? ["Website or store visit", "Added to cart", "Checkout", "Delivery", "Repeat purchase"]
    : ["First contact", "Conversation", "Meeting", "Proposal", "Negotiation", "Approval", "Purchase"];
}

export function selectedDiscoveryGroups(selected = []) {
  return Object.entries(DISCOVERY_GROUPS)
    .filter(([, group]) => group.options.some((option) => selected.includes(option)))
    .map(([id]) => id);
}

export function shouldShowDistinctLines(answers) {
  const selected = Array.isArray(answers["awareness.discover"])
    ? answers["awareness.discover"].filter(
        (item) => !["I'm not sure", "Something else"].includes(item)
      )
    : [];

  return selected.length > 2 && selectedDiscoveryGroups(selected).length >= 2;
}

export const CAPABILITY_FIELDS = [
  "Skill/capability",
  "Information",
  "Data",
  "Technology",
  "People",
  "Operational support"
];
