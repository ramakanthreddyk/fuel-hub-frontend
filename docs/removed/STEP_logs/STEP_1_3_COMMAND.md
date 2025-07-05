# STEP\_1\_3\_COMMAND.md — Schema Validation Script

---

## 🧠 Project Context

**FuelSync Hub** is a multi-tenant SaaS ERP for fuel station networks. The platform enforces schema-per-tenant design, where each tenant has isolated operational tables. Schema consistency is critical to ensure reliable seed, migration, and query behavior.

> Phase 1 covers all DB schema, seed, and validation tooling.

---

## ✅ Prior Steps Implemented

**Step 1.1 — Public Schema Migration & Seed**

* `migrations/001_create_public_schema.sql`
* `scripts/seed-public-schema.ts`

**Step 1.2 — Tenant Schema Migration & Seed**

* `migrations/tenant_schema_template.sql`
* `scripts/seed-tenant-schema.ts`

All tables now exist in:

* `public` schema (plans, tenants, admin\_users)
* `tenant_<slug>` schema (stations, pumps, nozzles, etc.)

---

## 🛠 Task: Validate Tenant Schema Matches Template (Step 1.3)

### 🎯 Goal

Create a validation script that ensures tenant schemas match the official template structure (table names, columns, constraints).

### 🔨 What to Build

#### 1. Script File

Create:

```ts
scripts/validate-tenant-schema.ts
```

This script should:

* Use the `pg` client
* Connect to Postgres and list all user-defined schemas
* For each tenant schema:

  * Verify table names match expected list
  * Check column names and types match template
  * Check FK constraints exist
* Output any mismatches in a readable diff-like format
* Exit with non-zero code if mismatch found (for CI use)

> Optionally: Validate default values, `NOT NULL`, `CHECK`, and audit fields.

---

## 📓 Documentation Updates

After implementation, update:

* [ ] `PHASE_1_SUMMARY.md` → Add Step 1.3 summary block
* [ ] `CHANGELOG.md` → Log added validation script
* [ ] `IMPLEMENTATION_INDEX.md` → Mark Step 1.3 as ✅ Done
* [ ] `DATABASE_GUIDE.md` → Add validation logic reference

---

## ✅ Acceptance Criteria

* ✅ Works even when multiple tenants exist
* ✅ Flags any schema drift
* ✅ Fully local and does not require external services

---

## ⏭️ Next Step Preview

> **Step 1.4**: Define full relational ERD and include as image + markdown

---

## 🏁 Now Run:

```
Codex, begin execution of STEP_1_3_COMMAND.md
```
