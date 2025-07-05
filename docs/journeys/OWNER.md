---
title: OWNER Role Journey
lastUpdated: 2025-07-05
category: journeys
---

# OWNER Role Journey

Comprehensive guide for the **OWNER** role. Owners manage one or more stations within a tenant. All endpoints require a valid JWT from `/api/v1/auth/login` with `x-tenant-id` header.

## Login Flow
### `POST /api/v1/auth/login`
Headers: `x-tenant-id: <tenantId>`
Body:
```json
{ "email": "owner@example.com", "password": "Secret123" }
```
Response contains JWT with claims `{ userId, tenantId, role: 'owner' }`.

## Endpoint Groups
### Dashboard & Analytics
- `GET /api/v1/dashboard/sales-summary`
- `GET /api/v1/dashboard/payment-methods`
- `GET /api/v1/dashboard/fuel-breakdown`
- `GET /api/v1/dashboard/top-creditors`
- `GET /api/v1/dashboard/sales-trend`
- `GET /api/v1/analytics/dashboard`
- `GET /api/v1/analytics/station-comparison`
- `GET /api/v1/analytics/hourly-sales`
- `GET /api/v1/analytics/peak-hours`
- `GET /api/v1/analytics/fuel-performance`

### Station Hierarchy
- `POST /api/v1/stations`
- `GET /api/v1/stations`
- `GET /api/v1/stations/compare`
- `GET /api/v1/stations/ranking`
- `GET /api/v1/stations/{stationId}`
- `GET /api/v1/stations/{stationId}/metrics`
- `GET /api/v1/stations/{stationId}/performance`
- `PUT /api/v1/stations/{stationId}`
- `DELETE /api/v1/stations/{stationId}`
- Similar CRUD for `/pumps` and `/nozzles`

### Operations
- Record nozzle readings: `POST /api/v1/nozzle-readings`
- Validate reading: `GET /api/v1/nozzle-readings/can-create/{nozzleId}`
- Manage fuel prices: `POST/GET/PUT/DELETE /api/v1/fuel-prices`
- Fuel deliveries: `POST/GET /api/v1/fuel-deliveries`
- Creditors & payments: CRUD `/api/v1/creditors` and `/api/v1/credit-payments`
- Reconciliation reports: `POST/GET /api/v1/reconciliation`
- Sales listing & analytics: `GET /api/v1/sales`, `GET /api/v1/sales/analytics`
- Inventory levels: `GET/POST /api/v1/inventory`
- Inventory alerts: `GET /api/v1/inventory/alerts`
- Update inventory counts: `POST /api/v1/inventory/update`
- Alerts feed: `GET /api/v1/alerts`
- Fuel inventory view: `GET /api/v1/fuel-inventory`

### User & Settings
- Manage users within tenant: `/api/v1/users`
- Update settings: `POST /api/v1/settings`
- Export reports: `/api/v1/reports/*`

## Database Touch Points
Owners operate within their tenant schema (`<tenant_id>`). Common tables:
- `users`, `stations`, `pumps`, `nozzles`
- `nozzle_readings`, `sales`, `fuel_prices`
- `deliveries`, `creditors`, `credit_payments`
- `reconciliations`, `fuel_inventory`, `alerts`

## Sample Flow – Daily Operations
1. Owner logs in and fetches dashboard metrics.
2. Adds a new station via `POST /stations` if under plan limits.
3. Creates pumps for the station via `POST /pumps`.
4. Adds nozzles to pumps via `POST /nozzles`.
5. Sets fuel prices via `POST /fuel-prices`.
6. Records daily nozzle readings for each nozzle.
7. Generates reconciliation summary with `GET /reconciliation/daily-summary`.
8. Reviews alerts with `GET /alerts` and inventory with `GET /inventory`.

## Error Handling
- `403` if JWT role not owner.
- `401` invalid token.
- `400` validation errors (e.g. missing required fields).
- `409` plan limit violations when creating stations/pumps/nozzles.

## Edge Notes
- Some endpoints like analytics may require additional query params (`stationId`, `dateFrom`, `dateTo`).
- Ensure `x-tenant-id` header always matches the tenant in JWT to avoid `TENANT_REQUIRED` errors.
- JWTs expire in 1h; use `/api/v1/auth/refresh` to renew.

