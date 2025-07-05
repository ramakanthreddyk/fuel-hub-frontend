# TESTING_GUIDE.md — Running the FuelSync Test Suite

This guide describes how to run unit and e2e tests for FuelSync Hub.

1. Ensure PostgreSQL 16 is installed and running locally. On Ubuntu:

```bash
sudo apt-get update && sudo apt-get install -y postgresql
sudo service postgresql start
```
   Set the `postgres` user password to `postgres` and edit
   `/etc/postgresql/16/main/pg_hba.conf` to use `md5` for local connections.
   Restart the service after changes.

2. Verify the database specified in `.env.test` is running. You can also use:

```bash
./scripts/start-dev-db.sh
```

3. Install dependencies and run tests:

```bash
npm install
npm test
```

The test suite automatically provisions the `fuelsync_test` database via `jest.globalSetup.ts`. This setup runs `scripts/create-test-db.ts` using the variables in `.env.test`.
If PostgreSQL is not running, the global setup prints a warning and exits without running tests.

Service tests mock database calls while integration tests create and drop a dedicated schema using the global setup and teardown scripts.

Sample coverage includes authentication, nozzle readings, creditors and reconciliation logic. E2E tests verify the login flow and protected routes.

Creditor service tests validate balance logic in `tests/creditor.service.test.ts`.
Plan enforcement logic is covered in `tests/planEnforcement.test.ts`, which mocks database calls to verify pump creation limits.

