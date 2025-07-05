# STEP_3_5_COMMAND.md — Validate and bind dashboard page actions

## Project Context Summary
FuelSync Hub uses React Router based pages under `src/pages/` with role-based access. Some action buttons lack navigation handlers or reference routes that do not yet exist.

## Steps Already Implemented
- Stations and pumps CRUD with React Query hooks
- Reporting APIs and `useExportSalesReport` hook
- Dashboard pages for stations, pumps and sales

## What to Build Now, Where, and Why
- Wire "Settings" and "Add Pump" actions in `StationDetailPage.tsx`.
- Create `EditStationPage.tsx` as a stub and register route `stations/:stationId/edit` in `App.tsx`.
- Add back navigation button to `FuelInventoryPage.tsx`.
- Enable sales export in `SalesPage.tsx` via `useExportSalesReport`.

## Required Documentation Updates
- Mark this step done in `PHASE_3_SUMMARY.md`.
- Record the change in `CHANGELOG.md`.
- Add a row to `IMPLEMENTATION_INDEX.md`.
