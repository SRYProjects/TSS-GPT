# SAGE — PRODUCT SPEC

**Status:** Canonical V1 product specification  
**Repository:** `SRYProjects/TSS-GPT`  
**Product:** SAGE — Sales System Guide  
**Methodology:** Cross-Through (CT)

The authoritative build direction is the October 2026 **Cross-Through System — Build Instructions: Comprehensive Specification** supplied by the owner. Where older product decisions conflict with that specification, the October 2026 specification governs. The Cross-Through methodology itself must not be reinterpreted or expanded by the app.

## 1. Purpose

SAGE is a free, self-guided diagnostic for **established business owners**. It is not limited to B2B.

SAGE evaluates whether the sales operation is deliberately defined, connected, evidenced, and consistently executed, then identifies where attention matters most.

The free product must stand on its own. Professional consulting, training, evaluation, implementation, and support are optional next steps and must never be manufactured through pressure or invented weakness.

## 2. Cross-Through architecture

The three foundational actions are fixed and must not be renamed:

- **Create Presence**
- **Present the Offer and Value**
- **Confirm the Sale**

The four Cross-Through relationships are fixed and must not be renamed, reordered, merged, or expanded:

- **Awareness → Engagement**
- **Alignment → Favor**
- **Resolution → Perception of Value**
- **Decision → Perception of Benefit**

The interface may explain these ideas in plain language, but it must not create substitute methodology.

## 3. Diagnostic answer states

Exactly four interpretive states exist for questions about an activity, capability, result, or verification:

- **NO** — the activity or capability is not currently established.
- **UNKNOWN** — the user does not know.
- **NO VERIFICATION** — the activity occurs, but its result cannot reliably be established.
- **ESTABLISHED** — the activity is performed and its result can be verified.

Purely descriptive Foundation questions carry no diagnostic state.

No other diagnostic taxonomy may be introduced.

## 4. Absolute product prohibitions

V1 must not:

- score, grade, rank, benchmark, or assign a numeric maturity value;
- show a completion percentage;
- show global **Step X of Y** progress;
- use ordinal good-to-bad maturity ladders except the Guide-specified capability/execution Yes / Partial / No / I don't know structure;
- reintroduce the legacy Solid / Incomplete / Disconnected / Unverified / Performance Problem / Execution Exposure taxonomy;
- use red/green judgment coloring;
- use failure language or generic advice disconnected from the user's answers;
- assume B2B-specific buyer types as the product frame;
- turn Cross-Through terminology into vocabulary the user must learn before answering.

## 5. Interaction rules

- Teach before asking: one short plain-language framing line before a new idea.
- Every question includes a concrete example.
- Multi-select is the default when more than one condition can genuinely apply.
- Selecting an option never auto-advances.
- Continue is always explicit.
- **Something else** and **I'm not sure / Not sure** are distinct choices wherever relevant.
- Tone is direct, plain, and confident; no trivial gamification or fake-human chatter.
- Deep Dives are optional and carry the exact permission copy:  
  **“This is optional. You can see your plan at any time; unanswered depth is not treated as a weakness.”**
- Skipped optional depth is never converted into a weakness.

## 6. V1 journey

The journey is:

1. Landing — orientation only; no diagnostic data.
2. Foundation — Core only.
3. Awareness → Engagement — Core + optional Deep Dive.
4. Alignment → Favor — Core + optional Deep Dive.
5. Resolution → Perception of Value — Core + optional Deep Dive.
6. Decision → Perception of Benefit — Core + optional Deep Dive.
7. Sales Process — Core + optional Deep Dive.
8. Capability & Execution — Core + optional Deep Dive.
9. Plan / Report.

Progress uses a milestone path. Each reached milestone may be shown only as:

- **not yet reached**
- **clear**
- **worth testing**

No fraction, percentage, score, or global step count is permitted.

At the close of each Core section, show one supported observation immediately when the user's own answers establish one. Never manufacture an observation.

## 7. Foundation

Foundation collects only the context needed by later sections:

- what the company sells;
- who normally buys;
- one-line reason someone should consider the company.

These answers are descriptive and never flagged.

## 8. Sales lines

Opportunity-source selections live inside Awareness.

When the user's selected routes indicate multiple meaningfully different groups, reveal the sales-line question inline immediately after discovery. Do not move it to a later screen.

For each selected distinct line, allow:

- a measurable objective;
- **Yes, and I track it**;
- **I do this but don't track it**;
- **Not sure**.

The objective text is optional. A selected line must have a tracking choice before the section can continue.

Implementation clarification: the specification's user-facing instruction explicitly says it is acceptable to pick no distinct lines. V1 therefore allows Continue with zero distinct lines selected; once a line is selected, its tracking choice becomes required.

## 9. Sales Process

Core identifies the meaningful steps that actually occur.

The starter list adapts to product/subscription vs. service/project context and allows custom steps.

Deep Dive asks what each selected step must produce for the opportunity to continue. If the user opens this Deep Dive and leaves a step objective blank, that step is **UNKNOWN**. Skipping the Deep Dive entirely is neutral.

## 10. Capability & Execution

Core asks:

- whether the business has what the important sales activities require;
- whether the work is actually executed consistently.

This is the one area where the Guide's explicit Yes / Partial / No / I don't know structure is permitted.

Optional breakdown may examine exactly six support fields for user-named activities:

1. Skill/capability
2. Information
3. Data
4. Technology
5. People
6. Operational support

Do not add or remove support fields.

## 11. Report

The report is assembled only from the user's answers.

It must:

- open with **one priority direction** chosen by the user from supported flagged findings, never a computed “best” score;
- show the completed milestone map;
- state that identifying a condition is not the same as proving it caused a result;
- return something useful for every answered diagnostic question;
- show working/established answers with a concise direction for further testing;
- show unestablished, unknown, or unverified answers with:
  - what is not confirmed;
  - the answer evidence;
  - why it matters;
  - a concrete next step framed as something to establish or test, not a guaranteed fix;
- group findings by section;
- provide a save/star control on each finding;
- compile saved findings into **Your selected next steps**;
- summarize **What's working** and **What's not yet confirmed**;
- provide a hypothesis builder for the chosen priority:
  - what will change;
  - what result is expected;
  - how and when it will be checked;
- prefill the hypothesis builder with an editable suggestion grounded in the chosen finding;
- explicitly advise testing one meaningful change at a time.

No report language may claim a cause that the answers have not established.

## 12. Commercial path

Contextual support prompts may appear beside real gaps, and one comprehensive support offer may appear at the end.

Supported offer labels include:

- Get Support
- Request an Evaluation
- Share My Plan for Feedback
- Work With Us

The free report must be useful before these offers appear.

**Open implementation item:** the production destination/contact route for these CTAs is not yet documented. Do not invent an email address or endpoint. The migration branch prepares/copies the request text until a real route is confirmed.

## 13. Technical architecture

Current V1 stack:

- React 19 + Vite;
- Cloudflare Worker deployment;
- Cloudflare D1 for anonymous aggregate product telemetry/admin reporting;
- browser localStorage for diagnostic answers and progress;
- no account required for the diagnostic;
- no LLM required to classify answers or build findings.

Architecture boundaries:

- diagnostic configuration is separate from engine logic;
- engine logic is separate from UI;
- diagnostic answers must not silently be sent to telemetry;
- existing aggregate analytics/admin infrastructure is preserved unless separately changed.

Current implementation files for the October 2026 migration:

- `src/sageV2Config.js` — authoritative V1 questions and CT structure;
- `src/sageV2Engine.js` — four-state classification and report assembly;
- `src/SageV2.jsx` — review/report user experience;
- `src/sageV2.css` — V2 presentation;
- `src/main.jsx` — branch entry point;
- `worker/index.js` — telemetry API, including legacy + current stage IDs.

Legacy `diagnosticConfig.js`, `diagnosticRules.js`, `diagnosticEngine.js`, `diagnosticExperience.js`, and the prior `App.jsx` remain in the repository during migration for rollback/reference only and are not authoritative once V2 is validated and merged.

## 14. Design direction

- Professional, serious, modern sales-system product.
- Dark navy/charcoal foundation with restrained cyan/blue and gold accents.
- No red/green judgment treatment.
- Readable typography; important content must not look like fine print.
- The review should feel light even when the reasoning underneath is rigorous.
- The report should be scannable first, detailed second.
- Mobile must preserve readability and obvious multi-select behavior.

## 15. Implementation interpretation rules

When source instructions appear internally inconsistent:

1. do not invent methodology;
2. preserve the explicit user-facing promise where possible;
3. choose the behavior that avoids trapping or misleading the user;
4. record the implementation clarification here or in `PROJECT_STATE.md`;
5. escalate only if the unresolved point materially changes methodology or commercial intent.

Current clarification: an option containing both uncertainty wording and an explicit **“we don't really track this”** statement maps to **NO VERIFICATION**, because the more specific verification condition controls.

## 16. Authority

For future work:

1. Read this file.
2. Read `PROJECT_STATE.md`.
3. Inspect the live repository and recent commits.
4. Treat code as implementation truth, but do not preserve code behavior that conflicts with this product spec.
5. Never revive superseded legacy taxonomy, percentage progress, B2B-only framing, or global step counts.
