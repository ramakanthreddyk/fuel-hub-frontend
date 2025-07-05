# STEP_fix_20251223_COMMAND.md

## Project Context Summary
The Owner dashboard currently displays empty metrics because the backend's `/dashboard/sales-summary` response uses field names like `totalSales` and `transactionCount`. The frontend and API contract expect `totalRevenue`, `salesCount`, and related camelCase fields. The OpenAPI YAML also lists the old names, causing further mismatch.

## Steps Already Implemented
- Fixes up to `STEP_fix_20251222.md` have aligned various dashboard pages and CRUD flows.
- `SalesSummaryCard` and related hooks expect `SalesSummary` fields as defined in `api-contract.ts`.

## What to Build Now
- Update `fuelsync/src/controllers/dashboard.controller.ts` so `getSalesSummary` returns keys `totalRevenue`, `totalVolume`, `salesCount`, `totalProfit`, `profitMargin`, and `period`.
- Update OpenAPI specs (`docs/openapi-spec.yaml`, `fuelsync/docs/openapi.yaml`, `fuelsync/frontend/docs/openapi-v1.yaml`) to define `SalesSummary` with these fields.
- Ensure all other pages already referencing `totalRevenue` continue to work.
- Add changelog entry and update implementation index and phase summary.

## Required Documentation Updates
- `fuelsync/docs/CHANGELOG.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `fuelsync/docs/PHASE_2_SUMMARY.md`
