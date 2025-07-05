# STEP_fix_20251109_COMMAND.md

## Project Context Summary
The frontend guide previously implied that schema updates might begin in the frontend. Review feedback specified an authoritative flow beginning from the database. We must clarify the propagation order and emphasize references to database and backend docs.

## Steps Already Implemented
- `STEP_fix_20251108.md` expanded the update list to mention backend docs and the final doc sync step.

## What to Build Now
- Replace the update flow in `docs/FRONTEND_REFERENCE_GUIDE.md` with the new authoritative list.
- Reword the schema change note to stress that the flow starts from the database and to consult `DATABASE_MANAGEMENT.md` and `backend_brain.md`.
- Add an addendum in `docs/PHASE_3_SUMMARY.md` noting the new flow description.
- Log this fix in `docs/CHANGELOG.md` and add a row in `docs/IMPLEMENTATION_INDEX.md`.
- Document the fix summary in `docs/STEP_fix_20251109.md`.

## Required Documentation Updates
- `docs/FRONTEND_REFERENCE_GUIDE.md`
- `docs/PHASE_3_SUMMARY.md`
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251109.md`
