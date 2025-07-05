# STEP_fix_20251003_COMMAND.md

## Project Context Summary
Running `npm run setup-unified-db` fails during the migration step when connecting to the Azure PostgreSQL server. The error states `no pg_hba.conf entry ... no encryption` because `scripts/migrate.js` connects without SSL.

## Steps Already Implemented
Fixes through `STEP_fix_20251002.md` cover dotenv loading and local migration execution. The setup script already invokes `node scripts/migrate.js up`.

## What to Build Now
- Update `scripts/migrate.js` to include `ssl: { rejectUnauthorized: false }` in the `Pool` configuration so migrations connect using SSL.
- Document the fix in the changelog, implementation index and phase summary.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_1_SUMMARY.md`
