# STEP_fix_20250919_COMMAND.md

## Project Context Summary
The TypeScript build is failing in `parseRows` because the generic type lacks a constraint.

## Steps Already Implemented
See `IMPLEMENTATION_INDEX.md` through `STEP_fix_20250918.md`.

## What to Build Now
- Constrain `parseRows` with `extends Record<string, any>`.
- Rebuild to confirm compilation succeeds.
- Update documentation: changelog, implementation index, phase summary.

## Required Documentation Updates
- Append fix entry to `CHANGELOG.md`.
- Mark fix done in `PHASE_2_SUMMARY.md`.
- Add row to `IMPLEMENTATION_INDEX.md`.
