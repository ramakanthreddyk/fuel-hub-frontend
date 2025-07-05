# STEP\_1\_7\_COMMAND.md — Seed Validation & Reset Test

---

## 🧠 Project Context

FuelSync Hub uses schema-per-tenant isolation and script-based seeding. We've created a dev/test seeder in Step 1.6. This step ensures that:

* The seeded data is **valid**, **queryable**, and **deterministic**
* The demo tenant(s) can be reset cleanly
* Core foreign keys and business logic relationships hold

This step lays the groundwork for CI environments and local dev resets.

---

## ✅ Prior Steps Implemented

* **Step 1.1**: Public schema migration & seed
* **Step 1.2**: Tenant schema template migration
* **Step 1.3**: Schema validation script
* **Step 1.4**: ERD + documentation
* **Step 1.5**: Constraint + audit field enforcement
* **Step 1.6**: Demo tenant seed script

---

## 🛠 Task: Seed Validation Script

### 📂 Create file:

`scripts/validate-demo-tenant.ts`

### 🔧 Script behavior:

1. Accept tenant schema name (default: `demo_tenant_001`)
2. Connect to Postgres
3. Validate:

   * `users` table has 3 rows (owner, manager, attendant)
   * `stations` → `pumps` → `nozzles` all exist and FK linked
   * Nozzles count = 2; each linked to 1 pump → 1 station
4. Output: ✅ PASSED or ❌ FAILED + reason

### 🧪 Bonus Task:

* In `reset-all-demo-tenants.ts`, append `validate-demo-tenant.ts` execution after each schema reset

---

## 📓 Documentation Updates

* [x] `PHASE_1_SUMMARY.md` → Add validation strategy
* [x] `CHANGELOG.md` → Feature: seed validation tool
* [x] `IMPLEMENTATION_INDEX.md` → Add step 1.7 row
* [x] `SEEDING.md` → Add validation procedure section

---

## ✅ Acceptance Criteria

* ✅ Script verifies all core data relationships
* ✅ CI-friendly (can be reused in test setup later)
* ✅ Produces clear PASS/FAIL console output
* ✅ No data hardcoding (all dynamic via schema name)

---

