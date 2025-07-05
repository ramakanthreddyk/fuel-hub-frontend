# STEP_2_40_COMMAND.md — Nozzle reading creation validation endpoint

## Project Context Summary
Nozzle readings generate sales automatically. We must ensure a reading can only be created when the nozzle is active and a valid fuel price exists for its fuel type. Currently there is no API to check these prerequisites before submitting a reading.

## Steps Already Implemented
Backend phase completed through **Step 2.39** which added fuel price validation endpoints.

## What to Build Now
- Add a service function in `src/services/nozzleReading.service.ts` that verifies a nozzle is active and that an active fuel price exists for its fuel type.
- Add a controller method in `src/controllers/nozzleReading.controller.ts` that exposes this check.
- Register route `GET /nozzle-readings/can-create/:nozzleId` in `src/routes/nozzleReading.route.ts`.
- Document the endpoint in `docs/openapi.yaml` and `src/docs/swagger.ts`.
- Update changelog, phase summary and implementation index.

## Files To Update
- `src/services/nozzleReading.service.ts`
- `src/controllers/nozzleReading.controller.ts`
- `src/routes/nozzleReading.route.ts`
- `docs/openapi.yaml`
- `src/docs/swagger.ts`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
