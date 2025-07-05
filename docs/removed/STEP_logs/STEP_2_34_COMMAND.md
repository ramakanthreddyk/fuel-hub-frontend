# STEP_2_34_COMMAND.md — OpenAPI Request Schema Detailing

## Project Context Summary
The backend OpenAPI specification (`docs/openapi.yaml`) lists all endpoints but many request and response bodies still use `type: object` without field definitions. Previous fixes imported schema components from the frontend spec, yet the paths were not wired to those components.

## Steps Already Implemented
- Generic schemas were replaced with detailed component definitions (STEP_fix_20250731.md).
- Reusable `Success` and `Error` components were added (STEP_2_33_COMMAND.md).

## What to Build Now
1. Reference detailed schemas for authentication and user routes.
2. Add new `CreateStationRequest` and `UpdateStationRequest` schemas.
3. Update station, login and user endpoints to use these schemas and remove unnecessary request bodies.
4. Document the change in `CHANGELOG.md`, `PHASE_2_SUMMARY.md` and append a row in `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add entry under Fixes in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Record this step in `IMPLEMENTATION_INDEX.md`.
