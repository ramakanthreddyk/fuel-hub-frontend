# STEP_2_52_COMMAND.md — Nozzle fuel type & status validation

## Project Context Summary
FuelSync Hub is a multi-tenant Node/Express API with validation utilities for all request bodies.
Through **Step 2.51** duplicate nozzle creation returns a 409 conflict. Fuel type values are listed in the OpenAPI spec but the validator does not enforce them and status is ignored.

## Steps Already Implemented
- Error handling for duplicate nozzle creation (Step 2.51).
- Setup status API and response wrapper alignment (Steps 2.50 & 2.49).

## What to Build Now
- Update `src/validators/nozzle.validator.ts` so `fuelType` must be one of `['petrol','diesel','premium']`.
- Optionally accept a `status` field and validate it against `['active','inactive','maintenance']`.
- Throw clear errors when values are invalid.
- Document the change in changelog, phase summary and implementation index.

## Files to Update
- `src/validators/nozzle.validator.ts`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_2_52_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append a row in `IMPLEMENTATION_INDEX.md`.
