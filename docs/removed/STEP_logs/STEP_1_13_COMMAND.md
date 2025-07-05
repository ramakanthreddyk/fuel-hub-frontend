# STEP\_1\_13\_COMMAND.md — Daily Reconciliation Schema

---

## 🧠 Project Context

FuelSync Hub requires a daily reconciliation module to:

* Summarize sales by payment mode
* Track credit balances
* Lock day records to prevent changes

This is essential for financial accountability and reporting.

---

## ✅ Prior Steps Implemented

* `sales`, `fuel_prices`, `fuel_inventory`, and `creditors` schemas exist
* Stations and nozzles are mapped and seeded
* Plan limits and validations implemented

---

## 🛠 Task: Add Daily Reconciliation Schema

### 🎯 Objective

Introduce `day_reconciliations` table for day-end summaries and lock status.

### 📂 Files to Modify

* `migrations/tenant_schema_template.sql`
* `DATABASE_GUIDE.md`
* `PHASE_1_SUMMARY.md`
* `CHANGELOG.md`
* `IMPLEMENTATION_INDEX.md`
* `BUSINESS_RULES.md`

---

### ✏️ Schema Definition

```sql
CREATE TABLE day_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
  reconciliation_date DATE NOT NULL,
  total_sales NUMERIC NOT NULL DEFAULT 0,
  cash_sales NUMERIC NOT NULL DEFAULT 0,
  card_sales NUMERIC NOT NULL DEFAULT 0,
  upi_sales NUMERIC NOT NULL DEFAULT 0,
  credit_sales NUMERIC NOT NULL DEFAULT 0,
  total_credit_outstanding NUMERIC NOT NULL DEFAULT 0,
  finalized BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE (station_id, reconciliation_date)
);
```

---

## 🧠 Business Rules

* One row per station per day
* Totals calculated from `sales` table
* If `finalized = true`, prevent updates to that day’s sales
* Used for reports and dashboards

---

## 📓 Docs to Update

* [x] `PHASE_1_SUMMARY.md`: Add reconciliation section
* [x] `CHANGELOG.md`: Feature – reconciliation schema
* [x] `IMPLEMENTATION_INDEX.md`: Add Step 1.13
* [x] `BUSINESS_RULES.md`: Lock & summarize rules
* [x] `DATABASE_GUIDE.md`: Table definition & usage

---

## ✅ Acceptance Criteria

* ✅ `day_reconciliations` table created with constraints
* ✅ Enforced uniqueness for one record per station per day
* ✅ Finalized flag prevents future edits
* ✅ Docs updated across all tracking files

---
