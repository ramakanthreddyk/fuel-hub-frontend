# STEP_fix_20250721_COMMAND.md

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations. Backend code lives under `/fuelsync` using Express and Prisma. A backend audit (July 2025) highlighted remaining raw `pg` queries and missing tests.

## Steps Already Implemented
- Backend audit recorded in `BACKEND_FULL_REVIEW_JUL2025.md`.
- Numerous fix steps up to July 20, 2025 completed schema and API alignment.

## What to Build Now
- Replace remaining `pg` queries in `src/services/station.service.ts`, `src/services/nozzle.service.ts` and `src/services/fuelInventory.service.ts` with Prisma equivalents.
- Add lightweight unit tests for credit payment creation, fuel inventory calculations and analytics hourly sales.
- Update OpenAPI descriptions for `/fuel-inventory` and `/credit-payments` routes.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/openapi.yaml`
