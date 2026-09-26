import React, { useState } from "react";

function App() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark">S</span>
            <div>
              <strong>SAGE</strong>
              <span>Sales System Guide</span>
            </div>
          </div>
          <div className="progress-label">Sales System Review</div>
        </header>

        <main className="review-start">
          <div className="review-card">
            <span className="eyebrow">LET'S LOOK AT HOW YOU SELL</span>

            <h1>First, let's understand your sales system.</h1>

            <p>
              Every business that sells already has a sales system. I'll help
              you make yours visible—how sales begin, how they move forward,
              what you know is working, and what may need attention.
            </p>

            <div className="review-note">
              <strong>This won't require reports, CRM access, or spreadsheets.</strong>
              <span>
                I'll ask you a series of straightforward questions about how
                your business actually sells.
              </span>
            </div>

            <button className="primary-button">
              Begin My Review
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>SAGE</strong>
            <span>Sales System Guide</span>
          </div>
        </div>

        <span className="powered">Powered by Cross-Through</span>
      </header>

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
            onClick={() => setStarted(true)}
          >
            Get Started
            <span aria-hidden="true">→</span>
          </button>

          <p className="free-note">
            Free Sales System Review · No CRM connection required
          </p>
        </div>

        <div className="system-visual" aria-hidden="true">
          <div className="visual-label">YOUR SALES SYSTEM</div>

          <div className="system-path">
            <div className="system-node">
              <span>01</span>
              <strong>Create Interest</strong>
              <small>How opportunities begin</small>
            </div>

            <div className="connector"></div>

            <div className="system-node">
              <span>02</span>
              <strong>Build Preference</strong>
              <small>Why buyers favor you</small>
            </div>

            <div className="connector"></div>

            <div className="system-node">
              <span>03</span>
              <strong>Establish Value</strong>
              <small>Why buying makes sense</small>
            </div>

            <div className="connector"></div>

            <div className="system-node">
              <span>04</span>
              <strong>Move to Action</strong>
              <small>Why buyers proceed</small>
            </div>
          </div>

          <div className="visual-footer">
            <span>ACTIVITY</span>
            <span>RESULT</span>
            <span>EVIDENCE</span>
            <span>IMPROVEMENT</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
