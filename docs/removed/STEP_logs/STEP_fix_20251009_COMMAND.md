# STEP_fix_20251009_COMMAND.md

## Project Context Summary
`setup-azure-db.js` was introduced to orchestrate Azure-friendly schema setup and migrations. However it still executed `node scripts/migrate.js up`, which tried to apply migration `007_create_cash_reports.sql` and failed due to foreign keys. We already have a workaround script `apply-cash-reports-azure.js`.

## Steps Already Implemented
- `apply-cash-reports-azure.js` runs migration 007 without foreign keys.
- `setup-azure-db.js` orchestrates schema setup and seeding.

## What to Build Now
- Update `scripts/setup-azure-db.js` so Step 4 uses `MigrationRunner` from `migrate.js` to run migrations one by one, skipping `007_create_cash_reports.sql`.
- Keep Step 5 calling `apply-cash-reports-azure.js`.
- Document that this script skips migration 007 and applies it separately.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
- Create `docs/STEP_fix_20251009.md`
