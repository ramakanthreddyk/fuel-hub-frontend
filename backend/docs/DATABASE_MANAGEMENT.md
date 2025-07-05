# Database Management Guide

## Overview
This guide establishes proper database schema management, migration system, and maintenance procedures for FuelSync Hub.

## Current Problem
- All database schema is embedded in `app.ts` migration endpoint
- No version control for schema changes
- No rollback capability
- Difficult to track changes and maintain consistency

## Solution: Structured Database Management

### 1. Migration System Structure

```
migrations/
├── schema/
│   ├── 001_initial_schema.sql
│   ├── 002_add_profit_tracking.sql
│   ├── 003_add_inventory_system.sql
│   └── 004_add_alerts_system.sql
├── seeds/
│   ├── 001_basic_seed.sql
│   ├── 002_comprehensive_seed.sql
│   └── production_seed.sql
└── rollbacks/
    ├── 002_rollback_profit_tracking.sql
    ├── 003_rollback_inventory_system.sql
    └── 004_rollback_alerts_system.sql
```

### 2. Schema Versioning

Each migration file includes:
- Version number
- Description
- Up migration (changes)
- Dependencies
- Rollback instructions

### 3. Migration Tracking Table

```sql
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rollback_sql TEXT
);
```

## Implementation Plan

### Phase 1: Extract Current Schema
1. Move schema from `app.ts` to separate migration files
2. Create migration tracking system
3. Implement migration runner

### Phase 2: Enhance Migration System
1. Add rollback capabilities
2. Create schema validation
3. Add environment-specific migrations

### Phase 3: Documentation & Maintenance
1. Create schema documentation
2. Add change tracking
3. Implement backup procedures

## Database Schema Documentation

### Public Schema (Platform)
```sql
-- Platform management tables
public.plans              -- Subscription plans
public.tenants           -- Tenant organizations  
public.admin_users       -- SuperAdmin users
public.schema_migrations -- Migration tracking
```

### Tenant Schema (Per-Tenant)
```sql
-- Core business tables
{tenant}.users           -- Tenant users
{tenant}.stations        -- Fuel stations
{tenant}.pumps           -- Fuel pumps
{tenant}.nozzles         -- Pump nozzles

-- Operations tables
{tenant}.fuel_prices     -- Pricing history
{tenant}.nozzle_readings -- Meter readings
{tenant}.sales           -- Sales transactions
{tenant}.creditors       -- Credit customers

-- Management tables
{tenant}.fuel_inventory  -- Stock tracking
{tenant}.credit_payments -- Credit payments
{tenant}.alerts          -- System alerts
```

### Key Relationships
```
Station (1) → (N) Pump (1) → (N) Nozzle (1) → (N) Reading → (1) Sale
Station (1) → (N) Creditor (1) → (N) Credit_Payment
Station (1) → (N) Fuel_Inventory
Station (1) → (N) Alert
```

## Migration Commands

### Run Migrations
```bash
npm run migrate:up
npm run migrate:up -- --version=003
```

### Rollback Migrations  
```bash
npm run migrate:down
npm run migrate:down -- --version=002
```

### Check Status
```bash
npm run migrate:status
```

### Create New Migration
```bash
npm run migrate:create -- --name="add_new_feature"
```

## Best Practices

### 1. Migration Rules
- Never modify existing migration files
- Always create new migration for changes
- Include rollback SQL in every migration
- Test migrations on copy of production data

### 2. Schema Changes
- Add columns with DEFAULT values
- Use DEFERRABLE constraints for FK relationships
- Create indexes for performance-critical queries
- Document all business rules in comments

### 3. Data Integrity
- Use transactions for multi-table changes
- Validate data before and after migrations
- Backup before major schema changes
- Test rollback procedures

## Handling New Migration Files

When a schema change is required—for example adding a new column—create a new
SQL file in `migrations/schema` using the next version number. Example:

```sql
-- 006_add_opening_date.sql
ALTER TABLE public.stations
  ADD COLUMN opening_date DATE;
```

Run pending migrations with:

```bash
node scripts/migrate.js up
```

The migration runner records applied versions in `public.schema_migrations`.
Never modify existing files—always create a new migration.

### End-to-End Workflow for Adding a Column

1. **Database** – create the migration and adjust seed scripts.
2. **Scripts** – update helper utilities that rely on the table structure.
3. **db_brain.md** – record the reasoning behind the new column and any constraints.
4. **Backend** – modify services, validators, and routes accordingly.
5. **backend_brain.md** – document API updates or behavioural changes.
6. **OpenAPI** – update `docs/openapi.yaml` to expose the new field.
7. **Frontend** – follow `FRONTEND_REFERENCE_GUIDE.md` to consume the updated spec.
8. **Docs** – track temporary mismatches in `frontend/docs/api-diff.md` until implementation catches up.

## Maintenance Procedures

### Daily
- Monitor migration status
- Check for failed migrations
- Validate data integrity

### Weekly  
- Review schema changes
- Update documentation
- Test backup/restore procedures

### Monthly
- Analyze query performance
- Optimize indexes
- Clean up old migration logs

## Emergency Procedures

### Schema Corruption
1. Stop application
2. Restore from backup
3. Re-run migrations from last known good state
4. Validate data integrity

### Migration Failure
1. Check migration logs
2. Run rollback if safe
3. Fix migration script
4. Re-run migration

### Data Loss
1. Stop writes immediately
2. Assess damage scope
3. Restore from backup
4. Re-apply recent changes manually

## Tools & Scripts

### Migration Runner (`scripts/migrate.js`)
- Executes migration files in order
- Tracks applied migrations
- Handles rollbacks
- Validates schema state

### Schema Validator (`scripts/validate-schema.js`)
- Checks schema consistency
- Validates relationships
- Reports missing indexes
- Identifies orphaned data

### Backup Manager (`scripts/backup.js`)
- Creates schema dumps
- Exports data
- Manages backup retention
- Tests restore procedures

This system ensures maintainable, trackable, and reliable database management for FuelSync Hub
