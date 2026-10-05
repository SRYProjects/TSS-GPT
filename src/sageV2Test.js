import assert from "node:assert/strict";
import {
  buildFindings,
  buildMilestones,
  getAnswerState
} from "./sageV2Engine.js";
import { shouldShowDistinctLines } from "./sageV2Config.js";

assert.equal(
  getAnswerState("foundation.offer", {
    "foundation.offer": ["Service"]
  }),
  null,
  "Foundation descriptive questions must not carry a diagnostic state."
);

assert.equal(
  getAnswerState("awareness.verify", {
    "awareness.verify": "Not sure — we don't really track this"
  }),
  "NO VERIFICATION",
  "Explicit lack of tracking must map to NO VERIFICATION."
);

assert.equal(
  getAnswerState("execution.capability", {
    "execution.capability": "Partial — something important is missing"
  }),
  "NO",
  "Partial capability means the required capability is not fully established."
);

assert.equal(
  shouldShowDistinctLines({
    "awareness.discover": ["Organic search", "Paid ads"]
  }),
  false,
  "Two selected channels must not trigger the distinct-lines reveal."
);

assert.equal(
  shouldShowDistinctLines({
    "awareness.discover": [
      "Organic search",
      "Paid ads",
      "Cold email"
    ]
  }),
  true,
  "Three channels spanning two discovery groups must trigger the distinct-lines reveal."
);

const skippedDeepDive = buildFindings({
  "process.steps": ["Meeting", "Proposal"]
});

assert.equal(
  skippedDeepDive.some((finding) =>
    finding.id.startsWith("process-objective:")
  ),
  false,
  "Skipping Process Deep Dive must not manufacture missing-objective findings."
);

const openedDeepDive = buildFindings({
  "process.steps": ["Meeting", "Proposal"],
  __deepDiveSections: ["process"],
  "process.objectives": {
    Meeting: "Agree on the next step",
    Proposal: ""
  }
});

const blankProposalObjective = openedDeepDive.find(
  (finding) => finding.id === "process-objective:Proposal"
);

assert.equal(
  blankProposalObjective?.state,
  "UNKNOWN",
  "A blank step objective is UNKNOWN only after that Deep Dive is opened."
);

const untouchedMilestones = buildMilestones({}, []);
assert.ok(
  untouchedMilestones.every(
    (milestone) => milestone.status === "not yet reached"
  ),
  "Unreached sections must stay neutral."
);

const reachedMilestones = buildMilestones(
  {
    "foundation.offer": ["Service"],
    "foundation.buyer": ["Business owners"],
    "foundation.reason": "Specialized sales improvement",
    "awareness.discover": ["Organic search"],
    "awareness.verify": "They booked a meeting"
  },
  ["foundation", "awareness"]
);

assert.equal(
  reachedMilestones.find((item) => item.id === "awareness")?.status,
  "clear",
  "Supported Awareness core answers should produce a clear milestone."
);

console.log("SAGE V2 diagnostic tests passed.");
