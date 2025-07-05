# STEP_fix_20250918_COMMAND.md

## Project Context Summary
FuelSync Hub returns string values for numeric and date columns from the Postgres driver. A previous fix converted only sales volume and amount. All endpoints should return correctly typed values.

## Steps Already Implemented
See `IMPLEMENTATION_INDEX.md` up to `STEP_fix_20250917.md`.

## What to Build Now
- Create a utility to parse numbers and ISO dates from query results.
- Apply this utility across all service functions that return rows or single row objects.
- Ensure no API returns numeric or date strings.
- Update docs: changelog, phase summary, implementation index.

## Required Documentation Updates
- Append fix entry to `CHANGELOG.md`.
- Mark fix done in `PHASE_2_SUMMARY.md`.
- Add row to `IMPLEMENTATION_INDEX.md`.
