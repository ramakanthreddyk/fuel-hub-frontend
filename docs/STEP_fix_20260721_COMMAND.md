# STEP_fix_20260721_COMMAND.md — Pumps page all pumps default

Project Context Summary:
FuelSync Hub's sidebar includes an **All Pumps** link pointing to `/dashboard/pumps`. The page currently returns an empty state asking to select a station. `usePumps` already loads all pumps when no stationId is provided (see `STEP_fix_20260715_COMMAND.md`), so the UI should list all pumps instead of blocking the user.

Steps already implemented:
- `src/hooks/api/usePumps.ts` fetches all pumps when `stationId` is undefined.
- `src/pages/dashboard/PumpsPage.tsx` displays pump cards and create/delete dialogs.

Task: Update `src/pages/dashboard/PumpsPage.tsx` to remove the early return for missing stationId, add an "All Stations" option to the dropdown and handle `stationId` changes so an empty value navigates to `/dashboard/pumps`. This will show all pumps by default.

Required documentation updates: `CHANGELOG.md`, `docs/backend/CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
