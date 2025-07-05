# STEP_2_38_COMMAND.md — Attendant cash reports & alerts

## Project Context Summary
The attendant role currently supports listing assigned resources and submitting a cash report. However attendants cannot view their previous cash reports or acknowledge station alerts. The alerts module is only exposed to managers and owners. We need additional routes so attendants can view their own cash reports and manage alerts.

## Steps Already Implemented
Backend phase up to **Step 2.37** which added attendant access endpoints and the `cash_reports` table.

## What to Build Now
- Add GET `/cash-reports` route in `attendant.route.ts` mapped to a new controller method.
- Add GET `/alerts` and PUT `/alerts/:id/acknowledge` for attendants.
- Implement handlers in `attendant.controller.ts` that call service functions.
- Implement database queries in `attendant.service.ts` to list cash reports and alerts and to acknowledge an alert.
- Update `docs/openapi.yaml` and `backend_brain.md` with the new paths.
- Document the change in `CHANGELOG.md`, mark the step done in `PHASE_2_SUMMARY.md` and append to `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `src/routes/attendant.route.ts`
- `src/controllers/attendant.controller.ts`
- `src/services/attendant.service.ts`
- `docs/openapi.yaml`
- `backend_brain.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
- Update endpoint table in `backend_brain.md`.
