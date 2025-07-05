# CHANGELOG.md — FuelSync Hub Implementation Log

This file captures every change made during implementation, categorized by type:

* 🟩 Features: New functionality, modules, endpoints, or schema
* 🟦 Enhancements: Improvements to existing logic or structure
* 🟥 Fixes: Bug corrections or adjustments to align with business rules

Each entry is tied to a step from the implementation index.

---

## [Setup - Step 0] – Environment Bootstrap

**Status:** ✅ Done

### 🟩 Features

* Initialize Node project with TypeScript support
* Provide sample `.env` and `.gitignore`
* Add scripts for migrations and seeding

### Files

* `package.json`
* `tsconfig.json`
* `.env`
* `.gitignore`


## \[Phase 1 - Step 1.1] – Public Schema Migration

**Status:** ✅ Done

### 🟩 Features

* Create `plans`, `tenants`, `admin_users` and `admin_activity_logs` tables
* Use UUID primary keys and timestamp fields
* Provide seed script for demo plans, admin user and tenant

### Files

* `migrations/001_create_public_schema.sql`
* `scripts/seed-public-schema.ts`

---

## \[Phase 1 - Step 1.2] – Tenant Schema Template

**Status:** ✅ Done

### 🟩 Features

* Create tenant-level tables: `users`, `stations`, `pumps`, `nozzles`, `sales`, `creditors`, etc.
* Enforce FK constraints, UUIDs, and soft delete fields
* Provide seed script to create a demo tenant schema

### Files

* `tenant_schema_template.sql`
* `scripts/seed-tenant-schema.ts`

---

## \[Phase 1 - Step 1.3] – Schema Validation Script

**Status:** ✅ Done

### 🟩 Features

* CLI script validates each tenant schema against the template
* Reports missing tables, columns and type mismatches
* Exits with non-zero code when discrepancies exist

### Files

* `scripts/validate-tenant-schema.ts`

---

## \[Phase 1 - Step 1.4] – ERD Definition

**Status:** ✅ Done

### 🟩 Features

* Generated ERD diagram showing public and tenant tables
* Documented key tables in `DATABASE_GUIDE.md`

### Files

* `scripts/generate_erd_image.py`
* `docs/DATABASE_GUIDE.md`

---


## [Phase 1 - Step 1.5] – Audit Fields & Data Constraints

**Status:** ✅ Done

### 🟦 Enhancements

* Added audit timestamp columns to all tenant tables
* Introduced NOT NULL and CHECK constraints for schema integrity
* Created `scripts/check-constraints.ts` for verification

### Files

* `migrations/tenant_schema_template.sql`


## [Phase 1 - Step 1.6] – Dev/Test Tenant Seeder

**Status:** ✅ Done

### 🟩 Features

* Added `seed-demo-tenant.ts` to generate a demo tenant with users, station, pump and nozzles
* Added `reset-all-demo-tenants.ts` to drop and reseed all `demo_` schemas
* New npm scripts `seed:demo` and `reset:demo`

### Files

* `scripts/seed-demo-tenant.ts`
* `scripts/reset-all-demo-tenants.ts`
* `package.json`

---

## [Fix - 2025-06-21] – TypeScript Dependency Declarations

**Status:** ✅ Done

### 🟦 Enhancements

* Added `@types/node`, `@types/pg`, and `@types/dotenv` to development dependencies
* Updated `tsconfig.json` with Node module resolution and types
* Cleaned TypeScript warnings in `scripts/check-constraints.ts`

### Files

* `package.json`
* `tsconfig.json`
* `scripts/check-constraints.ts`
* `docs/STEP_fix_20250621.md`

## [Phase 1 - Step 1.7] – Demo Tenant Validation

**Status:** ✅ Done

### 🟩 Features

* Added `validate-demo-tenant.ts` to verify demo seed integrity
* `reset-all-demo-tenants.ts` now runs the validation after seeding

### Files

* `scripts/validate-demo-tenant.ts`
* `scripts/reset-all-demo-tenants.ts`

## [Phase 1 - Step 1.8] – Plan Limit Enforcement

**Status:** ✅ Done

### 🟩 Features

* Added `planConfig.ts` to centralise plan rules
* Implemented middleware stubs for enforcing plan limits
* Provided optional `plan_constraints.sql` for DB-level checks

### Files

* `src/config/planConfig.ts`
* `src/middleware/planEnforcement.ts`
* `database/plan_constraints.sql`

## [Phase 1 - Step 1.9] – Fuel Pricing Table

**Status:** ✅ Done

### 🟩 Features

* Added `fuel_prices` table with `fuel_type` and date range columns
* Enforced `price > 0` constraint and optional trigger snippet
* Created helper `getPriceAtTimestamp` for price lookups

### Files

* `migrations/tenant_schema_template.sql`
* `src/utils/priceUtils.ts`

## [Phase 1 - Step 1.10] – Sales Table Schema

**Status:** ✅ Done

### 🟩 Features

* Created `sales` table for per-delta transactions
* Links readings to nozzles and users with price lookup
* Stores payment method and computed amount

### Files

* `migrations/tenant_schema_template.sql`

## [Phase 1 - Step 1.11] – Creditors & Payments Schema

**Status:** ✅ Done

### 🟩 Features

* Expanded `creditors` table with balance and notes fields
* Added `credit_payments` table with payment_method and received_by columns
* Linked `sales` to `creditors` via `creditor_id`

### Files

* `migrations/tenant_schema_template.sql`

## [Phase 1 - Step 1.12] – Fuel Delivery & Inventory Schema

**Status:** ✅ Done

### 🟩 Features

* Added `fuel_deliveries` table capturing deliveries by fuel type and date
* Added `fuel_inventory` table tracking current volume per station

### Files

* `migrations/tenant_schema_template.sql`

## [Phase 1 - Step 1.13] – Daily Reconciliation Schema

**Status:** ✅ Done

### 🟩 Features

* Added `day_reconciliations` table for per-station daily summaries
* Tracks sales breakdown (cash, card, upi, credit) and outstanding credit
* Includes `finalized` flag to lock records

### Files

* `migrations/tenant_schema_template.sql`

## [Phase 1 - Step 1.14] – Admin Activity Logs Table

**Status:** ✅ Done

### 🟩 Features

* Added `admin_activity_logs` table for recording platform admin actions
* Stores target type, target id and JSONB details for each action

### Files

* `migrations/001_create_public_schema.sql`

## [Phase 1 - Step 1.15] – Finalize Tenant Schema

**Status:** ✅ Done

### 🟦 Enhancements

* Added DEFERRABLE foreign keys across all tenant tables
* Added index coverage for time-based queries
* Updated reading constraint to allow zero values

### Files

* `migrations/tenant_schema_template.sql`


## [Phase 1 - Step 1.16] – Schema Validation Tools

**Status:** ✅ Done

### 🟩 Features

* Extended `validate-tenant-schema.ts` to check foreign key settings and audit fields
* Added SQL helpers `validate-foreign-keys.sql` and `check-schema-integrity.sql`
* Script prints pass/fail summary for each tenant

### Files

* `scripts/validate-tenant-schema.ts`
* `scripts/validate-foreign-keys.sql`
* `scripts/check-schema-integrity.sql`


## [Phase 1 - Step 1.17] – Seed/Test Utility Functions

**Status:** ✅ Done

### 🟦 Enhancements

* Introduced `seedHelpers.ts` with helper functions to seed tenants and station hierarchy
* Added `schemaUtils.ts` for retrieving tenant schema names
* Documented usage examples in `SEEDING.md`

### Files

* `src/utils/seedHelpers.ts`
* `src/utils/schemaUtils.ts`
* `docs/SEEDING.md`

## [Phase 1 - Step 1.18] – Dev Database via Docker Compose

**Status:** ✅ Done

### 🟦 Enhancements

* Added `docker-compose.yml` for local Postgres
* Created `.env.development` with standard credentials
* Seed and validation scripts now load env vars per `NODE_ENV`

### Files

* `docker-compose.yml`
* `.env.development`
* `scripts/seed-public-schema.ts`
* `scripts/seed-demo-tenant.ts`
* `scripts/seed-tenant-schema.ts`
* `scripts/validate-demo-tenant.ts`
* `scripts/reset-all-demo-tenants.ts`


## [Phase 1 - Step 1.19] – Dev Helper Scripts & Env Validation

**Status:** ✅ Done

### 🟦 Enhancements

* Added shell scripts to start and stop the dev Postgres container
* Implemented `check-env.ts` to verify environment variable loading
* Documented script usage in new `README.md`

### Files

* `scripts/start-dev-db.sh`
* `scripts/stop-dev-db.sh`
* `scripts/check-env.ts`
* `README.md`

## [Phase 1 - Step 1.20] – Basic DB Integrity Tests

**Status:** ✅ Done

### 🟩 Features

* Introduced Jest test suite verifying public schema structure
* Added `jest.config.js` and `npm test` script

### Files

* `tests/db.test.ts`
* `jest.config.js`
* `package.json`


## [Phase 1 - Step 1.21] – Tenant Schema SQL Template

**Status:** ✅ Done

### 🟩 Features

* Added base tenant schema SQL template for runtime provisioning
* Includes `users`, `stations`, `pumps`, `nozzles`, `fuel_prices`, `nozzle_readings`, `sales`

### Files

* `sql/tenant_schema_template.sql`

## [Phase 1 - Step 1.22] – Extended Tenant Tables

**Status:** ✅ Done

### 🟩 Features

* Added `creditors`, `credit_payments`, `fuel_deliveries`, `fuel_inventory` tables to tenant schema

### Files

* `database/tenant_schema_template.sql`

## [Phase 1 - Step 1.23] – Daily Reconciliation Table

**Status:** ✅ Done

### 🟩 Features

* Added `day_reconciliations` table to tenant schema

### Files

* `database/tenant_schema_template.sql`

## [Phase 1 - Step 1.24] – Audit Logs Table

**Status:** ✅ Done

### 🟩 Features

* Added `audit_logs` table for per-tenant action tracking

### Files

* `database/tenant_schema_template.sql`

## [Phase 1 - Step 1.25] – Final Schema Wrap-Up

**Status:** ✅ Done

### 🟩 Features

* Updated `fuel_prices` table with `station_id`, `tenant_id` and price fields
* Added `user_activity_logs` for user events
* Added `validation_issues` table for future QA tracking
* Created `seed-tenant-sample.ts` to insert example prices and logs

### Files

* `database/tenant_schema_template.sql`
* `scripts/seed-tenant-sample.ts`

## [Phase 2 - Step 2.1] – Auth Service & Middleware

**Status:** ✅ Done

### 🟩 Features

* Added JWT authentication service with bcrypt password verification
* Implemented Express middlewares: `authenticateJWT`, `requireRole`, `checkStationAccess`
* Provided `/api/auth/login` route returning signed tokens

### Files

* `src/services/auth.service.ts`
* `src/routes/auth.route.ts`
* `src/middlewares/authenticateJWT.ts`
* `src/middlewares/requireRole.ts`
* `src/middlewares/checkStationAccess.ts`
* `src/utils/jwt.ts`
* `src/constants/auth.ts`
* `src/types/auth.d.ts`
* `package.json`

## [Phase 2 - Step 2.2] – User Management APIs

**Status:** ✅ Done

### 🟩 Features

* Added SuperAdmin user creation and listing endpoints
* Added tenant user creation and listing with plan limit checks
* Password hashing via bcrypt and basic request validation

### Files

* `src/controllers/adminUser.controller.ts`
* `src/controllers/user.controller.ts`
* `src/routes/adminUser.route.ts`
* `src/routes/user.route.ts`
* `src/services/adminUser.service.ts`
* `src/services/user.service.ts`
* `src/validators/user.validator.ts`

## [Phase 2 - Step 2.3] – Station, Pump & Nozzle APIs

**Status:** ✅ Done

### 🟩 Features

* CRUD endpoints for stations with plan limit checks
* Pump creation and listing with per-station limits
* Nozzle management with sales history protection
* Middleware for plan enforcement wrappers

### Files

* `src/controllers/station.controller.ts`
* `src/controllers/pump.controller.ts`
* `src/controllers/nozzle.controller.ts`
* `src/routes/station.route.ts`
* `src/routes/pump.route.ts`
* `src/routes/nozzle.route.ts`
* `src/services/station.service.ts`
* `src/services/pump.service.ts`
* `src/services/nozzle.service.ts`
* `src/middlewares/checkPlanLimits.ts`
* `src/validators/station.validator.ts`
* `src/validators/pump.validator.ts`
* `src/validators/nozzle.validator.ts`

## [Phase 2 - Step 2.4] – Nozzle Readings & Auto Sales

**Status:** ✅ Done

### 🟩 Features

* Endpoint `POST /api/nozzle-readings` records cumulative readings
* Auto-generates sales rows using price at reading time
* Endpoint `GET /api/nozzle-readings` with station/nozzle/date filters

### Files

* `src/controllers/nozzleReading.controller.ts`
* `src/routes/nozzleReading.route.ts`
* `src/services/nozzleReading.service.ts`
* `src/validators/nozzleReading.validator.ts`
* `src/utils/priceUtils.ts`

## [Phase 2 - Step 2.5] – Fuel Pricing Management

**Status:** ✅ Done

### 🟩 Features

* Endpoint `POST /api/fuel-prices` to record station fuel prices
* Endpoint `GET /api/fuel-prices` to retrieve pricing history
* Utility `getPriceAt` for historical price lookup

### Files

* `src/controllers/fuelPrice.controller.ts`
* `src/routes/fuelPrice.route.ts`
* `src/services/fuelPrice.service.ts`
* `src/validators/fuelPrice.validator.ts`

## [Phase 2 - Step 2.6] – Creditors and Credit Sales

**Status:** ✅ Done

### 🟩 Features

* CRUD endpoints for creditors
* Credit payments API with balance updates
* Credit sales validation against available limit

### Files

* `src/controllers/creditor.controller.ts`
* `src/services/creditor.service.ts`
* `src/routes/creditor.route.ts`
* `src/validators/creditor.validator.ts`
* `src/services/nozzleReading.service.ts`
* `src/validators/nozzleReading.validator.ts`

## [Phase 2 - Step 2.7] – Fuel Delivery & Inventory Tracking

**Status:** ✅ Done

### 🟩 Features

* Endpoint `POST /api/fuel-deliveries` to record deliveries
* Endpoint `GET /api/fuel-deliveries` to list deliveries per tenant
* Inventory volume auto-increments with each delivery

### Files

* `src/controllers/delivery.controller.ts`
* `src/services/delivery.service.ts`
* `src/routes/delivery.route.ts`
* `src/validators/delivery.validator.ts`

## [Phase 2 - Step 2.8] – Daily Reconciliation API

**Status:** ✅ Done

### 🟩 Features

* Endpoint `POST /api/reconciliation` to finalize a day per station
* Endpoint `GET /api/reconciliation/:stationId?date=` to fetch summary
* Lock prevents new sales or payments once finalized

### Files

* `src/controllers/reconciliation.controller.ts`
* `src/services/reconciliation.service.ts`
* `src/routes/reconciliation.route.ts`
* `src/services/nozzleReading.service.ts`
* `src/services/creditor.service.ts`
* `docs/BUSINESS_RULES.md`

## [Phase 2 - Step 2.9] – Global Auth Enforcement

**Status:** ✅ Done

### 🟩 Features

* `/api/auth/login` issues JWT tokens containing user and tenant context
* Middlewares `authenticateJWT`, `requireRole`, and `checkStationAccess` applied across all routes
* New `/v1/admin/*` router for super admin endpoints

### Files

* `src/controllers/auth.controller.ts`
* `src/routes/auth.route.ts`
* `src/routes/adminApi.router.ts`
* `src/middlewares/checkStationAccess.ts`
* `src/middleware/auth.middleware.ts`

## [Phase 2 - Step 2.10] – Backend Cleanup, Tests & Swagger

**Status:** ✅ Done

### 🟩 Features

* Added Swagger documentation route `/api/docs`

### 🟦 Enhancements

* Added Jest unit tests for core services and auth flow

### 🟥 Fixes

* Introduced centralized error handler returning `{ status, code, message }`

### Files

* `src/app.ts`
* `src/docs/swagger.ts`
* `src/routes/docs.route.ts`
* `src/middlewares/errorHandler.ts`
* `src/utils/db.ts`
* `tests/*`

## [Phase 2 - Step 2.11] – Jest DB Test Infrastructure

**Status:** ✅ Done

### 🟩 Features

* Global Jest setup/teardown creates and drops a dedicated test schema
* Introduced `.env.test` for isolated database configuration

### 🟦 Enhancements

* Added `test:db` npm script using `cross-env`
* Extended auth service tests to verify bcrypt usage

### Files

* `jest.config.js`
* `tests/setup.ts`
* `tests/teardown.ts`
* `tests/utils/db-utils.ts`
* `.env.test`
* `tests/auth.service.test.ts`

## [Phase 2 - Step 2.12] – Test DB Bootstrap & Helpers

**Status:** ✅ Done

### 🟩 Features

* `scripts/init-test-db.ts` bootstraps a dedicated test database
* Added `jest.setup.js` to initialize DB before tests
* Utility helpers `tests/utils/testClient.ts` and `tests/utils/testTenant.ts`

### 🟦 Enhancements

* `package.json` test scripts load env and setup file
* Renamed `jest.config.js` → `jest.config.ts`

### Files

* `.env.test`
* `scripts/init-test-db.ts`
* `jest.setup.js`
* `jest.config.ts`
* `tests/utils/testClient.ts`
* `tests/utils/testTenant.ts`

## [Phase 2 - Step 2.13] – Independent Backend Test Execution

**Status:** ✅ Done

### 🟦 Enhancements

* Added `jest.globalSetup.ts` and `jest.globalTeardown.ts` for automated test DB provisioning
* New scripts `scripts/create-test-db.ts` and `scripts/seed-test-db.ts`
* Updated Jest config and test script to use `.env.test` and run in-band
* Global setup now skips tests gracefully if PostgreSQL is unavailable
* Documented installing PostgreSQL locally for tests; updated seed logic and
  migration order to run without errors

### Files

* `jest.globalSetup.ts`
* `jest.globalTeardown.ts`
* `scripts/create-test-db.ts`
* `scripts/seed-test-db.ts`
* `jest.config.ts`

### 🟢 Dev Setup
* Documented local Postgres setup and seeding in `LOCAL_DEV_SETUP.md`
* Fixed seed scripts and station services to run without optional fields

## [Fix - 2025-06-23] – OpenAPI Spec

### 🟩 Features
* Added static OpenAPI file `docs/openapi.yaml` consolidating all endpoints

### Files
* `docs/openapi.yaml`
* `docs/STEP_fix_20250623.md`

## [Fix - 2025-06-24] – Local Dev Test Setup

### 🟢 Dev Setup
* Expanded `LOCAL_DEV_SETUP.md` with instructions to run tests
* Referenced `docs/openapi.yaml` in `README.md`

## [Fix - 2025-06-25] – Endpoint Review Notes

### 🟦 Enhancements
* Documented missing `paymentMethod` field for nozzle readings
* Noted absence of pump/nozzle update endpoints
* Added request body details to `/api/nozzle-readings` in OpenAPI spec

### Files
* `docs/STEP_fix_20250625.md`
* `docs/openapi.yaml`
* `docs/PHASE_2_SUMMARY.md`

## [Fix - 2025-06-26] – Clarify Test DB Setup

### 🟢 Dev Setup
* Added reminder in `LOCAL_DEV_SETUP.md` to start PostgreSQL before running tests
* `PHASE_2_SUMMARY.md` updated with the same note

### Files
* `docs/STEP_fix_20250626.md`
* `docs/LOCAL_DEV_SETUP.md`
* `docs/PHASE_2_SUMMARY.md`

## [Fix - 2025-06-27] – Local DB Install & Tests

### 🟢 Dev Setup
* Documented Docker Compose requirement in `LOCAL_DEV_SETUP.md`
* Added troubleshooting note for `docker-compose` missing
* Verified database setup and ran all Jest suites successfully

### Files
* `docs/STEP_fix_20250627.md`
* `docs/LOCAL_DEV_SETUP.md`
* `docs/TROUBLESHOOTING.md`

## [Fix - Step 2.CRITICAL_FIXES] – Backend Hardening

### 🟥 Fixes
* Added PostgreSQL connection pooling
* Added missing indexes for sales and user relations
* Versioned routes under `/v1`
* Introduced `errorResponse` helper and updated controllers

### Files
* `src/db/index.ts`
* `migrations/003_add_indexes.sql`
* `src/utils/errorResponse.ts`
* tests in `__tests__/`
* `docs/API_GUIDELINES.md`, `docs/SCHEMA_CHANGELOG.md`, `docs/CONTRIBUTING.md`

## [Fix - 2025-07-01] – Test DB Provisioning Guidance

### 🟢 Dev Setup
* Documented fallback instructions when Jest cannot create the test database.

### Files
* `docs/STEP_fix_20250701.md`
* `docs/TROUBLESHOOTING.md`
* `docs/LOCAL_DEV_SETUP.md`
* `docs/PHASE_2_SUMMARY.md`
* `README.md`

## [Fix - 2025-07-02] – Apt Install Reminder

### 🟢 Dev Setup
* Added explicit `sudo apt-get` install commands in fallback docs.

### Files
* `docs/STEP_fix_20250702.md`
* `docs/TROUBLESHOOTING.md`
* `docs/PHASE_2_SUMMARY.md`
* `README.md`

## [Step 2.14] Critical Fixes (Safe Schema & Additional Indexes)
- Added getSafeSchema utility and ServiceError class
- Replaced raw tenant schema interpolation in services
- Added additional indexes for credit payments and fuel prices
- Updated controllers to use ServiceError for consistent errors

## [Fix - 2025-07-03] – Remove uuid-ossp Defaults

### 🛢️ Database
* Removed `uuid-ossp` extension and UUID defaults from migrations.

### Files
* `migrations/001_create_public_schema.sql`
* `migrations/tenant_schema_template.sql`
* `sql/tenant_schema_template.sql`
* `database/tenant_schema_template.sql`
* `docs/STEP_fix_20250703.md`

## [Fix - 2025-07-04] – Test DB UUID & Jest Cleanup

### 🟢 Tests
* Fixed failing Jest setup by inserting a generated UUID when creating the basic plan.
* Updated unit tests to reflect current login response shapes.

### Files
* `scripts/create-test-db.ts`
* `tests/auth.service.test.ts`
* `tests/creditor.service.test.ts`
* `docs/STEP_fix_20250704.md`

## [Fix - 2025-12-19] – Complete Swagger API Documentation

### 🟩 Features
* Fixed empty Swagger UI by replacing JSDoc-based generation with comprehensive static specification
* Added all missing API endpoints to Swagger documentation including user management, station hierarchy, credit payments, and fuel management
* Added fuel inventory endpoint with GET `/v1/fuel-inventory` route and controller handler
* Fixed database import path in `app.ts` from `./db` to `./utils/db`

### 🟦 Enhancements
* Updated Swagger specification to use proper `/v1` API versioning
* Added detailed request/response schemas for all endpoints
* Organized endpoints by functional tags (Authentication, User Management, Station Hierarchy, etc.)
* Added proper parameter documentation including required headers and query parameters

### 🟥 Fixes
* Resolved issue where `http://localhost:3000/api/docs` was showing empty page
* Fixed missing routes in API documentation that were implemented but not documented
* Corrected server URL in Swagger spec to match actual API structure

### Files
* `src/docs/swagger.ts` - Complete rewrite with static specification
* `src/app.ts` - Fixed database import path
* `src/routes/delivery.route.ts` - Added fuel inventory route
* `src/controllers/delivery.controller.ts` - Added inventory handler

### API Endpoints Now Documented
* `/v1/auth/login` - User authentication
* `/v1/users` - Tenant user management (GET, POST)
* `/v1/admin/users` - Super admin user management (GET, POST)
* `/v1/stations` - Station management (GET, POST, PUT, DELETE)
* `/v1/pumps` - Pump management (GET, POST)
* `/v1/nozzles` - Nozzle management (GET, POST)
* `/v1/nozzle-readings` - Reading entry and auto-sales (GET, POST)
* `/v1/fuel-prices` - Fuel pricing management (GET, POST)
* `/v1/creditors` - Credit customer management (GET, POST, PUT, DELETE)
* `/v1/credit-payments` - Credit payment processing (GET, POST)
* `/v1/fuel-deliveries` - Fuel delivery logging (GET, POST)
* `/v1/fuel-inventory` - Inventory level viewing (GET)
* `/v1/reconciliation` - Daily reconciliation (GET, POST)

### Validation
* Server starts successfully with `NODE_ENV=development npx ts-node src/app.ts`
* Swagger UI accessible at `http://localhost:3000/api/docs`
* Swagger JSON available at `http://localhost:3000/api/docs/swagger.json`
* All previously missing routes now properly documented with request/response schemas

## [Step 2.15] – Sales Listing & Tenant Settings API

### 🟩 Features
* Added GET `/v1/sales` with filtering options
* Added GET and POST `/v1/settings` for tenant preferences

### Files
* `src/routes/sales.route.ts`, `src/controllers/sales.controller.ts`, `src/services/sales.service.ts`
* `src/routes/settings.route.ts`, `src/controllers/settings.controller.ts`, `src/services/settings.service.ts`

## [Step 2.16] – Utility Scripts & Fuel Inventory

### 🟩 Features
* Added `/v1/fuel-inventory` endpoint with auto-seeding when empty
* Enhanced auth logic to locate tenant by email when no schema is provided
* Added `start-server.js` and numerous helper scripts for DB checks and login tests
* Created `DB_AUTH_TROUBLESHOOTING.md` and `SERVER_README.md`
* Added initial frontend planning documents under `docs/Frontend`

### Files
* `start-server.js`, `scripts/*.ts`, `src/services/fuelInventory.service.ts`
* `src/controllers/fuelInventory.controller.ts`, `src/routes/fuelInventory.route.ts`
* `src/services/auth.service.ts`, `src/controllers/auth.controller.ts`
* `DB_AUTH_TROUBLESHOOTING.md`, `SERVER_README.md`, `docs/Frontend/*`

## [Step 2.17] – Azure Deployment Restructure

### 🛠 Enhancements
* Renamed entry script to `index.js` for Azure App Service
* Updated start script and added Node `20.x` engines requirement
* Adjusted helper script to launch `index.js`

### Files
* `index.js`, `package.json`, `scripts/start-and-test.js`

## [Fix - 2025-07-05] – Simplify Seeding Scripts

### 🟦 Enhancements
* Consolidated multiple seed utilities into `scripts/seed-production.ts`.
* Updated documentation to describe connecting, migrating and seeding in three steps.

### Files
* `scripts/seed-production.ts` (existing)
* `docs/SEEDING.md`, `docs/LOCAL_DEV_SETUP.md`, `SERVER_README.md`, `docs/TROUBLESHOOTING.md`, `docs/TESTING_GUIDE.md`, `docs/PHASE_1_SUMMARY.md`
* `package.json`, `jest.globalSetup.ts`, `scripts/init-db.js`

## [Fix - 2025-07-06] – Ensure cross-env Available for Tests

### 🟥 Fixes
* Moved `cross-env` from devDependencies to dependencies so `npm test` works in clean environments.

### Files
* `package.json`, documentation updates

## [Fix - 2025-07-07] – TypeScript typings on Azure

### 🟥 Fixes
* Moved `@types/node` to dependencies so production builds include Node typings.
* Removed `jest` from `tsconfig.json` to avoid missing type errors in Azure.

### Files
* `package.json`, `tsconfig.json`, documentation updates

## [Fix - 2025-07-08] – Azure Cleanup and Finalisation

### 🟦 Enhancements
* Added `AZURE_DEPLOYMENT.md` describing direct Git deployment.

### 🟥 Fixes
* Removed all Vercel-related configuration and docs.
* Updated CORS and DB utilities for Azure-only environment.
* Package scripts cleaned to run compiled output on Azure.

### Files
* `app.js`, `src/app.ts`, `src/utils/db.ts`, `package.json`, `package-lock.json`
* Deleted `vercel.json`, `.vercelignore`, `VERCEL_DEPLOYMENT.md`, `api/index.*`,
  `scripts/migrate-vercel.ts`, `vercel-postgres-setup.md`
* Documentation updates across `DEV_GUIDE.md` and summaries

## [Step 2.18] – Tenant APIs and Admin Summary

### 🟩 Features
* Added `/v1/tenants` endpoints for SuperAdmin tenant management.
* Added `/v1/admin/tenants/summary` for global tenant metrics.

### Files
* `src/services/tenant.service.ts`, `src/controllers/tenant.controller.ts`
* `src/routes/tenant.route.ts`, `src/routes/adminTenant.route.ts`, `src/routes/adminApi.router.ts`
* `src/validators/tenant.validator.ts`, `src/app.ts`, `docs/openapi.yaml`

## [Fix - 2025-07-09] – Align Backend with API Contract

### 🟥 Fixes
* Added missing dashboard routes and daily summary endpoint.
* Implemented logout and refresh token APIs.
* Introduced admin analytics and credit payment route `/credit-payments`.
* Unified base path to `/api/v1` and updated station listings.

### Files
* `src/app.ts`, `src/controllers/dashboard.controller.ts`, `src/routes/dashboard.route.ts`
* `src/controllers/adminAnalytics.controller.ts`, `src/routes/adminAnalytics.route.ts`
* `src/controllers/auth.controller.ts`, `src/routes/auth.route.ts`
* `src/controllers/reconciliation.controller.ts`, `src/routes/reconciliation.route.ts`
* `src/routes/creditPayment.route.ts`, `src/routes/creditor.route.ts`
* `src/services/station.service.ts`, `docs/openapi.yaml`, `docs/missing/*`

## [Fix - 2025-07-10] – Dashboard & Reconciliation Bug Fixes

### 🟥 Fixes
* Corrected route order in reconciliation router so `/daily-summary` works.
* Unified tenant lookup in dashboard payment method breakdown.
* Added basic analytics summary endpoint for SuperAdmin.

### Files
* `src/routes/reconciliation.route.ts`
* `src/controllers/dashboard.controller.ts`
* `src/controllers/adminUser.controller.ts`, `src/routes/adminApi.router.ts`
* `docs/STEP_fix_20250710.md`

## [Step 2.19] – Dashboard & Sales Metrics Expansion

### 🟩 Features
* Dashboard endpoints accept `stationId` and date range filters.
* Station list can include metrics with `/stations?includeMetrics=true`.
* New station metrics and performance routes.
* Sales listing supports pagination and `/sales/analytics` returns station-wise totals.

### Files
* `src/controllers/dashboard.controller.ts`, `src/routes/dashboard.route.ts`
* `src/controllers/station.controller.ts`, `src/routes/station.route.ts`, `src/services/station.service.ts`
* `src/controllers/sales.controller.ts`, `src/services/sales.service.ts`, `src/routes/sales.route.ts`, `src/validators/sales.validator.ts`
* `src/middlewares/checkStationAccess.ts`
* `docs/openapi.yaml`, `docs/STEP_2_19_COMMAND.md`

## [Fix - 2025-07-11] – SuperAdmin API Alignment

### 🟥 Fixes
* Added `price_yearly` field to plans and exposed in APIs.
* Analytics summary now returns `signupsThisMonth` and `tenantsByPlan` with percentages.
* Tenant creation accepts custom admin credentials.
* Tenant status update uses PATCH.

### Files
* `migrations/005_add_price_yearly_to_plans.sql`
* `src/services/plan.service.ts`, `src/controllers/admin.controller.ts`
* `src/services/tenant.service.ts`, `src/routes/adminApi.router.ts`
* `src/controllers/analytics.controller.ts`
* `docs/STEP_fix_20250711.md`

## [Fix - 2025-07-12] – Remove Legacy Seeders

### 🟥 Fixes
* Deleted obsolete seed scripts and `/migrate` endpoint.
* `setup-database.js` is now the only seeding mechanism.

### Files
* Removed scripts under `scripts/` and `src/utils/seedUtils.ts`
* Updated docs referencing old seed commands
* `src/app.ts`, `scripts/init-db.js`, `scripts/run-all-tests.js`
* `docs/STEP_fix_20250712.md`


## [Fix - 2025-07-13] – Document Frontend API Contract

### 🟦 Enhancements
* Added comprehensive frontend OpenAPI spec.
* Created API diff table highlighting missing endpoints and path mismatches.

### Files
* `frontend/docs/openapi-v1.yaml`
* `frontend/docs/api-diff.md`
* `docs/STEP_fix_20250713.md`

## [Feature - 2025-07-14] – API Alignment Endpoints

### 🟢 Features
* Added alerts API with mark-read support.
* Added `/analytics/station-comparison` endpoint.
* Fuel prices can be updated via PUT.
* Sales reports export available via POST.
* OpenAPI and Swagger docs updated.
* Frontend integration instructions added.

### Files
* `src/controllers/alerts.controller.ts`, `src/routes/alerts.route.ts`
* `src/controllers/analytics.controller.ts`, `src/routes/analytics.route.ts`
* `src/services/fuelPrice.service.ts`, `src/controllers/fuelPrice.controller.ts`, `src/routes/fuelPrice.route.ts`
* `src/controllers/reports.controller.ts`, `src/routes/reports.route.ts`
* `src/app.ts`, `docs/openapi.yaml`, `src/docs/swagger.ts`
* `frontend/docs/integration-instructions.md`, `frontend/docs/api-diff.md`
* `docs/STEP_2_20_COMMAND.md`

## [Fix - 2025-07-14] – Reports Controller Compile Error

### 🟥 Fixes
* Removed stray closing brace causing TypeScript error in `createReportsHandlers`.

### Files
* `src/controllers/reports.controller.ts`
* `docs/STEP_fix_20250714.md`
## [Fix - 2025-07-15] – Plan Enforcement Schema Lookup

### 🟥 Fixes
* Plan enforcement middleware queried tenants by UUID but received schema names, causing `invalid input syntax for type uuid` errors during station creation.
* Updated `planEnforcement.ts` functions to resolve plan details via `schema_name`.
* Owners can now create stations without UUID errors.

### Files
* `src/middleware/planEnforcement.ts`
* `docs/STEP_fix_20250715.md`


## [Fix - 2025-12-25] – Tenant Context & UUID Resolution

### 🟥 Fixes
* Fixed "invalid input syntax for type uuid" error by resolving schema names to actual tenant UUIDs
* Updated all service functions to get tenant UUID from schema name before database operations
* Fixed controller tenant context retrieval to check both JWT token and x-tenant-id header
* Added missing tenant status update and delete routes for super admin management
* Fixed frontend client header logic to properly handle super admin vs tenant user authentication

### 🟦 Enhancements
* Updated frontend StationsPage to use real API data instead of mock data
* Added loading states and error handling to frontend station management
* Improved tenant context handling across all controllers (station, pump, nozzle)
* Added comprehensive documentation of tenant UUID vs schema name resolution pattern

### Files
* `src/services/station.service.ts` - Fixed UUID resolution for all station operations
* `src/services/pump.service.ts` - Fixed UUID resolution for pump operations
* `src/services/inventory.service.ts` - Fixed null check for rowCount
* `src/controllers/station.controller.ts` - Fixed tenant context retrieval
* `src/controllers/pump.controller.ts` - Fixed tenant context retrieval
* `src/controllers/nozzle.controller.ts` - Fixed tenant context retrieval
* `src/controllers/tenant.controller.ts` - Added missing status update and delete handlers
* `src/routes/adminTenant.route.ts` - Added missing routes
* `src/api/client.ts` (frontend) - Fixed header logic for different user types
* `src/api/stations.ts` (frontend) - Updated Station interface and API methods
* `src/api/dashboard.ts` (frontend) - Added data transformation for backend compatibility
* `src/hooks/useStations.ts` (frontend) - Enhanced hooks with metrics support
* `src/pages/dashboard/StationsPage.tsx` (frontend) - Replaced mock data with real API calls
* `TENANT_CONTEXT_FIX.md` - Comprehensive fix documentation
* `TENANT_UUID_FIX_SUMMARY.md` - Technical implementation details
* `FRONTEND_INTERFACE_ALIGNMENT.md` - Frontend interface alignment documentation

## [Fix - 2025-12-25] – Tenant Management & User Creation Improvements

### 🟥 Fixes
* Fixed TypeScript build error: replaced `adminEmail` with `ownerEmail` in TenantInput interface
* Added schema name uniqueness validation to prevent tenant isolation conflicts
* Fixed tenant status management actions (activate, suspend, cancel) with conditional UI
* Improved tenant creation process with automatic user hierarchy generation

### 🟦 Enhancements
* Enhanced tenant details API to return complete organizational structure (users, stations, pumps, nozzles)
* Simplified frontend tenant creation form with auto-generation preview instead of manual fields
* Added better password generation pattern: `{firstname}@{schema}123` instead of weak `tenant123`
* Improved tenant status actions with conditional display and clear labels with emojis
* Added comprehensive tenant management documentation following AGENTS.md protocol

### 🟩 Features
* Automatic creation of Owner, Manager, and Attendant users for each new tenant
* Schema name collision detection with proper error handling
* Enhanced tenant details endpoint showing complete hierarchy structure
* Status lifecycle management: Active ↔ Suspended ↔ Cancelled → Deleted
* Auto-generation preview in frontend showing emails and password patterns

### Files
* `src/services/tenant.service.ts` - Added schema validation and enhanced tenant details
* `src/controllers/admin.controller.ts` - Fixed TypeScript interface alignment
* `src/components/admin/TenantForm.tsx` (frontend) - Simplified form with auto-generation preview
* `src/pages/superadmin/TenantsPage.tsx` (frontend) - Improved status management UI
* `docs/STEP_tenant_management_fixes.md` - Step command documentation
* `docs/TENANT_MANAGEMENT_GUIDE.md` - Comprehensive management guide
* `TENANT_USER_CREATION_PROCESS.md` - Complete user creation documentation

## [Feature - 2025-12-25] – Hierarchical Organization Components

### 🟩 Features
* Created TenantHierarchy component for SuperAdmin complete organizational structure view
* Built OrganizationHierarchy component for Owner/Manager self-service organization view
* Added TenantDetailsPage with full tenant hierarchy visualization
* Implemented collapsible tree structure: Tenant → Users → Stations → Pumps → Nozzles
* Enhanced tenant details API to return complete nested organizational data

### 🟦 Enhancements
* Updated frontend tenant interfaces to support hierarchical data structures
* Added role-based icons and visual indicators (👑 Owner, 🛡️ Manager, 🔧 Attendant)
* Integrated live performance metrics in organization hierarchy display
* Added "View Details" navigation from tenant management to detailed hierarchy
* Enhanced dashboard with organization structure card for quick overview

### 📊 API Enhancements
* Enhanced GET /admin/tenants/{id} to return complete organizational hierarchy
* Added nested data structure with users, stations, pumps, and nozzles
* Implemented efficient database queries with proper indexing for hierarchy data
* Added useTenantDetails hook for frontend data fetching
* Created getTenantDetails API method with full structure support

### 🎨 UI/UX Improvements
* Responsive collapsible tree design for mobile and desktop
* Color-coded status badges for all organizational entities
* Quick action buttons for navigation to management pages
* Empty states with helpful guidance for setup
* Loading states with skeleton components for smooth experience

### Files
* `src/components/admin/TenantHierarchy.tsx` (frontend) - SuperAdmin hierarchy component
* `src/components/dashboard/OrganizationHierarchy.tsx` (frontend) - User hierarchy component
* `src/pages/superadmin/TenantDetailsPage.tsx` (frontend) - Dedicated tenant details page
* `src/hooks/useTenantDetails.ts` (frontend) - Data fetching hook
* `src/api/tenants.ts` (frontend) - Enhanced interfaces and API methods
* `src/pages/superadmin/TenantsPage.tsx` (frontend) - Added "View Details" navigation
* `src/pages/dashboard/SummaryPage.tsx` (frontend) - Added organization hierarchy
* `docs/STEP_hierarchy_components.md` - Step command documentation
* `docs/FRONTEND_HIERARCHY_GUIDE.md` - Complete frontend hierarchy guide
* `docs/BACKEND_HIERARCHY_API.md` - Backend API documentation

## [Fix - 2025-12-25] – Tenant Details Routing & Admin User Names

### 🟥 Fixes
* Fixed 404 error on tenant details page by adding missing route `/superadmin/tenants/:tenantId`
* Added missing Collapsible UI component for hierarchy tree structure
* Fixed admin users to support name field in database and API
* Added migration to add name column to admin_users table

### 🟦 Enhancements
* Enhanced admin user creation and updates to include name field
* Auto-generate admin user names from email if not provided
* Updated all admin user queries to include name field
* Improved tenant details navigation flow

### Files
* `src/App.tsx` (frontend) - Added tenant details route and import
* `src/components/ui/collapsible.tsx` (frontend) - Added missing UI component
* `migrations/007_add_name_to_admin_users.sql` - Database migration for name field
* `src/services/admin.service.ts` - Enhanced admin user service with name support
* `src/controllers/admin.controller.ts` - Updated controllers to handle name field

## [Fix - 2025-12-25] – Owner Functionality & Service Consistency

### 🟥 Fixes
* Removed automatic dummy station seeding that was creating unwanted test data
* Fixed password display in tenant creation form to show correct schema name
* Fixed service layer inconsistency between tenantId and schemaName usage
* Enhanced user creation service to include name field and proper tenant UUID resolution
* Fixed fuel price service to use schema names consistently
* Removed station auto-seeding that was interfering with owner management

### 🟦 Enhancements
* Updated user service to support proper name field in user creation
* Enhanced fuel price service with proper tenant context resolution
* Improved service layer consistency across all tenant operations
* Fixed user controller to handle all CRUD operations properly

### Files
* `src/services/station.service.ts` - Removed dummy data seeding
* `src/components/admin/TenantForm.tsx` (frontend) - Fixed password display
* `src/services/user.service.ts` - Enhanced with name support and schema consistency
* `src/services/fuelPrice.service.ts` - Fixed schema name usage and tenant UUID resolution
* `src/controllers/user.controller.ts` - Complete user management functionality

## [Feature - 2025-12-25] – Complete Station Management Workflow

### 🟩 Features
* Added functional station creation with CreateStationDialog component
* Implemented pump creation and management with real API integration
* Created nozzle management system with proper data flow
* Added complete CRUD operations for stations, pumps, and nozzles
* Enhanced backend services with proper schema name handling and tenant UUID resolution

### 🟥 Fixes
* Fixed station creation button functionality - now opens dialog and creates stations
* Fixed API interface mismatches between frontend and backend
* Corrected pump and nozzle services to use schema names consistently
* Fixed pump listing to include nozzle counts
* Updated validators to support address field in station creation

### 🟦 Enhancements
* Enhanced station service to support address field in creation
* Updated pump service to include nozzle count in listings
* Improved nozzle service with proper tenant context and field support
* Added comprehensive error handling in all CRUD operations
* Enhanced frontend components with proper loading states and error handling

### Files
* `src/components/dashboard/CreateStationDialog.tsx` (frontend) - Station creation dialog
* `src/components/dashboard/CreatePumpDialog.tsx` (frontend) - Pump creation dialog
* `src/api/stations.ts` (frontend) - Added createStation method
* `src/api/pumps.ts` (frontend) - Complete pump API with proper endpoints
* `src/api/nozzles.ts` (frontend) - New nozzle API for CRUD operations
* `src/pages/dashboard/StationsPage.tsx` (frontend) - Integrated station creation dialog
* `src/pages/dashboard/PumpsPage.tsx` (frontend) - Fixed API interface mismatches
* `src/services/station.service.ts` - Enhanced with address field support
* `src/services/pump.service.ts` - Added nozzle count to listings
* `src/services/nozzle.service.ts` - Fixed schema name usage and added required fields
* `src/validators/station.validator.ts` - Added address field support

## [Critical Fix - 2025-12-25] – UUID Tenant Context Resolution

### 🟥 Critical Fixes
* Fixed "invalid input syntax for type uuid" error preventing station creation
* Resolved tenant context mismatch between controllers and services
* Fixed all controllers to use schemaName instead of tenantId for database operations
* Corrected tenant context resolution across station, pump, and nozzle operations
* Fixed UUID validation errors in all CRUD operations

### 🔧 Technical Resolution
* Updated station controller to use `(req as any).schemaName` instead of `req.user?.tenantId`
* Fixed pump controller tenant context resolution for all handlers
* Corrected nozzle controller to use proper schema names
* Ensured consistent tenant context pattern across all controllers
* Maintained tenant isolation while fixing UUID validation

### 📊 Root Cause Analysis
* Controllers were passing user tenantId (like "bittu") instead of schema names
* Services expected schema names (like "tenant_acme_corp_123456") for database operations
* UUID validation failed when non-UUID strings passed to database queries
* Tenant context middleware sets schemaName but controllers weren't using it

### Files
* `src/controllers/station.controller.ts` - Fixed all CRUD operations to use schemaName
* `src/controllers/pump.controller.ts` - Updated create, list, delete handlers
* `src/controllers/nozzle.controller.ts` - Fixed all nozzle operations
* `src/validators/nozzle.validator.ts` - Added nozzleNumber validation
* `docs/STEP_uuid_tenant_context_fix.md` - Complete fix documentation

## [Complete Fix - 2025-12-25] – Frontend-Backend Tenant Context Integration

### 🟥 Critical Fixes
* Created setTenantContext middleware to properly extract schema names from JWT tokens
* Fixed creditor table schema mismatch - removed non-existent contact_person column
* Updated creditor service to use correct column names (party_name, contact_number, address)
* Fixed all remaining controllers to use schemaName instead of tenantId
* Resolved frontend-backend tenant context integration issues

### 🔧 Technical Implementation
* Added setTenantContext middleware that extracts tenantId from JWT and sets as schemaName
* Updated creditor service to match actual database schema structure
* Fixed creditor validator to use correct field names
* Applied setTenantContext middleware to station and creditor routes
* Ensured consistent tenant context flow: JWT → Middleware → Controller → Service

### 📊 Database Schema Alignment
* Creditor table uses: party_name, contact_number, address (not contact_person)
* All services now properly resolve tenant UUID from schema names
* Consistent column naming across all tenant operations
* Proper foreign key relationships maintained

### Files
* `src/middlewares/setTenantContext.ts` - New middleware for tenant context resolution
* `src/routes/station.route.ts` - Added setTenantContext middleware
* `src/routes/creditor.route.ts` - Added setTenantContext middleware
* `src/services/creditor.service.ts` - Fixed schema alignment and tenant UUID resolution
* `src/controllers/creditor.controller.ts` - Updated to use schemaName
* `src/validators/creditor.validator.ts` - Fixed field names to match schema

## [Security Clarification - 2025-12-25] – Multi-Tenant Authorization Model

### 🔒 Security Architecture Clarified
* **Schema Isolation**: tenantId provides data separation between different companies
* **Role Authorization**: JWT role field provides permission control within same tenant
* **User Identity**: userId enables user-specific operations and audit trails
* **Secure Pattern**: authenticateJWT → setTenantContext → requireRole → handler

### 📊 Authorization Matrix
* **Owner**: Full access - create stations, manage users, view reports, enter sales
* **Manager**: Limited access - create stations, view reports, enter sales (no user management)
* **Attendant**: Restricted access - only enter sales and view assigned data
* **Schema Shared**: All users in same tenant access same schema but with different permissions

### 🔧 Technical Implementation
* JWT contains: {userId, tenantId (schema), role}
* setTenantContext: Extracts schema name for data isolation
* requireRole: Enforces permission control based on user role
* Route protection ensures both tenant isolation and role authorization

### Files
* `src/middlewares/setTenantContext.ts` - Enhanced with security documentation
* `src/routes/pump.route.ts` - Added setTenantContext middleware
* `docs/SECURITY_tenant_authorization.md` - Comprehensive security model documentation

## [Feature - Step 2.21] – CRUD Completion Endpoints

### 🟩 Features
* Added `updatePump` service and corresponding route/controller.
* Documented update and delete routes for pumps, nozzles and users in OpenAPI.

### Files
* `src/services/pump.service.ts`
* `src/controllers/pump.controller.ts`
* `src/routes/pump.route.ts`
* `docs/openapi.yaml`

## [Feature - Step 2.22] – Fuel Price Delete Endpoint

### 🟩 Features
* Added `deleteFuelPrice` service, controller method and route.
* Documented DELETE `/fuel-prices/{id}` in OpenAPI.

### Files
* `src/services/fuelPrice.service.ts`
* `src/controllers/fuelPrice.controller.ts`
* `src/routes/fuelPrice.route.ts`
* `docs/openapi.yaml`

## [Fix - 2025-07-16] – Schema Consolidation Migration

### 🟥 Fixes
* Migrated from schema-per-tenant design to a unified `public` schema with `tenant_id` columns.
* Added `db_brain.md` documenting database structure and best practices.

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`
* `docs/STEP_fix_20250716.md`

## [Fix - 2025-07-17] – Unified Schema Enhancements

### 🟥 Fixes
* Added missing `schema_migrations` and `admin_users` table definitions to migration 003.
* Enforced foreign key references on all `tenant_id` columns.
* Documented referential integrity in `db_brain.md`.

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`
* `docs/STEP_fix_20250717.md`

## [Fix - 2025-07-18] – Schema Alignment with Business Rules

### 🟥 Fixes
* Added `reading_id` to `sales` table
* Added `user_stations` and `tenant_settings` tables
* Extended `fuel_prices` with `effective_to`
* Updated `db_brain.md` with new structures

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`
* `docs/STEP_fix_20250718.md`

## [Fix - 2025-07-19] – Final Schema Adjustments

### 🟥 Fixes
* Added `admin_activity_logs` table for super admin auditing
* Added `updated_at` column to all major tables
* Inserted missing table comments for clarity
* Updated `db_brain.md` with new fields and tables

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`
* `docs/STEP_fix_20250719.md`

## [Fix - 2025-07-20] – Remove Legacy DB Files

### 🟥 Fixes
* Deleted obsolete production schema and seed scripts
* Removed unused tenant schema templates
* Updated helper scripts to load `001_initial_schema.sql`
* Documented migration procedure in `db_brain.md`

### Files
* `migrations/001_production_schema.sql` (deleted)
* `migrations/002_production_seed.sql` (deleted)
* `database/tenant_schema_template.sql` (deleted)
* `sql/tenant_schema_template.sql` (deleted)
* `scripts/run-migration.ts`
* `scripts/create-test-db.ts`
* `scripts/init-test-db.js`
* `db_brain.md`
* `docs/STEP_fix_20250720.md`

## [Enhancement - 2025-07-21] – Prisma ORM Migration

### 🟦 Enhancements
* Added Prisma and @prisma/client dependencies.
* Introduced `prisma/schema.prisma` with unified schema models.
* Updated `user.controller.ts` to use Prisma for main CRUD actions.
* Created `backend_brain.md` documenting all endpoints and noting OpenAPI drift.

### Files
* `package.json`
* `package-lock.json`
* `src/utils/prisma.ts`
* `src/controllers/user.controller.ts`
* `prisma/schema.prisma`
* `backend_brain.md`
* `docs/STEP_2_23_COMMAND.md`

## [Enhancement - 2025-07-22] – Additional Prisma Controllers

### 🟦 Enhancements
* Extended Prisma schema with `FuelPrice` and `UserStation` models.
* Refactored station, pump, nozzle, nozzle reading and fuel price controllers to use Prisma.

### Files
* `prisma/schema.prisma`
* `src/controllers/station.controller.ts`
* `src/controllers/pump.controller.ts`
* `src/controllers/nozzle.controller.ts`
* `src/controllers/nozzleReading.controller.ts`
* `src/controllers/fuelPrice.controller.ts`
* `backend_brain.md`
* `docs/STEP_2_24_COMMAND.md`

## [Enhancement - 2025-07-23] – Endpoint Inventory and Spec Update

### 🟦 Enhancements
* Generated full API inventory with Prisma migration status.
* Replaced outdated `openapi.yaml` with autogenerated spec reflecting all routes.
* Documented endpoint status table in `backend_brain.md`.

### Files
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_25_COMMAND.md`

## [Enhancement - 2025-07-24] – OpenAPI Route Audit

### 🟦 Enhancements
* Verified all backend routes against `openapi.yaml` – 97 paths match.
* Documented audit results in `backend_brain.md` with notes on missing schemas.

## [Enhancement - 2025-07-25] – Updated OpenAPI Spec

### 🟦 Enhancements
* Normalised path parameters and added missing summaries to `openapi.yaml`.
* Listed new endpoints in `backend_brain.md` highlighting contract drift.

### Files
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_27_COMMAND.md`

### Files
* `backend_brain.md`
* `docs/STEP_2_26_COMMAND.md`

## [Enhancement - 2025-07-26] – Complete OpenAPI Schemas

### 🟦 Enhancements
* Added generic request and response schemas for all API paths.
* Introduced `ErrorResponse` and normalised admin paths under `/api/v1`.
* Documented remaining contract drift in `backend_brain.md`.

### Files
* `docs/openapi.yaml`
* `backend_brain.md`

## [Enhancement - 2025-07-27] – API Doc Sync Script

### 🟦 Enhancements
* Added `merge-api-docs.js` for automated endpoint comparison.
* Documented best practices for contract evolution in `backend_brain.md`.

### Files
* `merge-api-docs.js`
* `backend_brain.md`
* `docs/STEP_2_29_COMMAND.md`

## [Enhancement - 2025-07-30] – Pump nozzle count

### 🟦 Enhancements
* `/api/v1/pumps` now returns `nozzleCount` for each pump and responses use `{ data }`.

### Files
* `src/controllers/pump.controller.ts`
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_30_COMMAND.md`

## [Fix - 2025-07-31] – OpenAPI Schema Details

### 🟥 Fixes
* Replaced minimal schema definitions with detailed properties and examples.
* Imported component definitions from `frontend/docs/openapi-v1.yaml`.

### Files
* `docs/openapi.yaml`
* `docs/STEP_fix_20250731.md`

## [Feature - 2025-08-01] – Analytics and lookup endpoints

### 🟩 Features
* Added DELETE `/api/v1/alerts/{alertId}`.
* Added analytics endpoints for hourly sales, peak hours and fuel performance.
* Added GET endpoints for creditors, stations and users with `{ data }` wrapper.
* Updated Prisma schema with `Alert` model.

### Files
* `src/controllers/analytics.controller.ts`
* `src/services/analytics.service.ts`
* `src/controllers/alerts.controller.ts`
* `src/services/alert.service.ts`
* `src/controllers/creditor.controller.ts`
* `prisma/schema.prisma`
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_31_COMMAND.md`

## [Fix - 2025-08-02] – Parameter naming alignment
### 🛠 Fixes
* Updated station and user routes to use `stationId` and `userId` path parameters.
* Synced OpenAPI spec and backend brain to match.
### Files
* `docs/openapi.yaml`
* `src/routes/user.route.ts`
* `src/routes/station.route.ts`
* `src/controllers/user.controller.ts`
* `src/controllers/station.controller.ts`
* `backend_brain.md`
* `docs/STEP_2_32_COMMAND.md`

## [Enhancement - 2025-08-03] – Reusable response components
### 🟦 Enhancements
* Added shared `Success` and `Error` response objects in the OpenAPI spec.
### Files
* `docs/openapi.yaml`
* `docs/STEP_2_33_COMMAND.md`

## [Fix - 2025-08-04] – Detailed request schemas

### 🟥 Fixes
* Wired authentication, user and station endpoints to explicit schemas.
* Added `CreateStationRequest` and `UpdateStationRequest` components.

### Files
* `docs/openapi.yaml`
* `docs/STEP_2_34_COMMAND.md`
## [Enhancement - 2025-08-05] – Response wrapping and parameter docs

### 🟦 Enhancements
* Unified all endpoints to return `{ data: ... }`.
* Documented query parameters for pump, nozzle and nozzle reading lists.
* Standardised error responses and updated utility routes.

### Files
* `docs/openapi.yaml`
* `src/app.ts`
* `docs/STEP_2_35_COMMAND.md`


## [Fix - 2025-08-11] – Consolidated Migration Scripts

### 🟥 Fixes
* Combined all remaining SQL migrations into `003_unified_schema.sql`.
* Added indexes and columns for yearly pricing, soft deletes and admin names.
* Introduced `report_schedules` table directly in the unified script.
* Removed outdated migration templates and incremental files.

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`

## [Fix - 2025-08-12] – Enum Constraint Updates

### 🟥 Fixes
* Added fuel type checks to `sales`, `fuel_inventory` and `fuel_deliveries` tables.
* Constrained `credit_payments.payment_method` to allowed values.
* Documented enum rules in `db_brain.md`.

### Files
* `migrations/schema/003_unified_schema.sql`
* `db_brain.md`
* `docs/STEP_fix_20250811.md`

## [Fix - 2025-08-13] – Response and Query Cleanups

### 🟥 Fixes
* Removed duplicated response object in the creditor controller.
* Corrected missing semicolons and braces in updated files.
* Rewrote analytics queries using `Prisma.sql` and separated execution.
* Updated table references to the unified `sales` name.
* Added optional `costPrice` validation for fuel prices.

### Files
* `src/controllers/creditor.controller.ts`
* `src/services/analytics.service.ts`
* `src/validators/fuelPrice.validator.ts`
* `docs/STEP_fix_20250813.md`

## [Fix - 2025-08-14] – Update Login Queries for Unified Schema

### 🟥 Fixes
* Updated login logic to use tenant UUIDs instead of `schema_name`.

### Files
* `src/controllers/auth.controller.ts`
* `src/services/auth.service.ts`
* `docs/STEP_fix_20250814.md`

## [Fix - 2025-08-15] – Tenant Service Unified Schema

### 🟥 Fixes
* Removed schema creation logic from tenant service.
* Controllers and validators now work with tenant IDs.
* Tests and documentation dropped `schemaName` fields.

### Files
* `src/services/tenant.service.ts`
* `src/controllers/tenant.controller.ts`
* `src/validators/tenant.validator.ts`
* `tests/utils/testTenant.ts`
* `docs/openapi.yaml`
* `docs/TENANT_MANAGEMENT_GUIDE.md`
* `docs/STEP_2_36_COMMAND.md`

## [Feature - 2025-06-26] – Unified Schema Setup Scripts

### 🟩 Features
* Added scripts to apply the new `004_complete_unified_schema.sql` migration, verify structure and seed data via Prisma.
* Created `setup-unified-db.js` for one-click environment bootstrap.
* Documented migration and seeding steps in `UNIFIED_SCHEMA_MIGRATION.md`, `UNIFIED_DB_SETUP.md` and `SEED_DATA_GUIDE.md`.
* Added npm aliases `db:fix-constraints`, `db:unified-schema`, `db:verify-schema` and `db:seed-data`.

### Files
* `scripts/apply-unified-schema.js`, `scripts/verify-schema.js`, `scripts/seed-data.js`, `scripts/setup-unified-db.js`, `scripts/fix-constraints.js`
* `UNIFIED_SCHEMA_MIGRATION.md`, `UNIFIED_DB_SETUP.md`, `SEED_DATA_GUIDE.md`
* `package.json`
* `docs/STEP_fix_20250627.md`

## [Fix - 2025-08-16] – Plan Enforcement Tenant Queries

### 🟥 Fixes
* Plan limit middleware now queries unified tables using `tenant_id`.
* Services pass tenant IDs instead of schema names.

### Files
* `src/middleware/planEnforcement.ts`
* `src/services/station.service.ts`
* `src/services/pump.service.ts`
* `src/services/nozzle.service.ts`
* `src/services/user.service.ts`
* `docs/STEP_fix_20250816.md`

## [Fix - 2025-08-17] – Service Schema Cleanup

### 🟥 Fixes
* Removed remaining `schema_name` references in services.
* Queries now use public tables with `tenant_id` filters.
* Controllers and seeding helpers updated accordingly.

### Files
* `src/services/*`
* `src/controllers/*`
* `src/utils/seedHelpers.ts`
* `docs/STEP_fix_20250817.md`

## [Fix - 2025-08-18] – Remove schemaName from docs

### 🟥 Fixes
* Updated all documentation to use unified tenant schema without `schemaName`.
* OpenAPI spec references `CreateTenantRequest` without schema fields.

### Files
* `docs/openapi.yaml`
* `docs/TENANT_CREATION_API.md`
* `docs/SUPERADMIN_IMPLEMENTATION.md`
* `docs/FRONTEND_SUPERADMIN.md`
* `docs/SUPERADMIN_FRONTEND_BACKEND_ALIGNMENT.md`
* `docs/SUPERADMIN_FRONTEND_GUIDE.md`
* `docs/TENANT_MANAGEMENT.md`
* `docs/BACKEND_HIERARCHY_API.md`
* `docs/STEP_fix_20250818.md`

## [Fix - 2025-08-19] – Auth Logging Cleanup

### 🟥 Fixes
* Removed query that listed all admin users during login.
* Reduced console output to only login attempts and error conditions.

### Files
* `src/controllers/auth.controller.ts`
* `docs/STEP_fix_20250819.md`

## [Fix - 2025-08-20] – Remove Tenant Schema Artifacts

### 🟥 Fixes
* Deleted tenant schema creation commands and template references.
* Updated test and seed scripts to work with unified tables.

### Files
* `package.json`
* `scripts/migrate.js`
* `scripts/init-test-db.js`
* `scripts/reset-passwords.ts`
* `jest.setup.js`, `jest.globalSetup.ts`, `tests/utils/db-utils.ts`
* `docs/AGENTS.md`
* `docs/STEP_fix_20250820.md`

## [Fix - 2025-08-21] – Remove schemaUtils and Update Analytics

### 🟥 Fixes
* Deleted obsolete `schemaUtils.ts`.
* Admin and general analytics now aggregate using `tenant_id` filters.
* Price lookup utility queries unified tables.

### Files
* `src/utils/priceUtils.ts`
* `src/controllers/adminAnalytics.controller.ts`
* `src/controllers/analytics.controller.ts`
* `docs/STEP_fix_20250821.md`

## [Fix - 2025-08-22] – Update Setup Database for Unified Schema

### 🟥 Fixes
* Removed tenant schema creation logic from `setup-database.js`.
* Seed helpers no longer reference schema templates.

### Files
* `scripts/setup-database.js`
* `src/utils/seedHelpers.ts`
* `docs/STEP_fix_20250822.md`

## [Fix - 2025-08-23] – Test Helpers Use Public Schema

### 🟥 Fixes
* Rewrote test tenant utility to insert tenants and users directly into public tables.
* Confirmed all fixtures rely on `tenant_id` columns only.

### Files
* `tests/utils/testTenant.ts`
* `docs/STEP_fix_20250823.md`

## [Fix - 2025-08-24] – Documentation Cleanup for Unified Schema

### 🟥 Fixes
* Removed or deprecated all `schema_name` references in public docs.

### Files
* `docs/ANALYTICS_API.md`
* `docs/SUPERADMIN_FRONTEND_GUIDE.md`
* `TENANT_UUID_FIX_SUMMARY.md`
* `docs/BACKEND_HIERARCHY_API.md`
* `docs/STEP_fix_20250824.md`

## [Fix - 2025-08-25] – Node typings moved back to dev deps

### 🟥 Fixes
* Moved `@types/node` from regular dependencies to `devDependencies`.

### Files
* `package.json`
* `docs/STEP_fix_20250825.md`

## [Fix - 2025-08-26] – Unified Schema Cleanup

### 🟥 Fixes
* Consolidated migrations into `005_master_unified_schema.sql`.
* Removed deprecated `schemaName` usage across the codebase.
* Updated OpenAPI spec to match unified schema.

### Files
* `migrations/schema/005_master_unified_schema.sql`
* `scripts/apply-unified-schema.js`
* `src/app.ts`
* `src/controllers/admin.controller.ts`
* `src/controllers/analytics.controller.ts`
* `src/middlewares/*.ts`
* `src/types/auth.d.ts`
* `frontend/docs/openapi-v1.yaml`
* `docs/STEP_fix_20250826.md`

## [Fix - 2025-08-27] – SQL String Literal Fixes

### 🟥 Fixes
* Replaced invalid multi-line single-quoted SQL strings with template strings.
* Build now succeeds without syntax errors.

### Files
* `src/services/creditor.service.ts`
* `src/services/fuelPrice.service.ts`
* `docs/STEP_fix_20250827.md`

## [Fix - 2025-08-28] – Backend UUID Generation

### 🟥 Fixes
* Insert statements for tenants, admin users and plans now generate UUIDs in the application.
* Resolves `null value in column "id"` errors on Azure Postgres.

### Files
* `src/services/tenant.service.ts`
* `src/services/admin.service.ts`
* `src/services/plan.service.ts`
* `docs/STEP_fix_20250828.md`

## [Fix - 2025-08-29] – Comprehensive UUID Insertion

### 🟥 Fixes
* All service insert statements now provide UUIDs via `crypto.randomUUID()`.
* Eliminates reliance on database defaults across pumps, stations, users and domain tables.

### Files
* `src/services/pump.service.ts`
* `src/services/nozzle.service.ts`
* `src/services/user.service.ts`
* `src/services/creditor.service.ts`
* `src/services/delivery.service.ts`
* `src/services/station.service.ts`
* `src/services/reconciliation.service.ts`
* `src/services/fuelPrice.service.ts`
* `src/services/adminUser.service.ts`
* `src/services/nozzleReading.service.ts`
* `src/services/inventory.service.ts`
* `src/services/fuelInventory.service.ts`
* `docs/STEP_fix_20250829.md`

## [Fix - 2025-08-30] – Admin Login Route

### 🟥 Fixes
* Introduced dedicated SuperAdmin login endpoint `/api/v1/admin/auth/login`.
* Added explicit service and controller logic to reject non-admin credentials.

### Files
* `src/routes/adminAuth.route.ts`
* `src/controllers/auth.controller.ts`
* `src/services/auth.service.ts`
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_fix_20250830.md`

## [Fix - 2025-08-31] – Consistent DB Password Variable

### 🟥 Fixes
* Renamed `DB_PASS` to `DB_PASSWORD` across environment files and test helpers.
* Updated Docker Compose configuration to reference the new variable.

### Files
* `.env.development`
* `.env.test`
* `docker-compose.yml`
* `jest.setup.js`
* `jest.globalSetup.ts`
* `jest.globalTeardown.ts`
* `tests/utils/db-utils.ts`
## [Fix - 2025-08-31] – Default 404 Handler

### 🟥 Fixes
* Unmatched routes now return JSON `{ success: false, message: 'Route not found' }` instead of HTML.

### Files
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_fix_20250831.md`

## [Fix - 2025-09-01] – Secure schemas route

### 🟥 Fixes
* `/schemas` endpoint now disabled in production and requires authentication.

### Files
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_fix_20250901.md`
## [Fix - 2025-09-02] – Debug middleware conditional

### 🟥 Fixes
* `debugRequest` middleware now runs only when not in production or when `DEBUG_REQUESTS=true`.
* Added `DEBUG_REQUESTS` variable to example and development env files.
* Documented request logging in development guide.

### Files
* `src/app.ts`
* `.env.example`
* `.env.development`
* `DEV_GUIDE.md`
* `docs/STEP_fix_20250902.md`

## [Fix - 2025-09-03] – Ignore tracked log files

### 🟥 Fixes
* Removed `logs/server.log` from version control and deleted the directory.
* Added `logs/` to `.gitignore` so runtime logs stay local.

### Files
* `.gitignore`
* `logs/server.log` (deleted)
* `docs/STEP_fix_20250903.md`

## [Fix - 2025-09-04] – Owner role doc filename corrected

### 🟥 Fixes
* Renamed `OWNER_ROLE_IMPLEMETATION.md` to `OWNER_ROLE_IMPLEMENTATION.md` for consistency.

### Files
* `OWNER_ROLE_IMPLEMENTATION.md`
* `docs/IMPLEMENTATION_INDEX.md`


## [Fix - 2025-09-05] – Tenant creation updated_at bug

### 🟥 Fixes
* Insert query for new tenants now sets `updated_at` to `NOW()` to satisfy not-null constraint.

### Files
* `src/services/tenant.service.ts`
* `docs/STEP_fix_20250905.md`

## [Fix - 2025-09-06] – User creation updated_at bug

### 🟥 Fixes
* All user insert queries now explicitly set `updated_at` to `NOW()` so databases without defaults do not fail.

### Files
* `src/services/user.service.ts`
* `src/services/tenant.service.ts`
## [Fix - 2025-09-06] – Credential consistency

### 🟥 Fixes
* Updated all docs and setup scripts to use `Admin@123` as the default password.
* Seed scripts and service now hash `Admin@123` by default and logs display the correct credentials.

### Files
* `src/services/admin.service.ts`
* `scripts/setup-database.js`
* Various documentation files
* `docs/STEP_fix_20250906.md`

## [Fix - 2025-09-07] – DB migration docs cleanup

### 🟥 Fixes
* Clarified that `setup-unified-db` applies `005_master_unified_schema.sql`.
* Documented workflow for new SQL migration files.
* Removed deprecated scripts `setup-database.js` and `check-db-connection.ts`.

### Files
* `UNIFIED_DB_SETUP.md`
* `docs/DATABASE_MANAGEMENT.md`
* `db_brain.md`
* `scripts/setup-database.js` (deleted)
* `scripts/check-db-connection.ts` (deleted)

## [Fix - 2025-09-08] – Admin user updated_at bug

### 🟥 Fixes
* Insert queries for new superadmins now set `updated_at` to `NOW()` so databases without defaults do not fail.

### Files
* `src/services/admin.service.ts`
* `src/services/adminUser.service.ts`
* `docs/STEP_fix_20250908.md`

## [Fix - 2025-09-09] – Prisma DB URL fallback

### 🟥 Fixes
* Prisma now derives `DATABASE_URL` from individual `DB_*` variables when the variable is not set.

### Files
* `src/utils/prisma.ts`
* `docs/STEP_fix_20250909.md`

## [Fix - 2025-09-10] – Tenant email slug generation

### 🟥 Fixes
* Default Owner, Manager and Attendant emails now use a slug of the tenant name instead of the tenant UUID.

### Files
* `src/services/tenant.service.ts`
* `src/utils/slugify.ts`
* `docs/TENANT_USER_CREATION_PROCESS.md`
* `docs/TENANT_CREATION_API.md`
* `docs/TENANT_MANAGEMENT_GUIDE.md`
* `docs/STEP_fix_20250910.md`

## [Fix - 2025-06-28] – Login test updates and schema fixes

### 🟥 Fixes
* Login test script now uses seeded credentials and supports custom port.
* Unified schema migrations run cleanly on fresh databases.

### Files
* `scripts/simple-login-test.js`
* `migrations/schema/003_unified_schema.sql`
* `migrations/schema/005_master_unified_schema.sql`
* `docs/STEP_fix_20250628.md`

## [Fix - 2025-06-29] – Plan rule lookup by UUID

### 🟥 Fixes
* `getPlanRules` now maps seeded plan UUIDs to rule presets, preventing false limit errors.
* Added unit tests for pump plan enforcement.

### Files
* `src/config/planConfig.ts`
* `tests/planEnforcement.test.ts`
* `docs/STEP_fix_20250629.md`

## [Fix - 2025-09-11] – Fuel price validFrom alignment

### 🟥 Fixes
* Backend validators and services now expect `validFrom` instead of `effectiveFrom`.
* Helper utilities and swagger docs updated accordingly.
* Integration instructions updated for the new field.

### Files
* `src/controllers/fuelPrice.controller.ts`
* `src/services/fuelPrice.service.ts`
* `src/validators/fuelPrice.validator.ts`
* `src/utils/priceUtils.ts`
* `src/utils/seedHelpers.ts`
* `src/docs/swagger.ts`
* `frontend/docs/integration-instructions.md`
* `docs/STEP_fix_20250911.md`

## [Fix - 2025-09-12] – Tenant context middleware

### 🟥 Fixes
* `setTenantContext` now resolves the tenant ID from the `x-tenant-id` header when missing in the JWT.
* Requests without any tenant context return a `TENANT_REQUIRED` error.

### Files
* `src/middlewares/setTenantContext.ts`
* `docs/SECURITY_tenant_authorization.md`
* `docs/STEP_fix_20250912.md`

## [Fix - 2025-09-13] – Tenant list includes counts

### 🟥 Fixes
* `listTenants` now returns `stationCount` and `userCount` for each tenant.

### Files
* `src/services/tenant.service.ts`
* `docs/STEP_fix_20250913.md`

## [Fix - 2025-09-14] – Explicit updated_at on inserts

### 🟥 Fixes
* All create operations now specify `updated_at = NOW()` to avoid not-null violations.

### Files
* Multiple service files under `src/services/*`
* `docs/STEP_fix_20250914.md`

## [Fix - 2025-09-15] – Unified Sales Storage

### 🟥 Fixes
* Sales records now insert into `public.sales` when nozzle readings are recorded.
* Dashboard, reconciliation and report queries updated to use unified tables.

### Files
* `src/services/nozzleReading.service.ts`
* `src/services/reconciliation.service.ts`
* `src/controllers/reconciliation.controller.ts`
* `src/controllers/dashboard.controller.ts`
* `src/controllers/reports.controller.ts`
* `docs/STEP_fix_20250915.md`

## [Fix - 2025-09-16] – Nozzle reading service wiring

### 🟥 Fixes
* `/api/v1/nozzle-readings` now uses the service layer so creating a reading also inserts a sales record.

### Files
* `src/controllers/nozzleReading.controller.ts`
* `docs/STEP_fix_20250916.md`

## [Fix - 2025-09-17] – Sales listing numeric values

### 🟥 Fixes
* `listSales` now parses `volume` and `amount` as numbers to match the `Sale` schema.

### Files
* `src/services/sales.service.ts`
* `docs/STEP_fix_20250917.md`

## [Fix - 2025-09-18] – Numeric and date parsing

### 🟥 Fixes
* Added `parseDb` helper to convert numeric and timestamp strings across services.
* All service listings now return numbers and `Date` objects instead of strings.

### Files
* `src/utils/parseDb.ts`
* `src/services/*`
* `docs/STEP_fix_20250918.md`

## [Fix - 2025-09-19] – Generic constraint for parseRows

### 🟥 Fixes
* Added an explicit `extends Record<string, any>` constraint to `parseRows` to satisfy TypeScript type checks.

### Files
* `src/utils/parseDb.ts`
* `docs/STEP_fix_20250919.md`

## [Fix - 2025-09-20] – Tenant_id column migration

### 🟥 Fixes
* Added migration to ensure all tenant tables include a `tenant_id` column.
* Legacy databases created before the unified schema are automatically updated.

### Files
* `migrations/schema/006_add_tenant_id_columns.sql`
* `docs/STEP_fix_20250920.md`

## [Fix - 2025-09-21] – Daily summary previous-day readings

### 🟥 Fixes
* Modified `getDailySummary` query to pull previous day's reading so nozzles with a single reading are included.

### Files
* `src/controllers/reconciliation.controller.ts`
* `docs/openapi.yaml`
* `docs/missing/IMPLEMENTATION_GUIDE.md`
* `docs/STEP_fix_20250921.md`

## [Fix - 2025-09-22] – Daily summary price lookup

### 🟥 Fixes
* Updated `getDailySummary` to join fuel prices using a lateral query and to include entries with a single reading.

### Files
* `src/controllers/reconciliation.controller.ts`
* `docs/openapi.yaml`
* `docs/STEP_fix_20250920.md`

## [Feature - 2025-09-23] – Attendant resource access and cash reports

### 🟩 Features
* Added `cash_reports` table to record attendant cash and credit totals.
* New attendant API to list assigned stations, pumps, nozzles and creditors.
* Endpoint to submit daily cash reports.

### Files
* `migrations/schema/007_create_cash_reports.sql`
* `src/services/attendant.service.ts`
* `src/controllers/attendant.controller.ts`
* `src/routes/attendant.route.ts`
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_37_COMMAND.md`

## [Feature - 2025-09-23] – Attendant resource access and cash reports

### 🟩 Features
* Added `cash_reports` table to record attendant cash and credit totals.
* New attendant API to list assigned stations, pumps, nozzles and creditors.
* Endpoint to submit daily cash reports.

### Files
* `migrations/schema/007_create_cash_reports.sql`
* `src/services/attendant.service.ts`
* `src/controllers/attendant.controller.ts`
* `src/routes/attendant.route.ts`
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_37_COMMAND.md`

## [Feature - 2025-09-24] – Attendant cash reports & alerts

### 🟩 Features
* List previous cash reports for attendants.
* Expose attendant alerts API with acknowledge action.

### Files
* `src/services/attendant.service.ts`
* `src/controllers/attendant.controller.ts`
* `src/routes/attendant.route.ts`
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_38_COMMAND.md`

## [Feature - 2025-09-25] – Fuel price validation endpoints

### 🟩 Features
* Validate fuel prices per station and flag outdated entries.
* Endpoint to list stations missing active prices.

### Files
* `src/services/fuelPriceValidation.service.ts`
* `src/controllers/fuelPrice.controller.ts`
* `src/routes/fuelPrice.route.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_39_COMMAND.md`

## [Feature - 2025-09-26] – Nozzle reading creation validation

### 🟩 Features
* Check if a nozzle reading can be created based on nozzle status and fuel price.

### Files
* `src/services/nozzleReading.service.ts`
* `src/controllers/nozzleReading.controller.ts`
* `src/routes/nozzleReading.route.ts`
* `docs/openapi.yaml`
* `src/docs/swagger.ts`
* `docs/STEP_2_40_COMMAND.md`

## [Feature - 2025-09-27] – Alert creation & summary endpoints

### 🟩 Features
* API to create new alerts.
* Endpoint to return unread alert counts by severity.

### Files
* `src/services/alert.service.ts`
* `src/controllers/alerts.controller.ts`
* `src/routes/alerts.route.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_41_COMMAND.md`

## [Feature - 2025-09-28] – Scheduled alert checks

### 🟩 Features
* Automated services evaluate missing readings, prices and reports.
* Alerts raised for creditor limits, inactivity and reading anomalies.

### Files
* `src/services/alertRules.service.ts`
* `docs/BUSINESS_RULES.md`
* `docs/STEP_2_42_COMMAND.md`

## [Fix - 2025-09-29] – Price and credit limit validation

### 🟥 Fixes
* Throw error when fuel price is missing or older than seven days on reading creation.
* Warn when creditor balance exceeds 90% of the credit limit.

### Files
* `src/utils/priceUtils.ts`
* `src/services/nozzleReading.service.ts`
* `tests/sales.service.test.ts`
* `docs/STEP_2_43_COMMAND.md`

## [Doc - Step 2.44] – Role Journey Documentation

### 🟦 Enhancements
* Added comprehensive API journey docs for all roles under `docs/journeys/`.

### Files
* `docs/journeys/SUPERADMIN.md`
* `docs/journeys/OWNER.md`
* `docs/journeys/MANAGER.md`
* `docs/journeys/ATTENDANT.md`
* `docs/STEP_2_44_COMMAND.md`

## [Backend - Step 2.45] – SuperAdmin Tenant Settings

### 🟩 Features
* Added `tenant_settings_kv` table for per-tenant key-value settings.
* SuperAdmin APIs to list, read and update tenant settings.
* Default settings inserted on tenant creation.

### Files
* `migrations/schema/008_create_tenant_settings_kv.sql`
* `src/services/settingsService.ts`
* `src/services/tenant.service.ts`
* `src/controllers/adminSettings.controller.ts`
* `src/routes/adminApi.router.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_45_COMMAND.md`

## [Doc - Step 2.46] – Journey Docs Alignment

### 🟦 Enhancements
* Updated all role journey docs with missing endpoints, request fields and auth helper notes.

### Files
* `docs/journeys/SUPERADMIN.md`
* `docs/journeys/OWNER.md`
* `docs/journeys/MANAGER.md`
* `docs/journeys/ATTENDANT.md`
* `docs/STEP_2_46_COMMAND.md`

## [Fix - 2025-09-23] – Unified setup runs migrations

### 🟥 Fixes
* `npm run setup-unified-db` now automatically executes `node scripts/migrate.js up` to include any new migration files.

### Files
* `scripts/setup-unified-db.js`
* `UNIFIED_DB_SETUP.md`
* `db_brain.md`
* `docs/STEP_fix_20250923.md`

## [Fix - 2025-10-01] – Migration runner conflict handling

### 🟥 Fixes
* Prevent duplicate entries in `schema_migrations` by using `ON CONFLICT` in `scripts/migrate.js`.

### Files
* `scripts/migrate.js`
* `docs/STEP_fix_20251001.md`

## [Fix - 2025-10-02] – Local migration execution

### 🟥 Fixes
* Added dotenv loading to `scripts/migrate.js` and corrected ordering in `003_unified_schema.sql` so all migrations run on a local database.

### Files
* `scripts/migrate.js`
* `migrations/schema/003_unified_schema.sql`
* `docs/STEP_fix_20251002.md`

## [Fix - 2025-10-03] – SSL connection for migrations

### 🟥 Fixes
* `scripts/migrate.js` now passes `ssl: { rejectUnauthorized: false }` so migrations work with SSL-required databases.

### Files
* `scripts/migrate.js`
* `docs/STEP_fix_20251003.md`

## [Fix - 2025-10-04] – Ensure UUID defaults

### 🟥 Fixes
* Added `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to early schema migrations.
* `003_unified_schema.sql` now inserts the seed admin user with an explicit
  `gen_random_uuid()` ID.

### Files
* `migrations/schema/001_initial_schema.sql`
* `migrations/schema/003_unified_schema.sql`
* `migrations/schema/004_complete_unified_schema.sql`
* `migrations/schema/005_master_unified_schema.sql`
* `docs/STEP_fix_20251004.md`

## [Fix - 2025-10-05] – Allow PoolClient for default settings

### 🟥 Fixes
* `setDefaultSettings` now accepts `PoolClient` so tenant creation compiles.

### Files
* `src/services/settingsService.ts`
* `docs/STEP_fix_20251005.md`

## [Enhancement - 2025-10-06] – Azure schema setup script

### 🟦 Enhancements
* Added optional Azure setup script to run the unified schema without `pgcrypto`.
* Clarified environment constraints in `AGENTS.md` and noted Codex must not run this script.
* Documented Azure developer workflow and environment detection in the script.

### Files
* `docs/AGENTS.md`
* `scripts/setup-azure-schema.js`
* `docs/AZURE_DEV_SETUP.md`
* `docs/STEP_1_26_COMMAND.md`

## [Fix - 2025-10-06] – Seed admin timestamps

### 🟥 Fixes
* Seed admin user now sets `created_at` and `updated_at` explicitly to `NOW()`.

### Files
* `migrations/schema/003_unified_schema.sql`
* `docs/STEP_fix_20251006.md`

## [Fix - 2025-10-07] – Azure cash_reports migration

### 🟥 Fixes
* Added `apply-cash-reports-azure.js` to run migration 007 on Azure without foreign keys.
* Added `npm` script `azure-migrate-cash` for convenience.

### Files
* `scripts/apply-cash-reports-azure.js`
* `docs/STEP_fix_20251007.md`

## [Fix - 2025-10-08] – Azure unified setup script

### 🟥 Fixes
* Added `setup-azure-db.js` to run schema setup, migrations and seeding in one step on Azure.
* Added npm script `setup-azure-db` for convenience.

### Files
* `scripts/setup-azure-db.js`
* `docs/STEP_fix_20251008.md`

## [Fix - 2025-10-09] – Skip cash_reports migration in Azure setup

### 🟥 Fixes
* `setup-azure-db.js` now runs migrations individually and skips `007_create_cash_reports.sql`, applying it separately with the existing script.

### Files
* `scripts/setup-azure-db.js`
* `docs/STEP_fix_20251009.md`

## [Fix - 2025-10-10] – Azure tenant_settings_kv migration

### 🟥 Fixes
* Added helper script to run migration 008 without foreign keys and updated Azure setup script accordingly.
* New npm script `azure-migrate-settings` for manual execution.

### Files
* `scripts/apply-tenant-settings-kv-azure.js`
* `scripts/setup-azure-db.js`
* `package.json`
* `docs/STEP_fix_20251010.md`

## [Enhancement - 2025-10-11] – Azure README instructions

### 🟦 Enhancements
* Added "Deploying to Azure" section in `README.md` linking to Azure deployment docs and referencing `npm run setup-azure-db`.

### Files
* `README.md`
* `docs/STEP_fix_20251011.md`

## [Fix - 2025-10-12] – Azure migration helper syntax

### 🟥 Fixes
* Removed leftover `ON DELETE CASCADE` clause in `apply-tenant-settings-kv-azure.js` which caused a syntax error during migration.

### Files
* `scripts/apply-tenant-settings-kv-azure.js`
* `docs/STEP_fix_20251012.md`

## [Fix - 2025-11-01] – Fuel inventory updated_at column

### 🟥 Fixes
* Added `updated_at` column in `createFuelInventoryTable` so seeding works.

### Files
* `src/services/fuelInventory.service.ts`
* `docs/STEP_fix_20251101.md`

## [Fix - 2025-11-02] – Delivery and inventory schema enums

### 🟥 Fixes
* Extended `fuelType` enum to include `premium` and renamed delivery property to `supplier`.
* Added `capacity` field to `FuelInventory` objects in API specs.

### Files
* `docs/openapi.yaml`
* `frontend/docs/openapi-v1.yaml`
* `src/docs/swagger.ts`
* `docs/STEP_fix_20251102.md`

## [Enhancement - 2025-11-03] – Response wrapper and new analytics endpoints

### 🟦 Enhancements
* Unified success and error response format with `success` boolean and optional `message` and `details`
* Added system health and station efficiency endpoints
* Added reconciliation approval route

### Files
* `src/utils/successResponse.ts`
* `src/utils/errorResponse.ts`
* controllers, routes and services updated
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_2_47_COMMAND.md`

## [Fix - 2025-11-04] – Script cleanup and guide

### 🟥 Fixes
* Added `docs/SCRIPTS_GUIDE.md` documenting all helper scripts.
* Removed obsolete scripts: `check-db-users.ts`, `check-server.js`, `check-tenant-structure.js`, `check-users.js`, `direct-login-test.js`, `frontend-login.js`, `generate-frontend-login.ts`, `run-all-migrations.ts`, `run-all-tests.js`, `simple-login-test.js`, `test-api-login.ts`.
* Updated `README.md` and `SERVER_README.md` to reference the new guide.

### Files
* `docs/SCRIPTS_GUIDE.md`
* `README.md`
* `SERVER_README.md`
* `scripts/` removed files
* `docs/STEP_2_48_COMMAND.md`


## [Fix - 2025-11-05] – Frontend docs consolidation

### 🟥 Fixes
* Introduced `FRONTEND_REFERENCE_GUIDE.md` pointing to the canonical `docs/openapi.yaml` spec.
* Updated `PHASE_3_SUMMARY.md` with the new spec path.
* Revised `frontend/docs/api-diff.md` to reference the consolidated spec.

### Files
* `docs/FRONTEND_REFERENCE_GUIDE.md`
* `docs/PHASE_3_SUMMARY.md`
* `frontend/docs/api-diff.md`
* `docs/STEP_fix_20251105.md`

## [Fix - 2025-11-06] – Column update process docs

### 🟥 Fixes
* Added instructions for handling new database columns in `FRONTEND_REFERENCE_GUIDE.md`.

### Files
* `docs/FRONTEND_REFERENCE_GUIDE.md`
* `docs/STEP_fix_20251106.md`

## [Fix - 2025-11-07] – Column workflow relocation

### 🟥 Fixes
* Moved database column change workflow to `DATABASE_MANAGEMENT.md`.
* `FRONTEND_REFERENCE_GUIDE.md` now references this guide instead of duplicating the steps.

### Files
* `docs/DATABASE_MANAGEMENT.md`
* `docs/FRONTEND_REFERENCE_GUIDE.md`
* `docs/PHASE_3_SUMMARY.md`
* `docs/STEP_fix_20251107.md`

## [Fix - 2025-11-08] – Clarify frontend update flow

### 🟥 Fixes
* Expanded the update flow in `FRONTEND_REFERENCE_GUIDE.md` to list backend docs and a final docs update step.
* Reworded the schema change note to direct developers to `DATABASE_MANAGEMENT.md` first.
* Updated `PHASE_3_SUMMARY.md` accordingly.

### Files
* `docs/FRONTEND_REFERENCE_GUIDE.md`
* `docs/PHASE_3_SUMMARY.md`
* `docs/STEP_fix_20251108.md`

## [Fix - 2025-11-09] – Authoritative frontend flow

### 🟥 Fixes
* Replaced the update list in `FRONTEND_REFERENCE_GUIDE.md` with a detailed flow starting from database migrations.
* Noted the new flow in `PHASE_3_SUMMARY.md`.
* Reinforced references to `DATABASE_MANAGEMENT.md` and `backend_brain.md`.

### Files
* `docs/FRONTEND_REFERENCE_GUIDE.md`
* `docs/PHASE_3_SUMMARY.md`
* `docs/STEP_fix_20251109.md`
## [Fix - 2025-11-10] – successResponse parameter alignment

### 🟥 Fixes
* Updated create endpoints to pass the HTTP status code as the fourth argument of `successResponse`.
* Compilation no longer fails due to type mismatch.

### Files
* `src/controllers/*.ts` updated
* `docs/STEP_2_49_COMMAND.md`
## [Feature - 2025-11-11] – Setup status API

### 🟢 Features
* Added `/api/v1/setup-status` endpoint to check onboarding completion without extra tables.

### Files
* `src/services/setupStatus.service.ts`
* `src/controllers/setupStatus.controller.ts`
* `src/routes/setupStatus.route.ts`
* `src/app.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_50_COMMAND.md`

## [Fix - 2025-11-12] – Nozzle seeding conflict

### 🟥 Fixes
* `createNozzles` now uses `ON CONFLICT (tenant_id, pump_id, nozzle_number) DO NOTHING` to avoid duplicates.

### Files
* `src/utils/seedHelpers.ts`
* `docs/STEP_1_17_COMMAND.md`

## [Fix - 2025-11-13] – Duplicate nozzle conflict handling

### 🟥 Fixes
* `create` handler in `nozzle.controller` now returns **409** when a nozzle number already exists for the pump.
* OpenAPI spec documents the 409 response.
* Added unit test for this scenario.

### Files
* `src/controllers/nozzle.controller.ts`
* `docs/openapi.yaml`
* `tests/nozzle.controller.test.ts`
* `docs/STEP_2_51_COMMAND.md`

## [Fix - 2025-11-14] – Pump request schema correction

### 🟥 Fixes
* Pump creation and update endpoints now reference `CreatePumpRequest`.
* `CreatePumpRequest` requires `serialNumber` alongside `stationId` and `name`.

### Files
* `docs/openapi.yaml`
* `docs/STEP_fix_20251114.md`

## [Fix - 2025-11-15] – Nozzle fuel type validation

### 🟥 Fixes
* `validateCreateNozzle` ensures `fuelType` is `petrol`, `diesel` or `premium`.
* Optional `status` is validated against `active`, `inactive` and `maintenance`.

### Files
* `src/validators/nozzle.validator.ts`
* `docs/STEP_2_52_COMMAND.md`

## [Fix - 2025-11-16] – Nozzle request schema cleanup

### 🟥 Fixes
* POST and PUT nozzle endpoints now reference `CreateNozzleRequest`.
* `CreateNozzleRequest` includes optional `status` with allowed enums.

### Files
* `docs/openapi.yaml`
* `docs/STEP_fix_20251116_COMMAND.md`

## [Fix - 2025-11-17] – Response object consistency

### 🟥 Fixes
* Pump and nozzle GET handlers now return `{ pump }` or `{ nozzle }` within the success wrapper.

### Files
* `src/controllers/nozzle.controller.ts`
* `docs/STEP_fix_20251117.md`

## [Fix - 2025-11-18] – Nozzle validator type cast

### 🟥 Fixes
* `validateCreateNozzle` now casts `fuelType` to the union type to satisfy TypeScript.

### Files
* `src/validators/nozzle.validator.ts`
* `docs/STEP_fix_20251118.md`

## [Fix - 2025-11-19] – Fuel price response station names

### 🟥 Fixes
* Fuel price listing now returns associated station `{ id, name }`.

### Files
* `backend_brain.md`
* `docs/STEP_fix_20251119.md`

## [Fix - 2025-11-20] – Fuel price station id in spec

### 🟥 Fixes
* OpenAPI and complete specs now document station `id` with `name`.
* Listing endpoint returns station id and name.

### Files
* `docs/openapi.yaml`
* `docs/missing/COMPLETE_API_SPEC.yaml`
* `src/controllers/fuelPrice.controller.ts`
* `docs/STEP_fix_20251120.md`

## [Fix - 2025-11-21] – Pump column rename

### 🟥 Fixes
* Database column `pumps.label` renamed to `name` to match API and Prisma schema.

### Files
* `migrations/schema/009_rename_pumps_label_to_name.sql`
* `docs/STEP_fix_20251121.md`

## [Fix - 2025-11-22] – Schema naming alignment

### 🟥 Fixes
* Updated documentation examples to use `pumps.name`.
* Added Prisma model for `tenant_settings_kv`.

### Files
* `db_brain.md`
* `docs/BACKEND_HIERARCHY_API.md`
* `docs/FRONTEND_NAVIGATION_GUIDE.md`
* `prisma/schema.prisma`
* `docs/STEP_fix_20251122.md`

## [Feature - 2025-11-23] – Fuel inventory summary endpoint

### 🟩 Features
* Added `GET /api/v1/fuel-inventory/summary` to aggregate stock totals by fuel type.

### Files
* `src/services/fuelInventory.service.ts`
* `src/controllers/fuelInventory.controller.ts`
* `src/routes/fuelInventory.route.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_53_COMMAND.md`

## [Fix - 2025-11-23] – Cash report credit entries

### 🟥 Fixes
* Cash report endpoint accepts `creditEntries` instead of a single `creditAmount`.
* Service records sales per credit entry and auto-calculates the credit total.

### Files
* `src/services/attendant.service.ts`
* `src/controllers/attendant.controller.ts`
* `docs/openapi.yaml`
* `backend_brain.md`
* `docs/STEP_fix_20251123.md`

## [Fix - 2025-11-24] – Extended JWT lifetime

### 🟥 Fixes
* Increased `JWT_EXPIRES_IN` constant to `100y` and updated documentation.

### Files
* `src/constants/auth.ts`
* `src/utils/jwt.ts`
* `docs/AUTH.md`
* `docs/journeys/*`
* `docs/STEP_fix_20251124.md`

## [Fix - 2025-11-25] – Refresh token constant

### 🟥 Fixes
* Added `REFRESH_TOKEN_EXPIRES_IN` constant and updated refresh endpoint to use `JWT_SECRET` and the new value. Documentation now clarifies refresh token lifetime.

### Files
* `src/constants/auth.ts`
* `src/controllers/auth.controller.ts`
* `docs/AUTH.md`
* `docs/STEP_fix_20251125.md`

## [Fix - 2025-11-26] – Unified fuel inventory queries

### 🟥 Fixes
* Inventory and delivery services now use `public.fuel_inventory` with `tenant_id` filters.
* Removed obsolete `createFuelInventoryTable` helper and updated controllers.

### Files
* `src/services/fuelInventory.service.ts`
* `src/services/inventory.service.ts`
* `src/services/delivery.service.ts`
* `src/controllers/fuelInventory.controller.ts`
* `src/controllers/delivery.controller.ts`
* `docs/STEP_fix_20251126.md`

## [Fix - 2025-11-27] – Dashboard station filter handling

### 🟥 Fixes
* Added `normalizeStationId` helper to treat `stationId=all` and similar values as undefined.
* Updated multiple controllers to use the helper ensuring owner dashboard aggregates all stations correctly.

### Files
* `src/utils/normalizeStationId.ts`
* `src/controllers/dashboard.controller.ts`
* `src/controllers/inventory.controller.ts`
* `src/controllers/reports.controller.ts`
* `src/controllers/sales.controller.ts`
* `src/controllers/pump.controller.ts`
* `src/controllers/alerts.controller.ts`
* `src/controllers/attendant.controller.ts`
* `src/controllers/analytics.controller.ts`
* `docs/STEP_fix_20251127.md`

## [Fix - 2025-11-28] – Previous reading in nozzle listing

### 🟥 Fixes
* `listNozzleReadings` now computes `previous_reading` using a window function.
* `NozzleReading` schema updated in OpenAPI.

### Files
* `src/services/nozzleReading.service.ts`
* `docs/openapi.yaml`
* `docs/STEP_fix_20251128.md`

## [Enhancement - 2025-11-29] – API corrections and feature flags

### 🟦 Enhancements
* Added deprecated aliases `/dashboard/fuel-types` and `/dashboard/daily-trend`.
* Introduced `/api/v1/tenant/settings` with feature flags exposure.
* Updated response schemas for station comparison, ranking and inventory APIs.

### Files
* `src/routes/dashboard.route.ts`
* `src/app.ts`
* `src/controllers/settings.controller.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_54_COMMAND.md`

## [Feature - 2025-11-30] – Dashboard station metrics endpoint

### 🟩 Features
* Added `/api/v1/dashboard/station-metrics` to retrieve metrics for all stations.
* Introduced `StationMetric` schema in OpenAPI.

### Files
* `src/services/station.service.ts`
* `src/controllers/dashboard.controller.ts`
* `src/routes/dashboard.route.ts`
* `docs/openapi.yaml`
* `docs/STEP_2_55_COMMAND.md`

## [Fix - 2025-12-01] – Alert parameter naming alignment

### 🟥 Fixes
* Renamed path parameter `alertId` to `id` for alert deletion and read routes.

### Files
* `docs/openapi.yaml`
* `frontend/docs/openapi-v1.yaml`
* `docs/STEP_fix_20251201.md`

## [Step 2.56] – Backend analytics and inventory completion

### 🟩 Features
* Added tenant dashboard analytics endpoint and admin tenant summary metrics.
* Fuel inventory levels now computed from deliveries and nozzle readings.

### 🟦 Enhancements
* Login and refresh responses include `tenantName`.
* Fuel price listing exposes `stationName`.
* Marked test endpoints as internal in OpenAPI.

### Files
* `src/services/analytics.service.ts`
* `src/services/fuelInventory.service.ts`
* `src/services/tenant.service.ts`
* `src/controllers/*`
* `src/routes/*`
* `docs/openapi.yaml`
* `docs/STEP_2_56_COMMAND.md`
## [Step 2.57] – Tenant email convention update

### 🟦 Enhancements
* Default user emails now use `<role>@<schema>.fuelsync.com` pattern for clarity.

### Files
* `src/services/tenant.service.ts`
* `docs/TENANT_CREATION_API.md`
* `docs/TENANT_MANAGEMENT_GUIDE.md`
* `TENANT_USER_CREATION_PROCESS.md`
* `docs/USER_MANAGEMENT.md`
* `UNIFIED_DB_SETUP.md`
* `docs/STEP_2_57_COMMAND.md`
\n## [Step 3.8] – Final QA Audit\n\n### 🟦 Enhancements\n* Verified OpenAPI, backend routes and frontend hooks are aligned.\n* Documented results in `QA_AUDIT_REPORT.md`.\n\n### Files\n* `docs/QA_AUDIT_REPORT.md`\n* `docs/STEP_3_8_COMMAND.md`\n

## [Step 3.9] – Readings page table

### 🟦 Enhancements
* Refactored readings listing into a structured table with nozzle label, station, volumes and price details.
* Added `ReadingsTable` component.

### Files
* `src/components/readings/ReadingsTable.tsx`
* `src/pages/dashboard/ReadingsPage.tsx`
* `docs/STEP_3_9_COMMAND.md`

## [Fix 2025-12-10] – Resolve TypeScript build errors

### 🟥 Fixes
* Updated middleware and services to consistently use the Prisma client.
* Added missing imports and explicit types to eliminate `tsc` errors.
* Corrected property names and plan distribution handling in analytics logic.

### Files
* `src/controllers/analytics.controller.ts`
* `src/controllers/dashboard.controller.ts`
* `src/controllers/nozzleReading.controller.ts`
* `src/middlewares/checkPlanLimits.ts`
* `src/routes/station.route.ts`
* `src/routes/pump.route.ts`
* `src/routes/nozzle.route.ts`
* `src/services/nozzleReading.service.ts`
* `src/services/attendant.service.ts`
* `src/services/nozzle.service.ts`
* `src/services/station.service.ts`
* `src/utils/priceUtils.ts`
* `docs/STEP_fix_20251210.md`

## [Fix 2025-12-11] – Explicit typing cleanup

### 🟥 Fixes
* Added explicit types for callback parameters to avoid `implicit any` errors.
* Replaced generic `$queryRaw` usage with type assertions.
* Typed transaction callbacks with Prisma clients.

### Files
* `src/controllers/analytics.controller.ts`
* `src/controllers/fuelPrice.controller.ts`
* `src/controllers/pump.controller.ts`
* `src/controllers/station.controller.ts`
* `src/services/alertRules.service.ts`
* `src/services/analytics.service.ts`
* `src/services/nozzleReading.service.ts`
* `src/services/pump.service.ts`
* `src/services/station.service.ts`
* `src/services/user.service.ts`
* `docs/STEP_fix_20251211.md`

## [Fix 2025-12-12] – Automated Prisma client generation

### 🟥 Fixes
* Added a `postinstall` script that runs `prisma generate` during installation.

### Files
* `package.json`
* `docs/STEP_fix_20251212.md`

## [Fix 2025-12-13] – Handle empty dashboard results

### 🟥 Fixes
* Dashboard endpoints now return an empty array instead of a 500 error when no records exist.

### Files
* `src/controllers/dashboard.controller.ts`
* `docs/STEP_fix_20251213.md`

## [Fix 2025-12-14] – Uniform dashboard empty handling

### 🟥 Fixes
* All dashboard endpoints now return an empty array when no records exist.

### Files
* `src/controllers/dashboard.controller.ts`
* `docs/STEP_fix_20251214.md`

## [Fix 2025-12-15] – Uniform empty lists across endpoints

### 🟥 Fixes
* List endpoints for stations, pumps, nozzles, readings, deliveries and more now explicitly return an empty array when no records exist.

### Files
* `src/controllers/*.ts`
* `docs/STEP_fix_20251215.md`

## [Fix 2025-12-16] – Include Node type definitions

### 🟥 Fixes
* Added `@types/node` as a dev dependency so the TypeScript build can find Node typings.

### Files
* `package.json`
* `package-lock.json`
* `docs/STEP_fix_20251216.md`

## [Fix 2025-12-17] – Station metrics compile fix

### 🟥 Fixes
* Cast station listing results to `any[]` so the `metrics` property can be assigned without TypeScript errors.

### Files
* `src/services/station.service.ts`
* `docs/STEP_fix_20251217.md`

## [Fix 2025-12-18] – Prisma price helper typing

### 🟥 Fixes
* Changed `getPriceAtTimestamp` to accept `PrismaClient` so service calls compile.

### Files
* `src/utils/priceUtils.ts`
* `docs/STEP_fix_20251218.md`

## [Fix 2025-12-19] – Station list typing and price lookup

### 🟥 Fixes
* Passed the transaction client to `getPriceAtTimestamp` in `createCashReport`.
* Cast station listing results to `any[]` to allow appending metrics.

### Files
* `src/services/attendant.service.ts`
* `src/services/station.service.ts`
* `docs/STEP_fix_20251219.md`

## [Fix 2025-12-20] – Apply documented Prisma price helper

### 🟥 Fixes
* Converted `getPriceAtTimestamp` to use `PrismaClient` and Prisma queries.
* Updated attendant and nozzle reading services to pass the Prisma instance.
* Linked local setup instructions from the README.

### Files
* `src/utils/priceUtils.ts`
* `src/services/attendant.service.ts`
* `src/services/nozzleReading.service.ts`
* `README.md`
* `docs/STEP_fix_20251220.md`

## [Fix 2026-07-15] – Reading meta fields

### 🟥 Fixes
* Insert `reading_id` when creating sales.
* `listNozzleReadings` joins pumps, stations and users to return `nozzle_number` and `recorded_by`.

### Files
* `src/services/nozzleReading.service.ts`
* `src/api/api-contract.ts`
* `src/api/services/readingsService.ts`
* `docs/STEP_fix_20260715_COMMAND.md`
