# STEP_fix_20251105_COMMAND.md

## Project Context Summary
`docs/openapi.yaml` and `frontend/docs/openapi-v1.yaml` both define the API. Frontend developers sometimes follow the latter, causing divergence. We want a single authoritative reference and cleanup the docs.

## Steps Already Implemented
- Backend work completed through `STEP_2_48_COMMAND.md`.
- Latest fix `STEP_fix_20251102.md` synced both spec files.

## What to Build Now
- Create `docs/FRONTEND_REFERENCE_GUIDE.md` explaining the update flow and pointing to `docs/openapi.yaml`.
- Update `frontend/docs/api-diff.md` intro to mention the canonical spec.
- Amend `PHASE_3_SUMMARY.md` with the new spec path and guide reference.
- Record changes in `CHANGELOG.md` and `IMPLEMENTATION_INDEX.md`.
- Summarize outcome in `docs/STEP_fix_20251105.md`.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_3_SUMMARY.md`
- `docs/FRONTEND_REFERENCE_GUIDE.md`
