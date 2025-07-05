---
title: Database Brain — Unified Schema Overview
lastUpdated: 2025-07-05
category: architecture
---

# Database Brain — Unified Schema Overview

This document records the reasoning and structure for migrating FuelSync Hub from a schema-per-tenant design to a single shared schema. It should be updated with each future database change.

## Rationale
- **Operational Simplicity:** Managing many schemas complicates migrations and backups. A single schema with `tenant_id` fields simplifies operations.
- **Scalability:** Shared schema works better with connection pools and ORM tooling.
- **Data Isolation via `tenant_id`:** Every tenant table now includes a `tenant_id` UUID column to filter data per organisation.

## Core Tables
| Table | Main Fields |
| ----- | ----------- |
| `admin_users` | `id`, `email`, `password_hash`, `role`, `created_at`, `updated_at` |
| `admin_activity_logs` | `id`, `admin_user_id`, `action`, `target_type`, `target_id`, `details`, `created_at`, `updated_at` |
| `plans` | `id`, `name`, `max_stations`, `max_pumps_per_station`, `max_nozzles_per_pump`, `price_monthly`, `price_yearly`, `features` |
| `tenants` | `id`, `name`, `plan_id`, `status`, `created_at`, `updated_at` |
| `users` | `id`, `tenant_id`, `email`, `password_hash`, `name`, `role`, `created_at`, `updated_at` |
| `stations` | `id`, `tenant_id`, `name`, `address`, `status`, `created_at`, `updated_at` |
| `pumps` | `id`, `tenant_id`, `station_id`, `name`, `serial_number`, `status`, `created_at`, `updated_at` |
| `nozzles` | `id`, `tenant_id`, `pump_id`, `nozzle_number`, `fuel_type`, `status`, `created_at`, `updated_at` |
| `fuel_prices` | `id`, `tenant_id`, `station_id`, `fuel_type`, `price`, `cost_price`, `valid_from`, `effective_to`, `created_at`, `updated_at` |
| `creditors` | `id`, `tenant_id`, `station_id`, `party_name`, `contact_number`, `address`, `credit_limit`, `status`, `created_at`, `updated_at` |
| `sales` | `id`, `tenant_id`, `nozzle_id`, `reading_id`, `station_id`, `volume`, `fuel_type`, `fuel_price`, `cost_price`, `amount`, `profit`, `payment_method`, `creditor_id`, `created_by`, `status`, `recorded_at`, `created_at`, `updated_at` |
| `user_stations` | `user_id`, `station_id`, `created_at`, `updated_at` |
| `tenant_settings` | `tenant_id`, `receipt_template`, `fuel_rounding`, `branding_logo_url`, `updated_at` |
| `fuel_inventory` | `id`, `tenant_id`, `station_id`, `fuel_type`, `current_stock`, `minimum_level`, `created_at`, `last_updated`, `updated_at` |
| `alerts` | `id`, `tenant_id`, `station_id`, `alert_type`, `message`, `severity`, `is_read`, `created_at`, `updated_at` |
| `fuel_deliveries` | `id`, `tenant_id`, `station_id`, `fuel_type`, `volume`, `delivered_by`, `delivery_date`, `created_at`, `updated_at` |
| `nozzle_readings` | `id`, `tenant_id`, `nozzle_id`, `reading`, `recorded_at`, `payment_method`, `created_at`, `updated_at` |
| `credit_payments` | `id`, `tenant_id`, `creditor_id`, `amount`, `payment_method`, `reference_number`, `notes`, `received_at`, `created_at`, `updated_at` |
| `day_reconciliations` | `id`, `tenant_id`, `station_id`, `date`, `total_sales`, `cash_total`, `card_total`, `upi_total`, `credit_total`, `finalized`, `created_at`, `updated_at` |
| `report_schedules` | `id`, `tenant_id`, `station_id`, `type`, `frequency`, `next_run`, `created_at`, `updated_at` |
| `audit_logs` | `id`, `tenant_id`, `user_id`, `action`, `entity_type`, `entity_id`, `details`, `created_at`, `updated_at` |
| `user_activity_logs` | `id`, `tenant_id`, `user_id`, `ip_address`, `user_agent`, `event`, `recorded_at`, `updated_at` |
| `validation_issues` | `id`, `tenant_id`, `entity_type`, `entity_id`, `message`, `created_at` |

## Relationships
```
users -> stations -> pumps -> nozzles
users -> user_stations -> stations
nozzles -> nozzle_readings -> sales
stations -> fuel_prices
stations -> creditors -> credit_payments
stations -> fuel_inventory
stations -> fuel_deliveries
stations -> day_reconciliations
users -> audit_logs
users -> user_activity_logs
tenants -> tenant_settings
```
Foreign keys cascade on delete to maintain integrity.

## Best Practices
- Always include `tenant_id` as the first column after `id` in tenant tables.
- All `tenant_id` fields reference `public.tenants(id)` to enforce referential integrity.
- Include `created_at` and `updated_at` in all tables for auditing.
- Index `tenant_id` individually and in combination with frequently queried columns.
- Use composite unique constraints with `tenant_id` for tenant-scoped uniqueness.
- Write migrations with `IF NOT EXISTS` and `DROP ... IF EXISTS` to remain idempotent.
- Test migrations in a staging database before running in production.

## Conventions
- Tables are snake_case; columns also snake_case.
- Index names use `idx_<table>_tenant` or `idx_<table>_<column>` format.
- Foreign key constraints include `ON DELETE CASCADE` for child records.
- New tables should follow the same pattern: `id` UUID primary key, `tenant_id` UUID NOT NULL, timestamps with defaults.
- `fuel_type` columns are constrained to `'petrol'`, `'diesel'`, `'premium'`. Add new types by altering the CHECK constraint in all tables.
- `payment_method` columns for sales and credit payments share the enum `'cash'`, `'card'`, `'upi'`, `'credit'`.

## Further Architectural Decisions
- Evaluate table partitioning for very large tenants.
- Consider row-level security policies if stricter isolation is required.
- Monitor query plans to adjust indexes as dataset grows.

## Migrating to the Unified Schema

To reset an environment using the unified schema:

1. Run the helper command which applies `migrations/schema/005_master_unified_schema.sql` and any newer migrations:
   ```bash
   npm run setup-unified-db
   ```
   This script removes existing tables, runs the master migration, applies all pending migration files and seeds demo data.

The `005_master_unified_schema.sql` file defines the full schema so no extra SQL is required for a fresh setup. Additional migration files placed under `migrations/schema` will be applied automatically during setup.

