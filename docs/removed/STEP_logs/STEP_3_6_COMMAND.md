# STEP_3_6_COMMAND.md — Add pump and nozzle settings stubs

## Project Context Summary
Frontend pages for pump management lacked a real settings screen. Backend API did not expose settings endpoints for pumps or nozzles.

## Steps Already Implemented
- Basic CRUD for pumps and nozzles
- Station actions wired in previous step 3.5

## What to Build Now, Where, and Why
- Create `PumpSettingsPage.tsx` to allow future settings editing
- Wire route `pumps/:pumpId/settings` and link from PumpsPage
- Stub backend endpoints `/pumps/{id}/settings` and `/nozzles/{id}/settings`
- Document new endpoints in `openapi.yaml`

## Required Documentation Updates
- Mark step done in `PHASE_3_SUMMARY.md`
- Record in `CHANGELOG.md`
- Add row to `IMPLEMENTATION_INDEX.md`
