# STEP_fix_20251008_COMMAND.md

## Project Context Summary
Developers working with Azure PostgreSQL wanted a single command that prepares the unified schema and demo data. Previous fixes introduced `setup-azure-schema.js` and a helper for the `cash_reports` migration, but running them together still required multiple commands.

## Steps Already Implemented
- Fix 2025-10-07 added `apply-cash-reports-azure.js`.
- The general `setup-unified-db.js` orchestrates setup for local environments.

## What to Build Now
- Create `scripts/setup-azure-db.js` that checks the DB connection, fixes constraints, applies the Azure-friendly schema, runs migrations including the cash reports workaround, verifies the schema, generates Prisma, and seeds data.
- Add npm script `setup-azure-db` for convenience.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
- Create `docs/STEP_fix_20251008.md`
