# STEP_fix_20251012_COMMAND.md

## Project Context Summary
The Azure helper script `apply-tenant-settings-kv-azure.js` was introduced to run migration 008 without foreign keys. However the script only removed `REFERENCES public.tenants(id)` leaving the `ON DELETE CASCADE` clause which caused a syntax error.

## Steps Already Implemented
- Azure setup uses `setup-azure-db.js` which calls `apply-tenant-settings-kv-azure.js`.

## What to Build Now
- Update `scripts/apply-tenant-settings-kv-azure.js` to also strip the `ON DELETE CASCADE` clause when removing the foreign key.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
- Create `docs/STEP_fix_20251012.md`
