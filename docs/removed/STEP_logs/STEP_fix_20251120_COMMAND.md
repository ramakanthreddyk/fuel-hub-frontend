# STEP_fix_20251120_COMMAND.md — Fuel price spec station id

## Project Context Summary
Fuel price responses now include related station name but the OpenAPI spec only documented the station name. The listing endpoint also didn't include the station relation.

## Steps Already Implemented
- Fuel price station names doc update (STEP_fix_20251119)

## What to Build Now
- Update `openapi.yaml` and `docs/missing/COMPLETE_API_SPEC.yaml` so `FuelPrice` includes `station` object with `id` and `name`.
- Update `src/controllers/fuelPrice.controller.ts` to return station `id` and `name` via Prisma include.
- Document the fix in changelog, phase summary and implementation index.

## Files to Update
- `docs/openapi.yaml`
- `docs/missing/COMPLETE_API_SPEC.yaml`
- `src/controllers/fuelPrice.controller.ts`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251120.md` (summary)

## Required Documentation Updates
- Changelog entry under Fixes.
- Implementation index row appended.
- Phase summary updated.
