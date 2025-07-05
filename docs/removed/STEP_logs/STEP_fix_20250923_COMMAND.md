# STEP_fix_20250923_COMMAND.md

## Project Context Summary
`npm run setup-unified-db` currently loads `005_master_unified_schema.sql` and seeds demo data. Additional SQL files under `migrations/schema` must be applied manually using `node scripts/migrate.js up`, which leads to stale setups when new migrations are added.

## Steps Already Implemented
Fixes through `STEP_fix_20250922_COMMAND.md` cover daily summary adjustments. Setup scripts exist but do not auto-run new migrations.

## What to Build Now
- Update `scripts/setup-unified-db.js` so it calls `node scripts/migrate.js up` after applying the master schema.
- Update `UNIFIED_DB_SETUP.md` and `db_brain.md` to mention that the setup command runs all pending migrations automatically.
- Document the change in changelog, implementation index and phase summary.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- `UNIFIED_DB_SETUP.md`
- `db_brain.md`
