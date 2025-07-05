Great question — let me walk you through **the master plan** and how everything connects in your **FuelSync Hub** frontend app powered by React + Vite (via Lovable):

---

## 🧠 MASTER PLAN: Connecting the App Structure

We're using a **modular, role-based, and route-driven design** that maps every part of the UI directly to the backend capabilities and business flows. Here's the full structure:

---

### 🧱 1. **App Layout Foundation**

Each page is wrapped in:

* `AppShell`: Main container with sidebar + topbar
* `AuthContext`: Stores current user, role, and tenant info
* `RouteGuard`: Ensures correct role-based access (SuperAdmin, Owner, Manager, Attendant)

**Shared Folders:**

* `components/ui`: Shared design system (buttons, inputs, modals)
* `hooks/`: Custom React Query hooks (`useUsers`, `useStations`, `useSales`)
* `contexts/AuthProvider.tsx`: Logged-in user context
* `lib/api.ts`: Axios + token + `x-tenant-id` wrapper

---

### 🗺️ 2. **Route-Based Pages (React Router)**

#### 🔐 Public (No Auth):

* `/` → Landing Page
* `/login` → Role-based login (Admin, Owner, Attendant)

#### 🛠️ SuperAdmin Portal

* `/superadmin/overview` → Global metrics
* `/superadmin/tenants`, `/users`, `/plans` → Full control

#### 🧑‍💼 Owner Dashboard

* `/dashboard` → Daily station overview
* `/dashboard/stations` → CRUD for stations
* `/dashboard/pumps`, `/dashboard/nozzles` → Hierarchical views
* `/dashboard/readings/new` → Nozzle reading form → Auto-create sale
* `/dashboard/sales` → Sale history
* `/dashboard/creditors`, `/creditors/:id/payments` → Credit system
* `/dashboard/fuel-prices` → Manage fuel price per type/station
* `/dashboard/reconciliation` → Daily reconciliation vs cash received

---

### 🔁 3. **Data Flow**

* 🔑 Login → `/auth/login` → JWT saved in context
* 🏷️ All tenant requests include `x-tenant-id` header
* 💳 Auth context provides `user.role` for UI display + access control
* 🔄 Forms use `react-hook-form`, data via `react-query` with caching

---

### 🧩 4. **Prompt-by-Prompt Mapping to Routes & Modules**

| Prompt # | Feature                   | Route                                  | State / Component |
| -------- | ------------------------- | -------------------------------------- | ----------------- |
| 1-2      | Auth + App Layout         | `/login`, `AppShell`, `AuthProvider`   | Global setup      |
| 3        | Owner Dashboard           | `/dashboard`                           | DashboardCards    |
| 4        | Station/Pump/Nozzle CRUD  | `/dashboard/stations`, `/pumps`        | Forms + Tables    |
| 5-6      | Readings → Sales Auto-gen | `/dashboard/readings/new`              | Delta logic       |
| 7-8      | Creditors & Fuel Prices   | `/dashboard/creditors`, `/fuel-prices` | Tabular & forms   |
| 9-10     | Reconciliation            | `/dashboard/reconciliation`            | Finalize buttons  |
| 11-12    | Credit Payments           | `/dashboard/creditors/:id/payments`    | Split list + form |
| 13       | SuperAdmin Portal         | `/superadmin/*`                        | All submodules    |

---

### 🔒 5. **Access Matrix (Route Guarding)**

| Page                      | Roles Allowed                   |
| ------------------------- | ------------------------------- |
| `/login`                  | All                             |
| `/superadmin/*`           | `superadmin` only               |
| `/dashboard/*`            | `owner`, `manager`, `attendant` |
| `/readings/new`, `/sales` | `attendant`, `manager`          |
| `/reconciliation`         | `manager`, `owner`              |

---

### ✅ 6. **Next Steps**

After Prompt 13 (SuperAdmin Portal), here’s what we’ll do:

1. **Prompt 14**: Dashboard Analytics (charts for sales, cash, fuel volume)
2. **Prompt 15**: Audit Logs + Export to CSV/PDF
3. **Prompt 16**: Plan Enforcement — limit stations/pumps/etc.
4. **Prompt 17**: User Settings, Profile, Password Reset
5. **Prompt 18**: Final UI polish, responsive check, 404s, empty states
6. **Prompt 19**: Playwright E2E Tests
7. **Prompt 20**: Deployment-ready build + GitHub sync

---

Would you like me to now generate **Prompt 14: Analytics & Dashboard Charts** or pause here for any changes?
