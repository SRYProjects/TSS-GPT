# SAGE — PROJECT STATE

**Repository:** `SRYProjects/TSS-GPT`  
**Default branch:** `main`  
**Active migration branch:** `cross-through-spec-migration`  
**Draft PR:** #1 — Migrate SAGE to authoritative Cross-Through build specification  
**Production:** `https://thesalessuccess.app`  
**Cloudflare Worker:** `tss-gpt`

## Current checkpoint — 2026-10-05

The October 2026 **Cross-Through System — Build Instructions: Comprehensive Specification** supersedes the prior SAGE questionnaire/report architecture wherever the two conflict.

The migration is intentionally isolated from production. `main` still contains the previously deployed application. No production merge has been performed from this session.

## What changed on the migration branch

Created a clean V2 implementation instead of patching the legacy seven-condition diagnostic in place.

### New authoritative implementation files

- `src/sageV2Config.js`
  - three fixed foundational actions;
  - four fixed Cross-Through relationships;
  - Foundation + four buyer-progression sections + Sales Process + Capability & Execution;
  - Core + Deep Dive question definitions;
  - inline sales-line trigger logic;
  - broad buyer framing rather than B2B-only framing.

- `src/sageV2Engine.js`
  - only four answer states: NO / UNKNOWN / NO VERIFICATION / ESTABLISHED;
  - descriptive Foundation questions are state-free;
  - skipped Deep Dives are neutral;
  - sales-line target/verification findings;
  - per-step objective findings only when Process Deep Dive is opened;
  - capability breakdown findings;
  - three-state milestone map: not yet reached / clear / worth testing;
  - evidence-bounded plan/report assembly;
  - no numeric score, ranking, maturity ladder, completion percentage, or legacy taxonomy.

- `src/SageV2.jsx`
  - new landing and review journey;
  - no global Step X of Y or percentage;
  - explicit Continue actions;
  - multi-select toggle behavior;
  - separate Something else vs. Not sure behavior;
  - inline distinct-sales-line reveal immediately after Awareness discovery;
  - optional Deep Dives with the required permission copy;
  - section observations when answers support one;
  - report available during the journey;
  - report opens with user-selected priority direction;
  - completed milestone map;
  - findings grouped by section;
  - save/star next-step builder;
  - What's working / What's not yet confirmed summary;
  - prefilled editable hypothesis builder;
  - contextual support prompts;
  - final support offer;
  - existing `/admin` route preserved.

- `src/sageV2.css`
  - dark professional visual system;
  - no red/green judgment coloring;
  - larger readable type;
  - responsive milestone path and report;
  - print treatment.

### Existing files changed

- `src/main.jsx` now points to `SageV2` on the migration branch and still loads the legacy stylesheet for Admin compatibility.
- `worker/index.js` accepts both historical telemetry stage IDs and the current Foundation/Awareness/Alignment/Resolution/Decision/Process/Execution IDs.
- `PRODUCT_SPEC.md` replaced with the authoritative V2 decisions and implementation clarifications.
- `.github/workflows/validate.yml` added to run `npm install` + `npm run build` on the migration branch and PR.

## What was deliberately not changed

- Production `main` has not been merged or deployed from this work.
- Existing D1 database and admin analytics remain intact.
- Existing anonymous telemetry event names remain intact.
- Legacy `App.jsx`, `diagnosticConfig.js`, `diagnosticRules.js`, `diagnosticEngine.js`, and `diagnosticExperience.js` remain for rollback/reference until V2 is validated. They are not authoritative for the V2 product.
- No production support/contact destination was invented. V2 prepares support-request text until the actual route is confirmed.

## Important implementation clarifications recorded

1. **Distinct sales lines:** the source specification says both that it is “fine to pick none” and that Continue enables once at least one line is selected. V2 follows the explicit user-facing promise: zero selected lines is allowed; if a line is selected, its tracking answer becomes required.
2. **“Not sure — we don't really track this”:** this contains both uncertainty and an explicit lack-of-verification statement. V2 maps it to **NO VERIFICATION**, treating the specific verification condition as controlling.
3. Deep Dive omission is never treated as evidence of weakness.
4. Process-step objective blanks become UNKNOWN only when the user actually opened that Deep Dive.

## Testing status

### Repository inspection
Completed:
- live repository identified;
- current main branch inspected;
- existing AGENTS / PRODUCT_SPEC / PROJECT_STATE reviewed;
- recent commits reviewed;
- legacy conflicts against the new governing specification identified.

### Automated build
A GitHub Actions validation workflow has been added and triggered for the migration branch / draft PR.

Validation command:
- `npm install`
- `npm run build`

**Status at time of this checkpoint:** running / awaiting final result.

### Browser / production
Not yet performed for V2. Production remains on the old main-branch application.

## Known risks / items to verify

- Automated build may expose JSX/import/syntax issues that require correction before browser testing.
- V2 needs a full desktop and narrow-screen browser regression.
- The conditional sales-line trigger must be exercised with:
  - one discovery group;
  - 2 selected channels;
  - 3+ channels across 2+ groups;
  - custom “Something else” channel.
- Deep Dive neutrality must be verified by comparing a skipped section with an opened-but-partially-answered section.
- Capability breakdown must be checked for multiple named activities.
- “See your plan” mid-review must not manufacture findings from unanswered sections.
- Print / Save PDF needs browser validation.
- Existing Admin Dashboard styling must be checked because the legacy stylesheet remains loaded alongside V2 styles.
- Support CTA production destination remains unresolved.

## Exact next step

1. Read the current GitHub Actions result for PR #1.
2. If the build fails, inspect the failing job and correct the migration branch until `npm run build` passes.
3. Once the build passes, perform browser regression against a preview/branch deployment before merging:
   - Landing;
   - Foundation;
   - each four Cross-Through sections;
   - sales-line conditional flow;
   - one skipped Deep Dive;
   - one opened Deep Dive;
   - Sales Process objective behavior;
   - Capability & Execution;
   - mid-review plan;
   - full report;
   - priority selection + hypothesis;
   - saved next steps;
   - print view;
   - mobile/narrow viewport;
   - `/admin`.
4. Merge only after V2 passes that regression.
5. After merge, confirm Cloudflare production deployment and re-run a short production smoke test.

## Short remaining roadmap

1. Pass automated branch build.
2. Browser-test V2 on a preview/branch deployment.
3. Correct functional and diagnostic defects.
4. Confirm the real professional-support/contact route and wire the CTA destination.
5. Merge PR #1.
6. Confirm Cloudflare deployment.
7. Run production regression.
8. Remove or archive legacy diagnostic files only after rollback risk is no longer material.

## Start-of-session rule

At the start of every future project conversation:

1. Read `PRODUCT_SPEC.md`.
2. Read `PROJECT_STATE.md`.
3. Inspect the current repository and recent commits.
4. Treat the live code as implementation truth unless it conflicts with a newer authoritative product decision.
5. Continue from the documented exact next step.

## End-of-session protocol

After substantial work:

1. Commit working code with a meaningful commit message.
2. Update `PROJECT_STATE.md`.
3. Record what changed.
4. Record testing status.
5. Record known issues.
6. Record the exact next step.
7. Update `PRODUCT_SPEC.md` only when a genuine product decision changes.
