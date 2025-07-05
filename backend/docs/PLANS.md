# PLANS.md — FuelSync Hub Tenant Plans

This file defines the pricing plans and their effect on feature availability and data limits.

---

## 📦 Plan Tiers

| Plan Name  | maxStations | maxPumpsPerStation | maxNozzlesPerPump | maxEmployees | enableCreditors | enableReports | enableApiAccess |
| ---------- | ----------- | ------------------ | ----------------- | ------------ | --------------- | ------------- | --------------- |
| Starter    | 1           | 2                  | 2                 | 3            | false           | false         | false           |
| Pro        | 3           | 4                  | 4                 | 10           | true            | true          | false           |
| Enterprise | ∞           | ∞                  | ∞                 | ∞            | true            | true          | true            |
`maxStations`, `maxPumpsPerStation` and `maxNozzlesPerPump` define how many stations, pumps and nozzles a tenant may configure. These limits are enforced by middleware during creation requests.


---

## ⚙️ Runtime Evaluation

* Each plan is stored in the `public.plans` table
* Plan configuration read via `planConfig.ts`
* Used in backend middleware and frontend route guards

---

## 🧪 Enforcement Examples

* Block new station if `count(stations)` ≥ `plan.maxStations`
* Disable `/creditors` routes if `!plan.enableCreditors`

---

> After modifying `planConfig.ts` or DB plan settings, update this file and regenerate documentation.

## 🚦 Enforcement Workflow

Plan rules are loaded at runtime from `planConfig.ts`. Backend middleware
functions (`planEnforcement.ts`) check current entity counts before allowing
creation of stations, pumps, nozzles or users. When a limit is exceeded the
middleware throws an error which is surfaced to the API client.

Example usage:

```ts
await beforeCreateStation(db, tenantId); // throws if over limit
```

Optional SQL constraints in `database/plan_constraints.sql` can be enabled to
enforce limits directly in Postgres once plan values stabilise.
