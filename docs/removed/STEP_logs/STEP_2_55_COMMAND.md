# STEP_2_55_COMMAND.md — Dashboard station metrics endpoint

## Project Context Summary
The backend is in Phase 2 and currently completed up to step 2.54 which introduced API corrections and feature flags. Owners and managers can access various dashboard endpoints for sales summary, fuel breakdown and trends, but there is no endpoint returning metrics for each station in one call. The OpenAPI spec also lacks a `StationMetric` schema.

## Steps Already Implemented
- Station performance comparison and ranking (`STEP_2_19` and later).
- Dashboard routes for sales summary, payment methods and system health.
- Fixes through `STEP_fix_20251128` and enhancements through `STEP_2_54`.

## What to Build Now
1. Implement `GET /api/v1/dashboard/station-metrics` returning per-station totals and pump information for the current tenant.
2. Add a service helper to gather metrics for all stations.
3. Extend `dashboard.controller.ts` and `dashboard.route.ts` with the new handler.
4. Update `openapi.yaml` with the new path and a `StationMetric` schema.
5. Document the change in `CHANGELOG.md`, `PHASE_2_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.

## Files to Update
- `src/services/station.service.ts`
- `src/controllers/dashboard.controller.ts`
- `src/routes/dashboard.route.ts`
- `docs/openapi.yaml`
- Documentation files listed above
- This command file `docs/STEP_2_55_COMMAND.md`

## Required Documentation Updates
- Add changelog entry under Features.
- Append row in `IMPLEMENTATION_INDEX.md` with file links.
- Mark step done in `PHASE_2_SUMMARY.md`.
