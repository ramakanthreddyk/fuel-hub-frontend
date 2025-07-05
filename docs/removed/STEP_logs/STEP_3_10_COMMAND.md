# STEP_3_10_COMMAND.md — Cash reports summary view

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations. Previous frontend steps added a Readings table (step 3.9). Attendants can submit cash reports and managers run reconciliations, but the cash reports list is very basic.

## Steps Already Implemented
- Backend reconciliation and attendant cash report endpoints up to step 2.56.
- Frontend dashboard pages with role guards (steps 3.5–3.9).

## What to Build Now, Where, and Why
Refactor the cash reports listing to display actionable information:
- Create `CashReportCard` and `CashReportTable` components in `src/components/reports/`.
- Update `src/pages/dashboard/CashReportsListPage.tsx` to fetch reports using role-based hooks (`useCashReports` for attendants, `useReconciliationHistory` for managers/owners`).
- Show station name, report date, cash received, sales total and discrepancy with a status badge. Managers can approve a report.
- Use card layout for attendants and table layout for managers/owners.

## Required Documentation Updates
- Record this step in `CHANGELOG.md`.
- Append a row to `fuelsync/docs/IMPLEMENTATION_INDEX.md`.
- Mark step done in `fuelsync/docs/PHASE_3_SUMMARY.md`.
