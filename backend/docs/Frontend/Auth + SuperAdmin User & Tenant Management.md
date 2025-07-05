🎯 Build the complete **authentication and user management flow** for FuelSync Hub.

---

## 🔐 AUTHENTICATION SYSTEM (JWT-Based)

Implement a full login system with token-based auth:
- 📄 `/login`: Form with `email`, `password`
- ✅ On success:
  - Save JWT token in `localStorage`
  - Decode JWT to extract user `role`
  - Redirect based on role:
    - `superadmin` → `/superadmin`
    - `owner` → `/dashboard`
    - `manager` → `/dashboard`
    - `attendant` → `/readings/new`
- 🔒 Protect all routes using:
  - `RequireAuth` wrapper
  - `RequireRole(['superadmin'])`, etc.
- 📤 Logout: Clear token and redirect to login
- Show error messages on failed login

Use this endpoint:
```http
POST /v1/auth/login
Body: { email, password }
Returns: { token }
👤 AUTH CONTEXT + ROUTE GUARDS
Create a global AuthContext to:

Store user, role, token

Provide login(), logout() methods

Automatically redirect unauthenticated users

Redirect if user tries to access another role's page

👑 SUPERADMIN PORTAL
Create a SuperAdmin Dashboard with:

🔧 Tenants Page (/superadmin/tenants)
List all tenants

Add new tenant (name, schema, planType)

Use API:

http
Copy
Edit
GET /v1/tenants
POST /v1/tenants
👥 Users Page (/superadmin/users)
List SuperAdmin users

Add new SuperAdmin user (email, password, role=superadmin)

Use API:

http
Copy
Edit
GET /v1/admin/users
POST /v1/admin/users
👔 OWNER USER MANAGEMENT (Multi-Station Setup)
Page: /dashboard/users

List users (owner, manager, attendant)

Add new user:

Select role: manager or attendant

Assign to station (dropdown populated from /v1/stations)

Use this API:

http
Copy
Edit
GET /v1/users
POST /v1/users
Headers: { x-tenant-id }
Body: { email, password, role }
🧭 NAVIGATION + ROUTING
Show sidebar/dashboard based on user role

Hide routes from other roles

Sidebar nav:

SuperAdmin: Tenants, Users

Owner: Dashboard, Stations, Pumps, Users, Readings

Manager: Dashboard, Readings, Reconciliation

Attendant: Readings only

✅ You can use Tailwind + shadcn/ui for layout
✅ All backend APIs are ready to integrate
✅ Use React Router for protected navigation