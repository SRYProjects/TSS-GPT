import React, { useEffect, useMemo, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import {
  resetReviewId,
  trackEvent
} from "./telemetry";
import {
  CAPABILITY_FIELDS,
  DEEP_DIVE_PERMISSION,
  DISCOVERY_GROUPS,
  QUESTION_BY_ID,
  SECTIONS,
  coreQuestions,
  deepQuestions,
  processStepOptions,
  shouldShowDistinctLines
} from "./sageV2Config";
import {
  buildPlan,
  hypothesisSeed,
  sectionObservation
} from "./sageV2Engine";

const STORAGE_KEY = "sage-cross-through-v2";

const SECTION_FRAMING = {
  foundation:
    "Start with just enough context for the rest of the review to fit your business.",
  awareness:
    "A prospective buyer just heard of you. Walk me through what happens. Every buyer starts here — aware you exist, but not yet paying real attention.",
  alignment:
    "They're paying attention now. What makes them believe you're the better choice? This is where a stranger starts becoming a likely buyer.",
  resolution:
    "They're weighing it up — is this worth what it costs them? Cost isn't only price. Time, effort, and risk count too.",
  decision:
    "They've decided it's worth it. What actually gets them to act? Deciding it's worth it and actually acting aren't the same moment.",
  process:
    "Now map what actually happens when an opportunity moves through your business. The activity itself matters less than what each step needs to produce.",
  execution:
    "A sound sales approach can still fail when the capability or consistency needed to execute it is missing. These are separate questions."
};

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      answers: saved.answers || {},
      sectionIndex: Number.isInteger(saved.sectionIndex) ? saved.sectionIndex : 0,
      visitedSections: Array.isArray(saved.visitedSections) ? saved.visitedSections : [],
      savedFindingIds: Array.isArray(saved.savedFindingIds) ? saved.savedFindingIds : [],
      selectedPriorityId: saved.selectedPriorityId || "",
      hypothesis: saved.hypothesis || null
    };
  } catch {
    return {
      answers: {},
      sectionIndex: 0,
      visitedSections: [],
      savedFindingIds: [],
      selectedPriorityId: "",
      hypothesis: null
    };
  }
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function stateDisplay(state) {
  if (state === "ESTABLISHED") return "Established";
  if (state === "NO VERIFICATION") return "Not verified";
  if (state === "UNKNOWN") return "Unknown";
  return "Not established";
}

function milestoneLabel(status) {
  if (status === "clear") return "Clear";
  if (status === "worth testing") return "Worth testing";
  return "Not yet reached";
}

function sectionStageId(sectionId) {
  return SECTIONS.some((section) => section.id === sectionId)
    ? sectionId
    : "";
}

function toggleMulti(current, option) {
  const values = Array.isArray(current) ? current : [];
  const uncertain = option.includes("not sure") || option.includes("don't know");

  if (uncertain) {
    return values.includes(option) ? [] : [option];
  }

  const withoutUncertainty = values.filter(
    (item) =>
      !item.toLowerCase().includes("not sure") &&
      !item.toLowerCase().includes("don't know")
  );

  return withoutUncertainty.includes(option)
    ? withoutUncertainty.filter((item) => item !== option)
    : [...withoutUncertainty, option];
}

function OptionButton({ active, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`sage-option ${active ? "is-active" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function OtherField({ question, answers, setAnswer }) {
  const value = answers[question.id];
  const selected = Array.isArray(value)
    ? value.includes("Something else")
    : value === "Something else";

  if (!selected) return null;

  return (
    <input
      className="sage-input sage-other-input"
      value={answers[`${question.id}.other`] || ""}
      onChange={(event) =>
        setAnswer(`${question.id}.other`, event.target.value)
      }
      placeholder="Add the answer that's missing from the list"
      aria-label="Something else"
    />
  );
}

function GroupedMultiQuestion({ question, answers, setAnswer }) {
  const selected = Array.isArray(answers[question.id])
    ? answers[question.id]
    : [];

  return (
    <>
      <div className="sage-group-stack">
        {Object.entries(DISCOVERY_GROUPS).map(([groupId, group]) => (
          <div className="sage-option-group" key={groupId}>
            <div className="sage-option-group-title">{group.label}</div>
            <div className="sage-options">
              {group.options.map((option) => (
                <OptionButton
                  key={option}
                  active={selected.includes(option)}
                  onClick={() =>
                    setAnswer(question.id, toggleMulti(selected, option))
                  }
                >
                  {option}
                </OptionButton>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sage-options sage-options-footer">
        {["Something else", "I'm not sure"].map((option) => (
          <OptionButton
            key={option}
            active={selected.includes(option)}
            onClick={() =>
              setAnswer(question.id, toggleMulti(selected, option))
            }
          >
            {option}
          </OptionButton>
        ))}
      </div>

      <OtherField question={question} answers={answers} setAnswer={setAnswer} />
    </>
  );
}

function ProcessStepsQuestion({ question, answers, setAnswer }) {
  const selected = Array.isArray(answers[question.id])
    ? answers[question.id]
    : [];
  const [custom, setCustom] = useState("");
  const baseOptions = processStepOptions(answers);

  function addCustom() {
    const value = custom.trim();
    if (!value) return;
    if (!selected.includes(value)) {
      setAnswer(question.id, [...selected, value]);
    }
    setCustom("");
  }

  return (
    <>
      <div className="sage-options">
        {baseOptions.map((option) => (
          <OptionButton
            key={option}
            active={selected.includes(option)}
            onClick={() =>
              setAnswer(question.id, toggleMulti(selected, option))
            }
          >
            {option}
          </OptionButton>
        ))}
      </div>

      <div className="sage-inline-add">
        <input
          className="sage-input"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add a step that isn't listed"
        />
        <button type="button" className="sage-secondary" onClick={addCustom}>
          Add step
        </button>
      </div>

      {selected.some((item) => !baseOptions.includes(item)) && (
        <div className="sage-custom-list">
          {selected
            .filter((item) => !baseOptions.includes(item))
            .map((item) => (
              <button
                type="button"
                key={item}
                className="sage-custom-chip"
                onClick={() =>
                  setAnswer(
                    question.id,
                    selected.filter((selectedItem) => selectedItem !== item)
                  )
                }
              >
                {item} ×
              </button>
            ))}
        </div>
      )}
    </>
  );
}

function StepObjectivesQuestion({ question, answers, setAnswer }) {
  const steps = Array.isArray(answers["process.steps"])
    ? answers["process.steps"]
    : [];
  const objectives = answers[question.id] || {};

  if (!steps.length) {
    return <p className="sage-muted">Add process steps first.</p>;
  }

  return (
    <div className="sage-objective-list">
      {steps.map((step) => (
        <label className="sage-objective-row" key={step}>
          <span>{step}</span>
          <input
            className="sage-input"
            value={objectives[step] || ""}
            onChange={(event) =>
              setAnswer(question.id, {
                ...objectives,
                [step]: event.target.value
              })
            }
            placeholder="What must happen for the opportunity to keep going?"
          />
        </label>
      ))}
    </div>
  );
}

function CapabilityBreakdownQuestion({ question, answers, setAnswer }) {
  const activities = Array.isArray(answers["execution.activities"])
    ? answers["execution.activities"]
    : [];
  const breakdown = answers[question.id] || {};
  const [activity, setActivity] = useState("");

  function addActivity() {
    const value = activity.trim();
    if (!value || activities.includes(value)) return;
    setAnswer("execution.activities", [...activities, value]);
    setActivity("");
  }

  function updateField(activityName, field, value) {
    setAnswer(question.id, {
      ...breakdown,
      [activityName]: {
        ...(breakdown[activityName] || {}),
        [field]: value
      }
    });
  }

  return (
    <>
      <div className="sage-inline-add">
        <input
          className="sage-input"
          value={activity}
          onChange={(event) => setActivity(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addActivity();
            }
          }}
          placeholder="Name an activity that feels shaky"
        />
        <button type="button" className="sage-secondary" onClick={addActivity}>
          Add activity
        </button>
      </div>

      <div className="sage-capability-stack">
        {activities.map((activityName) => (
          <div className="sage-capability-card" key={activityName}>
            <div className="sage-capability-title">{activityName}</div>
            {CAPABILITY_FIELDS.map((field) => (
              <div className="sage-capability-row" key={field}>
                <span>{field}</span>
                <div className="sage-mini-options">
                  {["Yes", "Partial", "No", "I don't know"].map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={
                        breakdown[activityName]?.[field] === option
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        updateField(activityName, field, option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function QuestionCard({ question, answers, setAnswer, deep = false }) {
  const value = answers[question.id];

  return (
    <section className={`sage-question ${deep ? "is-deep" : ""}`}>
      {deep && (
        <div className="sage-deep-permission">{DEEP_DIVE_PERMISSION}</div>
      )}

      <h2>{question.prompt}</h2>

      {question.example && (
        <p className="sage-example">
          <strong>Example:</strong> {question.example}
        </p>
      )}

      {question.type === "groupedMulti" && (
        <GroupedMultiQuestion
          question={question}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}

      {question.type === "multi" && (
        <>
          <div className="sage-options">
            {question.options.map((option) => (
              <OptionButton
                key={option}
                active={Array.isArray(value) && value.includes(option)}
                onClick={() =>
                  setAnswer(question.id, toggleMulti(value, option))
                }
              >
                {option}
              </OptionButton>
            ))}
          </div>
          <OtherField question={question} answers={answers} setAnswer={setAnswer} />
        </>
      )}

      {question.type === "single" && (
        <>
          <div className="sage-options">
            {question.options.map((option) => (
              <OptionButton
                key={option}
                active={value === option}
                onClick={() => setAnswer(question.id, option)}
              >
                {option}
              </OptionButton>
            ))}
          </div>
          <OtherField question={question} answers={answers} setAnswer={setAnswer} />
        </>
      )}

      {question.type === "text" && (
        <input
          className="sage-input sage-text-answer"
          value={value || ""}
          onChange={(event) => setAnswer(question.id, event.target.value)}
          placeholder="One line is enough"
        />
      )}

      {question.type === "textarea" && (
        <textarea
          className="sage-input sage-textarea"
          value={value || ""}
          onChange={(event) => setAnswer(question.id, event.target.value)}
          placeholder="Optional"
        />
      )}

      {question.type === "processSteps" && (
        <ProcessStepsQuestion
          question={question}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}

      {question.type === "stepObjectives" && (
        <StepObjectivesQuestion
          question={question}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}

      {question.type === "capabilityBreakdown" && (
        <CapabilityBreakdownQuestion
          question={question}
          answers={answers}
          setAnswer={setAnswer}
        />
      )}
    </section>
  );
}

function SalesLinesInline({ answers, setAnswer }) {
  if (!shouldShowDistinctLines(answers)) return null;

  const discover = Array.isArray(answers["awareness.discover"])
    ? answers["awareness.discover"]
    : [];

  const other = answers["awareness.discover.other"];
  const available = discover
    .filter((item) => !["I'm not sure", "Something else"].includes(item))
    .concat(discover.includes("Something else") && other ? [other] : []);

  const selected = Array.isArray(answers["process.distinctLines"])
    ? answers["process.distinctLines"]
    : [];
  const details = answers["process.lineTargets"] || {};

  function toggleLine(line) {
    setAnswer(
      "process.distinctLines",
      selected.includes(line)
        ? selected.filter((item) => item !== line)
        : [...selected, line]
    );
  }

  function updateLine(line, key, value) {
    setAnswer("process.lineTargets", {
      ...details,
      [line]: {
        ...(details[line] || {}),
        [key]: value
      }
    });
  }

  return (
    <section className="sage-question sage-sales-lines">
      <div className="sage-inline-reveal-label">Your sales lines</div>
      <h2>Which of the ways you just picked deserve their own target?</h2>
      <p className="sage-example">
        Pick as many as genuinely behave differently — it's fine to pick none.
        As soon as you pick one, its target fields appear right below.
      </p>

      <div className="sage-options">
        {available.map((line) => (
          <OptionButton
            key={line}
            active={selected.includes(line)}
            onClick={() => toggleLine(line)}
          >
            {line}
          </OptionButton>
        ))}
      </div>

      <div className="sage-line-targets">
        {selected.map((line) => (
          <div className="sage-line-target" key={line}>
            <strong>{line}</strong>
            <label>
              <span>What's the measurable objective for this line?</span>
              <input
                className="sage-input"
                value={details[line]?.objective || ""}
                onChange={(event) =>
                  updateLine(line, "objective", event.target.value)
                }
                placeholder="Example: 3 qualified conversations a month"
              />
            </label>
            <div className="sage-mini-options sage-line-tracking">
              {["Yes, and I track it", "I do this but don't track it", "Not sure"].map(
                (option) => (
                  <button
                    type="button"
                    key={option}
                    className={details[line]?.tracking === option ? "is-active" : ""}
                    onClick={() => updateLine(line, "tracking", option)}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MilestonePath({ plan, currentSectionId, onJump, reportMode = false }) {
  return (
    <nav className="sage-milestones" aria-label="Sales review milestones">
      {SECTIONS.map((section) => {
        const milestone =
          plan.milestones.find((item) => item.id === section.id) || {
            status: "not yet reached"
          };
        const active = section.id === currentSectionId;
        const canJump =
          reportMode || milestone.status !== "not yet reached" || active;

        return (
          <button
            type="button"
            key={section.id}
            disabled={!canJump}
            onClick={() => canJump && onJump?.(section.id)}
            className={`sage-milestone milestone-${milestone.status.replaceAll(
              " ",
              "-"
            )} ${active ? "is-current" : ""}`}
          >
            <span className="sage-milestone-dot" />
            <span>
              <strong>{section.shortLabel}</strong>
              <small>{milestoneLabel(milestone.status)}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function SectionObservation({ observation }) {
  if (!observation) return null;

  return (
    <div className={`sage-observation observation-${observation.status.replaceAll(" ", "-")}`}>
      <div className="sage-observation-kicker">
        {observation.status === "clear" ? "What appears clear" : "Worth testing"}
      </div>
      <h3>{observation.title}</h3>
      {observation.support && <p>{observation.support}</p>}
      <p className="sage-muted">{observation.why}</p>
    </div>
  );
}

function Landing({ onStart }) {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  return (
    <main className="sage-landing">
      <header className="sage-brandbar">
        <div className="sage-brand">
          <span className="sage-brand-mark">S</span>
          <span>
            <strong>SAGE</strong>
            <small>Sales System Guide</small>
          </span>
        </div>
      </header>

      <section className="sage-hero">
        <div className="sage-hero-copy">
          <div className="sage-eyebrow">FREE SALES SYSTEM REVIEW</div>
          <h1>
            You want to improve your sales.
            <span>Get the result you want by first getting the results you need.</span>
          </h1>
          <p>
            SAGE uses a short, tap-based review with concrete examples throughout
            to examine what your sales operation actually does, where results are
            clear, and what is worth testing. The core review takes about 10
            minutes, and your progress is saved automatically in this browser.
          </p>
          <button type="button" className="sage-primary sage-start" onClick={onStart}>
            Start
          </button>

        </div>

        <div className="sage-hero-visual" aria-hidden="true">
          <div className="sage-flow-line">
            <span>How opportunities begin</span>
            <i>→</i>
            <span>How buyers move forward</span>
            <i>→</i>
            <span>How sales become decisions</span>
          </div>
          <div className="sage-flow-grid">
            {[
              ["Attention", "Do buyers actually engage?"],
              ["Preference", "Why do they favor you?"],
              ["Value", "How do you know it's worth it to them?"],
              ["Decision", "What proves they are ready to act?"]
            ].map(([point, result]) => (
              <div key={point}>
                <small>{point}</small>
                <strong>{result}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ReviewHeader({ onHome, onPlan }) {
  return (
    <header className="sage-app-header">
      <button type="button" className="sage-brand sage-brand-button" onClick={onHome}>
        <span className="sage-brand-mark">S</span>
        <span>
          <strong>SAGE</strong>
          <small>Sales System Guide</small>
        </span>
      </button>

      {onPlan && (
        <button type="button" className="sage-secondary" onClick={onPlan}>
          See your plan
        </button>
      )}
    </header>
  );
}

function Review({
  answers,
  setAnswer,
  sectionIndex,
  setSectionIndex,
  visitedSections,
  setVisitedSections,
  onHome,
  onPlan
}) {
  const section = SECTIONS[sectionIndex];
  const deepOpen = Array.isArray(answers.__deepDiveSections)
    ? answers.__deepDiveSections.includes(section.id)
    : false;

  const plan = useMemo(
    () => buildPlan(answers, visitedSections),
    [answers, visitedSections]
  );

  const core = coreQuestions(section.id);
  const deep = deepQuestions(section.id);
  const observation = sectionObservation(section.id, answers);

  function questionComplete(question) {
    const value = answers[question.id];
    if (question.type === "text") return hasValue(value);
    if (question.type === "processSteps") {
      return Array.isArray(value) && value.length > 0;
    }
    return hasValue(value);
  }

  function lineTrackingComplete() {
    if (!shouldShowDistinctLines(answers)) return true;
    const selected = Array.isArray(answers["process.distinctLines"])
      ? answers["process.distinctLines"]
      : [];
    const details = answers["process.lineTargets"] || {};
    return selected.every((line) => hasValue(details[line]?.tracking));
  }

  const coreComplete =
    core.every(questionComplete) &&
    (section.id !== "awareness" || lineTrackingComplete());

  function openDeepDive() {
    const existing = Array.isArray(answers.__deepDiveSections)
      ? answers.__deepDiveSections
      : [];

    if (!existing.includes(section.id)) {
      setAnswer("__deepDiveSections", [...existing, section.id]);
      trackEvent("deep_dive_started", {
        stageId: sectionStageId(section.id),
        sectionIndex
      });
    }
  }

  function goNext() {
    const nextVisited = visitedSections.includes(section.id)
      ? visitedSections
      : [...visitedSections, section.id];

    setVisitedSections(nextVisited);

    trackEvent("section_completed", {
      stageId: sectionStageId(section.id),
      sectionIndex
    });

    if (deepOpen) {
      trackEvent("deep_dive_completed", {
        stageId: sectionStageId(section.id),
        sectionIndex
      });
    }

    if (sectionIndex >= SECTIONS.length - 1) {
      trackEvent("review_completed", {
        stageId: "execution",
        sectionIndex
      });
      onPlan();
      return;
    }

    const nextIndex = sectionIndex + 1;
    setSectionIndex(nextIndex);

    trackEvent("section_reached", {
      stageId: sectionStageId(SECTIONS[nextIndex].id),
      sectionIndex: nextIndex
    });
  }

  function jumpTo(sectionId) {
    const index = SECTIONS.findIndex((item) => item.id === sectionId);
    if (index >= 0 && index <= sectionIndex) {
      setSectionIndex(index);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sectionIndex, deepOpen]);

  return (
    <div className="sage-shell">
      <ReviewHeader onHome={onHome} onPlan={onPlan} />

      <MilestonePath
        plan={plan}
        currentSectionId={section.id}
        onJump={jumpTo}
      />

      <main className="sage-review">
        <div className="sage-section-heading">
          <div className="sage-eyebrow">{section.label}</div>
          <h1>{SECTION_FRAMING[section.id]}</h1>
        </div>

        <div className="sage-question-stack">
          {core.map((question) => (
            <React.Fragment key={question.id}>
              <QuestionCard
                question={question}
                answers={answers}
                setAnswer={setAnswer}
              />
              {question.id === "awareness.discover" && (
                <SalesLinesInline answers={answers} setAnswer={setAnswer} />
              )}
            </React.Fragment>
          ))}

          {coreComplete && <SectionObservation observation={observation} />}

          {coreComplete && deep.length > 0 && !deepOpen && (
            <div className="sage-deep-choice">
              <div>
                <div className="sage-eyebrow">OPTIONAL DEPTH</div>
                <h3>Want a more specific view of this area?</h3>
                <p>{DEEP_DIVE_PERMISSION}</p>
              </div>
              <button type="button" className="sage-secondary" onClick={openDeepDive}>
                Go deeper in this area
              </button>
            </div>
          )}

          {deepOpen &&
            deep.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answers={answers}
                setAnswer={setAnswer}
                deep
              />
            ))}
        </div>

        <div className="sage-review-actions">
          {sectionIndex > 0 && (
            <button
              type="button"
              className="sage-secondary"
              onClick={() => setSectionIndex(sectionIndex - 1)}
            >
              Back
            </button>
          )}

          <button
            type="button"
            className="sage-primary"
            disabled={!coreComplete}
            onClick={goNext}
          >
            {sectionIndex === SECTIONS.length - 1
              ? "See my plan"
              : deepOpen
                ? "Continue"
                : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

function CurrentSystemSnapshot({ currentSystem }) {
  const rows = [
    ["What you sell", currentSystem.offer.join(", ")],
    ["Who buys", currentSystem.buyers.join(", ")],
    ["Why consider you", currentSystem.reason],
    ["How opportunities begin", currentSystem.sources.join(", ")],
    ["Major process", currentSystem.steps.join(" → ")]
  ].filter(([, value]) => value);

  if (!rows.length) return null;

  return (
    <section className="sage-report-section" id="current-system">
      <div className="sage-report-heading">
        <div className="sage-eyebrow">YOUR CURRENT PICTURE</div>
        <h2>What your answers describe</h2>
      </div>

      <div className="sage-system-snapshot">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FindingCard({
  finding,
  saved,
  onSave,
  onEditArea
}) {
  const established = finding.state === "ESTABLISHED";

  return (
    <article className={`sage-finding ${established ? "is-established" : "needs-work"}`}>
      <div className="sage-finding-top">
        <span className="sage-state-label">{stateDisplay(finding.state)}</span>
        <button
          type="button"
          className={`sage-save ${saved ? "is-saved" : ""}`}
          onClick={() => onSave(finding.id)}
          aria-label={saved ? "Remove from selected next steps" : "Save as a next step"}
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      <h3>{finding.title}</h3>

      {finding.support && (
        <div className="sage-evidence">
          <strong>What supports this</strong>
          <p>{finding.support}</p>
        </div>
      )}

      <div className="sage-finding-detail">
        <div>
          <strong>Why it matters</strong>
          <p>{finding.why}</p>
        </div>
        <div>
          <strong>{established ? "Worth testing further" : "Next step"}</strong>
          <p>{established ? finding.test : finding.next}</p>
        </div>
      </div>

      {!established && (
        <div className="sage-context-support">
          <span>
            Want help working this specific issue through? Save it for feedback or
            reopen the section to add evidence.
          </span>
          <button type="button" onClick={() => onEditArea(finding.section)}>
            Add evidence
          </button>
        </div>
      )}
    </article>
  );
}

function HypothesisBuilder({ finding, hypothesis, setHypothesis }) {
  if (!finding) return null;

  return (
    <div className="sage-hypothesis">
      <div className="sage-eyebrow">TEST ONE CHANGE</div>
      <h3>Turn this direction into a deliberate test.</h3>
      <p>
        Test one meaningful change at a time. If several things change together,
        you cannot tell what produced the result.
      </p>

      <label>
        <span>What will change?</span>
        <textarea
          value={hypothesis.change}
          onChange={(event) =>
            setHypothesis({ ...hypothesis, change: event.target.value })
          }
        />
      </label>

      <label>
        <span>What result do you expect?</span>
        <textarea
          value={hypothesis.expected}
          onChange={(event) =>
            setHypothesis({ ...hypothesis, expected: event.target.value })
          }
        />
      </label>

      <label>
        <span>How and when will you check it?</span>
        <textarea
          value={hypothesis.check}
          onChange={(event) =>
            setHypothesis({ ...hypothesis, check: event.target.value })
          }
        />
      </label>
    </div>
  );
}

function SupportOffer({ plan, selectedPriority }) {
  const [prepared, setPrepared] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  function prepare(action) {
    const priority = selectedPriority?.title || plan.needsAttention[0]?.title || "";
    const message = [
      `${action} — SAGE Sales System Review`,
      priority ? `Priority issue: ${priority}` : "",
      "I completed the SAGE review and would like to discuss the findings."
    ]
      .filter(Boolean)
      .join("\n");

    setPrepared(message);
    setCopyStatus("");
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(prepared);
      setCopyStatus("Copied.");
    } catch {
      setCopyStatus("Select and copy the request below.");
    }
  }

  async function shareRequest() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "SAGE Sales System Review",
        text: prepared
      });
    } catch {
      // A cancelled share should not interrupt the report.
    }
  }

  return (
    <section className="sage-support-offer" id="support">
      <div>
        <div className="sage-eyebrow">PROFESSIONAL SUPPORT</div>
        <h2>Use the plan yourself, or get help working through it.</h2>
        <p>
          The free review stands on its own. If you want deeper investigation,
          design, implementation, testing, or training, use the option that fits
          what you need.
        </p>
      </div>

      <div className="sage-support-actions">
        {[
          "Get Support",
          "Request an Evaluation",
          "Share My Plan for Feedback",
          "Work With Us"
        ].map((label) => (
          <button
            type="button"
            key={label}
            className="sage-secondary"
            onClick={() => prepare(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {prepared && (
        <div className="sage-prepared-request">
          <strong>Request prepared</strong>
          <pre>{prepared}</pre>
          <div className="sage-support-actions">
            <button type="button" className="sage-secondary" onClick={copyRequest}>
              Copy request
            </button>
            {navigator.share && (
              <button type="button" className="sage-secondary" onClick={shareRequest}>
                Share request
              </button>
            )}
          </div>
          {copyStatus && <p>{copyStatus}</p>}
        </div>
      )}
    </section>
  );
}

function Report({
  answers,
  visitedSections,
  savedFindingIds,
  setSavedFindingIds,
  selectedPriorityId,
  setSelectedPriorityId,
  hypothesis,
  setHypothesis,
  onEditArea,
  onBackToReview,
  onHome
}) {
  const plan = useMemo(
    () => buildPlan(answers, visitedSections),
    [answers, visitedSections]
  );

  const selectedPriority =
    plan.priorityCandidates.find((finding) => finding.id === selectedPriorityId) ||
    null;

  useEffect(() => {
    trackEvent("report_viewed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function choosePriority(id) {
    const finding = plan.priorityCandidates.find((item) => item.id === id);
    setSelectedPriorityId(id);
    setHypothesis(hypothesisSeed(finding));
  }

  function toggleSave(id) {
    setSavedFindingIds(
      savedFindingIds.includes(id)
        ? savedFindingIds.filter((item) => item !== id)
        : [...savedFindingIds, id]
    );
  }

  const selectedSteps = plan.findings.filter((finding) =>
    savedFindingIds.includes(finding.id)
  );

  function jumpTo(sectionId) {
    onEditArea(sectionId);
  }

  function printPlan() {
    window.print();
  }

  return (
    <div className="sage-shell sage-report-shell">
      <ReviewHeader onHome={onHome} onPlan={null} />

      <main className="sage-report">
        <section className="sage-priority-first" id="priority">
          <div className="sage-eyebrow">ONE PRIORITY DIRECTION</div>
          <h1>Your Sales System Review</h1>
          <p>
            Choose one condition that is not established, is unknown, or is not verified to work on first. SAGE
            organizes the evidence; you choose the priority.
          </p>

          {plan.priorityCandidates.length > 0 ? (
            <>
              <div className="sage-priority-options">
                {plan.priorityCandidates.map((finding) => (
                  <button
                    type="button"
                    key={finding.id}
                    className={
                      selectedPriorityId === finding.id ? "is-active" : ""
                    }
                    onClick={() => choosePriority(finding.id)}
                  >
                    <span>{stateDisplay(finding.state)}</span>
                    <strong>{finding.title}</strong>
                  </button>
                ))}
              </div>

              {selectedPriority && (
                <div className="sage-selected-priority">
                  <strong>Your direction</strong>
                  <p>{selectedPriority.next}</p>
                </div>
              )}
            </>
          ) : (
            <div className="sage-no-priority">
              Your answers have not established a flagged condition. That is not a
              guarantee that nothing should change; it means this review did not
              establish a weakness from the evidence provided.
            </div>
          )}
        </section>

        <MilestonePath
          plan={plan}
          currentSectionId=""
          onJump={jumpTo}
          reportMode
        />

        <div className="sage-report-orientation">
          Nothing below is a guaranteed fix. Identifying a condition is not the
          same as proving it caused a sales result.
        </div>

        <CurrentSystemSnapshot currentSystem={plan.currentSystem} />

        <section className="sage-report-section" id="findings">
          <div className="sage-report-heading">
            <div className="sage-eyebrow">WHAT SAGE FOUND</div>
            <h2>Findings from the answers you provided</h2>
          </div>

          {SECTIONS.map((section) => {
            const sectionFindings = plan.findings.filter(
              (finding) =>
                finding.section === section.id &&
                !finding.contextual
            );
            const contextFindings = plan.findings.filter(
              (finding) =>
                finding.section === section.id &&
                finding.contextual
            );

            if (!sectionFindings.length && !contextFindings.length) return null;

            return (
              <div className="sage-finding-group" key={section.id}>
                <div className="sage-finding-group-heading">
                  <h3>{section.label}</h3>
                  <button
                    type="button"
                    onClick={() => onEditArea(section.id)}
                  >
                    Add evidence
                  </button>
                </div>

                {sectionFindings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    saved={savedFindingIds.includes(finding.id)}
                    onSave={toggleSave}
                    onEditArea={onEditArea}
                  />
                ))}

                {contextFindings.length > 0 && (
                  <div className="sage-context-panel">
                    <strong>Additional context you established</strong>
                    <ul>
                      {contextFindings.map((finding) => (
                        <li key={finding.id}>
                          <span>{finding.title}</span>
                          {finding.support && <small>{finding.support}</small>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="sage-report-section sage-summary" id="summary">
          <div className="sage-report-heading">
            <div className="sage-eyebrow">SUMMARY</div>
            <h2>What's working and what's not yet confirmed</h2>
          </div>

          <div className="sage-summary-grid">
            <div>
              <h3>What's working</h3>
              {plan.working.length ? (
                <ul>
                  {plan.working.map((finding) => (
                    <li key={finding.id}>
                      <strong>{finding.title}</strong>
                      <span>{finding.test}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sage-muted">
                  The answers provided so far do not yet verify a working condition.
                </p>
              )}
            </div>

            <div>
              <h3>What's not yet confirmed</h3>
              {plan.needsAttention.length ? (
                <ul>
                  {plan.needsAttention.map((finding) => (
                    <li key={finding.id}>
                      <strong>{finding.title}</strong>
                      <span>{finding.next}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sage-muted">
                  No unconfirmed condition was established from the answers provided.
                </p>
              )}
            </div>
          </div>

          <div className="sage-selected-next-steps">
            <h3>Your selected next steps</h3>
            {selectedSteps.length ? (
              <ol>
                {selectedSteps.map((finding) => (
                  <li key={finding.id}>
                    <strong>{finding.title}</strong>
                    <span>
                      {finding.state === "ESTABLISHED" ? finding.test : finding.next}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="sage-muted">
                Save any finding above to build your own next-step list.
              </p>
            )}
          </div>
        </section>

        <HypothesisBuilder
          finding={selectedPriority}
          hypothesis={hypothesis || hypothesisSeed(selectedPriority)}
          setHypothesis={setHypothesis}
        />

        <SupportOffer plan={plan} selectedPriority={selectedPriority} />

        <div className="sage-report-footer-actions">
          <button type="button" className="sage-secondary" onClick={onBackToReview}>
            Back to review
          </button>
          <button type="button" className="sage-secondary" onClick={printPlan}>
            Print / Save PDF
          </button>
        </div>
      </main>
    </div>
  );
}

export default function SageV2() {
  const initial = useMemo(() => loadSavedState(), []);
  const [screen, setScreen] = useState("landing");
  const [answers, setAnswers] = useState(initial.answers);
  const [sectionIndex, setSectionIndex] = useState(initial.sectionIndex);
  const [visitedSections, setVisitedSections] = useState(initial.visitedSections);
  const [savedFindingIds, setSavedFindingIds] = useState(initial.savedFindingIds);
  const [selectedPriorityId, setSelectedPriorityId] = useState(
    initial.selectedPriorityId
  );
  const [hypothesis, setHypothesis] = useState(initial.hypothesis);

  if (window.location.pathname.startsWith("/admin")) {
    return <AdminDashboard />;
  }

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers,
        sectionIndex,
        visitedSections,
        savedFindingIds,
        selectedPriorityId,
        hypothesis
      })
    );
  }, [
    answers,
    sectionIndex,
    visitedSections,
    savedFindingIds,
    selectedPriorityId,
    hypothesis
  ]);

  function setAnswer(id, value) {
    setAnswers((current) => ({
      ...current,
      [id]: value
    }));
  }

  function startReview() {
    resetReviewId();
    setScreen("review");
    trackEvent("review_started", {
      stageId: "business",
      sectionIndex: 0,
      createReview: true
    });
    trackEvent("section_reached", {
      stageId: "business",
      sectionIndex: 0
    });
  }

  function editArea(sectionId) {
    const index = SECTIONS.findIndex((section) => section.id === sectionId);
    if (index >= 0) setSectionIndex(index);
    setScreen("review");
  }

  function showPlan() {
    setScreen("report");
  }

  function goHome() {
    setScreen("landing");
  }

  if (screen === "landing") {
    return <Landing onStart={startReview} />;
  }

  if (screen === "report") {
    return (
      <Report
        answers={answers}
        visitedSections={visitedSections}
        savedFindingIds={savedFindingIds}
        setSavedFindingIds={setSavedFindingIds}
        selectedPriorityId={selectedPriorityId}
        setSelectedPriorityId={setSelectedPriorityId}
        hypothesis={hypothesis}
        setHypothesis={setHypothesis}
        onEditArea={editArea}
        onBackToReview={() => setScreen("review")}
        onHome={goHome}
      />
    );
  }

  return (
    <Review
      answers={answers}
      setAnswer={setAnswer}
      sectionIndex={sectionIndex}
      setSectionIndex={setSectionIndex}
      visitedSections={visitedSections}
      setVisitedSections={setVisitedSections}
      onHome={goHome}
      onPlan={showPlan}
    />
  );
}
