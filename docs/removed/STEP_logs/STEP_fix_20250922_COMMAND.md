# STEP_fix_20250922_COMMAND.md

## Project Context Summary
FuelSync Hub exposes a daily summary endpoint that calculates nozzle delta volumes and sales values. Previous fixes adjusted the query to include the prior day's reading, but pricing still does not account for the reading timestamp and entries with only one reading are filtered out.

## Steps Already Implemented
All fixes through `STEP_fix_20250921.md` are complete.

## What to Build Now
- Refine `getDailySummary` in `src/controllers/reconciliation.controller.ts`:
  - Compute `previous_reading` across all readings without date restriction.
  - Apply date filter after the CTE and include `nr.recorded_at` in the CTE output.
  - Use a LEFT JOIN LATERAL to pick the applicable fuel price record based on `recorded_at`.
  - Remove the `previous_reading IS NOT NULL` filter so single readings are shown.
- Update OpenAPI docs for `/api/v1/reconciliation/daily-summary` to document query parameters and response schema.
- Add changelog entry, update `PHASE_2_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.
- Document the fix in `docs/STEP_fix_20250920.md`.

## Required Documentation Updates
- `CHANGELOG.md`
- `IMPLEMENTATION_INDEX.md`
- `PHASE_2_SUMMARY.md`
- `docs/openapi.yaml`
- `docs/STEP_fix_20250920.md`
