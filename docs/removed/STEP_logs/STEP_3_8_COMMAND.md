# STEP_3_8_COMMAND.md — Final QA Audit

## Project Context Summary
FuelSync Hub manages fuel station operations with a multi-tenant backend (Express + Prisma) and a React frontend using React Query. The canonical API contract lives in `fuelsync/docs/openapi.yaml`. Previous steps completed backend analytics endpoints, feature flag handling, and Prisma migration of services (fix 2025-12-07).

## Steps Already Implemented
- Backend API up to step 2.56 and subsequent fixes (`STEP_fix_20251207.md`).
- Frontend dashboard and contract cleanup (steps 3.5–3.7).

## What to Build Now
Perform a final full-stack QA audit:
1. Confirm every OpenAPI path has a matching backend route.
2. Ensure React Query hooks call the canonical endpoints and are used in pages.
3. Verify core flows (readings ➜ sales, reconciliation, inventory alerts, dashboard metrics, settings) work end-to-end.
4. Summarize findings in `QA_AUDIT_REPORT.md`.

## Required Documentation Updates
- Append entry in `fuelsync/docs/CHANGELOG.md`.
- Add row to `fuelsync/docs/IMPLEMENTATION_INDEX.md`.
- Update `fuelsync/docs/PHASE_3_SUMMARY.md` with Step 3.8.
