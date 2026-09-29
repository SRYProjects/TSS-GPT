# AGENTS.md

Standing operating contract for coding agents working in this repository.

1. Read `PRODUCT_SPEC.md` first. It is the authority for locked product decisions.
2. Read `PROJECT_STATE.md` second. It is the current implementation checkpoint.
3. Inspect the live repository and recent commits before changing code.
4. Treat the live codebase as implementation truth.
5. Never guess when project records conflict, are incomplete, or do not support a decision. Surface the uncertainty and ask only for the clarification required to proceed.
6. Preserve behavior that has already been tested and locked unless the current task explicitly changes it or newer testing proves a defect.
7. Prefer small, testable, deployable increments over large speculative builds.
8. Do not overbuild beyond the documented V1 scope.
9. Keep business/domain logic separate from UI code where practical. In particular, preserve the separation among diagnostic configuration, diagnostic rules/engine, and presentation.
10. Run available build/tests after meaningful code changes. Where automated tests do not exist, perform the smallest relevant verification and record the limitation.
11. Use meaningful commit messages.
12. After substantial work, update `PROJECT_STATE.md` with:
    - what changed;
    - testing status;
    - known issues;
    - the exact next step.
13. Update `PRODUCT_SPEC.md` only when an actual product decision changes.
14. Do not use conversation memory as the sole authority when repository documentation or code is available.

Keep this file focused on how agents work. Do not duplicate the full product specification or project state here.
