# STEP\_1\_2\_COMMAND.md — Tenant Schema Migration & Seed

---

## 🧠 Project Context

**FuelSync Hub** is a multi-tenant SaaS ERP platform for fuel station networks. It operates in 3 phases:

* **Phase 1**: Database schema, constraints, seed scripts
* **Phase 2**: Backend services, APIs, validation logic
* **Phase 3**: Frontend UI, dashboards, E2E workflows

The system uses:

* **PostgreSQL** with schema-per-tenant isolation
* **TypeScript** for backend logic
* **Role-based access** (SuperAdmin, Owner, Manager, Attendant)
* **Strict auditability** and FK constraints

> Phase 1 requires building all schemas, constraints, and seeds before backend logic starts.

---

## ✅ Prior Steps Implemented

**Step 1.1 — Public Schema Migration & Seed**

* Created: `migrations/001_create_public_schema.sql`
* Created: `scripts/seed-public-schema.ts`
* Tables added: `plans`, `admin_users`, `tenants`, `admin_activity_logs`
* Seeded: Demo platform admin, tenant, and usage plans
* Documented in: `PHASE_1_SUMMARY.md`, `CHANGELOG.md`, `IMPLEMENTATION_INDEX.md`

---

## 🛠 Task: Tenant Schema Migration & Seed (Step 1.2)

### 🎯 Goal

Create a parameterized SQL migration and TypeScript seed logic to initialize a new tenant’s schema with core operational tables.

### 🔨 What to Build

#### 1. Migration SQL Template

Create file:

```txt
migrations/tenant_schema_template.sql
```

This SQL file should:

* Accept a `schema_name` placeholder for dynamic tenant schema creation
* Include the following tables:

  * `users`, `user_stations`
  * `stations`, `pumps`, `nozzles`
  * `nozzle_readings`, `sales`
  * `fuel_prices`, `creditors`, `credit_payments`
  * `fuel_deliveries`, `fuel_inventory`, `day_reconciliations`
* Include necessary indexes and FK constraints
* Add `created_at`, `updated_at` audit fields to each table

#### 2. Seeding Script

Create file:

```ts
scripts/seed-tenant-schema.ts
```

This should:

* Accept `tenantId` and `schemaName` from env or CLI
* Run the SQL migration using `pg` client
* Insert demo station, pumps, nozzles, and owner user
* Validate that tables are usable post-creation

---

## 🧾 Documentation & Logs

After implementation, update:

* [ ] `PHASE_1_SUMMARY.md` → Add Step 1.2 summary block
* [ ] `CHANGELOG.md` → Log added migration and seed script
* [ ] `IMPLEMENTATION_INDEX.md` → Mark Step 1.2 as ✅ Done
* [ ] `DATABASE_GUIDE.md` → Document tenant schema tables and constraints
* [ ] `SEEDING.md` → Document how tenant seed script is invoked

> 🚨 All docs must be updated for the step to be considered complete.

---

## ⏭️ Next Step Preview (Do Not Execute Yet)

> **Step 1.3**: Create validation script to compare tenant schema with template for consistency

---

## 🏁 Now Run:

```
Codex, begin execution of STEP_1_2_COMMAND.md
```
