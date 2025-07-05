# STEP_2_46_COMMAND.md — Journey Docs Alignment

## Project Context Summary
FuelSync Hub includes journey docs per role to describe available APIs. After step 2.45 we added SuperAdmin settings endpoints but the documentation now drifts from the OpenAPI and backend. We also want consistency across all role docs.

## Steps Already Implemented
* SuperAdmin settings implementation (STEP_2_45) and earlier role journey docs (STEP_2_44).

## What to Build Now
Update all role journey documents to reflect the latest endpoints, request fields and behaviours from `docs/openapi.yaml` and route implementations. Address gaps noted in the SUPERADMIN review: missing settings endpoints, optional fields, response codes, JWT expiry and database side effects. Ensure OWNER, MANAGER and ATTENDANT docs list all available endpoints including inventory and analytics additions.

## Files to Update
- `docs/journeys/SUPERADMIN.md`
- `docs/journeys/OWNER.md`
- `docs/journeys/MANAGER.md`
- `docs/journeys/ATTENDANT.md`
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/STEP_2_46_COMMAND.md` (this file)

## Acceptance Criteria
* All journey docs mention every route defined for that role.
* Required request fields, response codes and database tables are noted.
* Changelog entry logged for Step 2.46.
* Implementation index and phase summary updated with the new step.

## Next Step
```
Codex, begin execution of STEP_2_46_COMMAND.md
```
