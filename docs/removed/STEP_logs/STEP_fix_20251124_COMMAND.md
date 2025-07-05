# STEP_fix_20251124_COMMAND.md — Extend JWT expiry

## Project Context Summary
Previous docs stated that JWTs expired after 1 hour while code set `JWT_EXPIRES_IN` to `'1month'`. We want long-lived tokens for testing.

## Steps Already Implemented
- Auth services and JWT utilities built in Phase 2.
- Existing fix steps up to 2025-11-23 documented in IMPLEMENTATION_INDEX.

## What to Build Now
- Change `JWT_EXPIRES_IN` constant in `src/constants/auth.ts` to `'100y'`.
- Ensure `src/utils/jwt.ts` still imports the constant.
- Update all docs mentioning 1h expiry (`AUTH.md`, journey guides).
- Add entries to `PHASE_2_SUMMARY.md`, `CHANGELOG.md`, and `IMPLEMENTATION_INDEX.md`.
- Provide this command file and step summary.

## Required Documentation Updates
- Changelog entry under Fixes.
- Implementation index row.
- Phase summary update.
