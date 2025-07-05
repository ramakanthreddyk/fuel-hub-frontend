# STEP\_1\_25\_COMMAND.md — Wrap-Up: Finalize Tenant Schema & Database Setup

## 🧠 Project Context Summary

FuelSync Hub is a multi-tenant SaaS platform for managing daily operations of fuel stations. We’ve followed a phased implementation:

* Phase 1: Complete DB schema, tenant isolation, constraints, and seed scripts
* Steps 1.1–1.24 have built all core `public` and `tenant` schema components

Now we consolidate and finalize all remaining database tables in one step.

## ✅ Prior Steps Implemented

* Public schema setup (plans, tenants, admin\_users, logs)
* Tenant schema template: stations, pumps, nozzles, users, readings, sales
* Creditors, payments, deliveries, reconciliations, audit logs

## 🏗️ What to Build Now

Bundle the **final database setup** tasks:

### 1. `fuel_prices` table

```sql
CREATE TABLE fuel_prices (
  id UUID PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  effective_from TIMESTAMP NOT NULL,
  effective_to TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_prices_station_type ON fuel_prices (station_id, fuel_type);
```

### 2. `user_activity_logs` (optional, separate from `audit_logs`)

```sql
CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED,
  ip_address TEXT,
  user_agent TEXT,
  event TEXT,
  recorded_at TIMESTAMP DEFAULT now()
);
```

### 3. `validation_issues` table (optional future QA support)

```sql
CREATE TABLE validation_issues (
  id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 4. Wrap-up Seed Script

* Insert sample price data into `fuel_prices`
* Optionally insert 2-3 activity logs

## 📁 Files to Modify

* `database/tenant_schema_template.sql`
* `scripts/seed-tenant-sample.ts`

## 📚 Docs to Update

| File                      | Update Description                                 |
| ------------------------- | -------------------------------------------------- |
| `PHASE_1_SUMMARY.md`      | Mark Phase 1 (DB setup) as complete                |
| `CHANGELOG.md`            | Group all final DB setup tables as Features        |
| `IMPLEMENTATION_INDEX.md` | Mark all previous steps + final wrap step          |
| `DATABASE_GUIDE.md`       | Document `fuel_prices`, `validation_issues`, etc.  |
| `SEEDING.md`              | Add seed details for fuel prices + tenant defaults |

---

This command completes **Phase 1**.

> Proceed to Phase 2 only after validating this with: `npm run db:validate && npm run db:seed && npm test`
