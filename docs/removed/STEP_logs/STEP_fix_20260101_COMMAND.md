# STEP_fix_20260101_COMMAND.md

## Project Context Summary
The frontend now surfaces pending nozzle-reading alerts but lacks actions to resolve them and real-time dashboard visibility. Alerts remain active even after a reading is recorded.

## Steps Already Implemented
- `usePendingReadings` hook displays pending alerts on the Readings page.
- Readings page highlights large reading deltas via tooltip.

## What to Build Now
- Extend `usePendingReadings` with acknowledge and dismiss mutations.
- Auto-acknowledge `no_readings_24h` alerts when a reading is saved (`useCreateReading`).
- Add acknowledge/dismiss buttons next to each pending alert on `ReadingsPage`.
- Show a real-time pending readings count badge on the dashboard header.

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
