# STEP_fix_20251114_COMMAND.md

## Project Context Summary
Pump endpoints in `docs/openapi.yaml` mistakenly reference `CreateTenantRequest`. The correct schema `CreatePumpRequest` already exists but isn't used.

## Steps Already Implemented
* Previous steps up to `STEP_2_51_COMMAND.md` updated pump and nozzle documentation.

## What to Build Now
- Replace `CreateTenantRequest` with `CreatePumpRequest` for POST `/api/v1/pumps` and PUT `/api/v1/pumps/{id}`.
- Ensure `CreatePumpRequest` requires `stationId`, `name`, and `serialNumber`.
- Update docs and summaries.

## Required Documentation Updates
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- Create `docs/STEP_fix_20251114.md`
