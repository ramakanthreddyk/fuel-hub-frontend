---
title: backend_brain.md — FuelSync Backend Knowledge Base
lastUpdated: 2025-07-05
category: architecture
---

# backend_brain.md — FuelSync Backend Knowledge Base

This document tracks the current API surface and backend best practices. It is updated whenever endpoints change or the data layer is refactored.

## Active Endpoints

| Method | Path | Description |
|-------|------|-------------|
| POST | /api/v1/auth/login | User login |
| POST | /api/v1/auth/logout | Logout current user |
| POST | /api/v1/auth/refresh | Refresh JWT token |
| GET | /api/v1/auth/test | Auth route test |
| GET | /api/v1/users | List tenant users |
| GET | /api/v1/users/:userId | Get single user |
| POST | /api/v1/users | Create user |
| PUT | /api/v1/users/:userId | Update user |
| POST | /api/v1/users/:userId/change-password | Change password |
| POST | /api/v1/users/:userId/reset-password | Reset user password |
| DELETE | /api/v1/users/:userId | Remove user |
| GET | /api/v1/stations | List stations |
| POST | /api/v1/stations | Create station |
| GET | /api/v1/stations/compare | Station comparison metrics |
| GET | /api/v1/stations/ranking | Station ranking metrics |
| GET | /api/v1/stations/:stationId | Get station |
| PUT | /api/v1/stations/:stationId | Update station |
| DELETE | /api/v1/stations/:stationId | Delete station |
| GET | /api/v1/pumps | List pumps |
| POST | /api/v1/pumps | Create pump |
| GET | /api/v1/pumps/:id | Get pump |
| PUT | /api/v1/pumps/:id | Update pump |
| DELETE | /api/v1/pumps/:id | Delete pump |
| GET | /api/v1/nozzles | List nozzles |
| POST | /api/v1/nozzles | Create nozzle |
| GET | /api/v1/nozzles/:id | Get nozzle |
| PUT | /api/v1/nozzles/:id | Update nozzle |
| DELETE | /api/v1/nozzles/:id | Delete nozzle |
| POST | /api/v1/nozzle-readings | Record nozzle reading |
| GET | /api/v1/nozzle-readings | List nozzle readings |
| GET | /api/v1/fuel-prices | List fuel prices |
| POST | /api/v1/fuel-prices | Create fuel price |
| PUT | /api/v1/fuel-prices/:id | Update fuel price |
| DELETE | /api/v1/fuel-prices/:id | Delete fuel price |
| GET | /api/v1/creditors | List creditors |
| POST | /api/v1/creditors | Create creditor |
| PUT | /api/v1/creditors/:id | Update creditor |
| DELETE | /api/v1/creditors/:id | Delete creditor |
| POST | /api/v1/credit-payments | Record credit payment |
| GET | /api/v1/credit-payments | List credit payments |
| POST | /api/v1/fuel-deliveries | Record fuel delivery |
| GET | /api/v1/fuel-deliveries | List fuel deliveries |
| GET | /api/v1/reconciliation/:stationId | Get reconciliation summary |
| POST | /api/v1/reconciliation | Run daily reconciliation |
| GET | /api/v1/reconciliation | Reconciliation history |
| GET | /api/v1/reconciliation/daily-summary | Daily nozzle reading summary |
| POST | /api/v1/reconciliation/:id/approve | Approve reconciliation record |
| GET | /api/v1/sales | List sales records |
| GET | /api/v1/sales/analytics | Sales analytics |
| GET | /api/v1/settings | Get tenant settings |
| POST | /api/v1/settings | Update tenant settings |
| GET | /api/v1/fuel-inventory | View fuel inventory |
| GET | /api/v1/alerts | List alerts |
| PATCH | /api/v1/alerts/:id/read | Mark alert read |
| DELETE | /api/v1/alerts/:id | Delete alert |
| GET | /api/v1/tenants | List tenants |
| POST | /api/v1/tenants | Create tenant |
| GET | /api/v1/dashboard/sales-summary | Dashboard sales summary |
| GET | /api/v1/dashboard/payment-methods | Payment method breakdown |
| GET | /api/v1/dashboard/fuel-breakdown | Fuel type breakdown |
| GET | /api/v1/dashboard/top-creditors | Top creditors |
| GET | /api/v1/dashboard/sales-trend | Daily sales trend |
| GET | /api/v1/dashboard/system-health | System health metrics |
| GET | /api/v1/inventory | Current inventory metrics |
| POST | /api/v1/inventory/update | Update inventory counts |
| GET | /api/v1/inventory/alerts | Inventory alerts |
| GET | /api/v1/reports/sales/export | Export sales report |
| POST | /api/v1/reports/sales | Export sales via POST |
| GET | /api/v1/reports/sales | Get sales report |
| POST | /api/v1/reports/export | Export generic report |
| POST | /api/v1/reports/schedule | Schedule report |
| GET | /api/v1/reports/financial/export | Export financial report |
| GET | /api/v1/reconciliation | Reconciliation history |
| GET | /api/v1/analytics/dashboard | Super admin dashboard analytics |
| GET | /api/v1/analytics/superadmin | Alias to dashboard analytics |
| GET | /api/v1/analytics/tenant/:id | Tenant analytics summary |
| GET | /api/v1/analytics/station-comparison | Owner station comparison |
| GET | /api/v1/analytics/hourly-sales | Hourly sales metrics |
| GET | /api/v1/analytics/peak-hours | Peak sales hours |
| GET | /api/v1/analytics/fuel-performance | Fuel performance metrics |
| GET | /api/v1/attendant/stations | Attendant assigned stations |
| GET | /api/v1/attendant/pumps | Attendant assigned pumps |
| GET | /api/v1/attendant/nozzles | Attendant assigned nozzles |
| GET | /api/v1/attendant/creditors | Attendant creditors |
| POST | /api/v1/attendant/cash-report | Submit cash report with credit breakdown |
| GET | /api/v1/attendant/cash-reports | List cash reports |
| GET | /api/v1/attendant/alerts | List attendant alerts |
| PUT | /api/v1/attendant/alerts/:id/acknowledge | Acknowledge alert |

## Business Logic Notes

* All routes require JWT authentication except `/auth/login`.
* Multi-tenancy is enforced via `tenant_id` extracted from the JWT payload.
* Errors are returned with `errorResponse()` which now returns `{ success: false, message, details? }`.
* When using Prisma, always filter by `tenant_id` to avoid cross-tenant leakage.

## ORM Conventions

Prisma models mirror the unified public schema. Access the Prisma client via `src/utils/prisma.ts`. Controllers for users, stations, pumps, nozzles, nozzle readings and fuel prices now query through Prisma. Example usage:

```ts
const users = await prisma.user.findMany({ where: { tenant_id } });
```

## API Contract Drift

* `openapi.yaml` defines endpoints like `/admin/users` and `/admin/analytics` without the `/api/v1` prefix. The implementation mounts these under `/api/v1/admin/*`.
* Not all implemented endpoints are documented in `openapi.yaml` (e.g. `/fuel-inventory`, `/inventory/*`, `/alerts/:id/read`).


## Endpoint Migration Status

| Method | Path | Controller | Prisma |
| GET | /api/v1/admin/tenants/summary | adminTenant.controller.ts | no |
| GET | /api/v1/admin/tenants/ | adminTenant.controller.ts | no |
| POST | /api/v1/admin/tenants/ | adminTenant.controller.ts | no |
| PATCH | /api/v1/admin/tenants/:id/status | adminTenant.controller.ts | no |
| DELETE | /api/v1/admin/tenants/:id | adminTenant.controller.ts | no |
| POST | /api/v1/creditors/ | creditor.controller.ts | no |
| GET | /api/v1/creditors/ | creditor.controller.ts | no |
| PUT | /api/v1/creditors/:id | creditor.controller.ts | no |
| DELETE | /api/v1/creditors/:id | creditor.controller.ts | no |
| POST | /api/v1/fuel-prices/ | fuelPrice.controller.ts | yes |
| GET | /api/v1/fuel-prices/ | fuelPrice.controller.ts | yes |
| PUT | /api/v1/fuel-prices/:id | fuelPrice.controller.ts | yes |
| DELETE | /api/v1/fuel-prices/:id | fuelPrice.controller.ts | yes |
| POST | /api/v1/nozzles/ | nozzle.controller.ts | yes |
| GET | /api/v1/nozzles/ | nozzle.controller.ts | yes |
| GET | /api/v1/nozzles/:id | nozzle.controller.ts | yes |
| PUT | /api/v1/nozzles/:id | nozzle.controller.ts | yes |
| DELETE | /api/v1/nozzles/:id | nozzle.controller.ts | yes |
| GET | /api/v1/sales/ | sales.controller.ts | no |
| GET | /api/v1/sales/analytics | sales.controller.ts | no |
| POST | /api/v1/nozzle-readings/ | nozzleReading.controller.ts | yes |
| GET | /api/v1/nozzle-readings/ | nozzleReading.controller.ts | yes |
| POST | /api/v1/admin/users/ | adminUser.controller.ts | no |
| GET | /api/v1/admin/users/ | adminUser.controller.ts | no |
| GET | /api/v1/analytics/dashboard | analytics.controller.ts | no |
| GET | /api/v1/analytics/superadmin | analytics.controller.ts | no |
| GET | /api/v1/analytics/tenant/:id | analytics.controller.ts | no |
| GET | /api/v1/analytics/station-comparison | analytics.controller.ts | no |
| GET | /api/v1/reports/sales/export | reports.controller.ts | no |
| POST | /api/v1/reports/sales | reports.controller.ts | no |
| GET | /api/v1/reports/sales | reports.controller.ts | no |
| POST | /api/v1/reports/export | reports.controller.ts | no |
| POST | /api/v1/reports/schedule | reports.controller.ts | no |
| GET | /api/v1/reports/financial/export | reports.controller.ts | no |
| GET | /api/v1/alerts/ | alerts.controller.ts | no |
| PATCH | /api/v1/alerts/:id/read | alerts.controller.ts | no |
| POST | /api/v1/stations/ | station.controller.ts | yes |
| GET | /api/v1/stations/ | station.controller.ts | yes |
| GET | /api/v1/stations/compare | station.controller.ts | yes |
| GET | /api/v1/stations/ranking | station.controller.ts | yes |
| GET | /api/v1/stations/:stationId | station.controller.ts | yes |
| GET | /api/v1/stations/:stationId/metrics | station.controller.ts | yes |
| GET | /api/v1/stations/:stationId/performance | station.controller.ts | yes |
| GET | /api/v1/stations/:stationId/efficiency | station.controller.ts | yes |
| PUT | /api/v1/stations/:stationId | station.controller.ts | yes |
| DELETE | /api/v1/stations/:stationId | station.controller.ts | yes |
| GET | /api/v1/inventory/ | inventory.controller.ts | no |
| POST | /api/v1/inventory/update | inventory.controller.ts | no |
| GET | /api/v1/inventory/alerts | inventory.controller.ts | no |
| POST | /api/v1/reconciliation/ | reconciliation.controller.ts | no |
| GET | /api/v1/reconciliation | reconciliation.controller.ts | no |
| GET | /api/v1/reconciliation/daily-summary | reconciliation.controller.ts | no |
| GET | /api/v1/reconciliation/:stationId | reconciliation.controller.ts | no |
| GET | /api/v1/dashboard/sales-summary | dashboard.controller.ts | no |
| GET | /api/v1/dashboard/payment-methods | dashboard.controller.ts | no |
| GET | /api/v1/dashboard/fuel-breakdown | dashboard.controller.ts | no |
| GET | /api/v1/dashboard/top-creditors | dashboard.controller.ts | no |
| GET | /api/v1/dashboard/sales-trend | dashboard.controller.ts | no |
| GET | /api/v1/fuel-inventory/ | fuelInventory.controller.ts | no |
| GET | /api/v1/users/ | user.controller.ts | yes |
| GET | /api/v1/users/:userId | user.controller.ts | yes |
| POST | /api/v1/users/ | user.controller.ts | yes |
| PUT | /api/v1/users/:userId | user.controller.ts | yes |
| POST | /api/v1/users/:userId/change-password | user.controller.ts | yes |
| POST | /api/v1/users/:userId/reset-password | user.controller.ts | yes |
| DELETE | /api/v1/users/:userId | user.controller.ts | yes |
| GET | /api/v1/admin/analytics/ | adminAnalytics.controller.ts | no |
| POST | /api/v1/pumps/ | pump.controller.ts | yes |
| GET | /api/v1/pumps/ | pump.controller.ts | yes |
| GET | /api/v1/pumps/:id | pump.controller.ts | yes |
| PUT | /api/v1/pumps/:id | pump.controller.ts | yes |
| DELETE | /api/v1/pumps/:id | pump.controller.ts | yes |
| GET | /api/docs/swagger.json | docs.controller.ts | no |
| GET | /api/v1/settings/ | settings.controller.ts | no |
| POST | /api/v1/settings/ | settings.controller.ts | no |
| GET | /api/v1/admin/dashboard | adminApi.router.ts | no |
| POST | /api/v1/admin/tenants | adminApi.router.ts | no |
| GET | /api/v1/admin/tenants | adminApi.router.ts | no |
| GET | /api/v1/admin/tenants/:id | adminApi.router.ts | no |
| PATCH | /api/v1/admin/tenants/:id/status | adminApi.router.ts | no |
| DELETE | /api/v1/admin/tenants/:id | adminApi.router.ts | no |
| POST | /api/v1/admin/plans | adminApi.router.ts | no |
| GET | /api/v1/admin/plans | adminApi.router.ts | no |
| GET | /api/v1/admin/plans/:id | adminApi.router.ts | no |
| PUT | /api/v1/admin/plans/:id | adminApi.router.ts | no |
| DELETE | /api/v1/admin/plans/:id | adminApi.router.ts | no |
| POST | /api/v1/admin/users | adminApi.router.ts | no |
| GET | /api/v1/admin/users | adminApi.router.ts | no |
| GET | /api/v1/admin/users/:id | adminApi.router.ts | no |
| PUT | /api/v1/admin/users/:id | adminApi.router.ts | no |
| DELETE | /api/v1/admin/users/:id | adminApi.router.ts | no |
| POST | /api/v1/admin/users/:id/reset-password | adminApi.router.ts | no |
| GET | /api/v1/tenants/ | tenant.controller.ts | no |
| POST | /api/v1/tenants/ | tenant.controller.ts | no |
| POST | /api/v1/fuel-deliveries/ | delivery.controller.ts | no |
| GET | /api/v1/fuel-deliveries/ | delivery.controller.ts | no |
| GET | /api/v1/fuel-deliveries/inventory | delivery.controller.ts | no |
| POST | /api/v1/credit-payments/ | creditPayment.controller.ts | no |
| GET | /api/v1/credit-payments/ | creditPayment.controller.ts | no |
| POST | /api/v1/auth/login | auth.controller.ts | no |
| POST | /api/v1/auth/logout | auth.controller.ts | no |
| POST | /api/v1/auth/refresh | auth.controller.ts | no |
| GET | /api/v1/auth/test | auth.controller.ts | no |
| GET | /test | app.ts | n/a |
| POST | /test | app.ts | n/a |
| POST | /test-login | app.ts | n/a |
| GET | /health | app.ts | n/a |
| GET | /schemas | app.ts | n/a |

### OpenAPI Audit 2025-07-24
All routes defined in the Express app and route modules were parsed and compared to `docs/openapi.yaml`. The list matched exactly (97 paths). Test utilities `/test`, `/test-login`, `/health`, and `/schemas` remain documented. The spec currently only lists endpoints without request/response schemas, so there are no detected shape mismatches. Future improvements should flesh out those schemas for accurate contract validation.

### OpenAPI Contract Drift 2025-07-25
The old spec contained 41 endpoint definitions while the refreshed spec now lists 67.
New additions include admin management (`/api/v1/admin/*`), analytics dashboards, inventory APIs and utility endpoints such as `/health` and `/schemas`.

Endpoint gaps identified:

| Endpoint | In Old Spec | In New Spec | Implemented |
|----------|-------------|-------------|-------------|
| `/api/v1/admin/dashboard` | ❌ | ✅ | ✅ |
| `/api/v1/admin/plans` | ❌ | ✅ | ✅ |
| `/api/v1/admin/plans/{id}` | ❌ | ✅ | ✅ |
| `/api/v1/admin/users/{id}` | ❌ | ✅ | ✅ |
| `/api/v1/admin/users/{id}/reset-password` | ❌ | ✅ | ✅ |
| `/api/v1/admin/tenants/{id}` | ❌ | ✅ | ✅ |
| `/api/v1/admin/tenants/{id}/status` | ❌ | ✅ | ✅ |
| `/api/v1/analytics/dashboard` | ❌ | ✅ | ✅ |
| `/api/v1/analytics/superadmin` | ❌ | ✅ | ✅ |
| `/api/v1/analytics/tenant/{id}` | ❌ | ✅ | ✅ |
| `/api/v1/fuel-deliveries/inventory` | ❌ | ✅ | ✅ |
| `/api/v1/fuel-inventory` | ❌ | ✅ | ✅ |
| `/api/v1/inventory` | ❌ | ✅ | ✅ |
| `/api/v1/inventory/alerts` | ❌ | ✅ | ✅ |
| `/api/v1/inventory/update` | ❌ | ✅ | ✅ |
| `/api/v1/reports/financial/export` | ❌ | ✅ | ✅ |
| `/api/v1/reports/sales/export` | ❌ | ✅ | ✅ |
| `/api/v1/settings` | ❌ | ✅ | ✅ |
| `/api/v1/stations/compare` | ❌ | ✅ | ✅ |
| `/api/v1/stations/ranking` | ❌ | ✅ | ✅ |

The utility endpoints `/test`, `/test-login`, `/health` and `/schemas` live outside the `/api/v1` prefix in code. The spec treats them as versioned (`/api/v1/health` etc.), which is a minor drift but does not impact the frontend.

No implemented routes were found missing from the new spec aside from the unused `/api/v1/admin` root which has no handler.


### OpenAPI Spec Update 2025-07-26
The spec now defines request bodies and success/error responses for every endpoint. A new `ErrorResponse` schema describes `{status:"error", message}`. Admin paths were normalised to the `/api/v1/` prefix. Implementation still returns `{success:false}` on errors, so this mismatch is recorded as contract drift until refactored.

## Best Practices for Contract Evolution

- **OpenAPI as Source of Truth:** The spec in `docs/openapi.yaml` defines the canonical API. Whenever any endpoint is added or changed, update this file first.
- **Keep backend_brain.md in Sync:** After modifying the spec or code, update the endpoint table above with the exact method and path. Document request and response shapes or examples as they evolve.
- **Run `node merge-api-docs.js`:** Execute the comparison script to detect endpoints missing from either document. Resolve discrepancies before merging a pull request.
- **Define Schemas for Every Operation:** Each path in the spec must include `requestBody` and `responses` schemas. Use the shared `ErrorResponse` component for failures.
- **Consistent Versioning:** Maintain versioned routes (`/api/v1`) until a breaking change justifies `/api/v2`. Document deprecations and offer a transition period.
- **Deprecation Notices:** Mark outdated endpoints with a clear note in this file and in the spec. Avoid removing routes until the frontend has migrated.
- **PR Contract Checklist:** Pull requests should include a checkbox confirming OpenAPI and documentation updates. Run the merge script in CI to prevent drift.
- **Incremental, Reviewed Changes:** Prefer small, well-described API updates. Review contract changes regularly to ensure frontend, backend, and AI assistants remain aligned.

### Workflow
1. Edit the code and update `docs/openapi.yaml` for any API change.
2. Update the endpoint table and relevant notes in `backend_brain.md`.
3. Run `node merge-api-docs.js` to check for drift.
4. Address any missing or extra endpoints reported by the script.
5. Commit code and docs together so the spec and knowledge base never diverge.
\n### 2025-11-03 Response Wrapper Update\n- Pump listing now includes `nozzleCount` using Prisma \_count.\n- Successful responses are wrapped in `{ success: true, data, message? }`.
\n### 2025-11-19 Fuel Price Response Enhancement\n- `GET /api/v1/fuel-prices` now includes a `station` object `{ id, name }` for each price entry.
