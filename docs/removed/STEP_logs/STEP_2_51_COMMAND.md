# STEP_2_51_COMMAND.md — Nozzle duplicate handling

## Project Context Summary
FuelSync Hub backend exposes CRUD routes for stations, pumps and nozzles. Up through **Step 2.50** the create nozzle endpoint simply returned a generic 400 error on failures. Duplicating a nozzle number for the same pump should surface a conflict.

## Steps Already Implemented
- successResponse and errorResponse utilities standardised (Step 2.49).
- Setup status API added in Step 2.50.

## What to Build Now
- Catch `PrismaClientKnownRequestError` when creating a nozzle and return a 409 response if `err.code === 'P2002'` with message "Nozzle number already exists for this pump.".
- Add a unit test verifying that duplicates yield status 409.
- Document the new 409 response in `docs/openapi.yaml` for `POST /api/v1/nozzles`.
- Update documentation (changelog, phase summary, implementation index).

## Files to Update
- `src/controllers/nozzle.controller.ts`
- `docs/openapi.yaml`
- `tests/nozzle.controller.test.ts` (new)
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_2_51_COMMAND.md` (this file)

## Required Documentation Updates
- Append changelog entry under Fixes.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Add row to `IMPLEMENTATION_INDEX.md`.
