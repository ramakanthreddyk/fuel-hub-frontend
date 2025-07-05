# STEP\_2\_2\_COMMAND.md — User Management for SuperAdmin and Tenants

## ✅ Project Context Summary

FuelSync Hub is a multi-tenant ERP for fuel stations. After setting up the core authentication and JWT middleware in `STEP_2_1`, we now implement user creation and listing APIs for both platform (SuperAdmin) and tenant users.

## 📌 Prior Steps Implemented

* ✅ `STEP_2_1`: Auth Service, JWT Middleware, Role Enforcement
* Database includes `admin_users` (public) and `users` (tenant), with roles like owner, manager, attendant

## 🚧 What to Build Now

### 1. SuperAdmin User Management (Platform)

* Endpoint: `POST /api/admin-users`

  * Create platform-level admins in `public.admin_users`
  * Use bcrypt for password hashing
* Endpoint: `GET /api/admin-users`

  * List platform admins
  * Protected by SuperAdmin JWT token

### 2. Tenant User Management

* Endpoint: `POST /api/users`

  * Must extract tenant schema from JWT or header
  * Allowed roles: `owner`, `manager`, `attendant`
  * Enforce role limit via plan (e.g. `maxEmployees`)
  * Map station access in `user_stations`
* Endpoint: `GET /api/users`

  * List all users for a tenant
  * Restricted to role: owner or manager

### 3. Validation Rules

* Email must be unique per schema
* Password: min 6 characters
* Role must be one of allowed enum

## 📁 File Structure

Create or update the following:

```
src/
├── controllers/
│   ├── adminUser.controller.ts
│   └── user.controller.ts
├── routes/
│   ├── adminUser.route.ts
│   └── user.route.ts
├── services/
│   ├── adminUser.service.ts
│   └── user.service.ts
├── validators/
│   └── user.validator.ts
```

## 🧠 Why This Step

User creation is foundational for SuperAdmin onboarding and tenant-side staff management. It supports platform scaling and multi-role access setup.

## 🧾 Documentation To Update

* `CHANGELOG.md` (Feature: SuperAdmin + Tenant user management)
* `PHASE_2_SUMMARY.md` (Mark user management step complete)
* `IMPLEMENTATION_INDEX.md` (Log STEP\_2\_2 with file links)
* `ROLES.md` (Add user role matrix and descriptions)

---

> Once this file is saved, proceed with implementation only in the paths defined here and update docs accordingly.
