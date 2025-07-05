# STEP_2_43_COMMAND.md — Price validation on nozzle readings

## Project Context Summary
FuelSync Hub automatically converts nozzle readings to sales amounts. Prices are looked up at the reading timestamp. Currently, a missing price silently results in zero sale amount and there is no age check on the price. Credit sales only block when the limit is fully exceeded.

## Steps Already Implemented
Backend implementation is complete through **Step 2.42** which introduced automated alert rules.

## What to Build Now
- Update `src/utils/priceUtils.ts` so `getPriceAtTimestamp` returns `{ price, validFrom }` or `null`.
- In `src/services/nozzleReading.service.ts`:
  - Throw an error if `getPriceAtTimestamp` returns `null`.
  - Reject readings when the price record is older than seven days.
  - Warn when a creditor balance after the sale exceeds 90% of the credit limit.
- Adjust `tests/sales.service.test.ts` for the new return value.
- Update changelog, phase summary and implementation index.

## Required Documentation Updates
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
