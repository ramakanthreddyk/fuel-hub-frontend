# STEP_2_20_COMMAND.md — API Alignment Backend Updates

## Project Context Summary
Frontend specification in `frontend/docs/openapi-v1.yaml` lists endpoints that the backend still lacks. The `api-diff.md` document highlights missing alerts handling, station comparison alias, fuel price update and sales export routes. Phase 2 completed up to step 2.19 with dashboard expansion.

## Steps Already Implemented
- Core CRUD and analytics endpoints through `STEP_2_19`.
- Fix steps up to `STEP_fix_20250713` documented in `CHANGELOG.md`.

## What to Build Now
Implement missing backend endpoints so the frontend and backend specs align:
1. Global alerts API: `GET /api/v1/alerts` and `PATCH /api/v1/alerts/:id/read`.
2. Alias `GET /api/v1/analytics/station-comparison` calling existing station comparison logic.
3. Update fuel price records with `PUT /api/v1/fuel-prices/:id`.
4. Expose sales export via `POST /api/v1/reports/sales` accepting filter params.
5. Document these routes in `docs/openapi.yaml` and `src/docs/swagger.ts`.
6. Mount new routers in `src/app.ts` and add service/controller functions as needed.
7. Write `frontend/docs/integration-instructions.md` describing required frontend hook updates.
8. Update `CHANGELOG.md`, `PHASE_2_SUMMARY.md`, and `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `src/services/inventory.service.ts`
- `src/controllers/alerts.controller.ts` (new)
- `src/routes/alerts.route.ts` (new)
- `src/controllers/analytics.controller.ts`
- `src/routes/analytics.route.ts`
- `src/controllers/fuelPrice.controller.ts`
- `src/services/fuelPrice.service.ts`
- `src/routes/fuelPrice.route.ts`
- `src/controllers/reports.controller.ts`
- `src/routes/reports.route.ts`
- `src/app.ts`
- `docs/openapi.yaml`
- `src/docs/swagger.ts`
- `frontend/docs/api-diff.md`
- `frontend/docs/integration-instructions.md` (new)
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/CHANGELOG.md`
