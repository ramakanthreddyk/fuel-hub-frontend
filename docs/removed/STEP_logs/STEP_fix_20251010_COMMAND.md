# STEP_fix_20251010_COMMAND.md

## Project Context Summary
Migration `008_create_tenant_settings_kv.sql` adds a key-value settings table referencing `public.tenants`. On Azure (Citus), foreign keys on distributed tables fail. Previous fix `STEP_fix_20251009` skipped migration `007` and applied it via a custom script.

## Steps Already Implemented
- `apply-cash-reports-azure.js` handles migration 007 without foreign keys.
- `setup-azure-db.js` orchestrates Azure setup and skips migration 007.

## What to Build Now
- Create `scripts/apply-tenant-settings-kv-azure.js` that reads migration 008, removes the tenant foreign key, and executes it with SSL.
- Update `setup-azure-db.js` to skip `008_create_tenant_settings_kv.sql` and run the new script after `apply-cash-reports-azure.js`.
- Add npm script `azure-migrate-settings`.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
- Create `docs/STEP_fix_20251010.md`
