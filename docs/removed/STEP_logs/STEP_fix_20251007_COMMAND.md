# STEP_fix_20251007_COMMAND.md

## Project Context Summary
Azure PostgreSQL (particularly Citus) rejects foreign key constraints referencing distributed tables. Migration `007_create_cash_reports.sql` defines FKs on `tenant_id`, `station_id`, and `user_id`, causing `"cannot be implemented"` errors during `node scripts/migrate.js up` on Azure.

## Steps Already Implemented
- Fix 2025-10-06 updated seed admin timestamps.
- `setup-azure-schema.js` provides schema setup without `pgcrypto`.

## What to Build Now
- Create `scripts/apply-cash-reports-azure.js` that runs migration 007 but strips foreign key references.
- Document the workaround for Azure deployments.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
- Create `docs/STEP_fix_20251007.md`
