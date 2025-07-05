# AUTH.md — Authentication & Access Control Guide

This file defines the login flow, session management, and role-based access strategies used in FuelSync Hub.

---

## 🔐 Authentication Overview

* Users log in with email + password via `/api/auth/login`
* Successful login issues a **JWT token**, stored in **HttpOnly cookie**
* Token contains `user_id`, `tenant_id`, and `role`
* Route handled in `src/routes/auth.route.ts` which invokes `login()` service
* Super admins authenticate the same way but access endpoints under `/v1/admin`

---

## 🧪 Token Claims

```json
{
  "sub": "user-uuid",
  "tenant_id": "tenant123",
  "role": "manager",
  "iat": 1718880000,
  "exp": 1718966400
}
```

---

## 🧱 Middleware Chain

```ts
authenticateJWT()
  → requireRole("owner" | "manager" | ...)
  → checkStationAccess()
```

Middlewares live under `src/middlewares` (re-exported via `src/middleware/auth.middleware.ts`) and attach `req.user` after token verification.

---

## 🚫 Login Failures

* Return `401` for invalid credentials
* Use structured error response:

```json
{
  "status": "error",
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

## 🔓 Logout

* Call `/api/auth/logout` to clear the cookie

---

Login and logout routes exist under `/api/auth`. Tokens expire after **100 years** by default and rarely require renewal. The `/api/v1/auth/refresh` endpoint issues a new token valid for **24 hours** as defined by the `REFRESH_TOKEN_EXPIRES_IN` constant.

### Example Usage

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"secret"}'
# => { "token": "<jwt>" }

curl http://localhost:3000/api/stations \
  -H "Authorization: Bearer <jwt>"
```

The JWT token grants access to protected routes when supplied in the `Authorization` header.
