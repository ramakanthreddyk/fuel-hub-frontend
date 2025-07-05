# STEP\_1\_4\_COMMAND.md — Define Relational ERD & Docs

---

## 🧠 Project Context

**FuelSync Hub** uses a schema-per-tenant relational database structure to support multi-tenant ERP functionality for fuel station operations. A clearly documented and visualized ERD (Entity-Relationship Diagram) helps both humans and AI agents understand table relationships, constraints, and data flow.

> This step defines the official data model for the platform.

---

## ✅ Prior Steps Implemented

**Step 1.1 — Public Schema Migration & Seed**

* `migrations/001_create_public_schema.sql`
* `scripts/seed-public-schema.ts`

**Step 1.2 — Tenant Schema Migration & Seed**

* `migrations/tenant_schema_template.sql`
* `scripts/seed-tenant-schema.ts`

**Step 1.3 — Schema Validation Script**

* `scripts/validate-tenant-schema.ts`

---

## 🛠 Task: Define and Document Full ERD

### 🎯 Goal

Create a full visual and textual definition of the relational model covering both public and tenant schemas.

### 📂 What to Build

1. **Image File**:
   Create an ERD diagram (`docs/assets/FuelSync_ERD.png`) with:

* All tables
* PKs, FKs
* Relationships (1\:N, M\:N)
* Schema prefixes (`public.`, `tenant.`)

2. **Markdown Documentation**: Add to `docs/DATABASE_GUIDE.md`:

```markdown
## 🎯 ERD: Entity Relationship Diagram

![FuelSync ERD](./assets/FuelSync_ERD.png)

### 🔑 Key Tables Overview
| Table                  | Schema    | Notes                                  |
|------------------------|-----------|----------------------------------------|
| tenants                | public    | All tenant accounts                    |
| admin_users            | public    | SuperAdmin accounts                    |
| stations               | tenant    | Belongs to tenant                      |
| pumps                  | tenant    | FK → stations                          |
| nozzles                | tenant    | FK → pumps                             |
| nozzle_readings        | tenant    | FK → nozzles, FK → users               |
| sales                  | tenant    | Derived from readings                  |
| fuel_prices            | tenant    | Per station, per fuel type             |
| creditors              | tenant    | Credit customers                       |
| credit_payments        | tenant    | Payments made on credit                |
| fuel_deliveries        | tenant    | Inventory tracking                     |
| day_reconciliations    | tenant    | Daily summary for cash, credit, cards  |
```

> Use dbdiagram.io or DrawSQL or Mermaid to generate ERD image.

---

## 📓 Documentation Updates

* [ ] `DATABASE_GUIDE.md` → Add full ERD section + image
* [ ] `PHASE_1_SUMMARY.md` → Mark Step 1.4 done
* [ ] `IMPLEMENTATION_INDEX.md` → Mark Step 1.4 ✅ with file links
* [ ] `CHANGELOG.md` → Log ERD + documentation added

---

## ✅ Acceptance Criteria

* ✅ All key tables in public and tenant schemas visualized
* ✅ ERD image saved to `docs/assets/`
* ✅ Table list in markdown is complete and categorized

---

## ⏭️ Next Step Preview

> **Step 1.5**: Add DB constraint validations (audit fields, NOT NULLs, CHECKs)

---

