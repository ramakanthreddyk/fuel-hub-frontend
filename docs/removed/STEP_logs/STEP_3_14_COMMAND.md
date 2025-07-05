# STEP_3_14_COMMAND.md — Implement missing API integrations

## Project Context Summary
The previous audit in step 3.13 identified several backend endpoints that lacked
frontend hooks or pages. These include station comparison & ranking, generic
report export, and inventory updates. Existing hooks covered most APIs but were
unused in pages.

## Steps Already Implemented
- Full API audit documented in `docs/API_IMPLEMENTATION_AUDIT_20251224.md`
- React Query hooks for stations, pumps, inventory and analytics
- Dashboard pages for reports, inventory and analytics

## What to Build Now, Where, and Why
- Create pages using existing hooks:
  - `StationComparisonPage.tsx` and `StationRankingPage.tsx`
  - `ReportExportPage.tsx` for `/reports/export`
  - `UpdateInventoryPage.tsx` for `/inventory/update`
- Add missing `updateInventory` service and hook.
- Wire routes in `src/App.tsx` so the pages are accessible.
- Update the audit document marking endpoints as used.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- `docs/API_IMPLEMENTATION_AUDIT_20251224.md`
