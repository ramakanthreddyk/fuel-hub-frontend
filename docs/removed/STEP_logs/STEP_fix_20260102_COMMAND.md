# STEP_fix_20260102_COMMAND.md

## Project Context Summary
Owners encountered 403 errors on the dashboard because `useAnalyticsDashboard` always hit the superadmin analytics endpoint. The Fuel Inventory page also crashed when inventory values were missing.

## Steps Already Implemented
- `useAnalyticsDashboard` fetches `/analytics/superadmin` unconditionally.
- Inventory table directly formats numbers with `toLocaleString()`.

## What to Build Now
- Add an `enabled` flag to analytics hooks so they only run for superadmins.
- Update `DashboardPage` to use these hooks conditionally.
- Guard fuel inventory numbers with default `0` values.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
