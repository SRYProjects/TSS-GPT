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

### Locked journey-design rules after end-to-end user testing
- Preserve the **full approved diagnostic question bank**. Do not delete valuable diagnostic content merely to shorten the journey.
- Do **not** restore the original questionnaire as one mandatory sequence. The original forced sequence was too burdensome.
- Divide the experience into a **Core Review + optional Deep Dives**:
  - the Core Review collects the minimum evidence needed for a legitimate first diagnostic;
  - Deep Dives preserve additional verification, cause/evidence, buyer-progression, process-variation, testing, and execution questions that can materially make a finding more specific or better supported.
- Deep Dives are voluntary. At selected section checkpoints, users may **Continue** or **Go deeper in this area**. The interface must explain the value of the additional effort.
- Skipping a Deep Dive is never evidence of weakness. SAGE must not convert “not investigated” into a deficiency. Where appropriate, the report should state that additional evidence could sharpen that area.
- The first report must remain genuinely useful from Core Review answers alone.
- From the report, users should be able to return to relevant optional depth, provide more evidence, and regenerate a richer diagnostic without losing existing answers.
- Continue using the six sections. Show **Section N of 6** plus an honest Core Review completion percentage. Optional Deep Dives do not make the user's required progress move backward.
- At major section transitions, provide concise, evidence-bounded feedback about what SAGE has mapped or established so far. These **SAGE Update** breaks are a valued part of the experience and should be preserved.
- Optional Deep Dives must be visually unmistakable at eligible SAGE Update checkpoints, with an explicit choice between continuing the Core Review and going deeper.
- The report must also surface a conspicuous, centralized opportunity to add evidence by area; do not rely only on small links inside individual cards.
- Wherever SAGE declares a diagnostic condition such as **Solid, Incomplete, Disconnected, Unverified, Unknown, Performance Problem, or Execution Exposure**, pair the text with a consistent visual status indicator (colored accent line and dot). Color is supplemental to the written label, never a score.
- Adaptive questioning remains governed by stop / verify / clarify. Verification that is not essential to the first responsible finding belongs in optional depth.
- Step-objective verification samples only a few representative important process steps rather than requiring mapping of every selected step.
- The experience should make the exchange explicit: more evidence can produce a more specific and better-supported report, but the user controls how deep to go.

The first production version (22 core screens plus follow-ups) and the later 18-screen version were both judged too overwhelming. The solution is progressive disclosure and user control—not discarding the diagnostic intelligence.

## 5. Current V1 diagnostic scope

Across the Core Review and optional Deep Dives, the preserved diagnostic question bank can examine:
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

The report has five numbered sections:

1. **Your Current Sales System** — reconstruct important opportunity sources, major sales path(s), advancement context, and reported breakdown points without inventing missing information.
2. **Highest-Priority Findings** — normally 3–5; each should explain what was found, support, why it matters, direction, and evidence of improvement where available.
3. **What Needs Attention** — all supported attention findings using the diagnostic classifications.
4. **What Appears Solid** — only supported strengths.
5. **Your Cross-Through Build Path** — only next actions supported by the findings, with relevant Cross-Through guide topics.

The report must begin with the user's reconstructed current sales system before interpreting gaps, priorities, strengths, or recommended actions. The at-a-glance diagnostic map may follow that reconstruction as an interpretive visual.

Presentation rules:
- The report headline is **Your Sales System Diagnostic** with the plain-language explanation **Here’s how your sales system currently works—and where improvement matters most.**
- **Sales System at a Glance** remains a concise diagnostic-condition summary, not a place for long substantiation.
- Highest-priority findings should be grouped by the kind of work they imply when supported: structural conditions to **Establish first**, followed by conditions to **Verify / improve next**. This grouping is sequencing guidance, not a severity score.
- **What SAGE Found** is the evidence layer. Detailed findings use progressive disclosure/accordions so the report remains scannable while preserving the full evidence, significance, direction, and evidence-of-improvement content.
- **What Appears Solid** is deliberately compact and should not visually compete with priority work.
- **Your Cross-Through Build Path** is the strongest closing section. Each action should state the action, why it matters, what better looks like when evidence is available, and the relevant Cross-Through guide topic.
- Keep the report in the established dark visual system; do not introduce high-contrast white cards as the primary presentation surface.

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
- The final diagnostic experience should be conclusion-first and visually dramatic: lead with a **Sales System at a Glance** visual and the 3–5 priority findings before detailed substantiation.
- The at-a-glance visual communicates diagnostic conditions by area (for example Incomplete, Unverified, Unknown, Execution Exposure, or supported/established where evidence warrants). It must not become a numeric score, grade, benchmark, traffic-light game, or disguised rating.
- Where skipped optional depth could materially sharpen an area, the report may offer **Go deeper in this area** and return the user to the relevant optional questions.
- The client-facing print/PDF version requires a dedicated document layout; it must not rely on simply printing the web-card presentation.
- Use ordinary business language in the interface. Cross-Through terminology belongs primarily in analysis/report guidance, not as required user vocabulary.
- SAGE should be used lightly as the product/guide identity; no fake-human chatter or cute AI personality.
- Current landing headline: **“Improve your sales by improving how you sell.”**
- Current supporting proposition: the business already has a sales system; SAGE helps it understand what is working, what is missing, and where improvement matters.
- Public-goal treatment is locked to:
  - **Help us reach our goal of 1,000.**
  - **Get your FREE sales improvement report.**
  - **Be one of the first 1,000 companies to improve their sales with SAGE.**
  - Show the truthful live completion count inside the progress ring and the truthful remaining count as **X to go!**
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

## 14. Growth, sharing, and privacy-first usage analytics

Locked direction:
- SAGE should be designed to spread because the free diagnostic can provide standalone value to B2B businesses.
- The landing page should show a truthful live completion count and a public goal of reaching **1,000 companies**.
- Never seed, inflate, or imply a number of businesses/users that the system cannot verify.
- Use **Sales System Reviews completed**, not “sales plans created.”
- Provide **Share SAGE** on the landing page and again after the diagnostic has delivered value.
- Sharing language should create intrigue and invite a fresh perspective; it must not imply that another business owner does not understand selling or is doing something wrong.
- Sharing must be explicit rather than silently copying a link. When the user chooses **Share SAGE**, show the SAGE URL and clear sharing choices such as Copy link, Email, LinkedIn, X, and the native device share sheet where supported.
- Preserve infrastructure for future aggregate-insight publishing and tracked professional/partner distribution without exposing diagnostic answers.

### Privacy model

The user's diagnostic answers remain in the browser under the existing local-persistence model.

The shared backend may receive only anonymous product-usage events and minimal non-content metadata needed to operate the counter and understand the funnel. It must not receive:
- diagnostic answer text or selections;
- company or contact names;
- email addresses;
- CRM/customer data;
- raw IP addresses;
- precise location.

Allowed anonymous telemetry includes:
- random anonymous session/review identifiers;
- event type;
- section/stage identifier and ordinal;
- coarse country/region derived at the Cloudflare edge;
- coarse device class;
- referring hostname;
- explicitly sanitized campaign/source tag;
- share channel;
- timestamp.

The anonymous event structure should support future aggregate sales-system research only if a later product decision explicitly authorizes additional non-sensitive categorical collection. Do not silently begin sending diagnostic answers.

### Admin analytics

- Provide an **Admin** link in the site footer.
- Admin analytics must be access-controlled and must never expose diagnostic answers.
- Useful V1 measures include landing sessions, review starts, review completion, report views, Deep Dive usage, shares, section funnel progression, coarse geography, device mix, referring hosts, and tracked source tags.
- Admin authentication secrets must be stored as Cloudflare Worker secrets, never committed to GitHub or shipped to the browser.

## 15. Superseded/rejected directions

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

## 16. Unresolved items

These are not locked and must not be guessed:
- how the Cross-Through guide will be delivered/accessed from the app;
- final consistency of user-facing naming between “Free Sales System Review,” “Sales System Diagnostic,” and the formal Cross-Through diagnostic name;
- paid-service packaging, pricing, billing, and conversion mechanics;
- whether/when AI is introduced after deterministic V1;
- whether future versions require accounts, server persistence, or saved diagnostic history.

Update this file only when a genuine product decision changes.
