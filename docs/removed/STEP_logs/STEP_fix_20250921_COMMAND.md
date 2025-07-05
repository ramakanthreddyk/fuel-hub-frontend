# STEP_fix_20250921_COMMAND.md

## Project Context Summary
The daily summary endpoint currently filters nozzle readings by date inside the CTE. This prevents `LAG` from returning the previous day's reading when a nozzle has only one entry for the day.

## Steps Already Implemented
All fixes through `STEP_fix_20250920.md` are complete.

## What to Build Now
- Update `getDailySummary` in `src/controllers/reconciliation.controller.ts`.
  - Remove the date filter from the CTE and add `recorded_at` to its output.
  - Filter by date after the CTE so LAG can access the previous day.
- Ensure documentation and OpenAPI reflect the updated query parameters and behaviour.
- Add changelog entry, update implementation index and phase summary.

## Required Documentation Updates
- `CHANGELOG.md`
- `IMPLEMENTATION_INDEX.md`
- `PHASE_2_SUMMARY.md`
- `docs/openapi.yaml`
- `docs/missing/IMPLEMENTATION_GUIDE.md`
