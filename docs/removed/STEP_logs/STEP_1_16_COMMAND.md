# STEP\_1\_16\_COMMAND.md — Add Validation Scripts for Tenant Schema

---

## 🧠 Project Context

FuelSync Hub's schema-per-tenant model requires validation tooling to ensure that tenant schemas are properly structured, constrained, and consistent with the latest template. Validation scripts will also help QA and future migration safety.

---

## ✅ Prior Steps Implemented

* All tenant tables migrated: `users`, `stations`, `pumps`, `nozzles`, `sales`, `readings`, `creditors`, `deliveries`, `inventory`, `reconciliations`, etc.
* Foreign keys and indexes are in place via the finalized `tenant_schema_template.sql`.

---

## 🛠 Task: Create Validation Scripts for Schema & Data

### 🎯 Objective

Build and test tools to:

1. Validate all tenant schemas match the template
2. Detect missing constraints or columns
3. Confirm referential integrity across FKs

### 📂 Files to Create

* `scripts/validate-tenant-schema.ts`
* `scripts/validate-foreign-keys.sql`
* `scripts/check-schema-integrity.sql`

### 💡 Features to Include

* Compare tenant schema structure to template (programmatically)
* Query missing constraints (e.g. no `DEFERRABLE` FKs)
* Log discrepancies to console in clear table format
* Print pass/fail summary for each tenant

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: Add summary of validation scripts
* [ ] `CHANGELOG.md`: Add feature entry for schema validation tooling
* [ ] `IMPLEMENTATION_INDEX.md`: Log Step 1.16
* [ ] `SEEDING.md`: Add note about running validation after seed

---

## ✅ Acceptance Criteria

* ✅ Script runs and outputs readable status per tenant
* ✅ All docs updated
* ✅ Helps detect drift or seed errors
* ✅ Referenced in seeding and QA processes

---

