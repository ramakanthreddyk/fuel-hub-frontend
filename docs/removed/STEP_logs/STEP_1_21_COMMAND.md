# STEP\_1\_21\_COMMAND.md — Create Tenant Schema Template

---

## 🧠 Project Context

We’re nearing the end of **Phase 1: Database Layer**. Until now, we’ve only dealt with the public schema (`plans`, `tenants`, `admin_users`, etc). Each tenant will have their **own Postgres schema** (multi-tenant isolation).

This step sets up a `tenant_schema_template.sql` file to initialize per-tenant schemas.

---

## ✅ Prior Steps Implemented

* Public schema migrations and seed complete
* Seed scripts for demo tenants
* Database tests to validate schema structure
* `.env` and dev DB setup complete

---

## 🛠 Task: Create `tenant_schema_template.sql`

This SQL file will be used by the backend (Phase 2) when creating new tenants dynamically. It contains all base tables a tenant needs.

### 📄 File to Create

* `sql/tenant_schema_template.sql`

---

### 🔧 Contents

```sql
-- sql/tenant_schema_template.sql

-- Example: template schema for new tenant
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'attendant')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) DEFERRABLE INITIALLY DEFERRED,
  label TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nozzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pump_id UUID NOT NULL REFERENCES pumps(id) DEFERRABLE INITIALLY DEFERRED,
  fuel_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fuel_type TEXT NOT NULL,
  price_per_litre NUMERIC(10, 2) NOT NULL CHECK (price_per_litre > 0),
  effective_from TIMESTAMP NOT NULL,
  effective_to TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nozzle_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nozzle_id UUID NOT NULL REFERENCES nozzles(id) DEFERRABLE INITIALLY DEFERRED,
  reading NUMERIC(10, 2) NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nozzle_id UUID NOT NULL REFERENCES nozzles(id) DEFERRABLE INITIALLY DEFERRED,
  user_id UUID NOT NULL REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED,
  volume_sold NUMERIC(10, 2) NOT NULL,
  sale_amount NUMERIC(10, 2) NOT NULL,
  sold_at TIMESTAMP NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'credit')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: Add schema template mention
* [ ] `CHANGELOG.md`: Feature log for `tenant_schema_template.sql`
* [ ] `IMPLEMENTATION_INDEX.md`: Add Step 1.21 + file link
* [ ] `DATABASE_GUIDE.md`: Document tenant schema contents

---

## ✅ Acceptance Criteria

* ✅ `sql/tenant_schema_template.sql` created
* ✅ Contains `users`, `stations`, `pumps`, `nozzles`, `fuel_prices`, `nozzle_readings`, `sales`
* ✅ All FKs are DEFERRABLE INITIALLY DEFERRED
* ✅ Phase 2 backend logic will use this to provision tenant schemas

---

## 🏁 Next Action

```
Codex, begin execution of STEP_1_21_COMMAND.md
```
