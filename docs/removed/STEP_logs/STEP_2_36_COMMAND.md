# STEP_2_36_COMMAND.md — Tenant Service Unified Schema

## Project Context Summary
FuelSync Hub recently migrated to a unified public schema. Some services like `tenant.service.ts` still reference the old `schema_name` approach and attempt to create per-tenant schemas. Documentation and OpenAPI specs also expose a `schemaName` field which no longer exists.

## Steps Already Implemented
- Login queries updated for unified schema (`STEP_fix_20250814.md`).
- Response wrapper alignment and OpenAPI cleanup up to `STEP_2_35_COMMAND.md`.

## What to Build Now
1. Refactor `src/services/tenant.service.ts` so no logic depends on `schema_name` or schema creation.
2. Update related controller and validator to drop `schemaName` fields.
3. Adjust `tests/utils/testTenant.ts` for the unified tables.
4. Remove `schemaName` from OpenAPI components and tenant management guide.
5. Document the change in `CHANGELOG.md`, `PHASE_2_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `src/services/tenant.service.ts`
- `src/controllers/tenant.controller.ts`
- `src/validators/tenant.validator.ts`
- `tests/utils/testTenant.ts`
- `docs/openapi.yaml`
- `docs/TENANT_MANAGEMENT_GUIDE.md`
- Documentation files listed above

## Required Documentation Updates
- Add changelog entry under Fixes.
- Append row to `IMPLEMENTATION_INDEX.md`.
- Summarise in `PHASE_2_SUMMARY.md`.
