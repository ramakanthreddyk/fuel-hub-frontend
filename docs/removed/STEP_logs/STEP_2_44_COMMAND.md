# STEP_2_44_COMMAND.md — Role Journey Documentation

## Project Context Summary
FuelSync Hub has a multi‑tenant backend with role based access control. The openAPI specification and backend services exist but we lack consolidated journey docs per role. These docs will serve as onboarding, QA and future drift checks.

Phase 2 implementation is currently at step 2.43 with price validation on nozzle readings. All backend endpoints are present, but role journeys are not summarised.

## Steps Already Implemented
* Full auth and admin APIs up to `STEP_2_43`.
* Owner role implementation with profit tracking and analytics.
* Attendant endpoints for cash reports and alerts.

## What to Build Now
Create detailed journey documents for each role (SUPERADMIN, OWNER, MANAGER, ATTENDANT). Each doc must map login, JWT contents, accessible endpoints, database tables, permission checks, success and error responses, and sample flows. Highlight TODOs where behaviour is ambiguous.

## Files to Update
- `docs/journeys/SUPERADMIN.md` (new)
- `docs/journeys/OWNER.md` (new)
- `docs/journeys/MANAGER.md` (new)
- `docs/journeys/ATTENDANT.md` (new)
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`

## Acceptance Criteria
* Each journey file lists all endpoints available to that role, grouped logically.
* Include request/response samples and DB references where possible.
* Changelog entry and implementation index row added for step 2.44.
* Phase summary updated with a short description of the new documentation.

## Next Step
``` 
Codex, begin execution of STEP_2_44_COMMAND.md
```
