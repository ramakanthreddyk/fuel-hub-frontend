---
title: FuelSync Scripts Guide
lastUpdated: 2025-07-05
category: backend
---

# FuelSync Scripts Guide

This guide lists the maintenance and utility scripts found in the `scripts/` directory.
Keep this document updated whenever scripts are added or removed.

## Database Setup

- `start-dev-db.sh` / `stop-dev-db.sh` – start and stop the local Postgres container.
- `check-env.ts` – prints the environment variables loaded for `NODE_ENV=development`.
- `check-db-connection.js` – verifies database credentials.
- `fix-constraints.js` – removes foreign key constraints that block migrations.
- `apply-unified-schema.js` – applies the main `005_master_unified_schema.sql` migration.
- `migrate.js` – runs incremental migrations (`up`, `down`, `status`).
- `verify-schema.js` – checks that required tables exist.
- `seed-data.js` – seeds the unified schema with demo data.
- `setup-unified-db.js` – orchestrates all of the above steps.

## Azure Helpers

Human developers can bootstrap an Azure PostgreSQL instance using:

- `setup-azure-db.js`
- `apply-cash-reports-azure.js`
- `apply-tenant-settings-kv-azure.js`
- `setup-azure-schema.js` *(Codex must not run this)*

## Testing Utilities

- `init-db.js` / `init-test-db.js` – create empty databases for local and test environments.
- `reset-passwords.ts` – update demo user passwords after seeding.
- `start-and-test.js` – start the server then run login checks.

## Other Tools

- `generate_erd_image.py` – produce the ERD diagram under `docs/assets/`.
- `add-yearly-price.js` – insert yearly plan pricing entries.
- `validate-demo-tenant.ts` – ensure the demo tenant structure is intact.
- `validate-tenant-schema.ts` – validate tenant schema after migrations.

Legacy scripts no longer in use were removed to reduce clutter:

- `check-db-users.ts`
- `check-server.js`
- `check-tenant-structure.js`
- `check-users.js`
- `direct-login-test.js`
- `frontend-login.js`
- `generate-frontend-login.ts`
- `run-all-migrations.ts`
- `run-all-tests.js`
- `simple-login-test.js`
- `test-api-login.ts`

