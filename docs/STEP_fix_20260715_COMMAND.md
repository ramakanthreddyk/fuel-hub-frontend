Project Context Summary: Recent sales table shows "Unknown Station" and missing nozzle and fuel info because `/api/v1/sales` only returned basic fields.
Steps already implemented: Up to STEP_fix_20260714_COMMAND.md including test DB fallback docs.
Task: Extend `listSales` query to join stations, pumps and nozzles so results include station_name, pump_name, nozzle_number, fuel_type and fuel_price. Update `salesApi` mapping accordingly. Document in changelogs, implementation index and phase summary.
Required documentation updates: CHANGELOG.md, docs/backend/CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, docs/backend/PHASE_3_SUMMARY.md.
Project Context Summary: The readings page lacks nozzle numbers and shows "RECORDED BY: UNKNOWN" because the backend endpoint `/v1/nozzle-readings` only returns basic fields. Previous fix 2026-07-14 documented test DB setup fallback. 
Steps already implemented: Implementation index is up to 2026-07-14 with backend/frontend sync and shared API types.
Task: Attach created readings to sales via `reading_id`, extend `listNozzleReadings` query to join pumps, stations and users so that each reading includes `nozzleNumber`, `pumpName`, `stationName` and `recordedBy` fields. Update frontend `ReadingReceiptCard` to display these values. Update CHANGELOG.md, backend/docs/CHANGELOG.md, backend/docs/IMPLEMENTATION_INDEX.md and backend/docs/PHASE_3_SUMMARY.md.
Required documentation updates: CHANGELOG.md, backend/docs/CHANGELOG.md, backend/docs/IMPLEMENTATION_INDEX.md, backend/docs/PHASE_3_SUMMARY.md.
Project Context Summary: The PumpsPage uses `usePumps()` to fetch pump data. When opening "/dashboard/pumps" from the sidebar, no stationId is provided. The existing hook disables the query when stationId is undefined, so the page shows no pumps. Previous steps up to STEP_fix_20260714_COMMAND.md covered integration tests and documentation updates.

Steps already implemented: All backend and frontend integration up to STEP_fix_20260714_COMMAND.md. Pump listing UI already exists in `src/pages/dashboard/PumpsPage.tsx`.

Task: Modify `src/hooks/api/usePumps.ts` so that the pumps query runs even when no station is selected. Use a stable query key for the "all pumps" case and remove the `enabled` condition. Update docs to log this fix.

Required documentation updates: `CHANGELOG.md`, `backend/docs/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
