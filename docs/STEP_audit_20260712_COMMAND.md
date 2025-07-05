Project Context Summary: FuelSync Hub is a multi-tenant ERP with an Express + Prisma backend and a Vite React frontend. Previous step `STEP_fix_20260711_COMMAND.md` installed Jest and attempted API route tests.

Steps already implemented: See IMPLEMENTATION_INDEX for completed backend and frontend phases through July 11 2026. Testing infrastructure exists but DB connection fails.

Task: Perform backend–frontend sync audit. Map frontend API modules under `src/api` to backend routes defined in `docs/openapi-spec.yaml` and `backend/src/routes`. Identify missing integrations and mismatched fields. Create integration tests that parse the OpenAPI spec and hit each GET endpoint without path params. Document findings in `docs/FRONTEND_BACKEND_SYNC_AUDIT_20260712.md`.

Files to modify or create:
- `docs/FRONTEND_BACKEND_SYNC_AUDIT_20260712.md` (new)
- `backend/__tests__/integration/openapiRoutes.test.ts` (new)
- `CHANGELOG.md`
- `docs/backend/IMPLEMENTATION_INDEX.md`
- `backend/docs/IMPLEMENTATION_INDEX.md`
- `docs/backend/PHASE_3_SUMMARY.md`
- `docs/STEP_audit_20260712_COMMAND.md` (this file)

After coding, run `npm install` and `npm test` in `backend/`. Update docs with results.
