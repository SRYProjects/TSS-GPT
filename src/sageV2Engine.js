import {
  ANSWER_STATES,
  QUESTION_BY_ID,
  coreQuestions,
  shouldShowDistinctLines
} from "./sageV2Config.js";

const {
  NO,
  UNKNOWN,
  NO_VERIFICATION,
  ESTABLISHED
} = ANSWER_STATES;

const CONTEXT_ONLY_IDS = new Set([
  "awareness.care",
  "awareness.stop",
  "alignment.present",
  "alignment.lose",
  "resolution.resolve",
  "resolution.giveup",
  "decision.want",
  "decision.hesitate"
]);

const FINDING_META = {
  "awareness.discover": {
    established: "Your main opportunity routes are visible.",
    gap: "Your opportunity routes are not yet clear.",
    why: "Different routes can behave differently. If they are blended together, the business can miss which routes create meaningful opportunities and which do not.",
    next: "Review recent opportunities and identify the real route each one entered through.",
    test: "Track the important routes separately long enough to see whether they produce different levels of engagement."
  },
  "awareness.verify": {
    established: "You have an observable sign of engagement.",
    gap: "Engagement is not reliably verified.",
    why: "Attention is not the same as engagement. Without an observable signal, the business cannot tell whether awareness is turning into real buyer interest.",
    next: "Choose the buyer action that will count as engagement and capture it consistently.",
    test: "Compare the engagement signal across the sales lines you rely on most."
  },
  "awareness.care": {
    established: "You have identified what tends to earn a response.",
    gap: "What earns a response is not yet clear.",
    why: "Knowing what makes a buyer care helps distinguish activity that creates attention from activity that creates engagement.",
    next: "Compare recent responses and identify the recurring reason buyers engaged.",
    test: "Test one message or approach against the response signal you selected."
  },
  "awareness.stop": {
    established: "You have identified common barriers to engagement.",
    gap: "The barriers to engagement are not yet clear.",
    why: "A sales line can be active while avoidable barriers quietly suppress response.",
    next: "Review non-responses and identify the most common observable barrier before changing the approach.",
    test: "Change one likely barrier at a time and compare the engagement signal."
  },
  "alignment.why": {
    established: "You can state why a buyer should prefer you.",
    gap: "The reason a buyer should prefer you is not yet clear.",
    why: "Buyer attention does not automatically become preference. The selling system needs a deliberate basis for favoring your offer over alternatives.",
    next: "Define the specific reason a buyer should favor you in the situations that matter most.",
    test: "Use that reason consistently and watch for an observable preference signal."
  },
  "alignment.verify": {
    established: "You have an observable sign of buyer preference.",
    gap: "Buyer preference is not reliably verified.",
    why: "A positive conversation can feel encouraging without establishing that the buyer actually favors you.",
    next: "Choose an observable signal that distinguishes preference from simple interest.",
    test: "Compare that signal across wins, losses, and stalled opportunities."
  },
  "alignment.present": {
    established: "Your main presentation methods are identified.",
    gap: "How the offer is presented is not yet clear.",
    why: "Presentation methods shape how buyers evaluate fit, difference, and value.",
    next: "Identify the presentation method used in the opportunities that matter most.",
    test: "Compare whether different presentation methods produce different preference signals."
  },
  "alignment.lose": {
    established: "You have identified factors that can pull buyers toward alternatives.",
    gap: "Competitive pull is not yet clear.",
    why: "Preference can erode even after interest is established.",
    next: "Review recent losses and identify which competing factor was actually present.",
    test: "Address one recurring factor deliberately and compare buyer-preference evidence."
  },
  "resolution.resolvehow": {
    established: "You have a defined way to help buyers resolve doubts.",
    gap: "Buyer doubts are handled ad hoc or are not yet clearly addressed.",
    why: "Perceived value can remain unresolved when risk, proof, effort, or uncertainty is left to chance.",
    next: "Define the evidence or mechanism you will use to resolve the doubts that matter most.",
    test: "Track whether that change increases the number of buyers who move into next-step or terms discussions."
  },
  "resolution.verify": {
    established: "You have an observable sign that the buyer sees sufficient value.",
    gap: "Perceived value is not reliably verified.",
    why: "Explaining value does not prove the buyer perceives enough value to continue.",
    next: "Choose the buyer behavior that will count as evidence that the offer is worth proceeding with.",
    test: "Compare that signal before and after one deliberate change to how value is established."
  },
  "resolution.resolve": {
    established: "You have identified what buyers still need to understand.",
    gap: "What remains unresolved before a decision is not yet clear.",
    why: "Unresolved questions can delay or stop an otherwise viable opportunity.",
    next: "Review recent late-stage opportunities and identify the recurring unresolved question.",
    test: "Address that question earlier and compare downstream progression."
  },
  "resolution.giveup": {
    established: "You have identified costs beyond price.",
    gap: "The buyer's non-price sacrifice is not yet clear.",
    why: "Time, effort, disruption, and risk can outweigh price in the buyer's value judgment.",
    next: "Identify the non-price sacrifice that matters most to your buyers.",
    test: "Address that sacrifice explicitly and observe whether value signals improve."
  },
  "decision.clear": {
    established: "You have a defined way to clear final hesitation.",
    gap: "Final hesitation is handled ad hoc or is not yet clearly addressed.",
    why: "A buyer can see value and still fail to act when remaining issues are not deliberately resolved.",
    next: "Define how the team will surface and resolve the final issues that commonly prevent action.",
    test: "Track whether that approach increases observable decision signals."
  },
  "decision.verify": {
    established: "You have an observable sign that the buyer has decided.",
    gap: "The decision point is not reliably verified.",
    why: "Willingness to proceed should be distinguishable from a positive conversation or continued interest.",
    next: "Define the buyer action that will count as a decision to proceed.",
    test: "Compare that signal with actual sales completion and identify where final conversion still breaks down."
  },
  "decision.want": {
    established: "You have identified the benefit the buyer ultimately wants.",
    gap: "The buyer's reason to act is not yet clear.",
    why: "Rational value can justify a purchase, while perceived benefit gives the buyer a reason to act.",
    next: "Identify the outcome buyers personally or organizationally want from proceeding.",
    test: "Connect that benefit explicitly to the offer and observe decision signals."
  },
  "decision.hesitate": {
    established: "You have identified common late-stage hesitation.",
    gap: "Late-stage hesitation is not yet clear.",
    why: "A known hesitation can be resolved deliberately; an assumed one can lead to the wrong fix.",
    next: "Review recent late-stage stalls and establish what actually prevented action.",
    test: "Resolve one recurring issue earlier and compare decision evidence."
  },
  "process.steps": {
    established: "The major sales-process activities are visible.",
    gap: "The actual sales path is not yet clear.",
    why: "A business cannot deliberately improve advancement if it cannot identify the major activities opportunities pass through.",
    next: "Map the major activities that occur from first meaningful contact through purchase or loss.",
    test: "Use the map on recent opportunities and note where the real path differs."
  },
  "execution.capability": {
    established: "The business reports having what the important sales work requires.",
    gap: "An important capability or support requirement is missing or unknown.",
    why: "A sound sales approach can still fail when people, information, data, technology, or operating support are insufficient.",
    next: "Identify the missing requirement for the activity that matters most and address that requirement before redesigning the whole sales approach.",
    test: "After the requirement is addressed, compare execution reliability and the target sales result."
  },
  "execution.consistency": {
    established: "The important sales work is reported as consistently executed.",
    gap: "Execution varies enough to threaten the intended sales result.",
    why: "A viable sales system cannot produce predictable evidence when execution changes materially by person, workload, or circumstance.",
    next: "Identify where execution varies and establish the minimum required practice for that activity.",
    test: "Compare the result when the required practice is followed consistently."
  }
};

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function answerText(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return "";
  return value ? String(value) : "";
}

function includesAny(value, needles) {
  const values = Array.isArray(value) ? value : [value];
  return values.some((item) => {
    const normalized = String(item || "").toLowerCase();
    return needles.some((needle) => normalized.includes(needle));
  });
}

export function getAnswerState(questionId, answers) {
  const question = QUESTION_BY_ID[questionId];
  const value = answers[questionId];

  if (!question || !question.stateBearing) return null;

  if (questionId === "process.objectives") return null;
  if (questionId === "execution.breakdown") return null;

  if (!hasValue(value)) return null;

  if (questionId === "execution.capability") {
    if (value === "Yes") return ESTABLISHED;
    if (value === "I don't know") return UNKNOWN;
    return NO;
  }

  if (questionId === "execution.consistency") {
    if (value === "Yes, consistently") return ESTABLISHED;
    if (value === "I don't know") return UNKNOWN;
    return NO;
  }

  if (questionId === "process.steps") {
    return Array.isArray(value) && value.length > 0 ? ESTABLISHED : UNKNOWN;
  }

  // The explicit "we don't track this" condition is more specific than
  // the uncertainty wording embedded in the same option.
  if (includesAny(value, ["don't really track this", "do not track this"])) {
    return NO_VERIFICATION;
  }

  if (includesAny(value, ["i'm not sure", "not sure", "i don't know", "don't know"])) {
    return UNKNOWN;
  }

  if (includesAny(value, ["nothing formal", "it's ad hoc", "it is ad hoc"])) {
    return NO;
  }

  return ESTABLISHED;
}

function supportFor(questionId, answers) {
  const question = QUESTION_BY_ID[questionId];
  const value = answers[questionId];
  const other = answers[`${questionId}.other`];

  if (!question) return "";

  if (Array.isArray(value)) {
    const cleaned = value.map((item) =>
      item === "Something else" && other ? `Something else: ${other}` : item
    );
    return cleaned.join(", ");
  }

  if (value === "Something else" && other) return other;
  return answerText(value);
}

function findingFromQuestion(questionId, answers) {
  const state = getAnswerState(questionId, answers);
  if (!state) return null;

  const question = QUESTION_BY_ID[questionId];
  const meta = FINDING_META[questionId] || {
    established: `${question.prompt} — a concrete answer is established.`,
    gap: `${question.prompt} — this is not yet established.`,
    why: "This affects how reliably an opportunity can move through the sales system.",
    next: "Define the missing condition and establish how it will be verified.",
    test: "Make one deliberate change and compare the observable result."
  };

  const contextual = CONTEXT_ONLY_IDS.has(questionId);

  return {
    id: questionId,
    section: question.section,
    state,
    contextual,
    title: state === ESTABLISHED ? meta.established : meta.gap,
    support: supportFor(questionId, answers),
    why: meta.why,
    next: meta.next,
    test: meta.test,
    question: question.prompt
  };
}

function lineFindings(answers) {
  if (!shouldShowDistinctLines(answers)) return [];

  const selected = Array.isArray(answers["process.distinctLines"])
    ? answers["process.distinctLines"]
    : [];
  const details = answers["process.lineTargets"] || {};

  return selected.map((line) => {
    const detail = details[line] || {};
    const tracking = detail.tracking || "";
    const objective = String(detail.objective || "").trim();

    let state = UNKNOWN;
    let title = `${line}: the line's target is not yet defined.`;
    let next = `Define the measurable result ${line} is expected to produce.`;

    if (tracking === "I do this but don't track it") {
      state = NO_VERIFICATION;
      title = `${line}: activity exists, but its result is not tracked.`;
      next = `Choose evidence that will show whether ${line} is producing its intended result.`;
    } else if (tracking === "Yes, and I track it" && objective) {
      state = ESTABLISHED;
      title = `${line}: a target and tracking practice are established.`;
      next = `Compare the tracked result with the target and test whether the line deserves continued investment.`;
    } else if (tracking === "Yes, and I track it" && !objective) {
      state = UNKNOWN;
      title = `${line}: tracking exists, but the target outcome is not defined.`;
      next = `Define what successful performance for ${line} is supposed to produce.`;
    }

    return {
      id: `sales-line:${line}`,
      section: "awareness",
      state,
      contextual: false,
      title,
      support: [objective ? `Objective: ${objective}` : "", tracking].filter(Boolean).join(" · "),
      why: "A sales line can consume time and money without a defined target or evidence that it produces the result expected from it.",
      next,
      test: `Track ${line} against its target and compare the result with the other opportunity routes you use.`,
      question: "Which sales lines deserve their own target?"
    };
  });
}

function processObjectiveFindings(answers) {
  const opened = Array.isArray(answers.__deepDiveSections)
    ? answers.__deepDiveSections.includes("process")
    : false;

  if (!opened) return [];

  const steps = Array.isArray(answers["process.steps"]) ? answers["process.steps"] : [];
  const objectives = answers["process.objectives"] || {};

  return steps.map((step) => {
    const objective = String(objectives[step] || "").trim();
    const state = objective ? ESTABLISHED : UNKNOWN;

    return {
      id: `process-objective:${step}`,
      section: "process",
      state,
      contextual: false,
      title: objective
        ? `${step}: an advancement objective is defined.`
        : `${step}: no defined objective is recorded for this step.`,
      support: objective || "No objective provided.",
      why: "Completing a sales activity is not the same as advancing an opportunity. Each meaningful step needs a result that makes progression observable.",
      next: objective
        ? `Verify whether “${objective}” reliably predicts advancement after ${step}.`
        : `Define what must be true when ${step} succeeds so the opportunity can keep moving.`,
      test: `Use the defined result on recent opportunities and compare whether it distinguishes advancement from simple activity completion.`,
      question: "For each step, what needs to happen for them to keep going?"
    };
  });
}

function executionBreakdownFindings(answers) {
  const breakdown = answers["execution.breakdown"];
  if (!breakdown || typeof breakdown !== "object") return [];

  const findings = [];

  Object.entries(breakdown).forEach(([activity, fields]) => {
    Object.entries(fields || {}).forEach(([field, value]) => {
      if (!hasValue(value)) return;

      let state = ESTABLISHED;
      if (value === "I don't know") state = UNKNOWN;
      else if (value === "Partial" || value === "No") state = NO;

      findings.push({
        id: `execution-breakdown:${activity}:${field}`,
        section: "execution",
        state,
        contextual: false,
        title:
          state === ESTABLISHED
            ? `${activity}: ${field.toLowerCase()} appears available.`
            : `${activity}: ${field.toLowerCase()} needs attention.`,
        support: `${field}: ${value}`,
        why: "Execution quality depends on the specific support required for the activity, not only on whether the activity exists.",
        next:
          state === ESTABLISHED
            ? `Keep ${field.toLowerCase()} available and verify that it remains sufficient for ${activity}.`
            : `Establish what ${activity} requires from ${field.toLowerCase()} and close the specific gap.`,
        test: `After the support change, compare whether ${activity} is performed more reliably and produces its intended result.`,
        question: "For the activities that feel shakiest, what specifically is missing?"
      });
    });
  });

  return findings;
}

export function buildFindings(answers) {
  const direct = Object.keys(QUESTION_BY_ID)
    .map((id) => findingFromQuestion(id, answers))
    .filter(Boolean);

  return [
    ...direct,
    ...lineFindings(answers),
    ...processObjectiveFindings(answers),
    ...executionBreakdownFindings(answers)
  ];
}

function sectionIsReached(sectionId, answers, visitedSections = []) {
  if (visitedSections.includes(sectionId)) return true;

  return coreQuestions(sectionId).some((question) => hasValue(answers[question.id]));
}

export function buildMilestones(answers, visitedSections = []) {
  const sectionIds = [
    "foundation",
    "awareness",
    "alignment",
    "resolution",
    "decision",
    "process",
    "execution"
  ];

  const findings = buildFindings(answers);

  return sectionIds.map((sectionId) => {
    if (!sectionIsReached(sectionId, answers, visitedSections)) {
      return { id: sectionId, status: "not yet reached" };
    }

    const relevant = findings.filter(
      (finding) =>
        finding.section === sectionId &&
        !finding.contextual
    );

    const worthTesting = relevant.some((finding) => finding.state !== ESTABLISHED);

    return {
      id: sectionId,
      status: worthTesting ? "worth testing" : "clear"
    };
  });
}

export function buildCurrentSystem(answers) {
  const offer = Array.isArray(answers["foundation.offer"])
    ? answers["foundation.offer"].filter((item) => item !== "Something else")
    : [];
  const offerOther = answers["foundation.offer.other"];
  if (offerOther) offer.push(offerOther);

  const buyers = Array.isArray(answers["foundation.buyer"])
    ? answers["foundation.buyer"].filter((item) => item !== "Something else")
    : [];
  const buyerOther = answers["foundation.buyer.other"];
  if (buyerOther) buyers.push(buyerOther);

  const sources = Array.isArray(answers["awareness.discover"])
    ? answers["awareness.discover"].filter(
        (item) => !["I'm not sure", "Something else"].includes(item)
      )
    : [];
  const sourceOther = answers["awareness.discover.other"];
  if (sourceOther) sources.push(sourceOther);

  const steps = Array.isArray(answers["process.steps"])
    ? answers["process.steps"]
    : [];

  return {
    offer,
    buyers,
    reason: answers["foundation.reason"] || "",
    sources,
    steps
  };
}

export function buildPlan(answers, visitedSections = []) {
  const findings = buildFindings(answers);
  const working = findings.filter(
    (finding) =>
      finding.state === ESTABLISHED &&
      !finding.contextual
  );
  const context = findings.filter((finding) => finding.contextual);
  const needsAttention = findings.filter(
    (finding) =>
      finding.state !== ESTABLISHED &&
      !finding.contextual
  );

  return {
    currentSystem: buildCurrentSystem(answers),
    milestones: buildMilestones(answers, visitedSections),
    findings,
    working,
    context,
    needsAttention,
    priorityCandidates: needsAttention,
    selectedNextSteps: []
  };
}

export function hypothesisSeed(finding) {
  if (!finding) {
    return {
      change: "",
      expected: "",
      check: ""
    };
  }

  return {
    change: finding.next,
    expected: finding.test,
    check: "Choose the observable evidence before making the change, then compare the result after enough real opportunities have passed through it."
  };
}

export function sectionObservation(sectionId, answers) {
  const findings = buildFindings(answers).filter(
    (finding) =>
      finding.section === sectionId &&
      !finding.contextual
  );

  if (!findings.length) return null;

  const attention = findings.find((finding) => finding.state !== ESTABLISHED);
  const finding = attention || findings[0];

  return {
    status: finding.state === ESTABLISHED ? "clear" : "worth testing",
    title: finding.title,
    support: finding.support,
    why: finding.why
  };
}
