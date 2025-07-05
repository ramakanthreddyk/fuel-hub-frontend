# STEP_2_35_COMMAND.md — Response Wrapper & Endpoint Alignment

## Project Context Summary
FuelSync Hub's backend and OpenAPI spec were recently aligned with explicit request schemas and reusable response components. However some endpoints still return bare objects and arrays, and the error response structure in the spec differs from the `errorResponse` utility used in code. Several query parameters are also undocumented.

## Steps Already Implemented
- Request schema references and shared Success/Error responses (STEP_2_33_COMMAND.md, STEP_2_34_COMMAND.md).

## What to Build Now
1. Standardise all success responses to `{ data: ... }` and error responses to `{ success: false, message }` across code and OpenAPI.
2. Update the OpenAPI spec so every endpoint uses this wrapper and remove any direct object or array schemas.
3. Document missing query parameters for pump and nozzle listing, nozzle reading queries and any other affected endpoints.
4. Ensure `/api/v1/pumps/{id}`, `/api/v1/nozzles/{id}`, `/api/v1/reports/sales`, `/api/v1/reports/export`, `/api/v1/reports/schedule`, `/api/v1/reconciliation`, and analytics endpoints explicitly list their parameters and return wrapped data.
5. Update test/utility routes in `src/app.ts` to use `successResponse`.
6. Modify the `Error` response component in OpenAPI to match `errorResponse`.
7. Record changes in `CHANGELOG.md`, mark this step done in `PHASE_2_SUMMARY.md`, and add a row in `IMPLEMENTATION_INDEX.md`.

## Files To Update
- `src/app.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add entry under Enhancements in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append to `IMPLEMENTATION_INDEX.md`.
