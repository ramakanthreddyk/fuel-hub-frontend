# STEP_fix_20251125_COMMAND.md — Refresh token expiry constant

## Project Context Summary
Refresh tokens in `auth.controller.ts` were signed using a hard coded secret and expiry. We want a dedicated constant like `JWT_EXPIRES_IN` for better consistency and documentation.

## Steps Already Implemented
- Authentication controller and services built in Phase 2.
- Fix 2025-11-24 extended `JWT_EXPIRES_IN` to `100y`.

## What to Build Now
- Add `REFRESH_TOKEN_EXPIRES_IN` constant (`'24h'`) in `src/constants/auth.ts`.
- Use `JWT_SECRET` and the new constant when signing tokens in the refresh endpoint.
- Document refresh token lifetime in `docs/AUTH.md`.
- Update changelog, implementation index and phase summary.
- Provide this command file and the summary file `STEP_fix_20251125.md`.

## Required Documentation Updates
- Changelog entry under Fixes.
- Implementation index row.
- Phase summary addition.
