# STEP_2_57_COMMAND.md — Tenant email convention update

## Project Context Summary
FuelSync Hub is a multi-tenant ERP with schema-per-tenant. The tenant service automatically creates owner, manager and attendant users when a tenant is created. Currently the generated emails follow the pattern `owner@{tenant-slug}.com`. Documentation such as `TENANT_CREATION_API.md` and `TENANT_MANAGEMENT_GUIDE.md` describe this behaviour.

## Steps Already Implemented
- Tenant creation with automatic user generation using slug-based emails
- Backend analytics and inventory endpoints (`STEP_2_56_COMMAND.md`)
- Frontend password change form and hooks

## What to Build Now
Update tenant user seeding logic and docs to use a consistent domain-based email pattern:
`{role}@{schema}.fuelsync.com`. Emails must remain unique per tenant schema. Update documentation examples accordingly.

## Files to Update
- `fuelsync/src/services/tenant.service.ts`
- `fuelsync/docs/TENANT_CREATION_API.md`
- `fuelsync/docs/TENANT_MANAGEMENT_GUIDE.md`
- `fuelsync/TENANT_USER_CREATION_PROCESS.md`
- `fuelsync/docs/USER_MANAGEMENT.md`
- `fuelsync/UNIFIED_DB_SETUP.md`
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/PHASE_2_SUMMARY.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
