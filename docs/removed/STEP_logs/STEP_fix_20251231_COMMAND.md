# STEP_fix_20251231_COMMAND.md

## Project Context Summary
The Readings page lists nozzle readings but does not surface alerts for missing readings. Recent QA suggested adding visibility for pending readings and highlighting large discrepancies between consecutive readings.

## Steps Already Implemented
- Alerts API and hook infrastructure exist (`useAlerts` and `alertsService`).
- Readings page statistics show counts by status but pending alerts are hidden.

## What to Build Now
- Create `usePendingReadings` hook calling `alertsService.getAlerts` with type `no_readings_24h`.
- Display a pending readings card on `ReadingsPage` listing affected nozzles.
- Color delta differences red when greater than 20% of previous reading and show a tooltip explaining the anomaly.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `docs/DOCUMENTATION_MAP.md`
