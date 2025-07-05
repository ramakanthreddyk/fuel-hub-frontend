# STEP_fix_20251121_COMMAND.md — Pump column rename

## Project Context Summary
Pumps were originally stored with a `label` column. Recent code and Prisma models now use `name` instead, causing runtime errors when querying the database.

## Steps Already Implemented
- Fuel price station id in spec (STEP_fix_20251120.md)

## What to Build Now
- Create migration to rename `pumps.label` to `name`.
- Update schema changelog and documentation.
- Record this fix in changelog, phase summary and implementation index.

## Files to Update
- `migrations/schema/009_rename_pumps_label_to_name.sql`
- `docs/SCHEMA_CHANGELOG.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_1_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/STEP_fix_20251121.md` (summary)

## Required Documentation Updates
- Add changelog entry under Fixes.
- Append row to `IMPLEMENTATION_INDEX.md`.
- Summarise fix in `PHASE_1_SUMMARY.md`.
