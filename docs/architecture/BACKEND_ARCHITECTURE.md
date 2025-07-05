---
title: ARCHITECTURE.md — FuelSync Hub Platform Overview
lastUpdated: 2025-07-05
category: architecture
---

# ARCHITECTURE.md — FuelSync Hub Platform Overview

This file explains the high-level architecture, data model hierarchy, roles, and modular structure of the FuelSync Hub ERP platform.

---

## 🧱 System Structure

```text
SuperAdmin (Platform Operator)
  └── Tenants (Fuel Companies)
        └── Stations
              └── Pumps
                    └── Nozzles
                          └── Nozzle Readings → Sales
              └── Users (Owner, Manager, Attendant)
              └── Creditors
              └── Deliveries
```

---

## 🧩 Core Modules

| Module                 | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| Multi-Tenant Support   | Public schema + tenant schemas with isolated data           |
| User Management        | SuperAdmin & tenant user creation, role assignment          |
| Station Configuration  | Add/edit stations, pumps, nozzles                           |
| Nozzle Readings        | Cumulative manual readings, supports multiple daily entries |
| Auto Sales Calculation | Delta-based sale entry based on readings × price            |
| Fuel Pricing           | Price per station per fuel type; timestamped                |
| Credit Management      | Issue fuel on credit, track balances, take payments         |
| Fuel Inventory         | Log deliveries and tank stock                               |
| Daily Reconciliation   | Day-close summaries for sales, cash, credit, UPI, card      |
| Dashboards             | Role-based overviews for SuperAdmin, Owner, Manager         |
| Seeding & Testing      | Dev/test reset & validation support                         |

---

## 🔐 Role Access Matrix

| Role       | Access Level                                                         |
| ---------- | -------------------------------------------------------------------- |
| SuperAdmin | Global access to all tenants, plans, logs, seeds                     |
| Owner      | Access to own org, full station config, staff, sales, reports        |
| Manager    | Can view station, manage attendants, enter readings, view dashboards |
| Attendant  | Can enter readings & payment info, limited to assigned station only  |

---

## 🧠 Nozzle Reading to Sales

1. Each reading is cumulative
2. Delta is calculated: `volume = new_reading - previous_reading`
3. Fuel price is fetched at `reading_timestamp`
4. Sale = `volume × price`, logged into `sales` table

Sales are logged automatically for every delta.

---

## 🔌 Public vs Tenant Schema

| Schema    | Tables                                                           |
| --------- | ---------------------------------------------------------------- |
| `public`  | `tenants`, `plans`, `admin_users`, `admin_activity_logs`         |
| `tenantX` | `users`, `stations`, `pumps`, `nozzles`, `nozzle_readings`, etc. |

All tenant-specific data is isolated per schema to ensure secure and scalable multi-tenancy.

---

## 📂 Key Tables

### In `public` Schema:

* `tenants`
* `admin_users`
* `plans`, `plan_limits`
* `admin_activity_logs`

### In `tenant` Schema:

* `users`, `user_stations`
* `stations`, `pumps`, `nozzles`
* `sales`, `nozzle_readings`
* `fuel_prices`, `creditors`, `credit_payments`
* `fuel_deliveries`, `fuel_inventory`
* `day_reconciliations`

---

## 🛠 Developer Utilities

```bash
npm run db:seed        # Populate test data
npm run db:validate    # Run schema consistency checks
node scripts/generate-api-docs.js
```

---

## 📌 Architecture Notes

* Relational data design with UUID PKs and enforced FKs
* Schema isolation improves security, maintenance, and tenant offboarding
* Plan limits enforced via runtime configuration (`planConfig.ts`)
* CLI tools support schema seeding, validation, and introspection

> Refer to `BUSINESS_RULES.md` for enforced behaviors and `PHASE_1_SUMMARY.md` for schema-specific logic.
