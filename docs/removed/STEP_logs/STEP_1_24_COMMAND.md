# STEP\_1\_24\_COMMAND.md — Add `audit_logs` to Tenant Schema

## 🧠 Project Context Summary

FuelSync Hub captures a full audit trail for each tenant. Logs include actions by users (e.g., reading submission, sale creation, fuel delivery). These logs help in traceability, reporting, and internal audits.

We now add the `audit_logs` table to the tenant schema template.

## ✅ Prior Steps Implemented

* `STEP_1_21_COMMAND.md`: Introduced `tenant_schema_template.sql`
* `STEP_1_22_COMMAND.md`: Added creditors, payments, deliveries
* `STEP_1_23_COMMAND.md`: Added `day_reconciliations` table

## 🏗️ What to Build Now

**Task**: Add a general-purpose `audit_logs` table to the `tenant_schema_template.sql`

### Table: `audit_logs`

| Column        | Type      | Notes                                         |
| ------------- | --------- | --------------------------------------------- |
| `id`          | UUID      | Primary key                                   |
| `user_id`     | UUID      | FK → users                                    |
| `action`      | TEXT      | Freeform action string (e.g., 'CREATE\_SALE') |
| `entity_type` | TEXT      | E.g., 'sale', 'nozzle\_reading'               |
| `entity_id`   | UUID      | ID of the affected entity                     |
| `details`     | JSONB     | Optional metadata                             |
| `created_at`  | TIMESTAMP | Default now()                                 |

## 📁 Files to Modify

* `database/tenant_schema_template.sql`

## 📚 Docs to Update

| File                      | Update Description                          |
| ------------------------- | ------------------------------------------- |
| `PHASE_1_SUMMARY.md`      | Mark Step 1.24 as done                      |
| `CHANGELOG.md`            | Add audit log table creation as **Feature** |
| `IMPLEMENTATION_INDEX.md` | Add row for Step 1.24 with file reference   |
| `DATABASE_GUIDE.md`       | Add `audit_logs` with field details         |

## 📝 Notes

* Add `DEFERRABLE INITIALLY DEFERRED` constraint on FK to `users`
* Use `JSONB` for flexible log metadata
* Add index on `(entity_type, entity_id)` for faster filtering

---

Once this is done, we will proceed to finalize the pricing metadata and validation support tables.
