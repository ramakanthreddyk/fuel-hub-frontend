# STEP_2_45_COMMAND.md — SuperAdmin Tenant Settings

## Project Context Summary
FuelSync Hub now runs on a unified public schema with tenant data keyed by `tenant_id`. SuperAdmin APIs exist for managing tenants, plans and users but there is no way to toggle per-tenant feature flags. We need a simple key-value settings store controlled only by SuperAdmins.

## Steps Already Implemented
Backend phase is completed through **Step 2.44** which added role journey documentation. All admin routes reside under `/api/v1/admin` and require a JWT with the `superadmin` role.

## What to Build Now
1. Add a new table `public.tenant_settings_kv` for arbitrary tenant settings.
2. Seed default settings when a tenant is created.
3. Implement service `settingsService.ts` with `getAllSettings`, `getSetting` and `updateSetting` functions.
4. Expose SuperAdmin routes:
   - `GET /api/v1/admin/tenants/:tenantId/settings`
   - `GET /api/v1/admin/tenants/:tenantId/settings/:key`
   - `PUT /api/v1/admin/tenants/:tenantId/settings/:key` `{ value: string }`
5. Update documentation files and changelog.

## Files to Update
- `migrations/schema/008_create_tenant_settings_kv.sql` (new)
- `src/services/settingsService.ts` (new)
- `src/services/tenant.service.ts`
- `src/controllers/adminSettings.controller.ts` (new)
- `src/routes/adminApi.router.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Acceptance Criteria
- SuperAdmins can view and update settings for any tenant.
- Default settings are inserted on tenant creation.
- Changelog and phase summary mention Step 2.45.
- Implementation index lists Step 2.45 with file references.

## Next Step
```
Codex, begin execution of STEP_2_45_COMMAND.md
```
