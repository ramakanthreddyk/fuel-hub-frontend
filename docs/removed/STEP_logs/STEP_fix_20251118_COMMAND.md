# STEP_fix_20251118_COMMAND.md — Nozzle validator type casting

## Project Context Summary
Recent refactoring replaced the pump `label` field with `name`. After regenerating the Prisma client, `tsc` still failed due to a type mismatch in the nozzle validator.

## Steps Already Implemented
- Response object consistency fix (STEP_fix_20251117.md)

## What to Build Now
- Cast `fuelType` to the union type in `validateCreateNozzle` so TypeScript accepts the result.
- Document the fix across changelog, phase summary and implementation index.

## Files to Update
- `src/validators/nozzle.validator.ts`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251118_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Append row in `IMPLEMENTATION_INDEX.md`.
- Summarise in `PHASE_2_SUMMARY.md`.
