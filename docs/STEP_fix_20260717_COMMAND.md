# STEP_fix_20260717_COMMAND.md — Report generation endpoint

Project Context Summary:
FuelSync Hub's frontend uses `reportsService.generateReport` to create reports. The service posts to `/reports/sales`, but the backend exposes a generic `/reports/export` endpoint that expects a payload with `type`, `format`, `stationId` and `dateRange` fields. The mismatch causes report generation to fail.

Steps already implemented: All fixes through `STEP_fix_20260716_COMMAND.md` including cash report path correction.

Task: Update `reportsService.generateReport` to call `/reports/export` with the correct payload and return the response as a blob. Modify `useGenerateReport` hook to open the returned file and invalidate cached reports. Document the fix.

Required documentation updates: `CHANGELOG.md`, `docs/backend/CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
