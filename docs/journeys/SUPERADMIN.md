# SUPERADMIN Role Journey

This document traces every API endpoint and data flow available to a **SUPERADMIN** in FuelSync Hub. It is derived from `docs/openapi.yaml` and the Express routes under `src/routes`. Any behaviour not documented here is a TODO for the dev team.

## Assumptions
- JWT payload follows `AuthPayload` interface: `{ userId, tenantId?, role }`.
- SUPERADMIN users exist in `public.admin_users` table.
- Success responses use `{ data: ... }`, errors use `{ success: false, message }`.
- Tenant schemas are isolated; SUPERADMIN operations occur in the `public` schema only.

## Login Flow
### `POST /api/v1/admin/auth/login`
**Body**
```json
{ "email": "admin@example.com", "password": "Secret123" }
```
**Success Response** `200`
```json
{
  "data": {
    "token": "<jwt>",
    "user": { "id": "uuid", "name": "admin", "email": "admin@example.com", "role": "superadmin" }
  }
}
```
**JWT Claims**
```json
{ "userId": "uuid", "role": "superadmin", "tenantId": null }
```
**DB Tables Queried**: `public.admin_users` (verify email/password)

## Permissions
All subsequent endpoints require `Authorization: Bearer <jwt>` header and `requireRole([superadmin])` middleware.

## Endpoint Groups
### 1. Dashboard & Analytics
| Method | URL | Description | DB Tables |
| --- | --- | --- | --- |
| GET | `/api/v1/admin/dashboard` | Platform metrics (tenants, plans, admin users) | `public.tenants`, `public.plans`, `public.admin_users` |
| GET | `/api/v1/admin/analytics` | Aggregate sales / station stats across tenants | `public.sales`, `public.stations`, `public.tenants` |
| GET | `/api/v1/analytics/superadmin` | Same as above (alias) | same |
| GET | `/api/v1/analytics/tenant/{id}` | Metrics for a specific tenant | tenant schema tables |

### 2. Tenant Management
| Method | URL | Notes | DB Writes |
| --- | --- | --- | --- |
| GET | `/api/v1/tenants` | List tenants | `public.tenants` |
| POST | `/api/v1/tenants` | Create tenant with default users | `public.tenants`, `public.users` |
| GET | `/api/v1/admin/tenants` | Detailed tenant list | `public.tenants` |
| GET | `/api/v1/admin/tenants/summary` | Count metrics | `public.tenants` |
| GET | `/api/v1/admin/tenants/{id}` | Full tenant hierarchy | `public.tenants`, `public.users`, `public.stations` ... |
| PATCH | `/api/v1/admin/tenants/{id}/status` | Update status (`active|suspended|cancelled`) | `public.tenants` |
| DELETE | `/api/v1/admin/tenants/{id}` | Soft delete tenant | `public.tenants` |

### 3. Subscription Plans
| Method | URL | DB |
| --- | --- | --- |
| POST | `/api/v1/admin/plans` | Insert into `public.plans` |
| GET | `/api/v1/admin/plans` | Read `public.plans` |
| GET | `/api/v1/admin/plans/{id}` | Read single plan | 
| PUT | `/api/v1/admin/plans/{id}` | Update plan | 
| DELETE | `/api/v1/admin/plans/{id}` | Delete plan (fails if in use) |

### 4. Admin Users
| Method | URL | Notes |
| --- | --- | --- |
| POST | `/api/v1/admin/users` | Create another superadmin | 
| GET | `/api/v1/admin/users` | List admin users |
| GET | `/api/v1/admin/users/{id}` | Get admin user |
| PUT | `/api/v1/admin/users/{id}` | Update fields |
| DELETE | `/api/v1/admin/users/{id}` | Cannot delete last admin | 
| POST | `/api/v1/admin/users/{id}/reset-password` | Reset password |

## Sample Flow – Provision Tenant
1. **Login** as SUPERADMIN and obtain JWT.
2. **POST `/api/v1/tenants`** with `{ name, planId }` to create tenant and owner user. Tables affected: `public.tenants`, `public.users` (owner/manager/attendant created automatically).
3. **GET `/api/v1/admin/tenants/{id}`** to fetch full hierarchy.
4. **PATCH `/api/v1/admin/tenants/{id}/status`** if you need to suspend or activate tenant.
5. **GET `/api/v1/admin/dashboard`** to verify counts.

## Error Cases
- `401` Missing or invalid JWT.
- `403` Role not `superadmin`.
- `404` Tenant or plan not found.
- `409` Attempt to delete plan in use.
- `422` Validation errors (e.g., invalid status). Format:
```json
{ "success": false, "message": "Reason" }
```

## Audit & Logs
- Critical actions insert rows in `public.admin_activity_logs` (TODO confirm – not in code).
- `updated_at` triggers fire on all main tables.

## Edge Cases & TODOs
- Behaviour when tenant creation fails mid-way is not fully documented. Transaction should rollback, but verify.
- JWT expiry (`1h`) may require refresh via `/api/v1/auth/refresh` (not admin specific).
- Unknown if multiple owners per tenant are allowed via admin APIs – currently createTenant auto-generates one owner.

## Future-Proofing Tips
- Keep this doc in sync with `docs/openapi.yaml` whenever routes change.
- Add contract tests ensuring each role cannot access other role endpoints.
- If new admin features are added, document DB tables and JWT claims here first.

