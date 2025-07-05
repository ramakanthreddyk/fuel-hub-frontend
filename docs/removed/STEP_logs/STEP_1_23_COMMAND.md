# STEP\_1\_23\_COMMAND.md — Add `day_reconciliations` to Tenant Schema

## 🧠 Project Context Summary

FuelSync Hub is a multi-tenant ERP for fuel station management. Each tenant has a dedicated schema based on `tenant_schema_template.sql`. This template is being extended incrementally to support core domain workflows such as daily summaries and financial reconciliation.

This step builds upon prior additions such as `sales`, `creditors`, and `fuel_deliveries`.

## ✅ Prior Steps Implemented

* `STEP_1_21_COMMAND.md`: Created initial tenant schema template.
* `STEP_1_22_COMMAND.md`: Added `creditors`, `credit_payments`, `fuel_deliveries`, `fuel_inventory` tables.

## 🏗️ What to Build Now

**Task**: Add the `day_reconciliations` table to the `tenant_schema_template.sql`.

### Table: `day_reconciliations`

| Column         | Type      | Notes                                |
| -------------- | --------- | ------------------------------------ |
| `id`           | UUID      | Primary key                          |
| `station_id`   | UUID      | FK → stations                        |
| `date`         | DATE      | The day being reconciled             |
| `total_sales`  | NUMERIC   | Total sales amount for the day       |
| `cash_total`   | NUMERIC   | Portion paid in cash                 |
| `card_total`   | NUMERIC   | Portion paid by card                 |
| `upi_total`    | NUMERIC   | Portion paid via UPI                 |
| `credit_total` | NUMERIC   | Total sold on credit                 |
| `finalized`    | BOOLEAN   | Marks if reconciliation is locked    |
| `created_at`   | TIMESTAMP | Default now()                        |
| `updated_at`   | TIMESTAMP | Default now(), auto-update on change |

## 📁 Files to Modify

* `database/tenant_schema_template.sql`

## 📚 Docs to Update

| File                      | Update Description                                      |
| ------------------------- | ------------------------------------------------------- |
| `PHASE_1_SUMMARY.md`      | Mark Step 1.23 as done + summarize reconciliation table |
| `CHANGELOG.md`            | Log addition of `day_reconciliations` as Feature        |
| `IMPLEMENTATION_INDEX.md` | Add row for Step 1.23 with file reference               |
| `DATABASE_GUIDE.md`       | Describe new table and fields                           |

## 📝 Notes

* Enforce FK to `stations`
* Add `UNIQUE(station_id, date)` to prevent duplicates
* Set constraints `DEFERRABLE INITIALLY DEFERRED`

---

Once this step is complete, we’ll continue to finalize remaining metadata and validation structures.
