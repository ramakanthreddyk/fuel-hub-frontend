STEP_2_11_COMMAND.md — Setup Jest Testing Infrastructure
✅ Project Context Summary
FuelSync Hub is a multi-tenant ERP system with schema-per-tenant Postgres setup. Backend Phase 2 is complete in terms of core APIs and services, but DB-related unit and integration tests are failing because the test environment and setup are not configured.

📌 Prior Steps Completed
✅ STEP_2_10: Final backend features, but npm test fails

✅ All backend logic, auth, APIs, and middleware are now functional

🚧 What to Build Now
1. Jest + DB Testing Setup
Configure jest.config.js

Add tests/setup.ts, teardown.ts, utils/db-utils.ts

Use .env.test with dedicated fuelsync_test DB

Provide lifecycle hooks to create and drop test schemas

2. Sample Unit Test
Add tests/auth.service.test.ts that verifies password hashing

3. Scripts & DevDeps
Add to package.json:

json
Copy
Edit
"scripts": {
  "test": "jest --runInBand",
  "test:watch": "jest --watch",
  "test:db": "cross-env NODE_ENV=test jest --forceExit --detectOpenHandles"
}
Add these dependencies:

bash
Copy
Edit
npm install --save-dev jest ts-jest @types/jest cross-env
4. Docs to Update
CHANGELOG.md: Feature — Jest + DB test infra setup

IMPLEMENTATION_INDEX.md: Add STEP_2_11

PHASE_2_SUMMARY.md: Add test infra section

TESTING_GUIDE.md: Add file explaining how to run and maintain tests

📁 File Paths to Create
arduino
Copy
Edit
tests/
├── setup.ts
├── teardown.ts
├── utils/
│   └── db-utils.ts
├── auth.service.test.ts

jest.config.js
.env.test
✅ Expected Outcome
npm test should spin up a seeded test schema and pass unit tests

Codex can now run future tests without network or manual setup
