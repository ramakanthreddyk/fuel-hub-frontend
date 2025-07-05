# STEP_2_19_COMMAND.md — Dashboard & Sales Metrics Expansion

## Project Context Summary
Phase 2 backend is mostly complete through step 2.18 which added tenant APIs. Recent fixes improved dashboard bugs. The dashboard, station and sales endpoints currently provide only basic metrics and lack query parameters for station or date range filtering. Implementation index shows step 3.x UI work is pending.

## Steps Already Implemented
- Full auth, station and sales services up to `STEP_2_18`.
- Fixes through `STEP_fix_20250710` for dashboard bugs.

## What to Build Now
Add richer metrics endpoints for dashboard, stations and sales:
- Accept `stationId` and optional date range on dashboard endpoints.
- Extend sales listing with pagination and date filters.
- New `GET /api/v1/sales/analytics` with station-wise aggregation.
- Station list can include metrics via `includeMetrics=true`.
- New routes `/api/v1/stations/:id/metrics` and `/api/v1/stations/:id/performance` with simple comparative figures.
- Update middleware `checkStationAccess` to look at query params.
- Document all new endpoints in `docs/openapi.yaml`.
- Update summaries and changelog.

## Files To Update
- `src/middlewares/checkStationAccess.ts`
- `src/controllers/dashboard.controller.ts`
- `src/controllers/station.controller.ts`
- `src/controllers/sales.controller.ts`
- `src/services/station.service.ts`
- `src/services/sales.service.ts`
- `src/routes/dashboard.route.ts`
- `src/routes/station.route.ts`
- `src/routes/sales.route.ts`
- `src/validators/sales.validator.ts`
- `docs/openapi.yaml`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/CHANGELOG.md`
