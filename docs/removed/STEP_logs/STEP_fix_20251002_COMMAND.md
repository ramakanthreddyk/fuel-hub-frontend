# STEP_fix_20251002_COMMAND.md

## Project Context Summary
The migration process failed in CI because the runner attempted to connect to the customer's database.
Codex needs a local PostgreSQL instance to run migrations during tests.
While preparing a local DB, migration 003 also failed due to out-of-order SQL statements.

## Steps Already Implemented
Fixes through `STEP_fix_20251001.md` handle ON CONFLICT logic in the migration runner.

## What to Build Now
- Install and configure a local PostgreSQL server for Codex.
- Update `scripts/migrate.js` to load `.env` files via dotenv.
- Fix `migrations/schema/003_unified_schema.sql` ordering issues so all eight migrations run cleanly.
- Document setup notes and the fix in the changelog, implementation index and phase summary.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
