# STEP_fix_20251227_COMMAND.md

## Project Context Summary
FuelSync Hub handles automatic sales generation when attendants record nozzle readings. A recent audit found several inconsistencies across the DB, backend services and OpenAPI contract.

## Steps Already Implemented
- Backend phase completed up to `STEP_fix_20251223.md` which aligned dashboard metrics and numeric formatting.

## What to Build Now
- Persist `payment_method` when creating nozzle readings and ensure validator defaults it.
- Include `missingPrice` flag in `canCreateNozzleReading` responses.
- Round sale volume to three decimals.
- Use a single pg client in `createNozzleReading` including price lookup.
- Support a `limit` query param for listing readings so the latest reading can be fetched efficiently.
- Align OpenAPI docs, especially status code `201` for POST `/nozzle-readings` and the new `limit` parameter.
- Update related controller logic and tests.

## Required Documentation Updates
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_2_SUMMARY.md`
