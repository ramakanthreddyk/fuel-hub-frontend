CODEX IMPLEMENTATION COMMAND — STEP_2_CRITICAL_FIXES
🎯 PURPOSE:
Resolve all critical backend issues flagged during audit, following best practices, with traceable documentation, source updates, and tests where applicable.

🔧 FIX 1: DATABASE CONNECTION POOLING
File: src/db/index.ts

Replace existing PG client with:

ts
Copy
Edit
import { Pool } from 'pg';

export const pool = new Pool({
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
✅ Add comment:

ts
Copy
Edit
// Connection pool with 10 max clients to prevent Azure PostgreSQL exhaustion
✅ Add unit test stub in __tests__/db.test.ts to ensure pool config loads without errors.

📈 FIX 2: ADD MISSING INDEXES
File: migrations/003_add_indexes.sql

Add:

sql
Copy
Edit
CREATE INDEX IF NOT EXISTS idx_sales_nozzle_id ON sales(nozzle_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_user_stations_user_id ON user_stations(user_id);
CREATE INDEX IF NOT EXISTS idx_pumps_station_id ON pumps(station_id);
✅ Update docs/SCHEMA_CHANGELOG.md:

pgsql
Copy
Edit
[003_add_indexes.sql]
- Added indexes to optimize common JOINs and WHERE queries on sales and user_stations
📦 FIX 3: API VERSIONING
File: src/app.ts

Refactor all route mounts:

ts
Copy
Edit
app.use('/auth', authRoutes);
⬇

ts
Copy
Edit
app.use('/v1/auth', authRoutes);
Repeat for:

/users, /stations, /sales, /reports, etc.

✅ Update OpenAPI/Swagger doc base path → /v1/

✅ Add to docs/API_GUIDELINES.md:

md
Copy
Edit
All endpoints must follow semantic versioning via route prefix: `/v1/...`
Breaking changes must be implemented as new `/v2/...` versions.
✅ Create a regression test: e2e/versioning.spec.ts to assert /v1/users and /v1/stations return HTTP 200.

⚠️ FIX 4: CONSISTENT ERROR HANDLING
Create file: src/utils/errorResponse.ts

ts
Copy
Edit
export function errorResponse(res, status = 400, message = 'Bad Request') {
  return res.status(status).json({ success: false, message });
}
✅ Refactor all existing error returns across routes:

ts
Copy
Edit
return errorResponse(res, 401, 'Unauthorized access');
✅ Add unit test: __tests__/utils/errorResponse.test.ts

✅ Update coding style guide: docs/CONTRIBUTING.md:

md
Copy
Edit
Use `errorResponse(res, status, message)` to ensure consistent JSON error structure across routes.
🧪 FIX 5: TEST INFRASTRUCTURE
✅ Add __tests__/integration/versioning.test.ts

✅ Add __tests__/utils/errorResponse.test.ts

✅ Add seed test data for sales, users, and stations using scripts/test-seed.ts

✅ Add README section:

md
Copy
Edit
### Running Tests

```bash
npm run test
Tests include DB pool config, versioned routes, and error handling


---

## 📝 DOCUMENTATION UPDATE SUMMARY

**Files modified**:
- `README.md`
- `docs/SCHEMA_CHANGELOG.md`
- `docs/API_GUIDELINES.md`
- `docs/CONTRIBUTING.md`

**New Files**:
- `src/utils/errorResponse.ts`
- `migrations/003_add_indexes.sql`

---

