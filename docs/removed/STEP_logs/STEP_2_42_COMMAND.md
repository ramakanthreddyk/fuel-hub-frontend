# STEP_2_42_COMMAND.md — Automated alert rules

## Project Context Summary
FuelSync Hub provides an alerts system for notifications. Manual alert endpoints exist but there are no automated checks to raise common issues.

## Steps Already Implemented
Backend phase completed through **Step 2.41** which added alert creation and summary endpoints.

## What to Build Now
- Create `src/services/alertRules.service.ts` containing functions to evaluate:
  - No readings in 24+ hours.
  - Active nozzle without fuel price.
  - Creditors exceeding 90% of credit limit.
  - Station inactivity or pump maintenance overdue.
  - Large discrepancies between successive readings.
  - Missing cash reports per shift.
  Each function should insert alerts via `alert.service.ts`.
- Document these behaviours in `docs/BUSINESS_RULES.md`.
- Update changelog, phase summary and implementation index.

## Files To Update
- `src/services/alertRules.service.ts`
- `docs/BUSINESS_RULES.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
