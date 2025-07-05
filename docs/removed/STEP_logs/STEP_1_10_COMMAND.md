# STEP\_1\_10\_COMMAND.md — Sales Table Schema & Mappings

---

## 🧠 Project Context

FuelSync Hub uses cumulative nozzle readings to generate per-delta sales records. Each sale must:

* Belong to a `nozzle_id`
* Have volume calculated from delta
* Reference the fuel price at the time of reading

The `sales` table should store individual sale entries, support breakdowns by payment method, and support later reconciliation reports.

---

## ✅ Prior Steps Implemented

* `nozzle_readings` table exists with audit columns
* `fuel_prices` schema is implemented with `effective_from`/`to`
* Pricing utility stub for lookup at timestamp is defined

---

## 🛠 Task: Define Sales Table & Constraints

### 🎯 Objective

Create a `sales` table inside each tenant schema:

* Link to `nozzle_id`, `user_id`, and `reading_id`
* Store volume (from delta), price, total amount
* Include payment method breakdown (cash, card, UPI, credit)
* Include `recorded_at` timestamp for reconciliation

### 📂 Files to Create or Modify

* `migrations/tenant_schema_template.sql`

  * Add `sales` table
* `BUSINESS_RULES.md`

  * Document delta calculation and sale rules
* `DATABASE_GUIDE.md`

  * Add to ERD

Example Schema:

```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nozzle_id UUID REFERENCES nozzles(id),
  user_id UUID REFERENCES users(id),
  reading_id UUID REFERENCES nozzle_readings(id),
  volume NUMERIC CHECK (volume >= 0),
  price NUMERIC CHECK (price > 0),
  amount NUMERIC GENERATED ALWAYS AS (volume * price) STORED,
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'upi', 'credit')),
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Add `sales` table summary
* [ ] `CHANGELOG.md` → Feature: `sales` schema with delta logic
* [ ] `IMPLEMENTATION_INDEX.md` → Add Step 1.10
* [ ] `DATABASE_GUIDE.md` → Add to ERD section
* [ ] `BUSINESS_RULES.md` → Link nozzle reading to sale delta logic

---

## ✅ Acceptance Criteria

* ✅ `sales` table exists in tenant schema
* ✅ Fields support volume, price, and computed amount
* ✅ Constraints for non-negative volume and valid payment method
* ✅ Timestamp present for reconciliation
* ✅ Docs updated

---
