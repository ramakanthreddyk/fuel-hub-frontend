## ✅ `STEP_2_15_COMMAND.md` — Final Backend Hardening & Audit Fixes

### 📌 Project Context

FuelSync Hub is a Codex-governed multi-tenant ERP for fuel stations. Phase 2 (Backend) is complete and testable. This step applies **final fixes** discovered during audit (`AUDIT_2025_06_Codex.md`) to ensure schema correctness, safe query patterns, and complete Codex compliance.

---

### 🔁 Prior Steps

* ✅ `STEP_2_10`: Backend cleanup, error handler, Swagger
* ✅ `STEP_2_11` – `.env` and test config
* ✅ `STEP_2_12` – Test infra
* ✅ `STEP_2_13` – Jest DB provisioning
* 🧠 `AUDIT_2025_06_Codex.md` identified final issues

---

### 🛠️ What to Build Now

#### 1. 🔐 Secure Tenant Schema Interpolation

**Problem**: Using `${tenantId}` directly in SQL can be unsafe.

**Fix**:

* In all service files (e.g., `creditor.service.ts`, `priceUtils.ts`, etc.), create and use a function:

```ts
export function getSafeSchema(schema: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error('Invalid schema name');
  return schema;
}
```

Use it like:

```ts
const schema = getSafeSchema(tenantId);
await db.query(`SELECT ... FROM ${schema}.creditors`);
```

---

#### 2. ⚠️ Improve Error Consistency in Services

**Problem**: Some services throw generic `Error(...)` instead of returning structured error info.

**Fix**:

* Create `src/errors/ServiceError.ts`:

```ts
export class ServiceError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}
```

* Replace `throw new Error('Invalid creditor')` with:

```ts
throw new ServiceError(404, 'Creditor not found');
```

* Update controllers to catch and call:

```ts
if (err instanceof ServiceError) return errorResponse(res, err.code, err.message);
```

---

#### 3. 🧪 Add Test Coverage for Creditor Logic

**Problem**: `creditor.service.ts` logic is untested.

**Fix**:

* Add `tests/creditor.service.test.ts`:

Test:

* Create creditor
* Update with nulls
* Credit payment with finalized day
* Invalid creditor ID
* Balance decrement check

---

#### 4. 🔍 Expand Index Coverage for Tenant Tables

**Problem**: `credit_payments.creditor_id` and `fuel_prices.station_id` are queried without index.

**Fix**:
Create `migrations/004_add_additional_indexes.sql`:

```sql
CREATE INDEX IF NOT EXISTS idx_credit_payments_creditor_id ON credit_payments(creditor_id);
CREATE INDEX IF NOT EXISTS idx_fuel_prices_station_id ON fuel_prices(station_id);
```

✅ Update `docs/SCHEMA_CHANGELOG.md`

---

### 📁 Files to Modify or Create

| File                                           | Action                         |
| ---------------------------------------------- | ------------------------------ |
| `src/utils/schemaUtils.ts`                     | 🆕 Add `getSafeSchema()`       |
| `src/errors/ServiceError.ts`                   | 🆕 Add service error class     |
| `creditor.service.ts`, `priceUtils.ts`, others | 🛠️ Replace raw schema + error |
| `tests/creditor.service.test.ts`               | 🆕 Add service-level tests     |
| `migrations/004_add_additional_indexes.sql`    | 🆕 Add missing FK indexes      |

---

### 📘 Docs to Update

| File                       | Change                                                   |
| -------------------------- | -------------------------------------------------------- |
| `CHANGELOG.md`             | 🟥 Step 2.14 Fixes (safe schema, error pattern, indexes) |
| `PHASE_2_SUMMARY.md`       | ✅ Backend now hardened & production-ready                |
| `IMPLEMENTATION_INDEX.md`  | ➕ Add STEP\_2\_14 row                                    |
| `docs/SCHEMA_CHANGELOG.md` | ➕ Add 004 index migration                                |
| `docs/TESTING_GUIDE.md`    | ➕ Note service-level tests for creditors                 |

---

### ✅ Final Result

FuelSync Hub backend is now:

* Codex-compliant and audit-safe
* Production-ready and schema-hardened
* Fully testable via `npm test` in isolation

---
