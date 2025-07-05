# STEP\_2\_9\_COMMAND.md — Auth, Roles, JWT and Access Control

## ✅ Project Context Summary

FuelSync Hub supports multi‑role authentication and authorization across tenants and the platform. This step implements secure login and access control across **all** APIs.

---

## 📌 Prior Steps Implemented

* ✅ `STEP_2_8`: Reconciliation logic and APIs
* ✅ All prior domain features (sales, readings, deliveries, creditors, pricing)

---

## 🚧 What to Build Now

### 1. JWT Auth Flow

* **`POST /api/auth/login`**

  * **Input:** `email`, `password`
  * **Output:** signed JWT token containing `role`, `user_id`, and `tenant_id`

### 2. Middleware

* `authenticateJWT` – Parse token, attach user context (`req.user`)
* `requireRole(roles: string[])` – Check if current user role is allowed
* `checkStationAccess` – Verify user → station mapping via `user_stations`

### 3. SuperAdmin Auth

* Use separate route prefix `/v1/admin/*`
* Validate credentials against the `public.admin_users` table

### 4. Secure All Routes

Ensure every route from **Steps 2.1 → 2.8** is wrapped with:

```ts
authenticateJWT → requireRole([...]) → controller
```

---

## 📁 File Paths

```
src/
├── middleware/auth.middleware.ts
├── services/auth.service.ts
├── routes/auth.route.ts
├── controllers/auth.controller.ts
```

---

## 🧠 Why This Step

Prevents unauthorized data access, enforces RBAC, and maintains tenant data isolation across the API layer.

---

## 🧾 Docs To Update

| File                      | Update Description                                 |
| ------------------------- | -------------------------------------------------- |
| `CHANGELOG.md`            | **Feature** – login, JWT issuance, RBAC middleware |
| `PHASE_2_SUMMARY.md`      | Add auth module summary                            |
| `IMPLEMENTATION_INDEX.md` | Add **STEP\_2\_9** with links                      |
| `AUTH.md`                 | Full auth strategy, token format, examples         |
| `BUSINESS_RULES.md`       | Access control logic & role matrix                 |

> Save this file, then begin implementation and update all referenced docs to mark this step complete.
