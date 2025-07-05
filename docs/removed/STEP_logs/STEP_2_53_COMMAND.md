# STEP_2_53_COMMAND.md — Fuel inventory summary API

## Project Context Summary
FuelSync Hub is a multi-tenant Node/Express backend. Through **Step 2.52** the backend provides a `GET /api/v1/fuel-inventory` endpoint which seeds sample data if missing. However the frontend TODO list calls for a summary endpoint to aggregate fuel inventory by fuel type. The `/api/v1/fuel-inventory` route also returns a 500 error when the table is missing.

## Steps Already Implemented
- Nozzle fuel type validation (Step 2.52).
- Response wrapper alignment and setup status API (Steps 2.49–2.50).

## What to Build Now
1. Add a `GET /api/v1/fuel-inventory/summary` route.
2. Implement service and controller logic to aggregate current volume and capacity by fuel type.
3. Ensure the summary endpoint creates the table if missing similar to the list endpoint.
4. Update OpenAPI spec with the new path.
5. Document the change in changelog, phase summary and implementation index.

## Files to Update
- `src/services/fuelInventory.service.ts`
- `src/controllers/fuelInventory.controller.ts`
- `src/routes/fuelInventory.route.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_2_53_COMMAND.md` (this file)

## Required Documentation Updates
- Add changelog entry under Features.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
