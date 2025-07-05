# STEP_2_50_COMMAND.md — Setup status API

## Project Context Summary
The FuelSync Hub backend is a Node/Express API with PostgreSQL. Backend work is complete through **Step 2.49** which aligned `successResponse` parameters. The application uses schema-per-tenant tables and JWT-based tenant context.

## Steps Already Implemented
* All core CRUD endpoints for stations, pumps, nozzles and fuel prices exist.
* Phase 2 documentation up to step 2.49 is complete.

## What to Build Now
Implement a new endpoint `GET /api/v1/setup-status` that returns whether a tenant has completed the minimum setup. This should be computed on the fly using entity counts; no new tables.

## Files to Update
* `src/services/setupStatus.service.ts` (new) — calculate counts and return `SetupStatusDTO`.
* `src/controllers/setupStatus.controller.ts` (new) — expose a handler using the service.
* `src/routes/setupStatus.route.ts` (new) — route definition.
* `src/app.ts` — mount the new router.
* `docs/openapi.yaml` — document the endpoint.
* `docs/PHASE_2_SUMMARY.md`
* `docs/IMPLEMENTATION_INDEX.md`
* `docs/CHANGELOG.md`
* `docs/STEP_2_50_COMMAND.md` (this file)

## Required Documentation Updates
* Add changelog entry under Features.
* Mark step done in `PHASE_2_SUMMARY.md`.
* Append row in `IMPLEMENTATION_INDEX.md`.
