# STEP\_2\_8\_COMMAND.md — Daily Reconciliation API

## ✅ Project Context Summary

FuelSync Hub requires end-of-day reconciliation to report all sales, payments, and credit balances per station and ensure integrity.

## 📌 Prior Steps Implemented

* ✅ `STEP_2_7`: Fuel deliveries and inventory tracking
* ✅ `STEP_2_6`: Creditors and credit sales
* ✅ `STEP_2_5`: Fuel pricing
* ✅ `STEP_2_4`: Nozzle reading → sales conversion

## 🚧 What to Build Now

### 1. Daily Reconciliation API

* `POST /api/reconciliation`

  * Inputs: `station_id`, `reconciliation_date`
  * Action: Aggregate totals from `sales` and `credit_payments` tables for the day
  * Output: Cash, card, UPI totals; credit outstanding
  * Flag the date as `finalized = true` to lock edits

* `GET /api/reconciliation/:stationId?date=yyyy-mm-dd`

  * Retrieve summary for a given station and date

### 2. Lock Mechanism

* Prevent new sales, payments, or edits for finalized days

## 📁 File Paths

```
src/
├── controllers/reconciliation.controller.ts
├── services/reconciliation.service.ts
├── routes/reconciliation.route.ts
```

## 🧠 Why This Step

Provides clarity on station-level financial summary per day. Required for audits and reports.

## 🧾 Docs To Update

* `CHANGELOG.md`: Feature — daily reconciliation API
* `PHASE_2_SUMMARY.md`: Mark step complete
* `IMPLEMENTATION_INDEX.md`: Add STEP\_2\_8
* `BUSINESS_RULES.md`: Reconciliation rules

---

> Ensure each reconciliation runs only once per station per date. Lock logic should be enforced in all relevant mutations (sales, payments).
