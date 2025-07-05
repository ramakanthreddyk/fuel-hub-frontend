# DATABASE\_GUIDE.md — FuelSync Hub Schema Overview

This guide documents the database structure, key constraints, naming patterns, and design philosophy.

---

## 🧱 Schema Model

| Schema  | Purpose                                      |
| ------- | -------------------------------------------- |
| public  | SuperAdmin config: tenants, plans, logs      |
| tenantX | Per-tenant isolation: stations, pumps, nozzles, readings, sales |

---

## 📐 Naming Conventions

* Tables: `snake_case_plural` → `stations`, `creditors`
* Primary Key: `id UUID PRIMARY KEY`
* Foreign Keys: `snake_case_id` → `tenant_id`, `station_id`
* Timestamps: `created_at`, `updated_at` (default `NOW()`)

---

## 🔗 Foreign Key Patterns

| Table             | FK References               |
| ----------------- | --------------------------- |
| `pumps`           | `stations(id)`              |
| `nozzles`         | `pumps(id)`                 |
| `sales`           | `nozzles(id)`, `nozzle_readings(id)`, `users(id)`, `creditors(id)` |
| `user_stations`   | `users(id)`, `stations(id)` |
| `credit_payments` | `creditors(id)`             |
| `fuel_deliveries` | `stations(id)`              |
| `fuel_inventory`  | `stations(id)`              |
| `day_reconciliations` | `stations(id)` with unique `(station_id, reconciliation_date)` |

All constraints are `ON DELETE CASCADE`.

---
## 📝 Audit Fields & Data Constraints

All tenant tables include `created_at` and `updated_at` columns with `NOW()` defaults. Business rules are enforced with `NOT NULL` and `CHECK` constraints. Example checks include `reading >= 0`, `price_per_litre > 0`, and `credit_limit >= 0`. Stations are unique per tenant and daily reconciliations enforce a unique `(station_id, reconciliation_date)` pair.


## ⚠️ Constraint Notes

* No triggers for enforcing entity existence (use app logic)
* `fuel_prices` table stores `station_id`, `fuel_type`, price and effective date range
* `CHECK(price > 0)` on `fuel_prices`
* `CHECK(reading >= 0)` on `nozzle_readings`
* Optional trigger snippet to close previous price period when inserting new row
* Sales volume auto-calculated via nozzle delta logic
* Fuel inventory updated by deliveries and sales entries
* All foreign keys are declared `DEFERRABLE INITIALLY DEFERRED`
* Indexes created for performance:
  * `nozzle_readings(recorded_at)`
  * `sales(recorded_at)`
  * `fuel_prices(effective_from)`
  * `credit_payments(received_at)`
  * `day_reconciliations(reconciliation_date)`

* Optional plan limit constraints defined in `database/plan_constraints.sql` (commented by default)

---

## 🛠 Migration/Seed Tools

* Migrations via `migrations/` directory per schema
* Seeding via `scripts/seed-public-schema.ts` and `scripts/seed-tenant-schema.ts`
* Schema validation via `scripts/validate-tenant-schema.ts`
* Lightweight template for runtime provisioning: `database/tenant_schema_template.sql`

---

> Keep this file synchronized with the ERD and `PHASE_1_SUMMARY.md`

## 🎯 ERD: Entity Relationship Diagram

Generate the diagram locally using `python scripts/generate_erd_image.py`. The output will be saved to `docs/assets/FuelSync_ERD.png`.

### 🔑 Key Tables Overview
| Table                  | Schema    | Notes                                  |
|------------------------|-----------|----------------------------------------|
| tenants                | public    | All tenant accounts                    |
| admin_users            | public    | SuperAdmin accounts                    |
| admin_activity_logs    | public    | Audit trail of SuperAdmin actions      |
| stations               | tenant    | Belongs to tenant                      |
| pumps                  | tenant    | FK → stations                          |
| nozzles                | tenant    | FK → pumps                             |
| nozzle_readings        | tenant    | FK → nozzles, FK → users               |
| sales                  | tenant    | Delta-based transactions with payment method |
| fuel_prices            | tenant    | Per station, per fuel type with history |
| user_activity_logs     | tenant    | Basic per-user event log               |
| validation_issues      | tenant    | Records data quality problems          |
| creditors              | tenant    | Credit customers                       |
| credit_payments        | tenant    | Payments made on credit                |
| fuel_deliveries        | tenant    | Incoming fuel by station and type      |
| fuel_inventory         | tenant    | Current stock level per station        |
| day_reconciliations    | tenant    | Daily summary with payment breakdown and lock flag |
| audit_logs             | tenant    | User actions and metadata              |

### 🆕 Credit & Inventory Tables

These tables were added in **Step 1.22** to support credit sales and fuel stock tracking.

| Table            | Description                                        |
| ---------------- | -------------------------------------------------- |
| `creditors`      | Stores credit-eligible customers with limits       |
| `credit_payments`| Records repayments from creditors                  |
| `fuel_deliveries`| Logs fuel received per station and fuel type       |
| `fuel_inventory` | Tracks current tank levels after deliveries/sales  |

### 🆕 Day Reconciliation Table

Introduced in **Step 1.23** to capture end-of-day totals per station.

| Field          | Description                           |
| -------------- | ------------------------------------- |
| `station_id`   | FK to `stations.id`                   |
| `date`         | Day being reconciled (unique per station) |
| `total_sales`  | Aggregate sales amount for the day    |
| `cash_total`   | Cash payments total                   |
| `card_total`   | Card payments total                   |
| `upi_total`    | UPI payments total                    |
| `credit_total` | Credit sales total                    |
| `finalized`    | Indicates reconciliation is locked    |

### 🆕 Audit Logs Table

Introduced in **Step 1.24** to provide a tenant-level audit trail.

| Field         | Description                                         |
| ------------- | --------------------------------------------------- |
| `user_id`     | FK to `users.id`                                    |
| `action`      | Describes the operation performed                   |
| `entity_type` | Type of record affected (e.g., `sale`)               |
| `entity_id`   | UUID of the affected record                         |
| `details`     | Optional JSONB metadata about the action            |

### 🆕 User Activity Logs

Introduced in **Step 1.25** to capture login and usage events per user.

| Field        | Description                                |
| ------------ | ------------------------------------------ |
| `user_id`    | FK to `users.id`                           |
| `ip_address` | IP address of the request                  |
| `user_agent` | Reported browser / client string           |
| `event`      | Short event label (e.g., `login`)          |
| `recorded_at`| Timestamp the event was recorded           |

### 🆕 Validation Issues Table

Used for future data quality workflows.

| Field        | Description                            |
| ------------ | -------------------------------------- |
| `entity_type`| Type of record (table)                  |
| `entity_id`  | UUID of the record with an issue        |
| `message`    | Description of the problem              |
| `created_at` | When the issue was captured             |
