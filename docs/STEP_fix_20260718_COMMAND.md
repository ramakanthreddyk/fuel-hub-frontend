# STEP_fix_20260718_COMMAND.md — Install missing packages

Project Context Summary:
Running `npm test` and `npm run lint` failed because the development packages `ts-node` and `@eslint/js` were missing from the installed dependencies. This prevented backend tests from starting and ESLint from loading its configuration.

Steps already implemented: All fixes through `STEP_fix_20260717_COMMAND.md` including the report generation endpoint fix.

Task: Add `ts-node` to the root `package.json` and reinstall dependencies. Install packages in both the root and `backend` folders with `--legacy-peer-deps`. Attempt `npm run lint` and `npm test` again to verify the packages load. Document this fix.

Required documentation updates: `CHANGELOG.md`, `docs/backend/CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
