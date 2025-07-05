# STEP_fix_20260716_COMMAND.md — Cash report submission path

Project Context Summary:
FuelSync Hub is a multi-tenant SaaS ERP for fuel stations. Recent fixes up to `STEP_fix_20260715_COMMAND.md` covered frontend hook updates. Attendant cash report submissions are failing because the frontend service posts to `/attendant/cash-reports` while the backend expects `/attendant/cash-report` as per the OpenAPI spec.

Steps already implemented: All backend and frontend features up to `STEP_fix_20260715_COMMAND.md` with documentation updates.

Task: Align the contract-based API client with the backend route. Update `src/api/contract/attendant.service.ts` so `createCashReport` sends POST requests to `/attendant/cash-report`. Document this fix.

Required documentation updates: `CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
