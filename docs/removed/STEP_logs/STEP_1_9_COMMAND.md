# STEP\_1\_9\_COMMAND.md — Fuel Price Schema & History Rules

---

## 🧠 Project Context

FuelSync Hub tracks historical fuel pricing per station and fuel type. Pricing is time-based and affects sales calculations (volume × price) during delta sales generation. New price inserts must end previous ranges and enforce price validity.

---

## ✅ Prior Steps Implemented

* Public and tenant schemas are created
* Plan enforcement middleware stubs exist
* ERD and seed data are in place

---

## 🛠 Task: Add Fuel Pricing Table + Constraints

### 🎯 Objective

Define and migrate a `fuel_prices` table into tenant schema that:

* Stores `station_id`, `fuel_type`, `price`, `effective_from`, `effective_to`
* Enforces `price > 0`
* Updates `effective_to` of the previous active row when new one is inserted
* Enables `current_price` lookup for a timestamp

### 📂 Files to Create or Modify

* `migrations/tenant_schema_template.sql`

  * Add `fuel_prices` table with audit columns
* `src/utils/priceUtils.ts`

  * Add helper `getPriceAtTimestamp(station_id, fuel_type, timestamp)` (stub)
* Optional trigger in SQL to auto-close prior price record (commented)

Example Schema:

```sql
CREATE TABLE fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id),
  fuel_type TEXT NOT NULL,
  price NUMERIC CHECK (price > 0),
  effective_from TIMESTAMP NOT NULL,
  effective_to TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Add `fuel_prices` table summary
* [ ] `CHANGELOG.md` → Feature: fuel pricing table + validations
* [ ] `IMPLEMENTATION_INDEX.md` → Add Step 1.9
* [ ] `DATABASE_GUIDE.md` → Add to ERD section + constraints
* [ ] `BUSINESS_RULES.md` → Add rules under "Fuel Price Rules"

---

## ✅ Acceptance Criteria

* ✅ `fuel_prices` table exists in tenant schema
* ✅ Price constraints applied (`price > 0`)
* ✅ Logic defined for `effective_from` / `effective_to`
* ✅ Utility stub exists to fetch price by timestamp
* ✅ Docs updated accordingly

---
