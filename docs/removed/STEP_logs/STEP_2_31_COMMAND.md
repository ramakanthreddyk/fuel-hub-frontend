# STEP_2_31_COMMAND.md — Backend Endpoint Expansion

## Project Context Summary
FuelSync Hub backend is mid-migration to Prisma ORM with unified public schema. Previous steps added pump nozzle counts and populated OpenAPI schemas. Several frontend endpoints remain missing in the backend and the spec.

## Steps Already Implemented
- Backend CRUD and analytics endpoints up to Step 2.30
- OpenAPI schemas imported from frontend spec (Fix 2025-07-31)

## What to Build Now
1. Implement new endpoints required by the frontend:
   - `DELETE /api/v1/alerts/{alertId}`
   - `GET /api/v1/analytics/hourly-sales`
   - `GET /api/v1/analytics/peak-hours`
   - `GET /api/v1/analytics/fuel-performance`
   - `GET /api/v1/creditors/{id}`
   - `GET /api/v1/stations/{stationId}`
   - `GET /api/v1/users/{userId}`
2. Use Prisma ORM for database access and wrap responses in `{ data }`.
3. Extend `docs/openapi.yaml` with parameters and schemas for these paths.
4. Update `backend_brain.md`, `CHANGELOG.md`, `PHASE_2_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `src/controllers/alerts.controller.ts`
- `src/controllers/analytics.controller.ts`
- `src/controllers/creditor.controller.ts`
- `src/controllers/station.controller.ts`
- `src/controllers/user.controller.ts`
- `src/routes/alerts.route.ts`
- `src/routes/analytics.route.ts`
- `src/routes/creditor.route.ts`
- `prisma/schema.prisma`
- `src/services/analytics.service.ts` (new)
- `src/services/alert.service.ts` (new)
- `docs/openapi.yaml`
- Documentation files listed above
