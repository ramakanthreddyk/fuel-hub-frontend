# STEP_2_21_COMMAND.md — CRUD Completion for Core Resources

## Project Context Summary
Phase 2 backend endpoints are mostly implemented through step 2.20. However the pump service lacks an update endpoint and the OpenAPI spec omits update/delete routes for several resources. To align the backend with the frontend UI and documentation we need full CRUD support for stations, pumps, nozzles and users.

## Steps Already Implemented
- CRUD and analytics endpoints up to `STEP_2_20` with recent fixes through `STEP_fix_20250715`.

## What to Build Now
- Add a pump update service, controller method and route.
- Register pump update route with authentication, tenant context and role checks.
- Document update/delete routes for pumps, nozzles and users in `docs/openapi.yaml`.
- Ensure station endpoints already expose update/delete.
- Update phase summary, changelog and implementation index.

## Files To Update
- `src/services/pump.service.ts`
- `src/controllers/pump.controller.ts`
- `src/routes/pump.route.ts`
- `docs/openapi.yaml`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/CHANGELOG.md`
