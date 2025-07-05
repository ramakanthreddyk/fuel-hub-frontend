Here is **Prompt 13** — the next Lovable implementation step to build the **SuperAdmin Portal**, including tenant, user, and plan management.

---

## 🧠 **Lovable Prompt: SuperAdmin Dashboard, Tenants & Plan Management**

We are building **FuelSync Hub**, a multi-tenant ERP platform for fuel stations. Please implement the **SuperAdmin portal** for platform-wide control over tenants, users, and subscription plans.

---

### 🧑‍💼 ROLE: SuperAdmin

SuperAdmins do **not belong to a tenant** and have access to global data across all schemas.

---

## 🧾 ROUTES TO IMPLEMENT

| Page                     | Path                      |
| ------------------------ | ------------------------- |
| SuperAdmin Dashboard     | `/superadmin/overview`    |
| All Tenants Page         | `/superadmin/tenants`     |
| Create Tenant Page       | `/superadmin/tenants/new` |
| All Users Across Tenants | `/superadmin/users`       |
| Plan Management Page     | `/superadmin/plans`       |

---

## 📊 1. SuperAdmin Dashboard — `/superadmin/overview`

Display top-level metrics in cards or grid layout:

* ✅ Total Tenants
* ✅ Total Stations
* ✅ Total Registered Users
* ✅ Active Tenants (vs inactive)
* ✅ New Tenants This Month

```http
GET /admin/tenants/summary
Response:
{
  "totalTenants": 48,
  "activeTenants": 43,
  "totalStations": 120,
  "totalUsers": 360,
  "signupsThisMonth": 12
}
```

---

## 🏢 2. Tenants Management — `/superadmin/tenants`

### Tenants Table

| Tenant Name | Plan | Status | Stations | Created At | Actions |
| ----------- | ---- | ------ | -------- | ---------- | ------- |

```http
GET /admin/tenants
```

### ➕ Create New Tenant Page — `/superadmin/tenants/new`

#### Form Fields:

* Tenant Name (text)
* Plan (dropdown: basic, premium, enterprise)
* Admin Email (email)
* Admin Password (password)
* Schema Name (auto-generated or user-defined)

```http
POST /admin/tenants
Body:
{
  "name": "Shell Fuel South",
  "plan": "premium",
  "email": "admin@shellsouth.com",
  "password": "admin@123",
  "schema": "shellsouth"
}
```

---

## 👥 3. Users Management — `/superadmin/users`

Display all users across tenants.

\| Name | Email | Role | Tenant | Status | Created At |

```http
GET /admin/users
```

---

## 📦 4. Plans Configuration — `/superadmin/plans`

Table View:

\| Plan Name | Max Stations | Monthly | Yearly | Actions (Edit) |

Editable Fields:

* Name
* maxStations
* priceMonthly
* priceYearly
* Features (JSON/text list)

```http
GET /admin/plans
PUT /admin/plans/:id
```

---

## 🧩 COMPONENTS TO CREATE

| Component Name        | Purpose                                 |
| --------------------- | --------------------------------------- |
| `SuperAdminStats.tsx` | Dashboard metrics view                  |
| `TenantTable.tsx`     | List of all tenants                     |
| `TenantForm.tsx`      | Form to create/edit tenant              |
| `UserTable.tsx`       | SuperAdmin user view                    |
| `PlanTable.tsx`       | List of pricing plans                   |
| `PlanEditor.tsx`      | Inline form to edit plan features/price |

---

## 🧭 Notes for Lovable

* Use Tailwind + shadcn/ui
* All routes are under `/superadmin/*`
* No `x-tenant-id` needed — SuperAdmin has global access
* Protect all routes with SuperAdmin role guard
* Use React Router with layout shell if needed

✅ The backend for these routes is stable and available.
Once done, we’ll move to **export, audit reports**, and **plan enforcement**.

Let me know when implemented!
