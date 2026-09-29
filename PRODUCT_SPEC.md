# SAGE — PRODUCT SPEC

**Status:** Canonical product specification for V1  
**Repository:** `SRYProjects/TSS-GPT`  
**Product:** SAGE — Sales System Guide  
**Methodology:** Cross-Through (CT)

This file records authoritative product decisions. The live repository is the implementation source of truth. Old proposals are not authoritative unless they are preserved here as current decisions.

## 1. Product purpose

SAGE helps an established B2B business **see, understand, and improve how it sells**.

The free V1 diagnostic makes the company's existing sales system visible and identifies, from the evidence supplied, what appears established, incomplete, disconnected, unverified, unknown, performance-related, or exposed to execution problems. It then identifies the few findings that deserve attention first and gives a supported direction for improvement.

SAGE must provide enough value that the owner can either:
1. use the Cross-Through guide and diagnostic findings to improve the system internally; or
2. engage professional help for deeper investigation, design, implementation, testing, and management.

SAGE must not manufacture weakness, urgency, or a need for consulting.

## 2. Target user

V1 is for **established B2B product/service businesses with an existing sales operation**.

The design should work across professional services, manufacturers, distributors/intermediaries, SaaS/software, contractors, and other B2B models.

V1 is not a startup/new-business guide and is not designed around consumer/household selling.

## 3. Four distinct layers — do not conflate them

### Cross-Through methodology
Cross-Through is the underlying sales methodology. It is broader than the app. It provides the discipline for understanding, defining, connecting, testing, and improving how a business sells.

Core methodology constraints:
- Every actively selling business already has a sales system, whether deliberate or habitual.
- There is no universal sales process; the business must determine what works for its offer, buyers, conditions, and operational strategy.
- Everything relied upon to create or advance an opportunity should have a defined target outcome/objective.
- Sales require conversion/advancement at each meaningful step.
- Presence, Presentation, and Confirmation are foundational actions, not mandatory sequential stages.
- Cross-Through points are Awareness, Alignment, Resolution, and Decision.
- Their fixed buyer-interest relationships are Awareness → Engagement, Alignment → Favor, Resolution → Perception of Value, Decision → Perception of Benefit.
- Foundational actions do not map one-to-one to Cross-Through points.
- Suspected drivers/barriers or causes remain hypotheses until supported by evidence.
- System design problems must be distinguished from execution problems.
- Important changes should be deliberately tested against evidence.

### SAGE diagnostic engine
The engine is the deterministic V1 implementation that interprets answers using Cross-Through diagnostic rules. It is not the Cross-Through methodology itself and does not attempt to encode the entire methodology.

### Diagnostic output
The output is a **Sales System Diagnostic**: a structured, evidence-bounded view of the current sales system, supported strengths, attention findings, priorities, and a Cross-Through build path. It is not a score, grade, benchmark, or complete consulting deliverable.

### Consulting/commercial offer
Professional services are a separate optional next step. They may investigate findings more deeply and design, implement, test, establish evidence/controls, and manage continuing improvement. The diagnostic must not pretend to have completed that work.

## 4. Core V1 user experience

1. Landing page explains that improving sales starts with improving how the business sells.
2. Short introduction explains what SAGE will examine and that no CRM, reports, or spreadsheets are required.
3. User moves through six progress sections:
   - Your Business
   - How Sales Begin
   - How Sales Move
   - How Buyers Progress
   - Improvement
   - Execution
4. Questions adapt to prior answers.
5. Claimed strengths receive limited verification where needed.
6. An answer that already establishes a gap should not trigger unnecessary probing.
7. Ambiguity receives only enough follow-up to classify the condition responsibly.
8. SAGE cross-checks answers for meaningful contradictions.
9. Completion screen leads to the diagnostic.
10. User receives the five-part diagnostic report.

### Locked journey-design rules after first end-to-end user test
- Preserve the approved diagnostic depth, but reduce user effort. The objective is to remove unnecessary burden, not diagnostic intelligence.
- Implement the approved 17 diagnostic areas plus the optional final-context question as **18 primary screens maximum**. Related subquestions and adaptive verification belong on the same primary screen through progressive reveal rather than becoming separate full-page screens.
- Continue using the six sections. Show **Section N of 6** plus an honest overall percentage based on completion of the 18 primary screens. Do not use “Question X of Y.”
- At major section transitions, give the user concise, evidence-bounded feedback about what SAGE has now mapped or established from their answers. This feedback must not become an unsupported diagnosis.
- Adaptive follow-ups remain governed by stop / verify / clarify: stop when a gap is established; verify meaningful claimed strengths; ask only what is needed to resolve ambiguity.
- Step-objective verification must sample only a few representative important process steps rather than requiring the user to map every selected step.
- The experience should feel progressively rewarding: the user should see both how far they have progressed and what SAGE has learned.

The first production test established that the previous 22-core-screen implementation plus separate follow-up screens was too long and overwhelming. Do not restore that interaction pattern.

## 5. Current V1 diagnostic scope

The diagnostic examines:
- what part of the sales operation is being assessed;
- primary B2B buyer type;
- meaningful opportunity sources and which contribute most;
- intended results of important source activities;
- evidence of source effectiveness;
- actual sales-process path and meaningful variations;
- intended results of important process steps;
- evidence of successful advancement;
- what buyers need to understand;
- evidence of buyer preference;
- evidence of buyer-perceived value;
- the buyer's meaningful reason to proceed;
- how remaining buying issues are surfaced/resolved;
- evidence of willingness to proceed;
- where promising opportunities stall;
- confidence in suspected causes;
- how weak results are investigated;
- how sales changes are tested;
- execution consistency and exposures;
- optional additional context.

The questionnaire is adaptive rather than a fixed 13-question assessment.

## 6. Diagnostic behavior

### Required classifications
Attention findings use:
- **Incomplete** — a necessary element is not deliberately defined/established.
- **Disconnected** — activities exist but do not clearly connect required results to advancement.
- **Unverified** — the business believes something works or causes a result without adequate evidence.
- **Unknown** — management cannot currently determine what is happening or why.
- **Performance Problem** — evidence establishes that an intended result is not being achieved.
- **Execution Exposure** — the system may be viable, but inconsistency, imbalance, persistence, skill, visibility, or support threatens performance.

Supported practices may be classified **Solid** only when the answers provide enough verification. Do not manufacture positive findings.

### Cross-answer rules
SAGE must distinguish claims from evidence. Examples:
- a “clear process” with undefined outcomes or subjective advancement evidence is not fully operationally defined;
- defined source objectives without source-result evidence remain unverified;
- a developed value explanation without verification of buyer-perceived value remains unverified;
- a defined process with inconsistent execution suggests an execution exposure;
- an undefined system plus inconsistent execution means execution cannot yet be cleanly isolated;
- claimed systematic testing with missing test elements is not a complete test discipline.

### Priority behavior
- No user-facing score, grade, rating, benchmark, or overall verdict.
- Internal priorities/weights may be used only to select the most useful findings.
- Target approximately 3–5 highest-priority findings when supported.
- Priorities should represent materially different diagnostic domains where appropriate.
- Do not claim a cause beyond the available evidence.

## 7. Required diagnostic output

The report has five sections:

1. **Your Current Sales System** — reconstruct important opportunity sources, major sales path(s), advancement context, and reported breakdown points without inventing missing information.
2. **What Appears Solid** — only supported strengths.
3. **What Needs Attention** — all supported attention findings using the diagnostic classifications.
4. **Highest-Priority Findings** — normally 3–5; each should explain what was found, support, why it matters, direction, and evidence of improvement where available.
5. **Your Cross-Through Build Path** — only next actions supported by the findings, with relevant Cross-Through guide topics.

The diagnostic provides direction, not a substitute for building and managing the sales system.

## 8. Explicit V1 exclusions

V1 does **not**:
- score, grade, rank, or benchmark the company;
- force a weakness when evidence supports a strong system;
- require CRM access, report uploads, spreadsheets, or heavy data entry;
- require user accounts or a backend database;
- use an AI/LLM API to generate findings;
- prescribe one universal sales funnel/process;
- expose Cross-Through terminology as vocabulary the user must learn to complete the diagnostic;
- fully determine ideal positioning, exact process design, precise messaging, detailed selling strategies, training requirements, compensation/organization design, technology configuration, complete management controls, or the exact solution to every weakness;
- turn proprietary strategies such as Gestalt Effect, Stage & Position, Peripheral Selling, or Creating Intrigue into questionnaire sections.

## 9. UX and design decisions

- Professional B2B SaaS feel; serious but engaging.
- The experience should feel like SAGE is progressively learning how the company sells, not administering a dull survey.
- Dark navy/charcoal visual foundation with restrained teal accents.
- Strong typography, clear hierarchy, visible progress, concise explanatory copy.
- Progress must communicate both the current section and overall completion percentage.
- Related verification should use progressive reveal within the current screen where practical, rather than repeatedly sending the user to another page.
- Section-transition feedback should provide a small payoff during the journey without pretending that the final diagnostic has already been completed.
- The final diagnostic experience should be conclusion-first and visually dramatic: surface the reconstructed sales system and 3–5 priority findings before detailed substantiation.
- The client-facing print/PDF version requires a dedicated document layout; it must not rely on simply printing the web-card presentation.
- Use ordinary business language in the interface. Cross-Through terminology belongs primarily in analysis/report guidance, not as required user vocabulary.
- SAGE should be used lightly as the product/guide identity; no fake-human chatter or cute AI personality.
- Current landing headline: **“Improve your sales by improving how you sell.”**
- Current supporting proposition: the business already has a sales system; SAGE helps it understand what is working, what is missing, and where improvement matters.
- Current light product label: **Sales System Guide**.

## 10. Data and persistence

Current V1 is client-side:
- answers are stored in browser `localStorage` under `sage-diagnostic-answers`;
- there is no server-side user record, database, authentication, CRM connection, or uploaded sales data;
- starting a new review clears the stored diagnostic answers;
- the diagnostic is generated in the browser from the current answers.

This is the current V1 implementation decision, not a commitment to future persistence architecture.

## 11. Technical architecture

Current stack:
- React 19
- Vite 7
- Cloudflare Vite plugin
- Cloudflare Workers static SPA deployment
- GitHub repository `SRYProjects/TSS-GPT`

Separation of concerns is intentional:
- `src/diagnosticConfig.js` — questions, stages, answer options, adaptive follow-ups, guide-topic mappings.
- `src/diagnosticRules.js` — direct findings and cross-answer diagnostic rules.
- `src/diagnosticEngine.js` — strengths, deduplication/supersession, corroboration, prioritization, current-system reconstruction, build-path assembly, report object.
- `src/App.jsx` — user journey and presentation logic.
- `src/styles.css` — visual system.
- `src/diagnosticTest.js` — manual diagnostic fixture; not imported in production.

Keep business/domain logic separate from UI code where practical.

## 12. AI behavior and boundaries

V1 is **deterministic and rules-based**. There is no production AI/LLM dependency.

Therefore:
- SAGE must not imply that an AI model independently investigated the business.
- Findings must be traceable to user answers and explicit diagnostic rules.
- Uncertainty must remain uncertainty.
- Hypotheses must not be presented as established causes.
- Future AI assistance may be considered, but its role, provider, cost, privacy model, and architecture are not locked V1 decisions.

## 13. Commercial and future direction

Locked direction:
- The free diagnostic should deliver genuine standalone value.
- Users may then use the Cross-Through guide to work internally or seek professional help.
- Paid work may include deeper investigation, system design, implementation, testing, evidence/controls, and continuing management.
- Longer-term product direction may include a recurring AI-enabled sales-performance system.

Not locked:
- pricing;
- checkout/billing implementation;
- packaging of paid services;
- exact future AI architecture.

## 14. Superseded/rejected directions

Do not revive these without an explicit product decision:
- the original fixed 13-question assessment;
- a user-facing score;
- positioning SAGE as an “opportunity finder”;
- broad B2C/consumer targeting for V1;
- forcing Presence → Presentation → Confirmation into a universal sequence;
- forcing foundational actions into one-to-one Cross-Through-point mappings;
- making Cross-Through jargon a prerequisite for using the app;
- making proprietary sales strategies separate diagnostic sections;
- requiring CRM/document uploads or a heavy data-intake process;
- using AI/API/database infrastructure merely because it may be useful later.

## 15. Unresolved items

These are not locked and must not be guessed:
- how the Cross-Through guide will be delivered/accessed from the app;
- final consistency of user-facing naming between “Free Sales System Review,” “Sales System Diagnostic,” and the formal Cross-Through diagnostic name;
- paid-service packaging, pricing, billing, and conversion mechanics;
- whether/when AI is introduced after deterministic V1;
- whether future versions require accounts, server persistence, or saved diagnostic history.

Update this file only when a genuine product decision changes.
