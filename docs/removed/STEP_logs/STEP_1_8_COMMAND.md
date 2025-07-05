# STEP\_1\_8\_COMMAND.md — Plan Limit Enforcement

---

## 🧠 Project Context

FuelSync Hub is a multi-tenant SaaS platform where each tenant is subject to usage-based plan restrictions. These include limits on:

* Max stations
* Max pumps per station
* Max nozzles per pump
* Max employees (users)
* Feature access (e.g., enableCreditors, enableReports)

Plans are defined in `public.plans` and linked via `tenants.plan_id`. Plan rules are loaded from `planConfig.ts` at runtime.

---

## ✅ Prior Steps Implemented

* Public + tenant schema migrations and seeders
* Tenant demo data seeding
* Seed validation and ERD docs

---

## 🛠 Task: Plan Limit Middleware Checks (Database + Stubs)

### 🎯 Objective

Enforce plan limits *at database level* for core counts, and *stub backend enforcement* via service-layer comments or pseudo-code.

### 📂 Files to Edit or Create

* `database/plan_constraints.sql` → add `CHECK` constraints (optional, comment out if problematic)
* `src/config/planConfig.ts` → define plan rules per `plan_id`
* `src/middleware/planEnforcement.ts` → stub logic for:

  * beforeCreateStation()
  * beforeCreatePump()
  * beforeCreateNozzle()
  * beforeCreateUser()

Each function should:

1. Look up tenant’s plan from DB
2. Load limit rules from `planConfig.ts`
3. Compare current count to limit
4. Throw exception if exceeded (for now, just `throw new Error()`)

### 🔒 Optional (if possible):

Define Postgres CHECK constraints in:

* `stations`, `pumps`, `nozzles`, `users`

But comment them out by default to avoid blocking seed/dev workflows.

---

## 📓 Documentation Updates

* [ ] `PHASE_1_SUMMARY.md` → Add enforcement layer
* [ ] `CHANGELOG.md` → Feature: plan enforcement logic (stubbed)
* [ ] `IMPLEMENTATION_INDEX.md` → Add Step 1.8 row
* [ ] `PLANS.md` → Define how limits are applied + examples
* [ ] `DATABASE_GUIDE.md` → Reference constraint definitions (if used)

---

## ✅ Acceptance Criteria

* ✅ Middleware stubs exist for each limit
* ✅ `planConfig.ts` supports rule lookups by plan\_id
* ✅ Pseudo-enforcement in place (exceptions thrown if limits exceeded)
* ✅ Optional: constraints in SQL file (commented)
* ✅ All doc files updated accordingly

---
