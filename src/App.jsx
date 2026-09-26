import React, { useState } from "react";

const questions = [
  {
    id: "sales_sources",
    section: "How Sales Begin",
    question: "How does new business typically find its way to you?",
    help: "Select every source that makes a meaningful contribution to sales.",
    type: "multi",
    options: [
      "Referrals",
      "Existing customers",
      "Outbound sales",
      "Website / search",
      "Advertising",
      "Email campaigns",
      "Social media",
      "Events / trade shows",
      "Partners / distributors",
      "Other"
    ]
  },
  {
    id: "source_intent",
    section: "How Sales Begin",
    question: "For those sales activities, how clear are you about what each one is supposed to produce?",
    help: "Think beyond 'generate sales.' What specific response or result should each activity create?",
    type: "single",
    options: [
      "Each important activity has a specific intended result",
      "Some do, but others are less clearly defined",
      "We generally know what we want, but it isn't specifically defined",
      "We mostly perform the activities and judge the results afterward"
    ]
  },
  {
    id: "source_evidence",
    section: "How Sales Begin",
    question: "How do you know which ways of generating business are actually working?",
    help: "Choose the answer that best describes your current practice.",
    type: "single",
    options: [
      "We track the result of each important source",
      "We track some sources but not others",
      "We rely mostly on experience or judgment",
      "We don't really know"
    ]
  },
  {
    id: "process_visibility",
    section: "How Sales Move",
    question: "Once a potential buyer engages, how clearly can you describe what normally happens between that point and a sale?",
    help: "We're looking for what actually happens—not an ideal process on paper.",
    type: "single",
    options: [
      "We have a clear, deliberate process",
      "There is a general process, but it varies",
      "It depends heavily on the salesperson or situation",
      "We have never really mapped it"
    ]
  },
  {
    id: "step_objectives",
    section: "How Sales Move",
    question: "Do the important steps in your sales process have a specific result they are expected to produce?",
    help: "For example, a meeting might need to establish fit and agreement on a next step—not merely 'have a good meeting.'",
    type: "single",
    options: [
      "Yes, for essentially every important step",
      "For some steps",
      "The results are generally understood but not defined",
      "No"
    ]
  },
  {
    id: "step_evidence",
    section: "How Sales Move",
    question: "How do you determine whether each important step actually accomplished what it needed to?",
    help: "Think about observable buyer response, measurable results, or other reliable evidence.",
    type: "single",
    options: [
      "We use defined evidence or measures",
      "We have evidence for some steps",
      "We rely primarily on salesperson judgment",
      "We don't evaluate individual steps this way"
    ]
  },
  {
    id: "buyer_understanding",
    section: "The Buyer's Experience",
    question: "How deliberately do you establish what a buyer needs to understand before they should choose you?",
    help: "Consider relevance, differentiation, value, evidence, risk, and alternatives.",
    type: "single",
    options: [
      "We have deliberately worked this out",
      "We understand much of it, but it isn't fully developed",
      "It is largely left to individual salespeople",
      "We have not examined it this way"
    ]
  },
  {
    id: "buyer_favor",
    section: "The Buyer's Experience",
    question: "How do you know when a buyer has moved from simply being interested to actually favoring your company or offer?",
    help: "We're asking about evidence of preference—not whether the conversation seems positive.",
    type: "single",
    options: [
      "We have recognizable evidence of buyer preference",
      "We have some indicators, but they aren't consistent",
      "We mostly infer it from the conversation",
      "We don't distinguish interest from preference"
    ]
  },
  {
    id: "value",
    section: "The Buyer's Experience",
    question: "How do you know buyers perceive enough value in your offer to justify choosing it over alternatives?",
    help: "Explaining value and knowing the buyer perceives value are different things.",
    type: "single",
    options: [
      "We deliberately establish and verify perceived value",
      "We address value but don't consistently verify it",
      "We mainly explain our value and assume the buyer understands",
      "We haven't defined how to determine this"
    ]
  },
  {
    id: "benefit",
    section: "The Buyer's Experience",
    question: "Beyond the rational value of your offer, how deliberately do you address why the buyer would actually want to act?",
    help: "Consider what changes for the buyer personally, why it matters, and why proceeding is worthwhile.",
    type: "single",
    options: [
      "We deliberately identify and establish this",
      "We address it in some situations",
      "It depends mostly on the salesperson",
      "We focus primarily on the rational business case"
    ]
  },
  {
    id: "causes",
    section: "Understanding Performance",
    question: "When a sales result is weaker than expected, what normally happens next?",
    help: "Choose the answer that most closely reflects your usual practice.",
    type: "single",
    options: [
      "We investigate possible causes before deciding what to change",
      "We review the situation, but the process is informal",
      "We usually act on the most likely explanation",
      "We tend to change tactics or push for more activity"
    ]
  },
  {
    id: "testing",
    section: "Understanding Performance",
    question: "When you change how you sell, how do you determine whether the change actually improved performance?",
    help: "Think about baseline results, deliberate changes, and evidence—not simply whether results later improved.",
    type: "single",
    options: [
      "We compare deliberate changes against meaningful evidence",
      "We measure some changes but not systematically",
      "We judge primarily from experience and overall results",
      "We rarely test changes in a structured way"
    ]
  },
  {
    id: "execution",
    section: "Working the System",
    question: "How confident are you that your sales approach is being executed consistently as intended?",
    help: "Consider consistency, balance of effort, persistence, and the skills required to perform the work.",
    type: "single",
    options: [
      "We verify execution and address deviations",
      "Execution is generally consistent, with some variation",
      "It varies significantly by person or situation",
      "We don't have enough visibility to know"
    ]
  }
];

function App() {
  const [screen, setScreen] = useState("landing");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = questions[current];
  const answer = answers[question?.id];

  function selectAnswer(value) {
    if (question.type === "multi") {
      const existing = answer || [];
      const updated = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];

      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  }

  function canContinue() {
    if (!question) return false;
    if (question.type === "multi") return answer?.length > 0;
    return Boolean(answer);
  }

  function nextQuestion() {
    if (!canContinue()) return;

    if (current === questions.length - 1) {
      setScreen("complete");
      return;
    }

    setCurrent(current + 1);
  }

  function previousQuestion() {
    if (current > 0) setCurrent(current - 1);
  }

  if (screen === "landing") {
    return (
      <div className="landing">
        <Header />

        <main className="hero">
          <div className="hero-content">
            <span className="eyebrow">STOP GOING THROUGH THE MOTIONS</span>

            <h1>
              Improve your sales by
              <br />
              improving <em>how you sell.</em>
            </h1>

            <p className="hero-copy">
              You already have a sales system. SAGE helps you understand it,
              see what's working, uncover what's missing, and determine where
              improvement matters.
            </p>

            <p className="hero-statement">
              The sales success you want starts with how you sell.
            </p>

            <button
              className="primary-button"
              onClick={() => setScreen("intro")}
            >
              Get Started <span>→</span>
            </button>

            <p className="free-note">
              Free Sales System Review · No CRM connection required
            </p>
          </div>

          <SystemVisual />
        </main>
      </div>
    );
  }

  if (screen === "intro") {
    return (
      <div className="app-shell">
        <Header review />

        <main className="review-start">
          <div className="review-card">
            <span className="eyebrow">LET'S LOOK AT HOW YOU SELL</span>

            <h1>First, let's make your sales system visible.</h1>

            <p>
              I'll ask you about how sales begin, how opportunities move,
              what buyers need from you, and how you determine what is
              actually working.
            </p>

            <div className="review-note">
              <strong>No reports. No CRM access. No spreadsheets.</strong>
              <span>
                Answer based on how your business actually sells today.
                There are no right answers.
              </span>
            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("questions")}
            >
              Begin My Review <span>→</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (screen === "complete") {
    return (
      <div className="app-shell">
        <Header review />

        <main className="review-start">
          <div className="review-card complete-card">
            <span className="eyebrow">REVIEW COMPLETE</span>
            <h1>Now let's make sense of how you sell.</h1>
            <p>
              SAGE has enough information to begin identifying how deliberate,
              connected, and measurable your sales system is—and where closer
              examination may improve performance.
            </p>

            <button className="primary-button">
              See My Sales System Review <span>→</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="question-shell">
      <Header review />

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="question-layout">
        <aside className="question-meta">
          <span className="question-count">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(questions.length).padStart(2, "0")}
          </span>

          <span className="question-section">{question.section}</span>

          <div className="section-rule" />

          <p>
            Your answers build a clearer picture of how your sales system
            actually works.
          </p>
        </aside>

        <section className="question-panel">
          <h2>{question.question}</h2>
          <p className="question-help">{question.help}</p>

          <div className="answer-list">
            {question.options.map((option) => {
              const selected =
                question.type === "multi"
                  ? answer?.includes(option)
                  : answer === option;

              return (
                <button
                  key={option}
                  className={`answer-option ${selected ? "selected" : ""}`}
                  onClick={() => selectAnswer(option)}
                >
                  <span className="answer-control">
                    {selected ? "✓" : ""}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <div className="question-actions">
            <button
              className="back-button"
              onClick={previousQuestion}
              disabled={current === 0}
            >
              ← Back
            </button>

            <button
              className="primary-button"
              disabled={!canContinue()}
              onClick={nextQuestion}
            >
              {current === questions.length - 1
                ? "Complete Review"
                : "Continue"}
              <span>→</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Header({ review = false }) {
  return (
    <header className="landing-header">
      <div className="brand">
        <span className="brand-mark">S</span>
        <div>
          <strong>SAGE</strong>
          <span>Sales System Guide</span>
        </div>
      </div>

      <span className="powered">
        {review ? "Sales System Review" : "Powered by Cross-Through"}
      </span>
    </header>
  );
}

function SystemVisual() {
  return (
    <div className="system-visual" aria-hidden="true">
      <div className="visual-label">YOUR SALES SYSTEM</div>

      <div className="system-path">
        {[
          ["01", "Create Interest", "How opportunities begin"],
          ["02", "Build Preference", "Why buyers favor you"],
          ["03", "Establish Value", "Why buying makes sense"],
          ["04", "Move to Action", "Why buyers proceed"]
        ].map(([number, title, description], index) => (
          <React.Fragment key={number}>
            <div className="system-node">
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{description}</small>
            </div>
            {index < 3 && <div className="connector" />}
          </React.Fragment>
        ))}
      </div>

      <div className="visual-footer">
        <span>ACTIVITY</span>
        <span>RESULT</span>
        <span>EVIDENCE</span>
        <span>IMPROVEMENT</span>
      </div>
    </div>
  );
}

export default App;
