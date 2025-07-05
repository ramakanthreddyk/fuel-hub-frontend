# STEP_fix_20251102_COMMAND.md

## Project Context Summary
The API specification defines schemas for fuel deliveries and inventory. Recent fixes aligned table definitions but the OpenAPI docs still list `deliveredBy` and restrict `fuelType` to `[petrol, diesel]`. `FuelInventory` also lacks a `capacity` field.

## Steps Already Implemented
- Unified schema migrations include `capacity` on `fuel_inventory` and allow `premium` as a fuel type.
- Previous fix `STEP_fix_20251101.md` added timestamps to fuel inventory records.

## What to Build Now
Update the OpenAPI YAML files and swagger snippets so that:
- `FuelInventory` includes a `capacity` property and uses `fuelType` enum `[petrol, diesel, premium]`.
- `CreateFuelDeliveryRequest` and `FuelDelivery` rename `deliveredBy` to `supplier` and use the extended `fuelType` enum.
Make sure `src/docs/swagger.ts` mirrors these changes.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- Create `docs/STEP_fix_20251102.md`
