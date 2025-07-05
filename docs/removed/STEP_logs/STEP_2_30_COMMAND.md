# STEP_2_30_COMMAND.md — Pump Listing Enhancement

## Project Context Summary
FuelSync Hub backend partially migrated to Prisma ORM. Pumps endpoint lacked nozzle counts and documentation did not reflect the unified response format.

## Steps Already Implemented
- Prisma introduced with basic models and several controllers migrated (Steps 2.23–2.29).

## What to Build Now
1. Extend pump listing to include the number of nozzles for each pump using Prisma `_count`.
2. Document the success response structure with a `data` wrapper and update `/pumps` notes in OpenAPI.
3. Update `backend_brain.md`, changelog and implementation index.

## Files To Update
- `src/controllers/pump.controller.ts`
- `docs/openapi.yaml`
- `backend_brain.md`
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
