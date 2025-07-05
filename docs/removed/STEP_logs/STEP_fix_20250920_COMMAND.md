# STEP_fix_20250920_COMMAND.md

## Project Context Summary
FuelSync Hub now uses a unified public schema with `tenant_id` columns. Some
production tables were created before this migration and are missing the
`tenant_id` field, causing queries like `/api/v1/sales` to fail with
`column "tenant_id" does not exist`.

## Steps Already Implemented
All fixes through `STEP_fix_20250919.md`.

## What to Build Now
- Create SQL migration `migrations/schema/006_add_tenant_id_columns.sql` that
  adds `tenant_id uuid` columns with a foreign key to `public.tenants(id)` if
  they are missing.
- Cover tables used by all services: `users`, `stations`, `pumps`, `nozzles`,
  `fuel_prices`, `creditors`, `credit_payments`, `nozzle_readings`, `sales`,
  `day_reconciliations`, `fuel_inventory`, `alerts`, `fuel_deliveries`,
  `report_schedules`, `audit_logs`, `user_activity_logs`, and
  `validation_issues`.
- Update documentation: changelog, phase summary, implementation index.

## Required Documentation Updates
- Add fix entry to `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
