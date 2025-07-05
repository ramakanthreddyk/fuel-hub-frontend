Build a Next.js 14 + React 18 frontend skeleton for **FuelSync Hub**, a multi-tenant ERP system for fuel station management.

---

🛠 STACK:

* Next.js 14 (App Router)
* React 18 + TypeScript
* React Query
* Material UI
* JWT-based role auth (SuperAdmin, Owner, Manager, Attendant)

---

🖼️ LANDING PAGE — `/`

Create a beautiful public homepage for FuelSync Hub with:

* Hero section: “Run Your Fuel Station Smartly”
* Tagline: “Multi-tenant ERP for fuel distribution and retail automation”
* CTA buttons: “Login” | “Request Demo”
* Visual: Gas station illustration / dashboard mockup / fuel meter

Use a simple full-width layout with a light/dark toggle.

---

📂 FOLDER STRUCTURE:

```
/app
  /page.tsx                → Landing page
  /login/page.tsx          → Login form (POST to /v1/auth/login)
  /dashboard/page.tsx      → Role-based redirect (e.g., /stations, /superadmin/tenants)
  /superadmin/tenants
  /superadmin/users
  /stations
  /pumps
  /nozzles
  /fuel-prices
  /readings/new
  /creditors
  /creditors/[id]/payments
  /fuel-deliveries
  /reconciliation

/contexts
  AuthContext.tsx          → stores user info, token, role

/shared
  /components
    Layout.tsx             → Authenticated layout with Sidebar, Header
    Sidebar.tsx
    Header.tsx
  /hooks
    useAuth.ts
  /lib
    api.ts                 → Axios wrapper with auth headers
    auth.ts                → Login, logout, token helpers
```

---

🔐 LOGIN FLOW

* Login via `/login` page
* Send credentials to `/v1/auth/login`
* On success:

  * Save JWT token
  * Save user info (role, name, tenant)
  * Redirect to `/dashboard`

---

🧭 DASHBOARD ROUTING

After login, redirect user based on role:

| Role       | Redirect to           |
| ---------- | --------------------- |
| superadmin | `/superadmin/tenants` |
| owner      | `/stations`           |
| manager    | `/stations`           |
| attendant  | `/readings/new`       |

---

🔒 AUTH GUARD

Wrap all routes (except `/`, `/login`) in an `AuthContext` + `RequireAuth` wrapper. If unauthenticated, redirect to `/login`.

---

🧠 UX / UI Suggestions

* Use `material-ui`'s responsive drawer layout
* Keep Sidebar on left with icons:

  * 📂 Stations
  * ⛽ Pumps / Nozzles
  * 📊 Readings
  * 💸 Creditors
  * 🧾 Reconciliation
* TopBar with user dropdown (Logout)
* Show tenant name + plan badge in header (e.g., "Reddy Fuels — Enterprise")

---

✅ BACKEND READY

All backend APIs are fully documented in OpenAPI 3.0 format and hosted under `/api`.

API base path: `/api/v1/...`
Auth is via JWT Bearer token.

---

🌟 GOAL

This prompt is ONLY for setting up the full **UI skeleton** with:

* Routing
* Layouts
* Auth scaffolding
* Landing + login page

Feature pages will be added one by one later.
