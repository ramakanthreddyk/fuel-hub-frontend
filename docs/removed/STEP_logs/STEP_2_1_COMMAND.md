# STEP\_2\_1\_COMMAND.md — Auth Service, JWT Middleware, Role Enforcement

## ✅ Project Context Summary

FuelSync Hub is a multi-tenant ERP platform for managing fuel stations. Each tenant (fuel company) has its own schema, and users are assigned roles like SuperAdmin, Owner, Manager, or Attendant. All backend logic is being built in **Phase 2**, following a completed database schema in Phase 1.

## 📌 Prior Steps Implemented

* Full public + tenant schema (`STEP_1_1` through `STEP_1_25`)
* Tables: `admin_users`, `tenants`, `users`, `stations`, `pumps`, `nozzles`, `sales`, `nozzle_readings`, etc.
* Seeded demo tenant, superadmin, and plan data

## 🚧 What to Build Now

Build the core authentication logic for the backend API:

### 1. Authentication Service

* `/api/auth/login` — accepts `{ email, password }`
* Validate against `admin_users` (public) or `users` (tenant schema, based on login domain/tenant header)
* Hash passwords using `bcrypt`
* On valid login, return JWT token (with user\_id, role, tenant\_id)

### 2. JWT Middleware

* `authenticateJWT` middleware to decode token and attach `req.user = { userId, role, tenantId }`
* Must reject expired or malformed tokens with `401 Unauthorized`

### 3. Role Enforcement Middleware

* `requireRole(['owner', 'manager'])` — generic middleware to check allowed roles
* `requireStationAccess` — validates if the user has access to the station via `user_stations` join

### 4. Auth Utilities

* `generateToken(payload)` — returns signed JWT
* `verifyToken(token)` — returns decoded or throws error

### 5. Shared Types & Constants

* Define enums/constants for role names and auth headers
* Add `src/types/auth.d.ts` and `src/constants/auth.ts`

## 📁 File Structure

Create or update the following files:

```
src/
├── middlewares/
│   ├── authenticateJWT.ts
│   ├── requireRole.ts
│   └── requireStationAccess.ts
├── routes/
│   └── auth.route.ts
├── services/
│   └── auth.service.ts
├── utils/
│   └── jwt.ts
├── constants/
│   └── auth.ts
├── types/
│   └── auth.d.ts
```

## 🧠 Why This Step

Authentication is foundational to all API access. Later services (stations, readings, credit, etc.) depend on identity and role enforcement.

## 🧾 Documentation To Update

* `CHANGELOG.md` (Feature: Auth system with JWT + middlewares)
* `PHASE_2_SUMMARY.md` (Mark Auth step done)
* `IMPLEMENTATION_INDEX.md` (Log STEP\_2\_1 with file links)
* `AUTH.md` (Create with explanation of login, token format, and middleware stack)

---

> Proceed only after this prompt file is saved and reviewed. Run all new endpoints using `ts-node-dev` or equivalent in local env.
