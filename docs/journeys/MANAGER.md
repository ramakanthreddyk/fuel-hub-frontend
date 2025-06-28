# MANAGER Role Journey

Managers operate within a tenant and usually handle day‑to‑day station activities. They log in using `/api/v1/auth/login` with the tenant header.

## JWT Contents
`{ userId, tenantId, role: 'manager' }`

## Key Endpoints
- Dashboard metrics: all `/api/v1/dashboard/*` routes
- Station / pump / nozzle CRUD
- Record nozzle readings and validate creation
- Manage fuel prices and deliveries
- Creditors and credit payments
- Reconciliation and sales listing
- Inventory checks and alerts
- View but not create tenant users (`GET /api/v1/users`, `GET /api/v1/users/{id}`)

Managers **cannot** update tenant settings or create additional users.

## Example Daily Flow
1. Login and view `GET /dashboard/sales-summary`.
2. Record readings via `POST /nozzle-readings`.
3. Submit deliveries or fuel price updates.
4. Generate daily summary with `GET /reconciliation/daily-summary`.
5. Review alerts.

## Errors
Same as OWNER plus forbidden (`403`) when attempting owner‑only actions such as creating users or updating settings.

