Great! Here's the next combined **Lovable Prompt for Prompt 9 (Fuel Delivery Log)** and **Prompt 10 (Fuel Inventory View)**.

---

### 🛢️ Lovable Prompt: Fuel Delivery Logging + Fuel Inventory View

We are building **FuelSync Hub**, a multi-tenant ERP system for fuel stations. This prompt covers two operational features for managers: logging fuel deliveries and tracking real-time inventory levels.

Framework: **React 18 + Vite + TypeScript**
Libraries: **Tailwind CSS**, **shadcn/ui**, **React Query**
Auth: **JWT-based**, with tenant context via `x-tenant-id` header
Use React Router for navigation.

---

## 🚚 PART 1 — Fuel Delivery Logging

**Route:** `/dashboard/fuel-deliveries`

### 📋 View Past Deliveries Table

Display all deliveries made to the selected station (default to user's assigned station).
Columns:

* Fuel Type (petrol / diesel)
* Volume Received
* Delivered By
* Delivery Date

```http
GET /v1/fuel-deliveries?stationId=<station_id>
Headers: { x-tenant-id }
```

---

### ➕ Log New Delivery

Show form at the top or modal.

**Form Fields:**

* Station (select if multi-station; else auto-filled)
* Fuel Type (dropdown: petrol, diesel)
* Volume (number – litres)
* Delivery Date (default to now)
* Delivered By (optional text)

```http
POST /v1/fuel-deliveries
Headers: { x-tenant-id }
Body:
{
  "stationId": "uuid",
  "fuelType": "petrol",
  "volume": 3000,
  "deliveryDate": "2025-06-22",
  "deliveredBy": "IOCL"
}
```

---

## 🧯 PART 2 — Fuel Inventory View

**Route:** `/dashboard/inventory`

This shows current available stock in each station by fuel type.

**Table Fields:**

* Station Name
* Fuel Type
* Available Volume
* Last Updated (ISO datetime)

```http
GET /v1/fuel-inventory?stationId=<id>&fuelType=<petrol|diesel>
Headers: { x-tenant-id }
```

Call this once per station + fuel type or fetch all and filter client-side if backend supports it.

---

## 🧩 Components to Build

| Component            | Purpose                           |
| -------------------- | --------------------------------- |
| `DeliveryTable.tsx`  | List of fuel deliveries           |
| `DeliveryForm.tsx`   | Log a new delivery                |
| `InventoryTable.tsx` | Show current volume per fuel type |

---

## 📌 Notes for Lovable

* Protect all routes with auth guard
* Include tenant header in all requests
* Allow search and filter by fuel type / date range
* Highlight low stock in red (if volume < threshold like 500L)

✅ Backend is ready. You may proceed to build both modules as specified. Let us know when complete — next up is daily reconciliation flow and audit-ready exports.


Perfect — here's the **updated and final detailed Lovable prompt** for:

---

## ✅ **Prompt 11: Daily Reconciliation Page (Cash & Credit Validation)**

*Handles closing of daily sales with confirmation of received cash vs expected sales value.*

---

### 📄 Route: `/dashboard/reconciliation`

This page is used at the **end of day** by the **Manager** to:

1. Review all **nozzle readings** and generated **sales** for the day
2. Compare with **cash declared by attendants**
3. Confirm if any delta was due to **credit** or **online payments**

---

### 🧭 Flow Summary

* Each day, nozzle readings generate sales based on delta × fuel price
* Attendant must declare how much **cash** they received
* Manager sees **Expected Total**, **Cash Declared**, and must confirm the **delta**
* Delta must be reconciled: either marked as *credit*, *online payment*, or flagged for investigation

---

### 📋 Reconciliation Table View

**Columns:**

| Nozzle | Previous Reading | Current Reading | Delta (L) | Price/Litre | Sale Value | Payment Method | Cash Declared |
| ------ | ---------------- | --------------- | --------- | ----------- | ---------- | -------------- | ------------- |
| #1     | 5000             | 10000           | 5000      | ₹100        | ₹500,000   | cash           | ₹20,000       |

**Below the table**, show:

* ✅ **Total Sales Value**
* 💵 **Total Cash Declared**
* 💰 **Delta Amount**
* 📝 **Reconciliation Notes (textarea)**
* ⏱️ **Date Picker** (default to today)

---

### 📥 Form Submission

**Form Fields:**

* `stationId` (auto-filled)
* `date` (date of reconciliation)
* `totalExpected` (from sales)
* `cashReceived` (sum of declared cash)
* `reconciliationNotes` (optional)
* `managerConfirmation` (checkbox: “I verify the above amounts”)

```http
POST /v1/reconciliation
Headers: { x-tenant-id }
Body:
{
  "stationId": "uuid",
  "date": "2024-06-22",
  "totalExpected": 500000,
  "cashReceived": 20000,
  "reconciliationNotes": "Remaining via credit. Fleet payment pending.",
  "managerConfirmation": true
}
```

---

### 🧩 Required Components

| Component                   | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `ReconciliationTable.tsx`   | Show all nozzle readings + sales                   |
| `ReconciliationSummary.tsx` | Show totals, delta, notes, confirm button          |
| `ReconciliationForm.tsx`    | Handles final submission with manager confirmation |

---

### 🔐 Access Rules

* Only **Manager** can reconcile a station’s daily sales
* **Owner** can view completed reconciliations in `/dashboard/history` (optional future)

---

## 🧠 Lovable Notes

* Readings already exist via `/v1/nozzle-readings`
* Sales are auto-generated from readings (assume already inserted)
* Allow “today” and “previous day” reconciliation
* If cash declared < expected, prompt manager to add a note before submission
* Use Toasts for feedback and a loading state on submission

✅ API is ready. Proceed to implement full workflow.

---

## ✅ **Prompt 12: Dashboard Summary Charts & Metrics**

*Used by Owners and Admins to get a high-level view of business health.*

---

### 📊 Route: `/dashboard/summary`

This is a visual dashboard for **Owners** and **Superadmins**. Shows key metrics with charts.

---

### 🔢 Metrics

1. **Total Sales (This Month)**
2. **Credit vs Cash Breakdown**
3. **Fuel Sold by Type**
4. **Top Creditors by Outstanding**
5. **Latest Reconciliation Status**
6. (Optional) **Daily Sales Trend (last 7 days)**

---

### 📈 Charts & Cards

| Widget                    | API                              | Type       |
| ------------------------- | -------------------------------- | ---------- |
| Total Sales Card          | `/v1/sales?range=monthly`        | Card       |
| Credit/Cash Breakdown Pie | `/v1/sales/payment-methods`      | Pie Chart  |
| Fuel Type Sold            | `/v1/sales/fuel-breakdown`       | Bar Chart  |
| Top Creditors Outstanding | `/v1/creditors?sort=outstanding` | Table      |
| Daily Sales Trend         | `/v1/sales?range=last7days`      | Line Chart |

---

### 🧩 Required Components

| Component                | Description                            |
| ------------------------ | -------------------------------------- |
| `SalesSummaryCard.tsx`   | Total sales for the month              |
| `PaymentMethodChart.tsx` | Pie chart of credit vs cash            |
| `FuelBreakdownChart.tsx` | Bar chart of litres sold per fuel type |
| `TopCreditorsTable.tsx`  | Top N creditors by unpaid balance      |
| `SalesTrendChart.tsx`    | Line chart of daily sales              |

---

### 🧠 Lovable Notes

* Group sales by `paymentMethod`, `fuelType`, and `date`
* Use shadcn cards and charts for summary widgets
* Each chart should have loading state, error handling
* Use `x-tenant-id` for all data requests

---

✅ You may proceed with implementing both prompts. Let me know if you'd like to combine them into a **single Lovable prompt** for a unified implementation.


Excellent question — and you're absolutely right to clarify this. Let's distinguish clearly how **summary dashboards** should behave for each role:

---

## ✅ **Summary Dashboard by Role**

### 🔒 SuperAdmin Dashboard (Global Overview)

SuperAdmins don’t own stations, but they **oversee all tenants**. Their dashboard shows:

| Metric                  | Description                              |
| ----------------------- | ---------------------------------------- |
| 🔢 Total Tenants        | Number of registered tenants             |
| 🧑‍💼 Active Users      | Total users across all tenants           |
| 🏪 Total Stations       | All stations created                     |
| ⛽ Total Sales Volume    | Cumulative across all tenants (optional) |
| 💳 Most Active Tenants  | Tenants with highest sales volume        |
| 📅 Recent Registrations | New tenants signed up this week          |

**APIs (admin routes):**

```http
GET /admin/tenants/summary
GET /admin/users/summary
GET /admin/stations/summary
GET /admin/sales/summary
```

---

### 🏠 Owner Dashboard (Per-Tenant Overview)

Owners manage 1+ stations (depending on plan), and see:

| Metric                      | Description                     |
| --------------------------- | ------------------------------- |
| 💰 Total Monthly Sales      | Across all their stations       |
| 🛢️ Fuel Sold by Type       | Petrol, Diesel, etc.            |
| 📈 Sales Trend              | Per day or week                 |
| 💳 Credit vs Cash Breakdown | Revenue source types            |
| ⛽ Station Statuses          | Station-wise sales volume today |

**APIs (tenant scoped):**

```http
GET /v1/sales/summary
GET /v1/sales/fuel-breakdown
GET /v1/sales/payment-methods
GET /v1/reconciliation/latest
```

---

### 🧑‍🔧 Manager Dashboard (Station Operations)

Managers only see data for their assigned station(s):

| Metric                       | Description                  |
| ---------------------------- | ---------------------------- |
| ⛽ Nozzle-wise Fuel Dispensed | Daily stats                  |
| 🧾 Pending Reconciliations   | Sales not yet closed         |
| 👷 Staff On Duty             | Current assigned employees   |
| 💵 Cash vs Declared Amount   | Today's expected vs received |

---

## 🧠 Summary

So to answer your question:

> **"How will SuperAdmin have a summary?"**

✅ **They will not see per-station data**, but instead have a **global metrics dashboard** about tenants, users, total system usage, and signups — essentially a “platform health” view.

Would you like me to generate a dedicated **Lovable prompt** for **SuperAdmin Summary Dashboard** next?
