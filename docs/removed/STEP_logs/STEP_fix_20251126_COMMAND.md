# STEP_fix_20251126_COMMAND.md — Unified fuel inventory queries

## Project Context Summary
FuelSync Hub recently migrated fuel inventory to a global `public.fuel_inventory` table with a `tenant_id` column. Some services still referenced `${tenantId}.fuel_inventory` tables and embedded the tenant schema in SQL queries.

## Steps Already Implemented
- Unified schema migrations (`public.fuel_inventory`, `public.fuel_deliveries`, etc.)
- Inventory summary endpoint (Step 2.53)
- Recent fixes up to 2025-11-25 documented in `IMPLEMENTATION_INDEX.md`

## What to Build Now
- Replace all table references like `${tenantId}.fuel_inventory` with `public.fuel_inventory` in delivery, inventory and fuelInventory services.
- Prefix joins to `public.stations`, `public.alerts` and `public.fuel_deliveries`.
- Add `tenant_id` filter parameters in each query.
- Remove the obsolete `createFuelInventoryTable` helper and update controllers to no longer call it.
- Pass tenantId as a query parameter in controller inventory lookups.
- Update docs: changelog, phase summary and implementation index.

## Required Documentation Updates
- Changelog entry under Fixes.
- Implementation index row.
- Phase 2 summary addition.
