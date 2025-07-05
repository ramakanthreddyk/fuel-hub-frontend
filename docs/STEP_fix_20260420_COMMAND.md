# STEP_fix_20260420_COMMAND.md

## Project Context Summary
FuelSync Hub maintained `docs/openapi/openapi.yaml` in addition to the canonical `docs/openapi-spec.yaml`. Some docs still referenced the old path and this caused confusion for developers.

## Steps Already Implemented
- `src/api/codegen.ts` already points to `docs/openapi-spec.yaml`.
- Frontend guidance in `FRONTEND_BRAIN.md` states this is the single source of truth.

## What Was Done Now
- Removed the outdated file `docs/openapi/openapi.yaml`.
- Updated documentation references from `docs/openapi.yaml` to `docs/openapi-spec.yaml`.
- Confirmed generation script uses the canonical spec path.
- Logged this fix in CHANGELOG and IMPLEMENTATION_INDEX.

## Required Documentation Updates
- `CHANGELOG.md`
- `docs/backend/CHANGELOG.md`
- `docs/backend/IMPLEMENTATION_INDEX.md`
- `docs/backend/PHASE_3_SUMMARY.md`
