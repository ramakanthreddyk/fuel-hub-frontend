# STEP_fix_20251116_COMMAND.md — Nozzle request schema cleanup

## Project Context Summary
FuelSync Hub is a multi-tenant Node/Express API documented in `docs/openapi.yaml`.  Previous steps fixed pump schemas and added validation for nozzle fuel types.  However the nozzle endpoints still used generic request objects and the allowed `fuelType` and `status` values were not visible.

## Steps Already Implemented
- Pump request schema correction (STEP_fix_20251114)
- Nozzle fuel type validation (STEP_2_52)

## What to Build Now
- Update `docs/openapi.yaml` around lines 410–468 so the POST and PUT nozzle endpoints reference `CreateNozzleRequest` instead of an anonymous object.
- Extend `CreateNozzleRequest` schema with optional `status` and list allowed enums for both `fuelType` and `status`.
- Document the change in changelog, phase summary and implementation index.

## Files to Update
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251116_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Summarise fix in `PHASE_2_SUMMARY.md`.
- Append new row in `IMPLEMENTATION_INDEX.md`.
