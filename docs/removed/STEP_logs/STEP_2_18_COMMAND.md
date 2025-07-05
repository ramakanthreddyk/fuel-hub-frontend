# STEP_2_18_COMMAND.md — Tenants API and Summary

## 🧠 Project Context
Backend Phase 2 includes all major domain APIs but lacks tenant management endpoints. Frontend docs reference `/admin/tenants/summary` and `/v1/tenants`, which currently return 404.

## 📌 Prior Steps Implemented
See `IMPLEMENTATION_INDEX.md` up to step 2.17 and the latest fix steps (Azure cleanup).

## 🚧 What to Build Now
- Add service, controller and routers for tenants.
  - `GET /v1/tenants` – list all tenants (SuperAdmin only).
  - `POST /v1/tenants` – create tenant (name, schema, plan, optional owner user).
  - `GET /v1/admin/tenants/summary` – return total tenant, station and user counts.
- Mount tenant router in `app.ts` and extend `adminApi.router` with admin tenant routes.
- Create input validator.
- Document new endpoints in `docs/openapi.yaml`.
- Update `CHANGELOG.md`, `PHASE_2_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.

## 📁 Files To Update
- `src/services/tenant.service.ts` (new)
- `src/controllers/tenant.controller.ts` (new)
- `src/routes/tenant.route.ts` (new)
- `src/routes/adminTenant.route.ts` (new)
- `src/routes/adminApi.router.ts`
- `src/app.ts`
- `src/validators/tenant.validator.ts` (new)
- `docs/openapi.yaml`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/CHANGELOG.md`
