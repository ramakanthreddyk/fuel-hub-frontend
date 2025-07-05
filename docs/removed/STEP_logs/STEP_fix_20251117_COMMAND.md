# STEP_fix_20251117_COMMAND.md — Pump & nozzle GET response format

## Project Context Summary
FuelSync Hub responses should always nest returned data under a `data` object. Some GET handlers still passed a raw `pump` or `nozzle` to `successResponse` which breaks this contract.

## Steps Already Implemented
- successResponse parameter alignment (STEP_2_49_COMMAND.md)
- Nozzle request schema cleanup (STEP_fix_20251116_COMMAND.md)

## What to Build Now
- Ensure the GET handlers for pumps and nozzles use `successResponse(res, { pump })` and `successResponse(res, { nozzle })`.
- Document the fix across changelog, phase summary and implementation index.

## Files to Update
- `src/controllers/pump.controller.ts`
- `src/controllers/nozzle.controller.ts`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251117_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Append row in `IMPLEMENTATION_INDEX.md`.
- Summarise in `PHASE_2_SUMMARY.md`.
