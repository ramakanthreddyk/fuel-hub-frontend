# STEP\_1\_22\_COMMAND.md — Extend Tenant Schema Template

## 🧠 Project Context Summary

FuelSync Hub is a multi-tenant SaaS ERP for fuel stations. Each tenant has a dedicated Postgres schema for isolation. The schema template `tenant_schema_template.sql` is cloned per tenant on creation.

The platform is being built using a Codex-first workflow, where each implementation step is logged and self-documented. We're now finalizing additional tenant-specific tables.

## ✅ Prior Steps Implemented

* `STEP_1_21_COMMAND.md` created the initial `tenant_schema_template.sql` with:

  * `users`, `user_stations`, `stations`, `pumps`, `nozzles`, `sales`, `nozzle_readings`, `fuel_prices`

## 🏗️ What to Build Now

**Task**: Extend `tenant_schema_template.sql` to include these missing domain tables:

| Table             | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `creditors`       | Track credit-eligible parties                      |
| `credit_payments` | Log repayments from creditors                      |
| `fuel_deliveries` | Track daily fuel received (by station, fuel type)  |
| `fuel_inventory`  | Track tank levels after delivery or sale deduction |

These are foundational to support credit sales and inventory reconciliation in later phases.

## 📁 Files to Modify

* `database/tenant_schema_template.sql`

## 📚 Docs to Update

| File                      | Update Description                                 |
| ------------------------- | -------------------------------------------------- |
| `PHASE_1_SUMMARY.md`      | Mark Step 1.22 as done + summarize added tables    |
| `CHANGELOG.md`            | Log new tables in tenant schema (Feature)          |
| `IMPLEMENTATION_INDEX.md` | Add row for Step 1.22 with file reference          |
| `DATABASE_GUIDE.md`       | Add section on new tenant tables with descriptions |

## 📌 Notes

* Use consistent naming (`id`, `created_at`, `updated_at`) and FK patterns
* All tenant tables must include tenant-scoped foreign keys
* Include indexes where appropriate (e.g., `creditor_id`, `station_id`, `fuel_type`)
* Make constraints `DEFERRABLE INITIALLY DEFERRED`

---

After this, we’ll finalize the tenant schema setup and begin running seeded test scaffolds.
