# STEP\_1\_15\_COMMAND.md — Finalize Tenant Schema (Constraints + Indexes)

---

## 🧠 Project Context

FuelSync Hub uses schema-per-tenant isolation. Each tenant schema must enforce referential integrity and performance best practices.

We’ve created tables for:

* `users`, `stations`, `pumps`, `nozzles`
* `nozzle_readings`, `sales`, `fuel_prices`, `creditors`, `fuel_deliveries`, `fuel_inventory`, `day_reconciliations`

---

## ✅ Prior Steps Implemented

* `sales` is linked to `nozzle_readings` via foreign keys
* `creditors` and `fuel_deliveries` schemas are migrated
* `day_reconciliations` logic exists

---

## 🛠 Task: Add Constraints + Indexes to Tenant Schema

### 🎯 Objective

Ensure data integrity and query performance across all tenant tables.

### 📂 Files to Modify

* `migrations/tenant_schema_template.sql`
* `DATABASE_GUIDE.md`
* `PHASE_1_SUMMARY.md`
* `CHANGELOG.md`
* `IMPLEMENTATION_INDEX.md`

---

### ✅ Add Constraints:

* `CHECK (price > 0)` on `fuel_prices`
* `CHECK (reading >= 0)` on `nozzle_readings`
* `FOREIGN KEY (user_id)` on `sales`, `credit_payments`
* `DEFERRABLE INITIALLY DEFERRED` on all FK constraints

### 🧠 Add Indexes:

* `nozzle_readings(recorded_at)`
* `sales(recorded_at)`
* `fuel_prices(effective_from)`
* `credit_payments(payment_date)`
* `day_reconciliations(day)`

---

## 📓 Docs to Update

* [ ] `DATABASE_GUIDE.md`: Document constraint & index strategy
* [ ] `PHASE_1_SUMMARY.md`: Log schema finalization step
* [ ] `CHANGELOG.md`: Add enhancement entry
* [ ] `IMPLEMENTATION_INDEX.md`: Add Step 1.15

---

## ✅ Acceptance Criteria

* ✅ Constraints defined in migration file
* ✅ Indexes added for performance-critical queries
* ✅ DEFERRABLE FKs declared
* ✅ Docs updated in all relevant locations

---
