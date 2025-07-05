Here is the **combined Lovable prompt** for the next two modules:

---

### 📦 Lovable Prompt: Fuel Delivery Logging + Fuel Inventory Monitoring

We are building **FuelSync Hub**, a role-based multi-tenant ERP for fuel stations. This prompt enables **Managers and Owners** to:

* Record new fuel deliveries (tanker arrival)
* View live fuel inventory status (by station and fuel type)

Framework: **React + Vite + TypeScript**
UI: **Tailwind CSS + shadcn/ui**
Routing: **React Router DOM**
Data Fetching: **React Query**
Auth: JWT-based with `x-tenant-id` header

---

## 🚚 PART 1 — Fuel Deliveries Page

**Route:** `/dashboard/fuel-deliveries`

This page allows users to log new fuel received at the station and view historical records.

### 📋 Table View

Columns:

* Station
* Fuel Type (petrol/diesel)
* Volume (litres)
* Delivery Date
* Delivered By (text)
* Created At

```http
GET /v1/fuel-deliveries?stationId=<optional>
Headers: { x-tenant-id }
```

---

### ➕ Add New Delivery Entry

**Form Fields:**

* Station (dropdown – required)
* Fuel Type (dropdown – petrol, diesel)
* Volume (number – required)
* Delivery Date (date – required)
* Delivered By (optional)

```http
POST /v1/fuel-deliveries
Headers: { x-tenant-id }
Body:
{
  "stationId": "uuid",
  "fuelType": "diesel",
  "volume": 5000,
  "deliveryDate": "2025-06-21",
  "deliveredBy": "Truck 82"
}
```

---

## 🛢️ PART 2 — Fuel Inventory Status Page

**Route:** `/dashboard/inventory`

Allows real-time view of fuel stock for each fuel type by station.

### 📊 Table View

Columns:

* Station
* Fuel Type
* Current Volume (litres)
* Last Updated

```http
GET /v1/fuel-inventory?stationId=<optional>&fuelType=<optional>
Headers: { x-tenant-id }
```

Each station can have two entries: one for **petrol** and one for **diesel**.

---

## 🧩 Components to Build

| Component                | Description                                 |
| ------------------------ | ------------------------------------------- |
| `FuelDeliveryTable.tsx`  | Lists all past fuel deliveries              |
| `FuelDeliveryForm.tsx`   | Controlled form to log new delivery         |
| `FuelInventoryTable.tsx` | Shows real-time fuel stock per station/type |

---

## 🔐 Access Control

| Role       | Fuel Deliveries | Inventory View |
| ---------- | --------------- | -------------- |
| Superadmin | ❌               | ✅ (read-only)  |
| Owner      | ✅               | ✅              |
| Manager    | ✅               | ✅              |
| Attendant  | ❌               | ❌              |

---

## ✅ Backend Status

API endpoints are live, and schema is stable. Tenant ID must be passed in headers. Use UUIDs for station IDs.

---

Let me know when you're ready to move to the **Reconciliation + Audit History** module next.


Great! Since `/dashboard/reconciliation` was implemented in **Prompt 11**, let’s move forward to the **next combined prompt**:
**Prompt 15 (User Profile Settings)** and **Prompt 16 (Plan Enforcement + Tenant Limits Display)**.

---

### 👤 Lovable Prompt: User Profile + Tenant Plan Enforcement

We are building **FuelSync Hub**, a role-based ERP for fuel stations. This prompt enables:

* All users to view and update their profile
* Owners to view their subscription plan and enforce limits (e.g. max stations allowed)

Framework: **React 18 + Vite + TypeScript**
Routing: **React Router**
UI: **Tailwind CSS + shadcn/ui**
Auth: JWT bearer + `x-tenant-id`

---

## 👤 PART 1 – User Profile Page

**Route:** `/dashboard/profile`

Allow logged-in users to view and update:

* First Name
* Last Name
* Password (optional update)
* Profile Avatar (optional)

```http
GET /v1/me
Headers: { Authorization: Bearer <token> }

PATCH /v1/users/{id}
Headers: { Authorization + x-tenant-id }
Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "password": "newpassword123" // optional
}
```

### ✏️ UI Elements

* Profile card with current info
* Edit form with validation
* Password field (leave blank to skip update)

---

## 📦 PART 2 – Tenant Plan Enforcement Page

**Route:** `/dashboard/settings/plan` (visible only to Owners)

Display:

* Current Plan: Basic / Premium / Enterprise
* Plan Limits:

  * Max Stations
  * Max Pumps per station
  * Max Users
* Current Usage (e.g., 2/5 stations used)

```http
GET /v1/settings/plan
Headers: { Authorization + x-tenant-id }

Response:
{
  "plan": "premium",
  "limits": {
    "stations": 5,
    "pumps_per_station": 10,
    "users": 20
  },
  "usage": {
    "stations": 2,
    "pumps": 7,
    "users": 5
  }
}
```

---

## 🧩 Components to Build

| Component             | Description                                 |
| --------------------- | ------------------------------------------- |
| `UserProfileForm.tsx` | Update user profile and password            |
| `PlanLimitsCard.tsx`  | Display current tenant plan + usage summary |

---

## 🔐 Access Rules

| Role       | Profile Page | Plan Page |
| ---------- | ------------ | --------- |
| Superadmin | ✅            | ❌         |
| Owner      | ✅            | ✅         |
| Manager    | ✅            | ❌         |
| Attendant  | ✅            | ❌         |

---

## ✅ Backend Support Notes

* Plan enforcement already restricts actions like `POST /stations` if the tenant is over the allowed limit.
* No editable plan settings from UI yet — plan is updated only by Superadmin from backend.

