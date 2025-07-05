# STEP\_1\_12\_COMMAND.md — Fuel Delivery & Inventory Schema

---

## 🧠 Project Context

FuelSync Hub tracks incoming fuel deliveries to station tanks and maintains stock balance. This enables inventory control, reconciliation, and alerts when fuel is below threshold.

We need two new tables:

* `fuel_deliveries`: incoming fuel entries with volume and source
* `fuel_inventory`: current tank levels per station & fuel type

These tables belong to each tenant schema.

---

## ✅ Prior Steps Implemented

* `stations`, `pumps`, `nozzles` tables exist
* `fuel_prices`, `sales`, and `creditors` tables created
* Tenant schema structure and seed system established

---

## 🛠 Task: Add Delivery & Inventory Schema

### 🎯 Objective

Design fuel delivery tracking and tank-level inventory for reconciliation.

### 📂 Files to Modify

* `migrations/tenant_schema_template.sql`
* `BUSINESS_RULES.md`
* `DATABASE_GUIDE.md`
* `PHASE_1_SUMMARY.md`
* `CHANGELOG.md`
* `IMPLEMENTATION_INDEX.md`

---

### ✏️ Schema Definitions

```sql
CREATE TABLE fuel_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL,
  volume NUMERIC CHECK (volume > 0),
  delivered_by TEXT,
  delivery_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE fuel_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL,
  current_volume NUMERIC CHECK (current_volume >= 0),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 🧠 Business Rules to Capture

* Every delivery increases `fuel_inventory.current_volume`
* Each sale reduces `fuel_inventory.current_volume`
* Alerts generated when below threshold (future enhancement)

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: fuel delivery & inventory section
* [ ] `CHANGELOG.md`: Feature – delivery/inventory schema
* [ ] `IMPLEMENTATION_INDEX.md`: Add Step 1.12
* [ ] `BUSINESS_RULES.md`: Inventory stock update logic
* [ ] `DATABASE_GUIDE.md`: Add to ERD and descriptions

---

## ✅ Acceptance Criteria

* ✅ `fuel_deliveries` and `fuel_inventory` tables created
* ✅ Fields: station, fuel type, volume, date, FK constraints
* ✅ All docs updated accordingly

---

