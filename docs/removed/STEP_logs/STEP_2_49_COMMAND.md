# STEP_2_49_COMMAND.md — successResponse parameter alignment

## Project Context Summary
Some create endpoints still call `successResponse` with the HTTP status as the third
argument. Since Step 2.47 standardised `successResponse(res, data, message?, status = 200)`,
passing the status in the third slot leads to TypeScript errors during build.

## Steps Already Implemented
Backend work is complete through **Step 2.48** which documented scripts and cleaned up utilities.

## What to Build Now
- Update all controller calls that pass a number as the third parameter to `successResponse`.
  They should pass `undefined` as the message and specify the status in the fourth position.
- No other functional changes.

## Files to Update
- `src/controllers/admin.controller.ts`
- `src/controllers/adminUser.controller.ts`
- `src/controllers/alerts.controller.ts`
- `src/controllers/attendant.controller.ts`
- `src/controllers/creditor.controller.ts`
- `src/controllers/delivery.controller.ts`
- `src/controllers/fuelPrice.controller.ts`
- `src/controllers/nozzle.controller.ts`
- `src/controllers/nozzleReading.controller.ts`
- `src/controllers/pump.controller.ts`
- `src/controllers/reconciliation.controller.ts`
- `src/controllers/reports.controller.ts`
- `src/controllers/station.controller.ts`
- `src/controllers/tenant.controller.ts`
- Update docs: `docs/CHANGELOG.md`, `docs/PHASE_2_SUMMARY.md`, `docs/IMPLEMENTATION_INDEX.md`.
- `docs/STEP_2_49_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
