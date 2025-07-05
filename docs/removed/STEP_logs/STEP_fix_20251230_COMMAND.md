# STEP_fix_20251230_COMMAND.md

## Project Context Summary
FuelSync Hub uses Radix UI dialogs. Console warnings indicated `DialogContent` components were missing `DialogTitle` and descriptions. Accessibility requires these elements. The command palette also needs a hidden title when not visible.

## Steps Already Implemented
Previous fix `STEP_fix_20251229.md` aligned API contracts.

## What to Build Now
- Install `@radix-ui/react-visually-hidden`.
- Add hidden title and description to `CommandDialog`.
- Provide descriptions for `AlertBadge` and `TopCreditorsTable` dialogs.
- Update documentation and implementation index.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
