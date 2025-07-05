---
title: FuelSync Unified Database Setup Guide
lastUpdated: 2025-07-05
category: backend
---

# FuelSync Unified Database Setup Guide

This guide provides step-by-step instructions for setting up the FuelSync database with the new unified schema and seeding it with initial data.

## Overview

The unified schema migration moves FuelSync from a schema-per-tenant design to a single shared schema with tenant_id fields. This simplifies operations, improves scalability, and works better with connection pools and ORM tooling.

## Prerequisites

- Node.js and npm installed
- PostgreSQL database server running
- Database connection parameters configured in `.env`

## Quick Setup

For a complete setup in one command:

```bash
npm run setup-unified-db
```

This command executes `scripts/setup-unified-db.js`, which applies the
`migrations/schema/005_master_unified_schema.sql` file and then runs
`node scripts/migrate.js up` to apply any new migration files. The master
script recreates all tables from scratch, so it is safe for fresh environments.

This script performs all the steps below automatically.

## Step-by-Step Setup

If you prefer to run each step individually:

### 1. Check Database Connection

Verify that your database connection is working:

```bash
npm run check-db
```

### 2. Fix Database Constraints

Remove any constraints that might prevent the migration:

```bash
npm run db:fix-constraints
```

### 3. Apply Unified Schema

Apply the unified schema to the database:

```bash
npm run db:unified-schema
```

### 4. Verify Schema Structure

Check that the schema was applied correctly:

```bash
npm run db:verify-schema
```

### 5. Generate Prisma Client

Generate the Prisma client based on the schema:

```bash
npx prisma generate
```

### 6. Seed Initial Data

Populate the database with essential data:

```bash
npm run db:seed-data
```

## Seed Data

The seed script creates the following data:

### Subscription Plans

- **Basic Plan**: 2 stations, 4 pumps per station, 2 nozzles per pump
- **Standard Plan**: 5 stations, 8 pumps per station, 4 nozzles per pump
- **Premium Plan**: 15 stations, 16 pumps per station, 6 nozzles per pump

### Users

- **SuperAdmin**:
  - Email: admin@fuelsync.com
  - Password: Admin@123

- **Tenant Owner**:
  - Email: owner@demofuels.fuelsync.com
  - Password: Owner@123

### Demo Tenant Infrastructure

- **Tenant**: Demo Fuels Ltd (Standard Plan)
- **Station**: Main Street Station
- **Pumps**: 2 pumps with 3 nozzles (petrol, diesel, premium)
- **Fuel Prices**: Set for all fuel types
- **Inventory**: Initial stock levels for all fuel types

## Verification

After setup, you can verify that everything is working correctly:

1. Start the application:
   ```bash
   npm run dev
   ```

2. Log in as SuperAdmin:
   - Navigate to the admin portal
   - Use the SuperAdmin credentials

3. Log in as Tenant Owner:
   - Navigate to the tenant portal
   - Use the Tenant Owner credentials

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

- Check that your database server is running
- Verify the connection parameters in `.env`
- Ensure the database exists and is accessible

### Schema Migration Issues

If the schema migration fails:

- Check for error messages in the console
- Verify that you have the necessary permissions
- Try running the fix-constraints script again

### Seed Data Issues

If seeding fails:

- Check for unique constraint violations
- Verify that the Prisma client is generated correctly
- Check that all required tables exist in the database

## Additional Resources

- [Unified Schema Migration Guide](./UNIFIED_SCHEMA_MIGRATION.md)
- [Seed Data Guide](./SEED_DATA_GUIDE.md)
- [Database Brain Document](./db_brain.md)
