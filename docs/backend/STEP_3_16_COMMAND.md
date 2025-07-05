# STEP_3_16_COMMAND.md

## Project Context
FuelSync Hub is a multi-tenant ERP for fuel stations. Phase 3 focuses on the frontend dashboard for owners and managers. Previous steps added analytics API endpoints and standalone comparison/ranking pages but the main analytics page still showed placeholder content.

## Prior Steps Implemented
- `StationComparisonPage.tsx` and `StationRankingPage.tsx` (Step 3.14)
- Analytics hooks and components in `src/components/analytics/*`

## Task
Integrate the existing analytics components into `src/pages/dashboard/AnalyticsPage.tsx` so owners/managers can view station comparison charts, advanced metrics, and performance ranking. Include station selectors and ranking period filter. Provide a refresh button that invalidates cached analytics queries.

## Documentation Updates
- Add Step 3.16 entry in `PHASE_3_SUMMARY.md`
- Update `CHANGELOG.md` and `docs/backend/CHANGELOG.md`
- Record the step in `IMPLEMENTATION_INDEX.md`
