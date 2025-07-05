# STEP_2_47_COMMAND.md — Response wrapper and analytics endpoints

## Project Context Summary
The API contract now expects all successful responses to include a `success` boolean and optional `message`. Error responses should also support an optional `details` array. Alignment docs also request endpoints for system health metrics, station efficiency and reconciliation approval.

## Steps Already Implemented
Backend phase completed through **Step 2.46** with numerous fixes up to 2025‑11‑02. Success responses currently wrap only `{ data }` and the above endpoints are missing.

## What to Build Now
- Update `successResponse` and `errorResponse` utilities to match the standardised format.
- Adjust controllers that send custom messages via `successResponse`.
- Add endpoint `GET /dashboard/system-health` returning basic uptime and DB status.
- Add endpoint `GET /stations/:stationId/efficiency` computing sales per pump.
- Document these paths in `docs/openapi.yaml` and list them in `backend_brain.md`.

## Files To Update
- `src/utils/successResponse.ts`
- `src/utils/errorResponse.ts`
- `src/controllers/auth.controller.ts`
- `src/controllers/user.controller.ts`
- `src/controllers/tenant.controller.ts`
- `src/app.ts`
- `src/controllers/dashboard.controller.ts`
- `src/routes/dashboard.route.ts`
- `src/services/analytics.service.ts`
- `src/controllers/station.controller.ts`
- `src/services/station.service.ts`
- `src/routes/station.route.ts`
- `docs/openapi.yaml`
- `backend_brain.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add changelog entry under Enhancements.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
