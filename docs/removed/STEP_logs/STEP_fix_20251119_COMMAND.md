# STEP_fix_20251119_COMMAND.md — Fuel price response station names

## Project Context Summary
The backend now returns station names in the fuel prices API response. Documentation must reflect this enhancement.

## Steps Already Implemented
- Nozzle validator type cast (STEP_fix_20251118.md)

## What to Build Now
- Update the backend requirements documentation to note that `/api/v1/fuel-prices` includes a `station` object with `id` and `name`.
- Document the fix in changelog, phase summary and implementation index.

## Files to Update
- `backend_brain.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251119_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Append row to `IMPLEMENTATION_INDEX.md`.
- Summarise fix in `PHASE_2_SUMMARY.md`.
