STEP_2_13_COMMAND.md — Independent Backend Test Execution
✅ Project Context Summary
FuelSync Hub is a multi-tenant ERP with backend APIs supporting auth, sales, readings, credit, reconciliation, and plan enforcement. All business domains are implemented.

Previous tests failed because Codex could not create and seed its own test database (fuelsync_test), resulting in jest.globalSetup.ts failures. This step fixes that permanently.

📌 Prior Steps Completed
✅ STEP_2_10: Final backend cleanup, unit tests, Swagger docs

✅ STEP_2_11: .env file support for dev and test configs

✅ STEP_2_12: Setup testing structure with sample test cases

🚧 What to Build Now
1. Provision Isolated Test DB (fuelsync_test)
Create DB if it doesn't exist

Use .env.test with PGDATABASE=fuelsync_test

Run full DB migration (public + tenant schema)

Seed test data:

Admin user + token

Sample tenant (tenant_123)

Basic station, pump, nozzle, fuel price, user

Initial reading and creditor

Add retry logic with logs if DB is unreachable or Postgres CLI is missing

2. Automate with Jest Global Hooks
jest.globalSetup.ts — run DB creation + seed

jest.globalTeardown.ts — optional: drop or truncate test DB

3. Run Full Test Suite
✅ Run all service-level and auth flow tests

✅ Generate a terminal report summarizing:

Passed tests

Failed tests

Coverage % (if --coverage is passed)

📁 Files to Create / Update
bash
Copy
Edit
jest.globalSetup.ts
jest.globalTeardown.ts
scripts/create-test-db.ts
scripts/seed-test-db.ts
.env.test
Also update:

jest.config.ts → point to globalSetup / globalTeardown

package.json test script → use --runInBand and .env.test

📘 Docs To Update
CHANGELOG.md: Enhancement — test DB runs independently

PHASE_2_SUMMARY.md: Mark testing complete

IMPLEMENTATION_INDEX.md: Add STEP_2_13

TESTING_GUIDE.md: Add section for test DB provisioning

🧪 Final Result: Codex can now execute npm test with no external setup and run all routes, logic, and validations in isolation.
