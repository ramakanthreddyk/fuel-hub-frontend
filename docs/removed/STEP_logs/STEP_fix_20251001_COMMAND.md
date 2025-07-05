# STEP_fix_20251001_COMMAND.md

## Project Context Summary
The unified migration runner inserts a record into `schema_migrations` after executing each SQL file. Individual migration files also insert their own records. When `npm run setup-unified-db` runs the migrations, this caused a unique constraint error on version `006`, stopping the process.

## Steps Already Implemented
Fixes through `STEP_fix_20250923.md` cover automatic migration execution after setup.

## What to Build Now
- Update `scripts/migrate.js` so the insert statement uses `ON CONFLICT (version) DO NOTHING`.
- Document the fix in the changelog, implementation index and phase summary.
- Create this command file and a corresponding summary file.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
