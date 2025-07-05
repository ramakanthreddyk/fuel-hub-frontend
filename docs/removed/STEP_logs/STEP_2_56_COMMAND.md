# STEP_2_56_COMMAND.md — Backend analytics and inventory completion

## Project Context Summary
FuelSync Hub backend uses Express and PostgreSQL with schema-per-tenant. Previous step 2.55 added dashboard station metrics. The OpenAPI spec defines additional analytics, admin and inventory endpoints that still return placeholder data or lack helper functions.

## Steps Already Implemented
- Multi-tenant authentication and role middleware
- Dashboard and station analytics endpoints
- Fuel inventory services using static table values
- Admin analytics routes

## What to Build Now
1. Implement missing analytics and admin summary endpoints according to `docs/openapi.yaml`.
2. Add helper functions `calculateTankLevel` and `getTenantMetrics` and use them in controllers.
3. Include `tenantName` in all login and refresh responses and expose `stationName` in fuel price listings.
4. Mark test routes in the OpenAPI spec as internal and ensure PUT endpoints have validation helpers.
5. Update changelog, phase summary and implementation index.

## Files to Update
- `src/services/analytics.service.ts`
- `src/services/fuelInventory.service.ts`
- `src/services/tenant.service.ts`
- `src/controllers/*`
- `src/routes/*`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
