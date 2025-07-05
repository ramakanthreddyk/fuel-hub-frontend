# STEP_fix_20251004_COMMAND.md

## Project Context Summary
`npm run setup-unified-db` fails on migration `003` because the inserted admin
user does not get a UUID. The migrations rely on `gen_random_uuid()` but the
`pgcrypto` extension is never installed explicitly.

## Steps Already Implemented
Fixes up through `STEP_fix_20251003.md` (SSL for migrations) are present.

## What to Build Now
- Ensure `pgcrypto` extension is created in all schema migrations.
- Update `003_unified_schema.sql` to supply an explicit UUID when seeding the
  default admin user.
- Document the fix in changelog, phase summary and implementation index.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/PHASE_1_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
