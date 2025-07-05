# STEP_3_13_COMMAND.md — Full-stack code & docs alignment audit

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations with a Node backend under `fuelsync/` and a React frontend under `src/`. Steps up to **3.12** delivered role based dashboards and an API matrix. Some discrepancies remain between backend routes, frontend hooks and the documentation.

## Steps Already Implemented
- Complete set of REST endpoints exists under `fuelsync/src/routes`
- React Query hooks implemented for stations, pumps, nozzles, inventory and analytics
- Previous QA audit (`STEP_3_8`) and role matrix (`STEP_3_12`) verified high level alignment

## What to Build Now, Where, and Why
- Perform a route-by-route check comparing `fuelsync/src/routes` with services in `src/api` and hooks in `src/hooks`
- Record the mapping in `docs/API_IMPLEMENTATION_AUDIT_20251224.md` with columns: Endpoint → Implementation status → Used in page → Hook used → Context used → Doc status
- Update `fuelsync/docs/IMPLEMENTATION_INDEX.md` with step **3.13**
- Document the step in `fuelsync/docs/PHASE_3_SUMMARY.md`
- Add changelog entries for transparency

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- New file: `docs/API_IMPLEMENTATION_AUDIT_20251224.md`
