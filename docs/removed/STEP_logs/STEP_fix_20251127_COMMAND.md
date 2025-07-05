# STEP_fix_20251127_COMMAND.md — Dashboard station filter handling

## Project Context Summary
Owner dashboard totals were returning zero because the frontend sent `stationId=all`.
Backend endpoints expected the parameter to be omitted.

## Steps Already Implemented
- Dashboard analytics endpoints (Step 2.50+).
- Fixes up to 2025-11-26 recorded in `IMPLEMENTATION_INDEX.md`.

## What to Build Now
- Create `normalizeStationId` helper to sanitize stationId query parameters.
- Update dashboard, inventory, reports, sales, pump, alerts, attendant and analytics controllers to use the helper.
- Document the fix in changelog, phase summary and implementation index.

## Required Documentation Updates
- Changelog entry under Fixes.
- Implementation index row.
- Phase 2 summary addition.
- This command file stored for traceability.
