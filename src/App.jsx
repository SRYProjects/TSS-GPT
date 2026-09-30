import React, { useEffect, useMemo, useState } from "react";
import { stages } from "./diagnosticConfig";
import { buildDiagnostic } from "./diagnosticEngine";
import {
  deepDiveMeta,
  getCoreEmbeddedQuestions,
  getCoreFlow,
  getCoreFollowUps,
  getDeepDiveQuestions,
  getDeepDiveStatus
} from "./diagnosticExperience";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;

  if (value && typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

function getDynamicOptions(question, answers) {
  const source = answers[question.sourceAnswer];

  const sourceOptions = Array.isArray(source) ? source : [];
  const additional = question.additionalOptions || [];

  return [...sourceOptions, ...additional];
}

function getImportantSources(answers) {
  if (Array.isArray(answers.top_sources)) {
    const usable = answers.top_sources.filter(
      (item) => item !== "We don't know which contribute most"
    );

    if (usable.length > 0) return usable;
  }

  if (Array.isArray(answers.sales_sources)) {
    return answers.sales_sources.filter(
      (item) =>
        item !== "Not sure" &&
        item !== "Other"
    );
  }

  return [];
}

function getImportantSteps(answers) {
  if (Array.isArray(answers.process_steps)) {
    return answers.process_steps;
  }

  return [];
}

function getVerificationSteps(answers) {
  const steps = getImportantSteps(answers);

  if (steps.length <= 3) return steps;

  const preferredPatterns = [
    "qualification",
    "needs",
    "situation",
    "meeting",
    "consultation",
    "demonstration",
    "presentation",
    "estimate",
    "quote",
    "proposal",
    "negotiation",
    "contract",
    "agreement"
  ];

  const selected = [];

  preferredPatterns.forEach((pattern) => {
    const match = steps.find(
      (step) =>
        step.toLowerCase().includes(pattern) &&
        !selected.includes(step)
    );

    if (match && selected.length < 3) {
      selected.push(match);
    }
  });

  steps.forEach((step) => {
    if (
      selected.length < 3 &&
      !selected.includes(step)
    ) {
      selected.push(step);
    }
  });

  return selected;
}

function getStepOutcomeOptions(step) {
  const normalized = step.toLowerCase();

  if (
    normalized.includes("meeting") ||
    normalized.includes("consultation")
  ) {
    return [
      "Understand the buyer's situation",
      "Determine fit",
      "Establish meaningful interest",
      "Identify decision participants",
      "Agree on the next step",
      "Other defined result"
    ];
  }

  if (
    normalized.includes("demonstration") ||
    normalized.includes("presentation")
  ) {
    return [
      "Address the buyer's need",
      "Establish preference",
      "Demonstrate capability or expected results",
      "Resolve important questions",
      "Secure a meaningful next step",
      "Other defined result"
    ];
  }

  if (
    normalized.includes("proposal") ||
    normalized.includes("estimate") ||
    normalized.includes("quote")
  ) {
    return [
      "Enable the buyer to evaluate the offer",
      "Establish scope and price",
      "Obtain approval",
      "Begin or advance negotiation",
      "Secure a meaningful next step",
      "Other defined result"
    ];
  }

  if (normalized.includes("qualification")) {
    return [
      "Determine whether the opportunity is a fit",
      "Confirm a meaningful need or requirement",
      "Determine buying potential",
      "Identify who is involved in the decision",
      "Agree on the next step",
      "Other defined result"
    ];
  }

  if (
    normalized.includes("needs") ||
    normalized.includes("situation")
  ) {
    return [
      "Understand the buyer's situation",
      "Identify important needs or requirements",
      "Understand desired results",
      "Identify barriers or concerns",
      "Agree on the next step",
      "Other defined result"
    ];
  }

  if (normalized.includes("negotiation")) {
    return [
      "Resolve remaining commercial issues",
      "Reach acceptable terms",
      "Resolve objections or concerns",
      "Confirm willingness to proceed",
      "Other defined result"
    ];
  }

  if (
    normalized.includes("contract") ||
    normalized.includes("agreement")
  ) {
    return [
      "Resolve remaining agreement issues",
      "Obtain final approval",
      "Secure commitment",
      "Establish implementation or next steps",
      "Other defined result"
    ];
  }

  if (
    normalized.includes("follow-up") ||
    normalized.includes("nurturing")
  ) {
    return [
      "Maintain meaningful engagement",
      "Advance the buying decision",
      "Resolve an outstanding issue",
      "Secure a meaningful next step",
      "Other defined result"
    ];
  }

  return [
    "Create a specific buyer response",
    "Establish or confirm fit",
    "Advance the opportunity",
    "Resolve an important issue",
    "Secure a meaningful next step",
    "Other defined result"
  ];
}

function buildQuestionFlow() {
  return getCoreFlow().map((question) => ({
    ...question,
    parentId: null
  }));
}

function getActiveFollowUps(question, answers) {
  const followUps = [];

  if (
    question.followUp &&
    question.followUp.when(answers)
  ) {
    followUps.push(question.followUp);

    if (
      question.followUp.nextFollowUp &&
      hasValue(answers[question.followUp.id])
    ) {
      followUps.push(
        question.followUp.nextFollowUp
      );
    }
  }

  return followUps;
}

function getProgressPercent(currentIndex) {
  if (currentIndex < 0) return 0;

  return Math.round(
    ((currentIndex + 1) / getCoreFlow().length) * 100
  );
}

function getSectionFeedback(stageId, answers) {
  const importantSources = getImportantSources(answers);
  const processSteps = getImportantSteps(answers);

  if (stageId === "business") {
    const scope =
      answers.assessment_scope ===
        "Our overall sales operation"
        ? "your overall sales operation"
        : answers.assessment_scope_detail ||
          "the part of the sales operation you selected";

    return {
      kicker: "Scope established",
      title: "SAGE knows what it is examining.",
      text: `The review is focused on ${scope}. Next, SAGE maps where sales opportunities come from and what those activities are expected to produce.`
    };
  }

  if (stageId === "begin") {
    const sourceText = importantSources.length
      ? importantSources.join(", ")
      : "your reported opportunity sources";

    const evidenceText =
      answers.source_evidence ===
      "We don't really know"
        ? "The evidence behind source performance is currently unclear."
        : answers.source_evidence ===
            "We rely mostly on experience or judgment"
          ? "Source performance currently relies more on judgment than recorded evidence."
          : "SAGE has also captured how source performance is evaluated.";

    return {
      kicker: "Opportunity picture mapped",
      title: "SAGE can now see how sales begin.",
      text: `The most important sources currently identified are ${sourceText}. ${evidenceText} Next, SAGE follows what happens after a buyer engages.`
    };
  }

  if (stageId === "move") {
    const processText = processSteps.length
      ? `${processSteps.length} major process steps are now mapped.`
      : "The major process path is not yet clearly established.";

    const outcomeText =
      answers.step_objectives ===
      "Yes, for essentially every important step"
        ? "You report defined outcomes across the important steps."
        : answers.step_objectives === "For some steps"
          ? "Defined outcomes exist for only part of the process."
          : "The answers indicate that advancement outcomes are not fully defined.";

    return {
      kicker: "Sales path mapped",
      title: "SAGE can now see how opportunities move.",
      text: `${processText} ${outcomeText} Next, the review looks at what must happen in the buyer's decision process.`
    };
  }

  if (stageId === "buyer") {
    const stallText =
      answers.stall_point === "We don't know"
        ? "Where promising opportunities break down is currently unknown."
        : answers.stall_point ===
            "There is no noticeable pattern"
          ? "You reported no consistent breakdown point."
          : hasValue(answers.stall_point)
            ? `You identified ${answers.stall_point} as an important point where opportunities can slow or stop.`
            : "SAGE has captured how buyers progress toward a decision.";

    return {
      kicker: "Buyer progression mapped",
      title: "The buyer side of the system is now visible.",
      text: `${stallText} Next, SAGE looks at how the business learns from weak results and tests changes.`
    };
  }

  if (stageId === "improve") {
    const testText =
      answers.testing ===
      "We compare deliberate changes against meaningful evidence"
        ? "You report a deliberate evidence-based approach to important sales changes."
        : answers.testing ===
            "We rarely test changes in a structured way"
          ? "Structured testing of sales changes is currently limited."
          : "SAGE has captured how sales changes are evaluated.";

    return {
      kicker: "Improvement discipline mapped",
      title: "SAGE can now see how the system learns.",
      text: `${testText} One final section checks whether the sales approach is consistently executed.`
    };
  }

  return null;
}

function getStageIndex(stageId) {
  return stages.findIndex((stage) => stage.id === stageId);
}

function cleanReportFinding(item) {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    support: item.support,
    why: item.why,
    direction: item.direction,
    improvementEvidence: item.improvementEvidence,
    guideTopic: item.guideTopic
  };
}

// --------------------------------------------------
// HEADER
// --------------------------------------------------

function Header({ onHome }) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="brand-button"
        onClick={onHome}
        aria-label="SAGE home"
      >
        <span className="brand-mark">S</span>

        <span className="brand-copy">
          <strong>SAGE</strong>
          <small>Sales System Guide</small>
        </span>
      </button>
    </header>
  );
}

// --------------------------------------------------
// LANDING VISUAL
// --------------------------------------------------

function SystemVisual() {
  return (
    <div className="system-visual" aria-hidden="true">
      <div className="visual-label">YOUR SALES SYSTEM</div>

      <div className="visual-flow">
        <div className="visual-node">
          <span>Opportunity</span>
        </div>

        <div className="visual-line" />

        <div className="visual-node">
          <span>Process</span>
        </div>

        <div className="visual-line" />

        <div className="visual-node">
          <span>Buyer</span>
        </div>

        <div className="visual-line" />

        <div className="visual-node visual-node-accent">
          <span>Sale</span>
        </div>
      </div>

      <div className="visual-signals">
        <span>Objectives</span>
        <span>Evidence</span>
        <span>Progression</span>
        <span>Execution</span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// LANDING
// --------------------------------------------------

function Landing({ onStart }) {
  return (
    <main className="landing-shell">
      <section className="landing-copy">
        <div className="eyebrow">
          STOP GOING THROUGH THE MOTIONS
        </div>

        <h1>
          Improve your sales by improving how you sell.
        </h1>

        <p className="landing-lead">
          You already have a sales system. SAGE helps you
          understand it, see what's working, uncover what's
          missing, and determine where improvement matters.
        </p>

        <p className="landing-statement">
          The sales success you want starts with how you sell.
        </p>

        <button
          type="button"
          className="primary-button landing-cta"
          onClick={onStart}
        >
          Get Started
        </button>

        <div className="landing-note">
          Free Sales System Review · No CRM connection required
        </div>
      </section>

      <section className="landing-visual">
        <SystemVisual />
      </section>
    </main>
  );
}

// --------------------------------------------------
// INTRO
// --------------------------------------------------

function Intro({ onContinue, onBack }) {
  return (
    <main className="intro-shell">
      <section className="intro-card">
        <div className="eyebrow">
          LET'S LOOK AT HOW YOU SELL
        </div>

        <h1>First, let's make your sales system visible.</h1>

        <p>
          SAGE will ask about how sales begin, how opportunities
          move, how buyers progress, how you determine what is
          working, and how consistently the system is executed.
        </p>

        <p>
          Some answers may trigger a short follow-up. Those
          follow-ups help distinguish established practices from
          assumptions, uncertainty, or incomplete information.
        </p>

        <div className="intro-promise">
          No reports to upload. No CRM access. No spreadsheets.
        </div>

        <div className="question-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onContinue}
          >
            Begin Review
          </button>
        </div>
      </section>
    </main>
  );
}

// --------------------------------------------------
// PROGRESS
// --------------------------------------------------

function StageProgress({
  currentStage,
  progressPercent
}) {
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="stage-progress">
      <div className="overall-progress">
        <div className="overall-progress-copy">
          <span>
            Section {currentIndex + 1} of {stages.length}
          </span>
          <strong>{progressPercent}% complete</strong>
        </div>

        <div
          className="overall-progress-track"
          aria-label={`${progressPercent}% complete`}
        >
          <div
            className="overall-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="stage-progress-row">
        {stages.map((stage, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={stage.id}
              className={[
                "stage-item",
                complete ? "complete" : "",
                active ? "active" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="stage-dot">
                {complete ? "✓" : index + 1}
              </div>

              <div className="stage-label">
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------------------------------------------
// STANDARD ANSWERS
// --------------------------------------------------

function SingleAnswer({
  question,
  value,
  onChange
}) {
  const options =
    question.type === "dynamicSingle"
      ? question.dynamicOptions
      : question.options || [];

  return (
    <div className="answer-list">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={`answer-option ${
            value === option ? "selected" : ""
          }`}
          onClick={() => onChange(option)}
        >
          <span className="answer-control">
            {value === option ? "●" : "○"}
          </span>

          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}

function MultiAnswer({
  question,
  value = [],
  onChange
}) {
  const options = question.options || [];
  const selected = Array.isArray(value) ? value : [];

  function toggle(option) {
    const isSelected = selected.includes(option);

    if (isSelected) {
      onChange(
        selected.filter((item) => item !== option)
      );
      return;
    }

    if (
      question.maxSelections &&
      selected.length >= question.maxSelections
    ) {
      return;
    }

    onChange([...selected, option]);
  }

  return (
    <>
      <div className="answer-list">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          const maxReached =
            question.maxSelections &&
            selected.length >= question.maxSelections &&
            !isSelected;

          return (
            <button
              type="button"
              key={option}
              className={`answer-option ${
                isSelected ? "selected" : ""
              }`}
              disabled={maxReached}
              onClick={() => toggle(option)}
            >
              <span className="answer-control">
                {isSelected ? "✓" : "□"}
              </span>

              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {question.maxSelections && (
        <div className="selection-note">
          {selected.length} of {question.maxSelections} selected
        </div>
      )}
    </>
  );
}

function DynamicMultiAnswer({
  question,
  value = [],
  onChange
}) {
  const selected = Array.isArray(value) ? value : [];
  const options = question.dynamicOptions || [];

  function toggle(option) {
    const isSelected = selected.includes(option);

    if (isSelected) {
      onChange(
        selected.filter((item) => item !== option)
      );
      return;
    }

    if (
      question.maxSelections &&
      selected.length >= question.maxSelections
    ) {
      return;
    }

    onChange([...selected, option]);
  }

  return (
    <>
      <div className="answer-list">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          const maxReached =
            question.maxSelections &&
            selected.length >= question.maxSelections &&
            !isSelected;

          return (
            <button
              type="button"
              key={option}
              className={`answer-option ${
                isSelected ? "selected" : ""
              }`}
              disabled={maxReached}
              onClick={() => toggle(option)}
            >
              <span className="answer-control">
                {isSelected ? "✓" : "□"}
              </span>

              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <div className="selection-note">
        Choose up to {question.maxSelections}.
      </div>
    </>
  );
}

// --------------------------------------------------
// TEXT ANSWERS
// --------------------------------------------------

function TextAnswer({
  value = "",
  onChange,
  textarea = false
}) {
  if (textarea) {
    return (
      <textarea
        className="text-answer textarea-answer"
        value={value}
        rows={5}
        maxLength={700}
        placeholder="Type your answer here..."
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    );
  }

  return (
    <input
      className="text-answer"
      type="text"
      value={value}
      maxLength={250}
      placeholder="Type your answer here..."
      onChange={(event) =>
        onChange(event.target.value)
      }
    />
  );
}

// --------------------------------------------------
// SOURCE OUTCOME MAP
// --------------------------------------------------

function SourceOutcomeMap({
  answers,
  value = {},
  onChange,
  options
}) {
  const sources = getImportantSources(answers);
  const current =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};

  function setOutcome(source, outcome) {
    onChange({
      ...current,
      [source]: outcome
    });
  }

  if (sources.length === 0) {
    return (
      <div className="inline-notice">
        No specific source was identified earlier.
      </div>
    );
  }

  return (
    <div className="mapping-list">
      {sources.map((source) => (
        <div className="mapping-card" key={source}>
          <div className="mapping-title">{source}</div>

          <div className="mapping-options">
            {options.map((option) => (
              <button
                type="button"
                key={option}
                className={`mapping-option ${
                  current[source] === option
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setOutcome(source, option)
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --------------------------------------------------
// STEP OUTCOME MAP
// --------------------------------------------------

function StepOutcomeMap({
  answers,
  value = {},
  onChange
}) {
  const steps = getVerificationSteps(answers);

  const current =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};

  function setOutcome(step, outcome) {
    onChange({
      ...current,
      [step]: outcome
    });
  }

  return (
    <div className="mapping-list">
      {steps.map((step) => {
        const options = getStepOutcomeOptions(step);

        return (
          <div className="mapping-card" key={step}>
            <div className="mapping-title">{step}</div>

            <div className="mapping-options">
              {options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`mapping-option ${
                    current[step] === option
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setOutcome(step, option)
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --------------------------------------------------
// ORDERING
// --------------------------------------------------

function OrderAnswer({
  question,
  answers,
  value,
  onChange
}) {
  const original = Array.isArray(
    answers[question.sourceAnswer]
  )
    ? answers[question.sourceAnswer]
    : [];

  const isSpecial =
    typeof value === "string" &&
    (question.additionalOptions || []).includes(value);

  const ordered =
    Array.isArray(value) &&
    value.length === original.length
      ? value
      : original;

  function move(index, direction) {
    const next = [...ordered];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [
      next[target],
      next[index]
    ];

    onChange(next);
  }

  function useOrderedSteps() {
    onChange([...original]);
  }

  return (
    <div className="order-shell">
      <button
        type="button"
        className={`order-mode ${
          !isSpecial ? "selected" : ""
        }`}
        onClick={useOrderedSteps}
      >
        These steps usually follow an identifiable order
      </button>

      {!isSpecial && (
        <div className="order-list">
          {ordered.map((step, index) => (
            <div className="order-item" key={step}>
              <div className="order-number">
                {index + 1}
              </div>

              <div className="order-name">{step}</div>

              <div className="order-buttons">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Move ${step} up`}
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === ordered.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${step} down`}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(question.additionalOptions || []).map(
        (option) => (
          <button
            type="button"
            key={option}
            className={`order-mode ${
              value === option ? "selected" : ""
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        )
      )}
    </div>
  );
}

// --------------------------------------------------
// DIFFERENT PATH
// --------------------------------------------------

function DifferentPathAnswer({
  answers,
  value,
  onChange
}) {
  const sources = getImportantSources(answers);

  const current =
    value && typeof value === "object"
      ? value
      : {
          source: "",
          steps: []
        };

  const steps = Array.isArray(current.steps)
    ? current.steps
    : [];

  function selectSource(source) {
    onChange({
      ...current,
      source
    });
  }

  function toggleStep(step) {
    const exists = steps.includes(step);

    onChange({
      ...current,
      steps: exists
        ? steps.filter((item) => item !== step)
        : [...steps, step]
    });
  }

  function moveStep(index, direction) {
    const next = [...steps];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [
      next[target],
      next[index]
    ];

    onChange({
      ...current,
      steps: next
    });
  }

  return (
    <div className="different-path-shell">
      <div className="subquestion-label">
        Source
      </div>

      <div className="answer-list compact">
        {sources.map((source) => (
          <button
            type="button"
            key={source}
            className={`answer-option ${
              current.source === source
                ? "selected"
                : ""
            }`}
            onClick={() => selectSource(source)}
          >
            <span className="answer-control">
              {current.source === source ? "●" : "○"}
            </span>

            <span>{source}</span>
          </button>
        ))}
      </div>

      {current.source && (
        <>
          <div className="subquestion-label">
            Select the major steps in this path
          </div>

          <div className="answer-list compact">
            {getImportantSteps(answers).map((step) => (
              <button
                type="button"
                key={step}
                className={`answer-option ${
                  steps.includes(step)
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleStep(step)}
              >
                <span className="answer-control">
                  {steps.includes(step) ? "✓" : "□"}
                </span>

                <span>{step}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {steps.length > 1 && (
        <>
          <div className="subquestion-label">
            Put those steps in their usual order
          </div>

          <div className="order-list">
            {steps.map((step, index) => (
              <div className="order-item" key={step}>
                <div className="order-number">
                  {index + 1}
                </div>

                <div className="order-name">{step}</div>

                <div className="order-buttons">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      moveStep(index, -1)
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === steps.length - 1
                    }
                    onClick={() =>
                      moveStep(index, 1)
                    }
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --------------------------------------------------
// ANSWER ROUTER
// --------------------------------------------------

function AnswerInput({
  question,
  answers,
  value,
  onChange
}) {
  if (
    question.type === "single" ||
    question.type === "dynamicSingle"
  ) {
    return (
      <SingleAnswer
        question={question}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "multi") {
    return (
      <MultiAnswer
        question={question}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "dynamicMulti") {
    return (
      <DynamicMultiAnswer
        question={question}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "text") {
    return (
      <TextAnswer
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "textarea") {
    return (
      <TextAnswer
        value={value}
        onChange={onChange}
        textarea
      />
    );
  }

  if (question.type === "sourceOutcomeMap") {
    return (
      <SourceOutcomeMap
        answers={answers}
        value={value}
        onChange={onChange}
        options={question.options || []}
      />
    );
  }

  if (question.type === "stepOutcomeMap") {
    return (
      <StepOutcomeMap
        answers={answers}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "order") {
    return (
      <OrderAnswer
        question={question}
        answers={answers}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.type === "differentPath") {
    return (
      <DifferentPathAnswer
        answers={answers}
        value={value}
        onChange={onChange}
      />
    );
  }

  return null;
}

// --------------------------------------------------
// QUESTION VALIDATION
// --------------------------------------------------

function questionComplete(question, value, answers) {
  if (question.optional) return true;

  if (!hasValue(value)) return false;

  if (question.type === "sourceOutcomeMap") {
    const sources = getImportantSources(answers);

    return sources.every(
      (source) =>
        value &&
        typeof value === "object" &&
        hasValue(value[source])
    );
  }

  if (question.type === "stepOutcomeMap") {
    const steps = getVerificationSteps(answers);

    return steps.every(
      (step) =>
        value &&
        typeof value === "object" &&
        hasValue(value[step])
    );
  }

  if (question.type === "differentPath") {
    return Boolean(
      value &&
      value.source &&
      Array.isArray(value.steps) &&
      value.steps.length > 0
    );
  }

  return true;
}

// --------------------------------------------------
// QUESTION SCREEN
// --------------------------------------------------

function SectionFeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="section-feedback">
      <div className="section-feedback-icon">✓</div>

      <div>
        <div className="section-feedback-kicker">
          {feedback.kicker}
        </div>

        <h3>{feedback.title}</h3>
        <p>{feedback.text}</p>
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  answers,
  onAnswer,
  onNext,
  onBack,
  progressPercent,
  sectionFeedback
}) {
  const value = answers[question.id];

  const embeddedQuestions =
    getCoreEmbeddedQuestions(question.id);

  const questionSet = [
    question,
    ...embeddedQuestions
  ];

  const followUps = getCoreFollowUps(
    questionSet,
    answers
  );

  const primaryComplete = questionSet.every(
    (item) =>
      questionComplete(
        item,
        answers[item.id],
        answers
      )
  );

  const followUpsComplete = followUps.every(
    (followUp) =>
      questionComplete(
        followUp,
        answers[followUp.id],
        answers
      )
  );

  const complete =
    primaryComplete && followUpsComplete;

  const stage =
    stages.find(
      (item) => item.id === question.stage
    ) || stages[0];

  return (
    <main className="question-shell">
      <StageProgress
        currentStage={question.stage}
        progressPercent={progressPercent}
      />

      <div className="question-layout">
        <aside className="question-meta">
          <div className="question-section">
            {stage.label}
          </div>

          <div className="section-rule" />

          <p>
            SAGE is building your sales-system picture as
            you go. Follow-up questions appear only when
            they help verify or clarify an answer.
          </p>
        </aside>

        <section className="question-panel">
          {sectionFeedback && (
            <SectionFeedbackCard
              feedback={sectionFeedback}
            />
          )}

          <h1>{question.title}</h1>

          {question.help && (
            <p className="question-help">
              {question.help}
            </p>
          )}

          <AnswerInput
            question={question}
            answers={answers}
            value={value}
            onChange={(newValue) =>
              onAnswer(question.id, newValue)
            }
          />

          {questionComplete(
            question,
            value,
            answers
          ) &&
            embeddedQuestions.map(
              (embeddedQuestion) => {
                const enhancedEmbedded = {
                  ...embeddedQuestion
                };

                if (
                  embeddedQuestion.type ===
                    "dynamicMulti" ||
                  embeddedQuestion.type ===
                    "dynamicSingle"
                ) {
                  enhancedEmbedded.dynamicOptions =
                    getDynamicOptions(
                      embeddedQuestion,
                      answers
                    );
                }

                return (
                  <div
                    className="inline-followup embedded-question"
                    key={embeddedQuestion.id}
                  >
                    <div className="inline-followup-label">
                      Next
                    </div>

                    <h2>
                      {embeddedQuestion.title}
                    </h2>

                    {embeddedQuestion.help && (
                      <p className="question-help">
                        {embeddedQuestion.help}
                      </p>
                    )}

                    <AnswerInput
                      question={enhancedEmbedded}
                      answers={answers}
                      value={
                        answers[
                          embeddedQuestion.id
                        ]
                      }
                      onChange={(newValue) =>
                        onAnswer(
                          embeddedQuestion.id,
                          newValue
                        )
                      }
                    />
                  </div>
                );
              }
            )}

          {followUps.map((followUp) => {
              const enhancedFollowUp = {
                ...followUp,
                stage: question.stage
              };

              return (
                <div
                  className="inline-followup"
                  key={followUp.id}
                >
                  <div className="inline-followup-label">
                    Quick follow-up
                  </div>

                  <h2>{followUp.title}</h2>

                  {followUp.help && (
                    <p className="question-help">
                      {followUp.help}
                    </p>
                  )}

                  <AnswerInput
                    question={enhancedFollowUp}
                    answers={answers}
                    value={answers[followUp.id]}
                    onChange={(newValue) =>
                      onAnswer(
                        followUp.id,
                        newValue
                      )
                    }
                  />
                </div>
              );
            })}

          <div className="question-actions">
            <button
              type="button"
              className="back-button"
              onClick={onBack}
            >
              Back
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={!complete}
              onClick={onNext}
            >
              Continue
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// --------------------------------------------------
// SECTION CHECKPOINT + OPTIONAL DEPTH
// --------------------------------------------------

function SectionReviewScreen({
  stageId,
  answers,
  onContinue,
  onGoDeeper,
  onBack
}) {
  const stage =
    stages.find((item) => item.id === stageId) ||
    stages[0];

  const feedback =
    getSectionFeedback(stageId, answers);

  const meta = deepDiveMeta[stageId];
  const depth = getDeepDiveStatus(
    stageId,
    answers
  );

  return (
    <main className="checkpoint-shell">
      <section className="checkpoint-card">
        <div className="checkpoint-complete">
          <span>✓</span>
          Section complete
        </div>

        <div className="eyebrow">
          {stage.label}
        </div>

        <h1>
          {feedback?.title ||
            "This part of your sales system is mapped."}
        </h1>

        <p className="checkpoint-summary">
          {feedback?.text ||
            "SAGE has enough information to continue the Core Review."}
        </p>

        {meta && depth.available > 0 && (
          <div className="depth-choice">
            <div className="depth-choice-copy">
              <div className="depth-label">
                OPTIONAL DEEP DIVE
              </div>

              <h2>{meta.title}</h2>
              <p>{meta.description}</p>

              <div className="depth-value">
                {depth.complete
                  ? "Additional evidence added to this area."
                  : depth.remaining +
                    " optional " +
                    (depth.remaining === 1
                      ? "question"
                      : "questions") +
                    " can make this part of your diagnostic more specific."}
              </div>
            </div>

            {!depth.complete && (
              <button
                type="button"
                className="secondary-accent-button"
                onClick={onGoDeeper}
              >
                Go deeper in this area
              </button>
            )}
          </div>
        )}

        <div className="checkpoint-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onContinue}
          >
            Continue Core Review
          </button>
        </div>
      </section>
    </main>
  );
}

function DeepDiveScreen({
  question,
  answers,
  value,
  onAnswer,
  onNext,
  onFinish,
  index,
  total,
  meta
}) {
  const followUps =
    getActiveFollowUps(question, answers);

  const primaryComplete = questionComplete(
    question,
    value,
    answers
  );

  const followUpsComplete = followUps.every(
    (followUp) =>
      questionComplete(
        followUp,
        answers[followUp.id],
        answers
      )
  );

  const complete =
    primaryComplete && followUpsComplete;

  return (
    <main className="deep-dive-shell">
      <section className="deep-dive-card">
        <div className="deep-dive-topline">
          <div>
            <div className="depth-label">
              OPTIONAL DEEP DIVE
            </div>
            <div className="deep-dive-area">
              {meta?.label || "Additional evidence"}
            </div>
          </div>

          <div className="deep-dive-count">
            {index + 1} of {total}
          </div>
        </div>

        <h1>{question.title}</h1>

        {question.help && (
          <p className="question-help">
            {question.help}
          </p>
        )}

        <AnswerInput
          question={question}
          answers={answers}
          value={value}
          onChange={(newValue) =>
            onAnswer(question.id, newValue)
          }
        />

        {primaryComplete &&
          followUps.map((followUp) => (
            <div
              className="inline-followup"
              key={followUp.id}
            >
              <div className="inline-followup-label">
                Add supporting evidence
              </div>

              <h2>{followUp.title}</h2>

              {followUp.help && (
                <p className="question-help">
                  {followUp.help}
                </p>
              )}

              <AnswerInput
                question={{
                  ...followUp,
                  stage: question.stage
                }}
                answers={answers}
                value={answers[followUp.id]}
                onChange={(newValue) =>
                  onAnswer(
                    followUp.id,
                    newValue
                  )
                }
              />
            </div>
          ))}

        <div className="deep-dive-note">
          This is optional. You can return to the Core Review
          at any time; unanswered depth is not treated as a
          weakness.
        </div>

        <div className="checkpoint-actions">
          <button
            type="button"
            className="back-button"
            onClick={onFinish}
          >
            Return to Core Review
          </button>

          <button
            type="button"
            className="primary-button"
            disabled={!complete}
            onClick={onNext}
          >
            {index + 1 < total
              ? "Continue Deep Dive"
              : "Finish Deep Dive"}
          </button>
        </div>
      </section>
    </main>
  );
}

// --------------------------------------------------
// COMPLETE SCREEN
// --------------------------------------------------

function CompleteScreen({
  onViewReport,
  onBack
}) {
  return (
    <main className="complete-shell">
      <section className="complete-card">
        <div className="eyebrow">
          REVIEW COMPLETE
        </div>

        <h1>
          Now let's make sense of how you sell.
        </h1>

        <p>
          SAGE has reconstructed the major parts of your
          sales system and compared your answers across the
          review.
        </p>

        <p>
          Your diagnostic distinguishes supported strengths
          from incomplete, disconnected, unverified, unknown,
          performance-related, and execution-related issues.
        </p>

        <div className="question-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onViewReport}
          >
            See My Sales System Diagnostic
          </button>
        </div>
      </section>
    </main>
  );
}

// --------------------------------------------------
// REPORT COMPONENTS
// --------------------------------------------------

function FindingCard({ finding, priority = false }) {
  const clean = cleanReportFinding(finding);

  return (
    <article
      className={`finding-card ${
        priority ? "priority-finding" : ""
      }`}
    >
      <div className="finding-topline">
        <span className="finding-type">
          {clean.type}
        </span>

        {priority && (
          <span className="priority-label">
            Priority
          </span>
        )}
      </div>

      <h3>{clean.title}</h3>

      {clean.support && (
        <div className="finding-block">
          <strong>What we found</strong>
          <p>{clean.support}</p>
        </div>
      )}

      {clean.why && (
        <div className="finding-block">
          <strong>Why it matters</strong>
          <p>{clean.why}</p>
        </div>
      )}

      {clean.direction && (
        <div className="finding-block">
          <strong>Direction</strong>
          <p>{clean.direction}</p>
        </div>
      )}

      {clean.improvementEvidence && (
        <div className="finding-block">
          <strong>Evidence of improvement</strong>
          <p>{clean.improvementEvidence}</p>
        </div>
      )}

      {clean.guideTopic && (
        <div className="guide-reference">
          Cross-Through Guide: {clean.guideTopic}
        </div>
      )}
    </article>
  );
}

function CurrentSystemSection({ system }) {
  return (
    <section className="report-section">
      <div className="report-section-number">01</div>

      <div className="report-section-content">
        <div className="eyebrow">
          YOUR CURRENT SALES SYSTEM
        </div>

        <h2>How your sales operation currently works</h2>

        <div className="system-summary-grid">
          <div className="summary-card">
            <span>Assessment</span>
            <strong>
              {system.scope || "Sales operation"}
            </strong>
          </div>

          <div className="summary-card">
            <span>Primary buyer</span>
            <strong>
              {system.buyerType || "Not established"}
            </strong>
          </div>

          <div className="summary-card">
            <span>Important opportunity sources</span>
            <strong>
              {system.importantSources?.length
                ? system.importantSources.join(", ")
                : system.sources?.length
                  ? system.sources.join(", ")
                  : "Not established"}
            </strong>
          </div>

          <div className="summary-card">
            <span>Process clarity</span>
            <strong>
              {system.processClarity ||
                "Not established"}
            </strong>
          </div>
        </div>

        {system.processSteps?.length > 0 && (
          <div className="sales-path">
            <div className="sales-path-label">
              Major sales path
            </div>

            <div className="sales-path-steps">
              {system.processSteps.map(
                (step, index) => (
                  <React.Fragment key={`${step}-${index}`}>
                    <div className="sales-path-step">
                      <span>{index + 1}</span>
                      {step}
                    </div>

                    {index <
                      system.processSteps.length - 1 && (
                      <div className="sales-path-arrow">
                        →
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        )}

        {system.stallPoint && (
          <div className="system-observation">
            <strong>
              Reported opportunity breakdown:
            </strong>{" "}
            {system.stallPoint}
          </div>
        )}
      </div>
    </section>
  );
}

function StrengthsSection({ strengths }) {
  return (
    <section className="report-section">
      <div className="report-section-number">02</div>

      <div className="report-section-content">
        <div className="eyebrow">
          WHAT APPEARS SOLID
        </div>

        <h2>
          Practices supported by your answers
        </h2>

        {strengths.length === 0 ? (
          <div className="report-empty">
            The review did not establish a practice strongly
            enough to classify it as solid from the information
            provided. That does not mean strengths do not exist;
            it means SAGE did not receive enough supporting
            evidence to establish them here.
          </div>
        ) : (
          <div className="finding-grid">
            {strengths.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AttentionSection({ findings }) {
  return (
    <section className="report-section">
      <div className="report-section-number">03</div>

      <div className="report-section-content">
        <div className="eyebrow">
          WHAT NEEDS ATTENTION
        </div>

        <h2>
          Conditions that deserve examination
        </h2>

        {findings.length === 0 ? (
          <div className="report-empty">
            This review did not identify a material issue that
            can be supported by your answers. Continue verifying
            performance as conditions change rather than assuming
            the system will remain effective.
          </div>
        ) : (
          <div className="finding-grid">
            {findings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PrioritySection({ findings }) {
  return (
    <section className="report-section">
      <div className="report-section-number">04</div>

      <div className="report-section-content">
        <div className="eyebrow">
          HIGHEST-PRIORITY FINDINGS
        </div>

        <h2>
          Where attention matters most
        </h2>

        {findings.length === 0 ? (
          <div className="report-empty">
            No priority deficiency was established from this
            review. The appropriate next step is continued
            verification rather than manufacturing a corrective
            action.
          </div>
        ) : (
          <div className="priority-list">
            {findings.map((finding, index) => (
              <div
                className="priority-wrapper"
                key={finding.id}
              >
                <div className="priority-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <FindingCard
                  finding={finding}
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BuildPathSection({ buildPath }) {
  return (
    <section className="report-section">
      <div className="report-section-number">05</div>

      <div className="report-section-content">
        <div className="eyebrow">
          YOUR CROSS-THROUGH BUILD PATH
        </div>

        <h2>
          What to work on next
        </h2>

        {buildPath.length === 0 ? (
          <div className="report-empty">
            SAGE did not establish a corrective build path from
            this review. Maintain the practices you can verify
            and continue testing them against actual results.
          </div>
        ) : (
          <div className="build-path-list">
            {buildPath.map((step, index) => (
              <div
                className="build-path-item"
                key={step.id}
              >
                <div className="build-path-number">
                  {index + 1}
                </div>

                <div>
                  <h3>{step.title}</h3>
                  <p>
                    Cross-Through Guide:{" "}
                    {step.guideTopic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="report-next-step">
          <h3>Two ways forward</h3>

          <p>
            Use the Cross-Through guide with these findings to
            investigate and improve the system internally, or
            get professional help to investigate, design, test,
            implement, and manage the improvements.
          </p>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------
// REPORT
// --------------------------------------------------

function DiagnosticReport({
  diagnostic,
  onRestart
}) {
  return (
    <main className="report-shell">
      <section className="report-hero">
        <div className="eyebrow">
          SAGE SALES SYSTEM DIAGNOSTIC
        </div>

        <h1>Your Sales System Diagnostic</h1>

        <p>
          A structured view of how your business currently
          creates and advances sales, what appears established,
          and where improvement deserves attention.
        </p>
      </section>

      <CurrentSystemSection
        system={diagnostic.currentSystem}
      />

      <StrengthsSection
        strengths={diagnostic.strengths}
      />

      <AttentionSection
        findings={diagnostic.attentionFindings}
      />

      <PrioritySection
        findings={diagnostic.priorityFindings}
      />

      <BuildPathSection
        buildPath={diagnostic.buildPath}
      />

      <div className="report-footer-actions">
        <button
          type="button"
          className="back-button"
          onClick={() => window.print()}
        >
          Print / Save PDF
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={onRestart}
        >
          Start a New Review
        </button>
      </div>
    </main>
  );
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

export default function App() {
  const [screen, setScreen] = useState("landing");

  const [answers, setAnswers] = useState(() => {
    try {
      const saved =
        window.localStorage.getItem(
          "sage-diagnostic-answers"
        );

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentQuestionId, setCurrentQuestionId] =
    useState(null);

  const [history, setHistory] = useState([]);

  const [diagnostic, setDiagnostic] =
    useState(null);

  const [
    sectionReviewStage,
    setSectionReviewStage
  ] = useState(null);

  const [
    reviewFromQuestionId,
    setReviewFromQuestionId
  ] = useState(null);

  const [
    afterSectionReview,
    setAfterSectionReview
  ] = useState(null);

  const [deepDiveStage, setDeepDiveStage] =
    useState(null);

  const [
    deepDiveQuestionId,
    setDeepDiveQuestionId
  ] = useState(null);

  const [deepDiveReturn, setDeepDiveReturn] =
    useState("sectionReview");

  const flow = useMemo(
    () => buildQuestionFlow(),
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "sage-diagnostic-answers",
        JSON.stringify(answers)
      );
    } catch {
      // Continue without local persistence.
    }
  }, [answers]);

  useEffect(() => {
    if (
      screen === "questions" &&
      !currentQuestionId &&
      flow.length > 0
    ) {
      setCurrentQuestionId(flow[0].id);
    }
  }, [
    screen,
    currentQuestionId,
    flow
  ]);

  const currentIndex = flow.findIndex(
    (question) =>
      question.id === currentQuestionId
  );

  const currentQuestion =
    currentIndex >= 0
      ? flow[currentIndex]
      : flow[0];

  function goHome() {
    setScreen("landing");
  }

  function startReview() {
    setScreen("intro");
  }

  function beginQuestions() {
    const first = flow[0];

    if (first) {
      setCurrentQuestionId(first.id);
      setHistory([]);
      setScreen("questions");
    }
  }

  function updateAnswer(id, value) {
    setAnswers((previous) => ({
      ...previous,
      [id]: value
    }));
  }

  function openSectionReview(
    stageId,
    fromQuestionId,
    nextTarget
  ) {
    setSectionReviewStage(stageId);
    setReviewFromQuestionId(fromQuestionId);
    setAfterSectionReview(nextTarget);
    setScreen("sectionReview");
    window.scrollTo(0, 0);
  }

  function nextQuestion() {
    if (!currentQuestion) return;

    const updatedFlow = buildQuestionFlow();

    const index = updatedFlow.findIndex(
      (question) =>
        question.id === currentQuestion.id
    );

    const next = updatedFlow[index + 1];

    setHistory((previous) => [
      ...previous,
      currentQuestion.id
    ]);

    if (
      next &&
      next.stage !== currentQuestion.stage
    ) {
      setCurrentQuestionId(next.id);

      openSectionReview(
        currentQuestion.stage,
        currentQuestion.id,
        next.id
      );
      return;
    }

    if (next) {
      setCurrentQuestionId(next.id);
      window.scrollTo(0, 0);
      return;
    }

    openSectionReview(
      currentQuestion.stage,
      currentQuestion.id,
      "complete"
    );
  }

  function previousQuestion() {
    if (history.length === 0) {
      setScreen("intro");
      window.scrollTo(0, 0);
      return;
    }

    const previousId =
      history[history.length - 1];

    setHistory((previous) =>
      previous.slice(0, -1)
    );

    setCurrentQuestionId(previousId);
    window.scrollTo(0, 0);
  }

  function backFromSectionReview() {
    if (!reviewFromQuestionId) return;

    setHistory((previous) =>
      previous.slice(0, -1)
    );

    setCurrentQuestionId(
      reviewFromQuestionId
    );

    setScreen("questions");
    window.scrollTo(0, 0);
  }

  function continueAfterSectionReview() {
    if (afterSectionReview === "complete") {
      setScreen("complete");
    } else {
      setScreen("questions");
    }

    window.scrollTo(0, 0);
  }

  function startDeepDive(
    stageId,
    returnTarget = "sectionReview"
  ) {
    const deepQuestions =
      getDeepDiveQuestions(stageId, answers);

    if (deepQuestions.length === 0) {
      if (returnTarget === "report") {
        setScreen("report");
      }
      return;
    }

    const firstUnanswered =
      deepQuestions.find(
        (question) =>
          !hasValue(answers[question.id])
      ) || deepQuestions[0];

    setDeepDiveStage(stageId);
    setDeepDiveQuestionId(
      firstUnanswered.id
    );
    setDeepDiveReturn(returnTarget);
    setScreen("deepDive");
    window.scrollTo(0, 0);
  }

  function finishDeepDive() {
    if (deepDiveReturn === "report") {
      const result = buildDiagnostic(answers);
      setDiagnostic(result);
      setScreen("report");
    } else {
      setScreen("sectionReview");
    }

    window.scrollTo(0, 0);
  }

  function nextDeepDiveQuestion() {
    const deepQuestions =
      getDeepDiveQuestions(
        deepDiveStage,
        answers
      );

    const index = deepQuestions.findIndex(
      (question) =>
        question.id === deepDiveQuestionId
    );

    const next = deepQuestions[index + 1];

    if (next) {
      setDeepDiveQuestionId(next.id);
      window.scrollTo(0, 0);
      return;
    }

    finishDeepDive();
  }

  function backFromComplete() {
    const lastId =
      history[history.length - 1];

    if (lastId) {
      setHistory((previous) =>
        previous.slice(0, -1)
      );

      setCurrentQuestionId(lastId);
      setScreen("questions");
      window.scrollTo(0, 0);
    }
  }

  function createDiagnostic() {
    const result = buildDiagnostic(answers);

    setDiagnostic(result);
    setScreen("report");
    window.scrollTo(0, 0);
  }

  function goDeeperFromReport(stageId) {
    startDeepDive(stageId, "report");
  }

  function restart() {
    const confirmed = window.confirm(
      "Start a new review? This will clear your current answers."
    );

    if (!confirmed) return;

    try {
      window.localStorage.removeItem(
        "sage-diagnostic-answers"
      );
    } catch {
      // Continue even if storage is unavailable.
    }

    setAnswers({});
    setHistory([]);
    setCurrentQuestionId(null);
    setDiagnostic(null);
    setSectionReviewStage(null);
    setReviewFromQuestionId(null);
    setAfterSectionReview(null);
    setDeepDiveStage(null);
    setDeepDiveQuestionId(null);
    setDeepDiveReturn("sectionReview");
    setScreen("landing");
    window.scrollTo(0, 0);
  }

  let content = null;

  if (screen === "landing") {
    content = (
      <Landing onStart={startReview} />
    );
  }

  if (screen === "intro") {
    content = (
      <Intro
        onContinue={beginQuestions}
        onBack={() => setScreen("landing")}
      />
    );
  }

  if (
    screen === "questions" &&
    currentQuestion
  ) {
    const enhancedQuestion = {
      ...currentQuestion
    };

    if (
      currentQuestion.type === "dynamicMulti" ||
      currentQuestion.type === "dynamicSingle"
    ) {
      enhancedQuestion.dynamicOptions =
        getDynamicOptions(
          currentQuestion,
          answers
        );
    }

    content = (
      <QuestionScreen
        question={enhancedQuestion}
        answers={answers}
        onAnswer={updateAnswer}
        onNext={nextQuestion}
        onBack={previousQuestion}
        progressPercent={getProgressPercent(
          currentIndex
        )}
      />
    );
  }

  if (
    screen === "sectionReview" &&
    sectionReviewStage
  ) {
    content = (
      <SectionReviewScreen
        stageId={sectionReviewStage}
        answers={answers}
        onContinue={continueAfterSectionReview}
        onGoDeeper={() =>
          startDeepDive(
            sectionReviewStage,
            "sectionReview"
          )
        }
        onBack={backFromSectionReview}
      />
    );
  }

  if (
    screen === "deepDive" &&
    deepDiveStage
  ) {
    const deepQuestions =
      getDeepDiveQuestions(
        deepDiveStage,
        answers
      );

    const deepIndex = Math.max(
      0,
      deepQuestions.findIndex(
        (question) =>
          question.id === deepDiveQuestionId
      )
    );

    const baseQuestion =
      deepQuestions[deepIndex];

    if (baseQuestion) {
      const enhancedDeepQuestion = {
        ...baseQuestion
      };

      if (
        baseQuestion.type === "dynamicMulti" ||
        baseQuestion.type === "dynamicSingle"
      ) {
        enhancedDeepQuestion.dynamicOptions =
          getDynamicOptions(
            baseQuestion,
            answers
          );
      }

      content = (
        <DeepDiveScreen
          question={enhancedDeepQuestion}
          answers={answers}
          value={answers[baseQuestion.id]}
          onAnswer={updateAnswer}
          onNext={nextDeepDiveQuestion}
          onFinish={finishDeepDive}
          index={deepIndex}
          total={deepQuestions.length}
          meta={deepDiveMeta[deepDiveStage]}
        />
      );
    }
  }

  if (screen === "complete") {
    content = (
      <CompleteScreen
        onViewReport={createDiagnostic}
        onBack={backFromComplete}
      />
    );
  }

  if (
    screen === "report" &&
    diagnostic
  ) {
    content = (
      <DiagnosticReport
        diagnostic={diagnostic}
        answers={answers}
        onGoDeeper={goDeeperFromReport}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="app">
      <Header onHome={goHome} />
      {content}
    </div>
  );
}
