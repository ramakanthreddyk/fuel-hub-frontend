# STEP_2_39_COMMAND.md — Fuel price validation endpoints

## Project Context Summary
Fuel price records exist per station and fuel type but there is currently no way to validate if each station has active prices for all available fuel types. Owners and managers need to detect stations missing prices or using outdated price entries.

## Steps Already Implemented
Backend phase completed through **Step 2.38** which added attendant cash report and alert endpoints.

## What to Build Now
- Create a new service module `fuelPriceValidation.service.ts` with functions to check missing fuel types and outdated prices for a station and to list stations missing active prices.
- Expose two API routes under `fuelPrice.route.ts`:
  - `GET /validate/:stationId` to validate a station's prices.
  - `GET /missing` to list all stations without active prices.
- Document request and response schemas in `docs/openapi.yaml`.
- Update changelog, phase summary and implementation index.

## Files To Update
- `src/services/fuelPriceValidation.service.ts` (new)
- `src/controllers/fuelPrice.controller.ts`
- `src/routes/fuelPrice.route.ts`
- `docs/openapi.yaml`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`

## Required Documentation Updates
- Add feature entry in `CHANGELOG.md`.
- Mark step done in `PHASE_2_SUMMARY.md`.
- Append row in `IMPLEMENTATION_INDEX.md`.
