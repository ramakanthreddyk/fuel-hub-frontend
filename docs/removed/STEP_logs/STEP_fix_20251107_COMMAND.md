# STEP_fix_20251107_COMMAND.md

## Project Context Summary
The previous fix step added a "When Adding a New Database Column" section to
`FRONTEND_REFERENCE_GUIDE.md`. Review feedback indicated this workflow should
live in the database documentation instead. The frontend guide must focus solely
on the canonical spec and how the UI consumes it.

## Steps Already Implemented
- Fix `STEP_fix_20251106.md` documented column changes in the frontend guide.

## What to Build Now
- Remove the column update instructions from `FRONTEND_REFERENCE_GUIDE.md` and
  replace them with a short pointer to the database guide.
- Add a new section in `DATABASE_MANAGEMENT.md` describing the end-to-end flow
  for adding a new column: migrations, scripts, db_brain update, backend update,
  backend docs, OpenAPI spec sync, and finally frontend updates.
- Mention the new doc location in `PHASE_3_SUMMARY.md`.
- Log this adjustment in `CHANGELOG.md` and append a row in
  `IMPLEMENTATION_INDEX.md`.
- Summarize the fix in `STEP_fix_20251107.md`.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/DATABASE_MANAGEMENT.md`
- `docs/FRONTEND_REFERENCE_GUIDE.md`
- `docs/PHASE_3_SUMMARY.md`
