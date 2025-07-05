# STEP_2_22_COMMAND.md — Fuel Price Delete Endpoint

## Project Context Summary
FuelSync Hub backend is nearing completion. CRUD routes are implemented for most resources, but fuel prices currently only support create, list and update operations. The frontend UI allows deleting price records, so the API must expose a DELETE route and supporting logic.

## Steps Already Implemented
- Step 2.21 added pump update endpoint and documented CRUD routes for other resources.

## What to Build Now
- Implement `deleteFuelPrice` in `src/services/fuelPrice.service.ts` to remove a fuel price by ID.
- Add `remove` handler in `src/controllers/fuelPrice.controller.ts` that calls the service and checks tenant context.
- Register `DELETE /api/v1/fuel-prices/:id` in `src/routes/fuelPrice.route.ts` with owner/manager role checks.
- Document the new route in `docs/openapi.yaml`.
- Update changelog, phase summary and implementation index.

## Files To Update
- `src/services/fuelPrice.service.ts`
- `src/controllers/fuelPrice.controller.ts`
- `src/routes/fuelPrice.route.ts`
- `docs/openapi.yaml`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/CHANGELOG.md`
