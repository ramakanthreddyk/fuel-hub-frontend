# STEP_2_37_COMMAND.md — Attendant Access & Cash Reports

## Project Context Summary
Attendants currently cannot fetch stations, pumps or nozzles because those listing endpoints are restricted to owners and managers. Creditors are also hidden, preventing credit sales. Daily cash and credit totals are not recorded separately from sales.

## Steps Already Implemented
Backend phase up to `STEP_fix_20250922.md` with unified schema and reconciliation fixes.

## What to Build Now
- Expose new attendant API to list assigned stations, pumps and nozzles using `user_stations` mapping.
- Allow attendants to list creditors.
- Create table `cash_reports` for attendants to submit daily cash and credit totals.
- Add POST endpoint for attendants to create a cash report.
- Document new routes in OpenAPI and update changelog, phase summary and implementation index.

## Files To Update
- `migrations/schema/007_create_cash_reports.sql` (new)
- `src/services/attendant.service.ts` (new)
- `src/controllers/attendant.controller.ts` (new)
- `src/routes/attendant.route.ts` (new)
- `src/app.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
