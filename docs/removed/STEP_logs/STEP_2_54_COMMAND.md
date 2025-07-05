# STEP_2_54_COMMAND.md — API corrections and feature flags

## Project Context Summary
FuelSync Hub backend includes numerous analytics and inventory endpoints.
OpenAPI spec and route handlers sometimes diverge and some response schemas are too generic.
Feature flags are stored in `tenant_settings_kv` but the tenant-facing `/api/v1/settings` endpoint only exposes core settings.

## Steps Already Implemented
- Station comparison and ranking APIs (Step 2.47+).
- Inventory management endpoints with alerts table.
- Tenant settings key-value storage for feature flags (Step 2.45).
- Fixes up to 2025‑11‑28 recorded in `IMPLEMENTATION_INDEX.md`.

## What to Build Now
1. Alias legacy dashboard paths `/dashboard/fuel-types` and `/dashboard/daily-trend` to the new handlers and mark them deprecated in OpenAPI.
2. Add `/api/v1/tenant/settings` routes for GET and POST that expose all key/value flags such as `features.auto_sales_generation` and `features.allow_export`. Keep `/api/v1/settings` as deprecated alias.
3. Expand OpenAPI `openapi.yaml` with concrete response schemas and examples for:
   - `/stations/compare`
   - `/stations/ranking`
   - `/inventory`, `/inventory/alerts`, `/inventory/update`
4. Update existing route handlers if paths differ from the spec.
5. Document the change in changelog, phase summary and implementation index.

## Files to Update
- `src/routes/dashboard.route.ts`
- `src/routes/settings.route.ts`
- `src/controllers/settings.controller.ts`
- `src/services/settingsService.ts`
- `src/routes/index.ts` if necessary
- `docs/openapi.yaml`
- Documentation files: `CHANGELOG.md`, `PHASE_2_SUMMARY.md`, `IMPLEMENTATION_INDEX.md`
- This command file `docs/STEP_2_54_COMMAND.md`

## Required Documentation Updates
- Add changelog entry under Enhancements.
- Append row in `IMPLEMENTATION_INDEX.md` with file links.
- Mark step done in `PHASE_2_SUMMARY.md`.
