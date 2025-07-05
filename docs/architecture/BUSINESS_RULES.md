---
title: BUSINESS_RULES.md — Core Logic & Validation Rules
lastUpdated: 2025-07-05
category: architecture
---

# BUSINESS\_RULES.md — Core Logic & Validation Rules

This file consolidates business logic, validation checks, and enforced behaviors in FuelSync Hub. It acts as a single source of truth for any feature enforcement, helpful for Codex agents, developers, and QA engineers.

---

## 🔁 Nozzle Reading & Sales Logic

| Rule                     | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| **Cumulative Entry**     | Each nozzle reading is cumulative.                                  |
| **Auto Delta**           | `volume_sold = new_reading - previous_reading`                      |
| **Price Application**    | Fuel price is fetched as of `reading_timestamp`                     |
| **Sale Formula** | `sale_amount = volume_sold × price_at(recorded_at)` |
| **Multiple Entries/Day** | Every delta becomes one sales row                                   |
| **Validation**           | Reading must be ≥ last reading, and belong to same nozzle & station |

**SQL for detecting invalid readings:**

```sql
SELECT * FROM nozzle_readings r
JOIN (
  SELECT nozzle_id, MAX(reading) AS prev
  FROM nozzle_readings
  WHERE recorded_at < r.recorded_at
  GROUP BY nozzle_id
) last ON last.nozzle_id = r.nozzle_id
WHERE r.reading < last.prev;
```

Additional Sale Rules:

* Each sale references the originating `nozzle_readings.id` via `reading_id`.
* `volume` is computed from the delta between successive readings.
* Fuel price at `recorded_at` is applied when calculating `amount`.
* `payment_method` must be one of `cash`, `card`, `upi`, or `credit`.
* `recorded_at` timestamps allow daily reconciliation and reporting.

---

## 🧮 Credit Sales Logic

| Rule                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| **Party Must Exist** | Credit sales require a valid `creditor_id` |
| **Max Limit**        | Block new sales if sale amount exceeds available credit (`credit_limit - balance`) |
| **Payment History**  | Recorded in `credit_payments` table            |
| **Payment Required** | No new credit sales if balance >= credit_limit |

**Suggestion:** Add a `check_credit_limit()` trigger before inserting into `sales`.

---

## 💵 Plan Enforcement Logic

| Plan Setting         | Enforced By                                       |
| -------------------- | ------------------------------------------------- |
| `maxStations`        | `beforeCreateStation()` in backend controller     |
| `maxPumpsPerStation` | `checkPumpLimit` middleware in pump routes        |
| `maxNozzlesPerPump`  | `checkNozzleLimit` middleware in nozzle routes    |
| `maxEmployees`       | Checked in user creation service                  |
| `enableCreditors`    | Conditional route guards (e.g., `/api/creditors`) |
| `enableReports`      | Frontend + backend feature flags                  |
| `enableApiAccess`    | API key generation is gated                       |

**Plan source:** `planConfig.ts` — evaluated per tenant at runtime.

---

## 🔐 Authentication & Authorization

| Rule                 | Method                                            |
| -------------------- | ------------------------------------------------- |
| Session must be JWT  | All users authenticate via JWT in HttpOnly cookie |
| Role-specific routes | `requireRole('owner')`, etc.                      |
| Station access check | `user_stations` must include station\_id for user |
| Super admin prefix   | `/v1/admin/*` validated against `public.admin_users` |

Example middleware chain:

```ts
authenticateJWT → requireRole(['manager']) → checkStationAccess → route handler
```

---

## 🔁 Reconciliation Logic

| Rule | Description |
| -------------- | -------------------------------------------------------------- |
| Daily Summary | For each station: total sales, cash/card split, credit outstanding |
| Auto Calculate | Totals calculated from `sales` table per date |
| Finalize Flag | Locked from edits if `finalized = true` |
| Locked Mutations | Sales and credit payments blocked after finalization |
| One Per Day | Unique `(station_id, reconciliation_date)` enforced |

---

## 🛢 Fuel Price Rules

| Rule                                 | Description                                 |
| ------------------------------------ | ------------------------------------------- |
| New price inserts end previous range | Updates `effective_to` of prior record or trigger |
| Price must be > 0                    | Enforced with `CHECK(price > 0)` |
| Stored per station & fuel type       | Track via `effective_from`/`effective_to` |
| Historical lookup allowed            | Used in sales delta logic     |
| Stale price blocked                  | Price older than 7 days cannot be used |
| No overlapping ranges | API ensures ranges do not overlap and closes open range |

---

## 🛢 Fuel Delivery & Inventory Rules

| Rule | Description |
| --- | --- |
| **Delivery Adds Stock** | Each row in `fuel_deliveries` increases `fuel_inventory.current_volume`. |
| **Inventory Auto Init** | Delivery creates inventory row when missing |
| **Sale Reduces Stock** | Recorded sales deduct sold volume from `fuel_inventory`. |
| **Low Stock Alert** | Future enhancement will trigger alerts when below threshold. |

## ⚙ Tenant Settings

| Rule | Description |
| --- | --- |
| **Owner Updates** | Only the tenant owner may modify settings via `/v1/settings` |
| **Manager Read** | Owners and managers can read current preferences |
| **Fields** | `receipt_template`, `fuel_rounding`, `branding_logo_url` stored in `tenant_settings` |

---

## ✅ Record Ownership & Integrity

| Entity         | Must Belong To          |
| -------------- | ----------------------- |
| Pumps          | a Station               |
| Nozzles        | a Pump                  |
| Sales          | a Nozzle and User       |
| Credit Payment | a Creditor and Receiver |
| Stations       | unique name per tenant  |

All enforced via FK constraints within the active tenant schema.


## 🚨 Alert Generation Rules
| Rule | Description |
| --- | --- |
| **No Reading in 24h** | Triggered when a nozzle has not submitted any readings for over 24 hours. |
| **Missing Fuel Price** | Active nozzle lacks a current fuel price entry. |
| **Credit Near Limit** | Creditor balance reaches 90% of credit limit. |
| **Station Inactive** | No activity for 48h or pump maintenance older than 7 days. |
| **Reading Discrepancy** | Successive reading jump exceeds 20% of previous value. |
| **Missing Cash Report** | Daily cash report not submitted. |

Alerts are inserted automatically via `alertRules.service.ts`.
---

## 📎 Cross-Reference Index

| Section      | File                        |
| ------------ | --------------------------- |
| Auth         | `AUTH.md`                   |
| Seed rules   | `SEEDING.md`                |
| Plans        | `PLANS.md`, `planConfig.ts` |
| Roles        | `ROLES.md`                  |
| Database FKs | `DATABASE_GUIDE.md`         |
| Known issues | `TROUBLESHOOTING.md`        |

> Update this file as new modules and validations are introduced.
