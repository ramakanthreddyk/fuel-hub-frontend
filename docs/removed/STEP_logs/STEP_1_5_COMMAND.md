# STEP\_1\_5\_COMMAND.md — Add Audit Fields & Constraints

---

## 🧠 Project Context

FuelSync Hub is a schema-per-tenant ERP system where all relational data is validated at both the schema (PostgreSQL) and service layer. Every tenant table must include audit fields and appropriate column constraints to ensure data integrity, enforce rules, and support reconciliation.

> This step finalizes the schema structure by adding all necessary `CHECK`, `NOT NULL`, and `DEFAULT` constraints, and ensures consistent audit fields across tables.

---

## ✅ Prior Steps Implemented

* **Step 1.1**: Public schema migration & seed — core `public.tenants`, `admin_users`, etc.
* **Step 1.2**: Tenant schema template — full schema created in `tenant_schema_template.sql`
* **Step 1.3**: Schema validation script
* **Step 1.4**: ERD defined, saved in `docs/assets/`, documented in `DATABASE_GUIDE.md`

---

## 🛠 Task: Add Audit Columns & Constraints to Schema

### 📂 Modify the following file:

`migrations/tenant_schema_template.sql`

### 🔧 Add to every tenant table:

```sql
created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
```

### 🧪 Add `CHECK` and `NOT NULL` constraints:

| Table                | Constraints                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| stations             | name NOT NULL, unique (tenant-wide), foreign key to tenant             |
| pumps                | station\_id NOT NULL, foreign key FK                                   |
| nozzles              | nozzle\_number NOT NULL, fuel\_type NOT NULL, FK to pump               |
| nozzle\_readings     | reading > 0 CHECK, nozzle\_id NOT NULL, recorded\_at NOT NULL          |
| sales                | volume > 0, price\_per\_litre > 0, sale\_amount > 0                    |
| fuel\_prices         | price > 0 CHECK, station\_id NOT NULL                                  |
| creditors            | credit\_limit >= 0 CHECK, contact\_person/email NOT NULL               |
| credit\_payments     | amount > 0 CHECK, reference\_number nullable, credited\_by FK to users |
| fuel\_deliveries     | litres\_delivered > 0, supplier NOT NULL                               |
| day\_reconciliations | finalized BOOLEAN DEFAULT false, FK to station + date combo UNIQUE     |

### ➕ Create `scripts/check-constraints.ts`

A script that connects to a tenant schema and lists:

* Any table missing `created_at` / `updated_at`
* Any column without `NOT NULL` but should have one
* Any missing CHECK constraints from the table list above

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Describe constraint additions
* [ ] `CHANGELOG.md` → Log audit/validation constraints added
* [ ] `IMPLEMENTATION_INDEX.md` → Step 1.5 ✅
* [ ] `DATABASE_GUIDE.md` → Add section: "Audit Fields & Data Constraints"

---

## ✅ Acceptance Criteria

* ✅ Every tenant table has `created_at`, `updated_at` with defaults
* ✅ Required columns marked `NOT NULL`
* ✅ All domain constraints implemented using `CHECK`
* ✅ Validation script reports issues clearly

---

