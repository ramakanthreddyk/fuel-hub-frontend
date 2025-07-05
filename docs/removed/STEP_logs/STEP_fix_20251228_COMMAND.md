# STEP_fix_20251228_COMMAND.md

## Project Context Summary
FuelSync Hub is a multi-tenant ERP. Backend nozzle reading APIs were fixed to
persist payment method, support `limit` queries and expose `missingPrice`.
Frontend pages and hooks must now consume these updates efficiently.

## Steps Already Implemented
- Backend fixes recorded in `STEP_fix_20251227.md` updated the API and docs.

## What to Build Now
- Update frontend services and hooks to use the new `limit` parameter when
  fetching the latest reading.
- Ensure `paymentMethod` is included when creating readings.
- Expose `missingPrice` from `useCanCreateReading` results.
- Display reading values with three-decimal precision.
- Document the changes in changelogs and summaries.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
