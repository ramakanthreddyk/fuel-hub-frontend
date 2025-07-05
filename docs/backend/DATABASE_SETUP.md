---
title: Database Setup Guide
lastUpdated: 2025-07-05
category: backend
---

# Database Setup Guide

## Overview

This guide explains how to set up the FuelSync database with all required schemas, tables, and seed data.

## Setup Process

### 1. Environment Variables

First, ensure your environment variables are set correctly:

```
DB_HOST=fuelsync-server.postgres.database.azure.com
DB_PORT=5432
DB_NAME=fuelsync_db
DB_USER=fueladmin
DB_PASSWORD=your_actual_password
```

You can set these in:
- `.env` file for local development
- Azure App Service Configuration for production

### 2. Run Setup Script

The setup script will:
1. Create all necessary schemas and tables
2. Create subscription plans
3. Create admin users
4. Create tenants with schemas
5. Create tenant users and data

```bash
# Run the setup script
npm run setup-db
```

## Database Structure

### Public Schema

- `plans` - Subscription plans
- `tenants` - Tenant organizations
- `admin_users` - SuperAdmin users
- `schema_migrations` - Migration history

### Tenant Schemas

Each tenant has its own schema with these tables:

- `users` - Tenant users (owner, manager, attendant)
- `stations` - Fuel stations
- `pumps` - Fuel pumps
- `nozzles` - Pump nozzles
- `fuel_prices` - Fuel pricing history
- `creditors` - Credit customers
- `nozzle_readings` - Meter readings
- `sales` - Sales transactions
- `credit_payments` - Credit payments
- `fuel_inventory` - Fuel inventory
- `alerts` - System alerts
- `fuel_deliveries` - Fuel deliveries

## Login Credentials

### SuperAdmin Users
- `admin@fuelsync.com / Admin@123`
- `admin2@fuelsync.com / Admin@123`
- `support@fuelsync.com / Admin@123` (Admin role)

### Tenant Users
- `owner@production-tenant.com / Admin@123`
- `manager@production-tenant.com / Admin@123`
- `attendant@production-tenant.com / Admin@123`

## Tenant Structure

The system has 4 tenants:

1. **FuelSync Production** (`production_tenant`)
   - Enterprise Plan
   - 3 stations, 10 pumps, 20 nozzles
   - Complete sales data

2. **Test Tenant 1** (`test_tenant_1`)
   - Basic Plan
   - 3 stations, 10 pumps, 20 nozzles
   - No sales data

3. **Test Tenant 2** (`test_tenant_2`)
   - Pro Plan
   - 3 stations, 10 pumps, 20 nozzles
   - No sales data

4. **Test Tenant 3** (`test_tenant_3`)
   - Enterprise Plan (suspended)
   - 3 stations, 10 pumps, 20 nozzles
   - No sales data

## Troubleshooting

### Database Connection Issues
- Check if the database server is running
- Verify the DB_HOST, DB_PORT values
- Check if your IP is allowed in the database firewall

### Schema Creation Issues
- Check if the user has CREATE SCHEMA permissions
- Verify the schema doesn't already exist

### Data Issues
- Check if the tenant ID is being passed in API requests
- Verify the tenant schema exists
- Check if the user has access to the tenant