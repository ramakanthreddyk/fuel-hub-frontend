# ROLES.md — Role Definitions & Permissions

This file documents the roles available in FuelSync Hub and what each role can access or perform.

---

## 🔐 Role Matrix

| Role       | Access Level                                                         |
| ---------- | -------------------------------------------------------------------- |
| SuperAdmin | Global access to all tenants, plans, logs, seeds                     |
| Owner      | Access to own org, full station config, staff, sales, reports        |
| Manager    | Can view station, manage attendants, enter readings, view dashboards |
| Attendant  | Can enter readings & payment info, limited to assigned station only  |

---

### Role Descriptions

* **SuperAdmin** – Manages all tenants, plans and global settings.
* **Owner** – Full control over a single tenant including stations and staff.
* **Manager** – Oversees daily operations and attendants for assigned stations.
* **Attendant** – Restricted to entering readings and payments for their station.

---

## 🧱 Backend Guards

Use middleware:

```ts
requireRole('owner')
```

Then:

* Check tenant context
* Confirm station association (via `user_stations`)

---

## 📋 Use Cases by Role

| Feature              | SuperAdmin | Owner | Manager | Attendant |
| -------------------- | ---------- | ----- | ------- | --------- |
| View Sales           | ✅          | ✅     | ✅       | ❌         |
| Create Reading       | ❌          | ✅     | ✅       | ✅         |
| Add Creditor Payment | ❌          | ✅     | ✅       | ❌         |
| Create New Station   | ❌          | ✅     | ❌       | ❌         |
| Seed Tenants         | ✅          | ❌     | ❌       | ❌         |

---

> Roles are embedded in JWT and must be evaluated at every critical endpoint or UI route.
