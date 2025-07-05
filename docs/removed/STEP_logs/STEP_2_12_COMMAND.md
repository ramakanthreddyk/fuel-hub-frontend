# STEP_2_12_COMMAND.md — Test Infrastructure Setup for DB-Backed Services

## ✅ Project Context Summary

FuelSync Hub is a multi-tenant ERP platform with per-tenant PostgreSQL schemas. Core backend services are implemented, including Auth, Sales, Creditors, and Reconciliation APIs. However, Jest tests for DB-backed services fail because the test environment lacks a Postgres instance, schema bootstrap, and runtime tenant context.

This step introduces a full test infrastructure to support automated service-level and route-level tests.

---

## 📌 Prior Steps Completed

* ✅ Phase 2 feature and route implementations (STEP_2_1 to STEP_2_10)
* ✅ Swagger docs and error handling middleware (STEP_2_10)
* ❌ Tests fail due to missing Postgres runtime or test schema

---

## 🚧 What to Build Now — Test Infra Setup

### 1. `.env.test` File

Create a test-specific env file for Jest to use:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=fuelsync_test
```

> Codex may generate this file dynamically or seed it on startup.

---

### 2. Test DB Bootstrap

Create script `scripts/init-test-db.ts` to:

* Connect to Postgres
* Create `fuelsync_test` database (if not exists)
* Run the public + tenant migrations
* Seed demo tenant data

---

### 3. Jest Test Hooks

Update `jest.setup.ts` to:

* Run `init-test-db.ts` once before tests
* Drop + re-seed test schema between suites (optional)

---

### 4. Test Utility Helpers

Add:

* `tests/utils/testClient.ts` → supertest client for API requests
* `tests/utils/testTenant.ts` → createTenant(), loginAs(role), etc.

---

### 5. Package & Config Updates

Ensure `package.json` includes:

```json
"scripts": {
  "test": "NODE_ENV=test jest --setupFiles ./jest.setup.ts",
  "test:watch": "npm run test -- --watch"
}
```

Also update:
* `jest.config.ts` — support for TypeScript, paths
* `tsconfig.json` — exclude `/tests/` from `noEmit`

---

## 📁 Files to Create or Update

```
.env.test
scripts/init-test-db.ts
tests/utils/testClient.ts
tests/utils/testTenant.ts
jest.config.ts
jest.setup.ts
package.json (scripts)
```

---

## 📘 Docs To Update

* `CHANGELOG.md` — Add: Test infra setup, DB init script
* `IMPLEMENTATION_INDEX.md` — Log STEP_2_12
* `TESTING_GUIDE.md` — Document how to run test suite with DB
* `PHASE_2_SUMMARY.md` — Mark test infra as complete

---

> After this step, `npm test` must run fully and pass all DB-connected service tests inside the local environment.
