# STEP\_1\_11\_COMMAND.md — Creditors & Credit Sales Schema

---

## 🧠 Project Context

FuelSync Hub allows station managers to issue fuel on credit to registered creditors (companies or drivers). Credit limits must be enforced, and payments tracked against outstanding balances.

Credit sales are recorded in the `sales` table (already created), tagged with `payment_method = 'credit'` and linked to a `creditor_id`.

We need to design two new tables:

* `creditors` — stores registered credit parties and limits
* `credit_payments` — tracks payments made against balances

---

## ✅ Prior Steps Implemented

* `sales` table implemented (Step 1.10)
* Payment method column exists with `credit` as a valid value
* `users`, `stations`, `nozzles` schema completed

---

## 🛠 Task: Define Credit Schema

### 🎯 Objective

Create `creditors` and `credit_payments` tables in tenant schema with required fields and constraints.

### 📂 Files to Create or Modify

* `migrations/tenant_schema_template.sql`

  * Add `creditors` and `credit_payments` tables
* `BUSINESS_RULES.md`

  * Add credit rules (limit enforcement, payment required)
* `DATABASE_GUIDE.md`

  * Update ERD section

### Example Schemas

```sql
CREATE TABLE creditors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_name TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  email TEXT,
  credit_limit NUMERIC CHECK (credit_limit >= 0),
  balance NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE credit_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creditor_id UUID REFERENCES creditors(id) ON DELETE CASCADE,
  amount NUMERIC CHECK (amount > 0),
  payment_method TEXT CHECK (payment_method IN ('cash', 'bank_transfer', 'check')),
  reference_number TEXT,
  notes TEXT,
  received_by UUID REFERENCES users(id),
  received_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

In `sales`, add:

```sql
ALTER TABLE sales ADD COLUMN creditor_id UUID REFERENCES creditors(id);
```

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Add credit schema summary
* [ ] `CHANGELOG.md` → Feature: credit schema and FK link to sales
* [ ] `IMPLEMENTATION_INDEX.md` → Add Step 1.11
* [ ] `BUSINESS_RULES.md` → Add credit sale and payment logic
* [ ] `DATABASE_GUIDE.md` → ERD update

---

## ✅ Acceptance Criteria

* ✅ `creditors`, `credit_payments` created in tenant schema
* ✅ `creditor_id` FK added to `sales`
* ✅ Constraint: credit\_limit, payment\_method checks
* ✅ Docs updated and changelog entry added

---
