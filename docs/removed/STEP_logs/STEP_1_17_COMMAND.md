# STEP\_1\_17\_COMMAND.md — Seed/Test Utility Functions

---

## 🧠 Project Context

FuelSync Hub's schema-per-tenant structure and growing module count require consistent helper functions for:

* Seeding tenants, users, stations, pumps, nozzles
* Fetching latest data (e.g., last reading, current fuel price)
* Generating test scaffolds across schemas

These helpers improve consistency across manual and automated seed scripts.

---

## ✅ Prior Steps Implemented

* Tenant schema created and finalized
* Public + tenant-level seed scripts exist for test tenants and stations
* Validation tooling for schemas created in Step 1.16

---

## 🛠 Task: Write Utility Functions for Seeding & Validation

### 🎯 Objectives

Build a utility module to:

1. Encapsulate common seed actions (e.g., createTenant, createPump)
2. Provide cross-tenant helpers (e.g., for test automation)
3. Support dynamic reading of schemas from DB

### 📂 Files to Create

* `src/utils/seedHelpers.ts`
* `src/utils/schemaUtils.ts`

### 💡 Must Include

* `createTenant(data)`
* `createStation(tenantId, data)`
* `createPump(stationId, data)`
* `createNozzles(pumpId, data[])` – skips duplicates with `ON CONFLICT (tenant_id, pump_id, nozzle_number) DO NOTHING`
* `getLatestReading(nozzleId)`
* `getCurrentFuelPrice(fuelType, stationId, atTime)`

Use `pg` client and environment-based connections.

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: Add summary of helper module
* [ ] `CHANGELOG.md`: Add enhancement entry for utility modules
* [ ] `IMPLEMENTATION_INDEX.md`: Log Step 1.17
* [ ] `SEEDING.md`: Add usage examples

---

## ✅ Acceptance Criteria

* ✅ Functions exportable and importable from seed/test scripts
* ✅ Promises return expected structure
* ✅ Schema context respected (per-tenant)

---
