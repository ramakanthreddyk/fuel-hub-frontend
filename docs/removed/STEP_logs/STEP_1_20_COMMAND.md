# STEP\_1\_20\_COMMAND.md — Basic DB Integrity Tests

---

## 🧠 Project Context

FuelSync Hub Phase 1 is almost complete. Before moving to backend development, we want basic tests that verify:

* Public schema integrity
* Key tables exist
* Constraints are enforced (e.g., DEFERRABLE FKs)

This step sets up our initial testing harness.

---

## ✅ Prior Steps Implemented

* Postgres DB running in Docker
* Seed script for `public` schema
* Helper for schema validation
* `.env.development` support + dev scripts

---

## 🛠 Task: Create Basic DB Integrity Test Suite

### 📂 Files to Create or Modify

* `tests/db.test.ts`
* `jest.config.js`
* Update `package.json` with test scripts

---

### 🧪 db.test.ts

```ts
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.development` });

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

describe('📦 Public Schema – Structure', () => {
  beforeAll(() => client.connect());
  afterAll(() => client.end());

  test('🧱 Table exists: plans', async () => {
    const res = await client.query("SELECT to_regclass('public.plans') AS exists");
    expect(res.rows[0].exists).toBe('public.plans');
  });

  test('🔐 DEFERRABLE constraints exist', async () => {
    const res = await client.query(`
      SELECT conname, deferrable
      FROM pg_constraint
      WHERE conname = 'fk_tenant_plan_id'
    `);
    expect(res.rows[0]?.deferrable).toBe(true);
  });
});
```

---

### ⚙️ jest.config.js

```js
module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  roots: ['<rootDir>/tests'],
};
```

### 📦 package.json

Add to `scripts`:

```json
"test": "jest"
```

Install:

```bash
npm install --save-dev jest ts-jest @types/jest
```

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: Mark test added
* [ ] `CHANGELOG.md`: Log test harness creation
* [ ] `IMPLEMENTATION_INDEX.md`: Add Step 1.20 with file links

---

## ✅ Acceptance Criteria

* ✅ Jest test runner installed and working
* ✅ `db.test.ts` verifies public schema and FKs
* ✅ Tests run using: `npm test`
* ✅ Phase 1 integrity proven

---
