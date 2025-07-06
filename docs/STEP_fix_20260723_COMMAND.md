# STEP_fix_20260723_COMMAND.md — Attendant pages use role APIs

Project Context Summary:
The frontend uses generic hooks like `useStations`, `usePumps` and `useCreditors` that call owner/manager routes. Attendant users hit 403 errors when loading dashboard or cash report pages because these routes require higher roles. Hooks for attendant specific APIs already exist in `src/hooks/api/useAttendant.ts` but are unused.

Steps already implemented:
- Attendant role routes exist in backend and contract services.
- Previous fix 2026-07-22 cleaned docs.

Task:
Update attendant-facing pages (`AttendantDashboardPage.tsx`, `CashReportPage.tsx`, `CashReportsListPage.tsx`, `NewReadingPage.tsx`) to fetch stations, pumps, nozzles and creditors via attendant hooks when the logged in user role is `attendant`. Keep existing behaviour for owners/managers.
Add brief entry to `CHANGELOG.md`, `docs/backend/CHANGELOG.md` and update `docs/backend/PHASE_3_SUMMARY.md`.

Required documentation updates: CHANGELOG.md, docs/backend/CHANGELOG.md, docs/backend/PHASE_3_SUMMARY.md, docs/backend/IMPLEMENTATION_INDEX.md.
