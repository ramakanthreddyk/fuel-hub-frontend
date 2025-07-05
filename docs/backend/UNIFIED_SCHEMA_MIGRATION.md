---
title: Unified Schema Migration Guide
lastUpdated: 2025-07-05
category: backend
---

# Unified Schema Migration Guide

This document outlines the process of migrating FuelSync Hub from a schema-per-tenant design to a single unified schema with tenant_id columns.

## Migration Overview

The migration process involved:

1. Creating a new SQL migration file (`004_complete_unified_schema.sql`) that defines all tables in the unified schema
2. Updating the Prisma schema to match the unified database structure
3. Fixing database constraints to allow the migration
4. Applying the migration and verifying the schema

## Schema Structure

The unified schema follows these principles:

- All tenant tables include a `tenant_id` UUID column that references `public.tenants(id)`
- Foreign keys cascade on delete to maintain integrity
- All tables include `created_at` and `updated_at` timestamps
- Indexes are created on `tenant_id` and other frequently queried columns
- Composite unique constraints include `tenant_id` for tenant-scoped uniqueness

## Tables in the Unified Schema

The following tables are included in the unified schema:

- Core platform tables:
  - `plans`: Subscription plans
  - `tenants`: Tenant organizations
  - `admin_users`: Super admin accounts
  - `admin_activity_logs`: Admin activity tracking

- Tenant-specific tables:
  - `users`: Tenant user accounts
  - `stations`: Fuel stations
  - `pumps`: Fuel pumps
  - `nozzles`: Pump nozzles
  - `user_stations`: User-station access mapping
  - `tenant_settings`: Tenant preferences
  - `fuel_inventory`: Fuel stock levels
  - `alerts`: System notifications
  - `fuel_deliveries`: Fuel delivery records
  - `nozzle_readings`: Meter readings
  - `fuel_prices`: Fuel pricing history
  - `creditors`: Credit customers
  - `sales`: Sales transactions
  - `credit_payments`: Creditor payments
  - `day_reconciliations`: Daily reconciliation
  - `report_schedules`: Scheduled reports
  - `audit_logs`: User action tracking
  - `user_activity_logs`: User activity tracking
  - `validation_issues`: Data validation errors

## How to Apply the Migration

To apply the unified schema migration:

1. Ensure database connection parameters are set in `.env`
2. Run the constraint fix script:
   ```
   node scripts/fix-constraints.js
   ```
3. Apply the unified schema:
   ```
   node scripts/apply-unified-schema.js
   ```
4. Verify the schema:
   ```
   node scripts/verify-schema.js
   ```

## Prisma Integration

The Prisma schema has been updated to match the unified database schema. To use Prisma with the unified schema:

1. Ensure `DATABASE_URL` is set in `.env`
2. Generate the Prisma client:
   ```
   npx prisma generate
   ```
3. Use the Prisma client in your code:
   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   
   // Example: Get all stations for a tenant
   const stations = await prisma.station.findMany({
     where: { tenant_id: 'tenant-uuid' }
   });
   ```

## Data Migration

If you need to migrate data from the old schema-per-tenant structure to the unified schema:

1. Create a data migration script that:
   - Reads data from each tenant schema
   - Inserts data into the unified schema with the appropriate tenant_id
   - Preserves relationships between entities

2. Test the data migration in a staging environment before applying to production

## Best Practices for the Unified Schema

- Always include tenant_id in queries to ensure data isolation
- Use transactions for operations that modify multiple tables
- Add appropriate indexes for queries that filter by tenant_id and other columns
- Use Prisma's relation fields to maintain referential integrity