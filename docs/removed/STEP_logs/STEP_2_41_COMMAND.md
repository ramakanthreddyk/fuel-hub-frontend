# STEP_2_41_COMMAND.md — Alert creation & summary endpoints

## Project Context Summary
FuelSync Hub uses an alerts system for inventory and other notifications. Alerts can currently be listed, marked read or deleted but there is no API to create new alerts or retrieve a summary count by priority.

## Steps Already Implemented
Backend phase completed through **Step 2.40** which added nozzle reading validation.

## What to Build Now
- Extend `src/services/alert.service.ts` with `createAlert` and `countBySeverity` functions.
- Add controller handlers for POST `/alerts` and GET `/alerts/summary`.
- Register routes in `src/routes/alerts.route.ts`.
- Document request and response schemas in `docs/openapi.yaml`.
- Update changelog, phase summary and implementation index.

## Files To Update
- `src/services/alert.service.ts`
- `src/controllers/alerts.controller.ts`
- `src/routes/alerts.route.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
