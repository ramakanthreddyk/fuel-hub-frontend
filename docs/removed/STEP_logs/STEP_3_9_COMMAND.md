# STEP_3_9_COMMAND.md — Readings Page Table

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations. Previous frontend steps implemented dashboards and cleanup (steps 3.5–3.8) with API contract alignment. The readings page currently lists data in an unstructured card layout and lacks key details like station, price and delta volume.

## Steps Already Implemented
- Backend endpoints up to step 2.57 and fixes through 2025-12-09.
- Frontend QA audit completed in step 3.8.

## What to Build Now
Refactor `src/pages/dashboard/ReadingsPage.tsx` to present nozzle readings in a clear table:
- Display nozzle label, station, formatted date/time, cumulative reading, delta volume, unit price and total amount.
- Create a reusable `ReadingsTable` component under `src/components/readings/`.
- Confirm data fetched via `useReadings` which calls `/api/v1/nozzle-readings` through React Query.

## Required Documentation Updates
- Add changelog entry for Step 3.9.
- Append row to `IMPLEMENTATION_INDEX.md`.
- Document the step in `PHASE_3_SUMMARY.md`.
