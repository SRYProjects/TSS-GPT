import { questions } from "./diagnosticConfig";

const coreScreenDefinitions = [
  {
    questionId: "assessment_scope",
    embedded: ["buyer_type"]
  },
  {
    questionId: "sales_sources",
    embedded: ["top_sources"]
  },
  {
    questionId: "source_objectives",
    embedded: []
  },
  {
    questionId: "source_evidence",
    embedded: []
  },
  {
    questionId: "process_clarity",
    embedded: []
  },
  {
    questionId: "process_steps",
    embedded: []
  },
  {
    questionId: "step_objectives",
    embedded: ["step_evidence"]
  },
  {
    questionId: "buyer_understanding",
    embedded: ["buyer_value"]
  },
  {
    questionId: "resolution",
    embedded: []
  },
  {
    questionId: "stall_point",
    embedded: []
  },
  {
    questionId: "weak_result_response",
    embedded: ["testing"]
  },
  {
    questionId: "execution",
    embedded: []
  }
];

const coreFollowUpIds = new Set([
  "assessment_scope_detail",
  "process_order"
]);

export const deepDiveMeta = {
  begin: {
    label: "How Sales Begin",
    title: "Add evidence about where sales come from",
    description:
      "Go deeper on what your most important opportunity sources are expected to produce and how you verify their contribution."
  },
  move: {
    label: "How Sales Move",
    title: "Add detail about how opportunities advance",
    description:
      "Explore meaningful process variations and verify the intended results of representative sales steps."
  },
  buyer: {
    label: "How Buyers Progress",
    title: "Add evidence about buyer progression",
    description:
      "Explore preference, benefit, readiness, unresolved issues, and the evidence behind where opportunities stall."
  },
  improve: {
    label: "Improvement",
    title: "Add evidence about how changes are tested",
    description:
      "Verify whether important sales changes are tested against a defined starting point, expected result, and meaningful evidence."
  },
  execution: {
    label: "Execution",
    title: "Add detail about execution",
    description:
      "Explore what may contribute to execution variation and add any important selling condition the Core Review did not capture."
  }
};

const deepDiveDefinitions = {
  begin: [
    { id: "source_objective_verification" },
    { id: "source_evidence_verification" }
  ],
  move: [
    { id: "different_path" },
    { id: "step_objective_verification" }
  ],
  buyer: [
    { id: "buyer_preference" },
    { id: "buyer_benefit" },
    { id: "readiness_evidence" },
    { id: "value_evidence" },
    { id: "resolution_details" },
    { id: "stall_reason" },
    { id: "stall_confidence" }
  ],
  improve: [
    { id: "testing_verification" }
  ],
  execution: [
    { id: "execution_exposures" },
    { id: "additional_context" }
  ]
};

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

function walkQuestion(question, stage, found) {
  if (!question) return;

  found.push({
    ...question,
    stage: question.stage || stage
  });

  if (question.followUp) {
    walkQuestion(
      question.followUp,
      question.stage || stage,
      found
    );
  }

  if (question.nextFollowUp) {
    walkQuestion(
      question.nextFollowUp,
      question.stage || stage,
      found
    );
  }
}

function allQuestionDefinitions() {
  const found = [];

  questions.forEach((question) => {
    walkQuestion(question, question.stage, found);
  });

  return found;
}

const questionIndex = new Map(
  allQuestionDefinitions().map((question) => [
    question.id,
    question
  ])
);

export function getQuestionById(id) {
  return questionIndex.get(id) || null;
}

export function getCoreFlow() {
  return coreScreenDefinitions
    .map(({ questionId }) =>
      getQuestionById(questionId)
    )
    .filter(Boolean);
}

export function getCoreEmbeddedQuestions(questionId) {
  const definition = coreScreenDefinitions.find(
    (item) => item.questionId === questionId
  );

  if (!definition) return [];

  return definition.embedded
    .map((id) => getQuestionById(id))
    .filter(Boolean);
}

export function getCoreFollowUps(
  questionSet,
  answers
) {
  const followUps = [];

  questionSet.forEach((question) => {
    const followUp = question.followUp;

    if (
      followUp &&
      coreFollowUpIds.has(followUp.id) &&
      followUp.when(answers)
    ) {
      followUps.push({
        ...followUp,
        stage: question.stage
      });
    }
  });

  return followUps;
}

function deepDiveQuestionApplies(
  question,
  answers
) {
  if (!question) return false;

  if (question.id === "source_objective_verification") {
    return [
      "Yes, for each important source",
      "For the most important sources"
    ].includes(answers.source_objectives);
  }

  if (question.id === "source_evidence_verification") {
    return [
      "Yes, we track meaningful results for each important source",
      "We track results for some sources"
    ].includes(answers.source_evidence);
  }

  if (question.id === "step_objective_verification") {
    return [
      "Yes, for essentially every important step",
      "For some steps"
    ].includes(answers.step_objectives);
  }

  if (question.id === "value_evidence") {
    return (
      answers.buyer_value ===
      "We deliberately establish and verify perceived value"
    );
  }

  if (question.id === "resolution_details") {
    return [
      "We deliberately identify and resolve remaining issues",
      "We usually address them, but the approach varies",
      "We mainly address issues when the buyer raises them",
      "Important issues often emerge late"
    ].includes(answers.resolution);
  }

  if (question.id === "stall_reason") {
    return (
      hasValue(answers.stall_point) &&
      ![
        "There is no noticeable pattern",
        "We don't know"
      ].includes(answers.stall_point)
    );
  }

  if (question.id === "stall_confidence") {
    return hasValue(answers.stall_reason);
  }

  if (question.id === "testing_verification") {
    return (
      answers.testing ===
      "We compare deliberate changes against meaningful evidence"
    );
  }

  if (question.id === "execution_exposures") {
    return [
      "Execution is generally consistent, with some variation",
      "It varies significantly by person or situation",
      "We don't have enough visibility to know"
    ].includes(answers.execution);
  }

  return true;
}

export function getDeepDiveQuestions(
  stageId,
  answers
) {
  const definitions =
    deepDiveDefinitions[stageId] || [];

  return definitions
    .map(({ id }) => getQuestionById(id))
    .filter((question) =>
      deepDiveQuestionApplies(question, answers)
    );
}

function clearQuestionBranch(
  clean,
  question
) {
  if (!question) return;

  delete clean[question.id];

  if (question.followUp) {
    clearQuestionBranch(
      clean,
      question.followUp
    );
  }

  if (question.nextFollowUp) {
    clearQuestionBranch(
      clean,
      question.nextFollowUp
    );
  }
}

export function sanitizeDiagnosticAnswers(
  answers
) {
  const clean = { ...answers };

  questions.forEach((question) => {
    const followUp = question.followUp;

    if (!followUp) return;

    if (!followUp.when(clean)) {
      clearQuestionBranch(clean, followUp);
      return;
    }

    if (
      followUp.nextFollowUp &&
      !hasValue(clean[followUp.id])
    ) {
      clearQuestionBranch(
        clean,
        followUp.nextFollowUp
      );
    }
  });

  return clean;
}

export function getDeepDiveStatus(
  stageId,
  answers
) {
  const questionsForStage =
    getDeepDiveQuestions(stageId, answers);

  const requiredIds = [];

  questionsForStage.forEach((question) => {
    requiredIds.push(question.id);

    if (
      question.followUp &&
      question.followUp.when(answers)
    ) {
      requiredIds.push(question.followUp.id);
    }
  });

  const uniqueIds = [...new Set(requiredIds)];

  const answered = uniqueIds.filter((id) =>
    hasValue(answers[id])
  );

  return {
    available: uniqueIds.length,
    answered: answered.length,
    remaining:
      uniqueIds.length - answered.length,
    complete:
      uniqueIds.length > 0 &&
      answered.length === uniqueIds.length
  };
}
