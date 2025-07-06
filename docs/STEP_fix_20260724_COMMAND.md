# STEP_fix_20260724_COMMAND.md — Clarify attendant role access

## Project Context Summary
The frontend still issues requests to `/nozzle-readings` and `/fuel-prices` when an attendant is logged in. These endpoints are owner/manager only, resulting in `403` errors. Attendant specific routes exist but there is no listing API for readings or prices. The journey docs are outdated (last updated 2025-07-05) and miss these details.

## Steps already implemented
- Attendant endpoints for stations, pumps, nozzles, creditors and cash reports (`docs/journeys/ATTENDANT.md`).
- Fix 2026-07-23 changed frontend pages to use attendant hooks for hierarchy data.

## What to build now
Update `docs/journeys/ATTENDANT.md` to clearly list the available endpoints and explicitly state that attendants cannot fetch `/fuel-prices` or list `/nozzle-readings`. Note the stubbed attendance/shifts APIs. This documents why 403 errors occur when generic hooks are used.

## Required documentation updates
- `docs/journeys/ATTENDANT.md` (updated)
- `CHANGELOG.md` entry under Fix 2026-07-24
- `backend/docs/IMPLEMENTATION_INDEX.md` new row
# STEP_fix_20260724_COMMAND.md — Mobile sidebar toggle fix

Project Context Summary:
The mobile dashboard layout shows a hamburger button in the header but clicking it does not open the sidebar. The sidebar component maintains its own state internally, so the header button is disconnected.

Steps already implemented:
- Attendant pages were updated to use role APIs (STEP_fix_20260723_COMMAND.md).
- Previous fixes include pumps page default listing and fuel price service tests.

Task:
Allow the header hamburger button to toggle the mobile sidebar by hoisting the sidebar open state to `DashboardLayout`. Pass `open` and `onOpenChange` props to `Sidebar`, and add an `onMobileMenuClick` callback prop to `Header` which opens the sidebar. Remove the unused local state in `Header`.
Update CHANGELOG.md, docs/FRONTEND_CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, backend/docs/IMPLEMENTATION_INDEX.md and docs/backend/PHASE_3_SUMMARY.md.

Required documentation updates: CHANGELOG.md, docs/FRONTEND_CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, backend/docs/IMPLEMENTATION_INDEX.md, docs/backend/PHASE_3_SUMMARY.md.
