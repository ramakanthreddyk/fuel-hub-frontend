# STEP\_1\_6\_COMMAND.md — Dev/Test Tenant Seeding & Validation

---

## 🧠 Project Context

FuelSync Hub is a schema-per-tenant SaaS platform. Each tenant’s schema must be seeded with demo data for local development and CI testing. This step sets up a reusable script that populates 1 or more demo tenants with:

* Users (owner, manager, attendant)
* Stations → Pumps → Nozzles
* Optional: fuel\_prices, readings, creditors (basic)

The goal is to create a clean, consistent starting state for backend and frontend testing.

---

## ✅ Prior Steps Implemented

* **Step 1.1**: Public schema migration & seed
* **Step 1.2**: Tenant schema template migration
* **Step 1.3**: Schema validation script
* **Step 1.4**: ERD defined and documented
* **Step 1.5**: Audit + constraint validation added to schema

---

## 🛠 Task: Dev/Test Tenant Seeder

### 📂 Create file:

`scripts/seed-demo-tenant.ts`

### 🔧 Script behavior:

1. Accept tenant name from CLI or default to `demo_tenant_001`
2. Create schema via `CREATE SCHEMA` and apply `tenant_schema_template.sql`
3. Insert:

   * 3 users (roles: owner, manager, attendant)
   * 1 station with name `Main Station`
   * 1 pump under that station
   * 2 nozzles under that pump
   * Optional: 1 fuel\_price row for current date
4. Log summary of what was inserted (via console)

### ➕ Add utility script:

`scripts/reset-all-demo-tenants.ts`

* Drops and recreates all schemas with prefix `demo_`
* Reruns seed logic

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Add dev/test seed strategy
* [ ] `CHANGELOG.md` → Feature: demo tenant seed setup
* [ ] `IMPLEMENTATION_INDEX.md` → Add step 1.6 row
* [ ] `SEEDING.md` → Add section: demo tenant population

---

## ✅ Acceptance Criteria

* ✅ Seeded tenant schema with all required FK links
* ✅ Users/station/pump/nozzles created
* ✅ Clean rerun capability for CI/testing
* ✅ Script can be extended with prices, readings later

---

