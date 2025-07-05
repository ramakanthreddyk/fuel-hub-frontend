
````md
# STEP_2_13_COMMAND.md

## 🧠 Project Context

FuelSync Hub is a schema-per-tenant, role-based ERP for fuel stations. This is a Codex-governed project with structured documentation, centralized knowledge in `AGENTS.md`, and strict adherence to `STEP_X_Y_COMMAND.md` conventions.

The backend and database are now complete and independently testable.

---

## 🔁 Previous Steps

- `STEP_2_10_COMMAND.md` finalized backend readiness and Swagger integration.
- `STEP_2_12_COMMAND.md` prepared test infrastructure, confirmed DB bootstrapping and Jest integration.
- Testing failed due to DB pooling and versioning issues not yet resolved.

---

## 🎯 Current Task

**Fix all critical backend design flaws**, ensuring performance, maintainability, and production readiness. All changes must follow AGENTS.md execution rules and update the changelog, implementation index, and documentation.

---

## ✅ Codex Task Summary

### 🔧 Database: Add Connection Pooling
- Replace raw `pg` connection with `Pool` using limits (`max: 10`, `idleTimeoutMillis: 30000`)
- File: `src/db/index.ts`
- Comment: `// Azure-friendly pooling config`

### 📈 Database: Add Missing Indexes
- Create `migrations/003_add_indexes.sql`
- Indexes:
  - `sales.nozzle_id`
  - `sales.created_at`
  - `user_stations.user_id`
  - `pumps.station_id`
- Add to: `docs/SCHEMA_CHANGELOG.md`

### 🧪 API: Enable Versioning
- Prefix all routes with `/v1/...`
- Apply to:
  - `authRoutes`, `userRoutes`, `salesRoutes`, `stationsRoutes`, etc.
- Update Swagger/OpenAPI config
- File: `src/app.ts`
- Add entry to: `docs/API_GUIDELINES.md`

### ⚠️ Errors: Centralize Error Format
- Create `src/utils/errorResponse.ts`
- Use:
  ```ts
  errorResponse(res, 400, 'Missing field: nozzle_id');
````

* Refactor all routes to use this
* Add test: `__tests__/utils/errorResponse.test.ts`

---

## 🧪 Tests

### Integration

* Create `__tests__/integration/versioning.test.ts` (assert 200 on `/v1/users`, `/v1/sales`)

### DB

* Add `__tests__/db.test.ts` to ensure Pool initializes and connects

---

## 📝 Documentation & Indexing

### AGENTS.md

> Append new cognitive rule: “All APIs must use `/vX/` versioning and `errorResponse(...)` format. Pooling must follow Azure constraints.”

### CHANGELOG.md

```md
## [Step 2.13] Critical Fixes (Connection Pooling, Indexes, Versioning, Error Handling)
- Introduced connection pooling with `pg.Pool`
- Added essential indexes for performance
- Introduced `/v1/` versioning on all APIs
- Standardized error responses using `errorResponse()`
```

### IMPLEMENTATION\_INDEX.md

```md
| Step | Scope                  | Description                                      |
|------|------------------------|--------------------------------------------------|
| 2.13 | Critical Backend Fixes | Pooling, Indexes, Versioning, Error Handling     |
```

### PHASE\_2\_SUMMARY.md

Update section: **“Backend Finalization”**

> Step 2.13 resolves final blockers for deployment-readiness: DB pooling added, indexes in place, versioned APIs, and unified error format. Testing structure confirmed.

---

## 🧠 Output Requirements

* Updated `src/db/index.ts`, `app.ts`, route prefixes
* `migrations/003_add_indexes.sql` created
* `utils/errorResponse.ts` implemented
* Test files scaffolded
* All doc files listed above updated in-line

---

## 🧪 Proceed if Jest/DB tests pass

* If `npm test` fails, fix or mark reason in AGENTS.md → “blocked\_items”

```

---

Let me know if you'd like me to execute the exact Codex-compatible action plan to generate these changes directly, or if you're pushing this to Codex manually.
```
