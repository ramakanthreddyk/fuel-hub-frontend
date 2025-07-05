Here is **Prompt 6** for Lovable — focused on the **Sales Listing + Filter + Detail View** page for Owners and Managers to track nozzle-level transactions.

---

## ✅ **Prompt 6: View and Manage Sales Entries**

> 🎯 Purpose: Show all auto-generated sales based on nozzle readings. Allow filtering by date, nozzle, and payment method.
> 📍 Route: `/dashboard/sales`
> 🗂️ Optional Detail View: `/dashboard/sales/[saleId]`

---

### 🔐 Access Control

| Role       | Access                             |
| ---------- | ---------------------------------- |
| Attendant  | 🔄 Can view own entries only       |
| Manager    | ✅ Full access to view/filter sales |
| Owner      | ✅ Full access, across all stations |
| SuperAdmin | ❌ No access                        |

---

### 🧱 UI Structure

#### 📌 Filters (Top Bar)

* `Station` (dropdown)
* `Nozzle` (dropdown; filtered by station)
* `Date Range` (start → end)
* `Payment Method`: cash, card, upi, credit
* `Status`: draft, posted

#### 📋 Sales Table Columns

| Field           | Source            |
| --------------- | ----------------- |
| Date            | `recorded_at`     |
| Station         | `station.name`    |
| Nozzle (Fuel)   | `nozzle.fuelType` |
| Volume (Litres) | `sale_volume`     |
| Price/Litre     | `fuel_price`      |
| Total Amount    | `amount`          |
| Payment Method  | `payment_method`  |
| Cash Received   | `cash_received`   |
| Credit Given    | `credit_given`    |
| Status          | `status`          |

#### 🔍 Optional Detail View

If user clicks a sale row:

* Show full breakdown
* `Previous vs Current Reading`
* Fuel price snapshot at time of sale
* Linked `creditor name` if payment was on credit

---

### 🔁 API Integration

📥 **GET `/v1/sales`**
Query params:

* `stationId`, `nozzleId`, `startDate`, `endDate`, `paymentMethod`, `status`

📥 **GET `/v1/stations`**, **/v1/pumps**, **/v1/nozzles**
→ For filter dropdowns

📤 **PATCH `/v1/sales/:id`** *(optional)*
→ Allow editing status (e.g., mark as posted)

---

### 🧩 UX Guidance for Lovable

* Filters should auto-refresh results when changed
* Highlight credit sales in a different color
* Add icon for **posted** status ✅ and **draft** 🕒
* Include quick summary on top:

  * *Total sales value this week: ₹XXXK*
  * *Top selling nozzle: Diesel Nozzle 2*

---

### 🧩 Suggested Components

| Component              | Role                          |
| ---------------------- | ----------------------------- |
| `SalesTable.tsx`       | Table listing with pagination |
| `SalesFilterBar.tsx`   | Top filters                   |
| `SaleDetailDrawer.tsx` | Optional: expand detail view  |
| `useSalesData.ts`      | React Query wrapper for fetch |
| `SaleStatusBadge.tsx`  | Color-coded status tag        |

---

Let me know if you'd like **Prompt 7: Fuel Price Management Page** next, or want to cover manager reconciliation flow instead.


Great! Here's your **Lovable-compatible combined prompt** that covers both **Prompt 5 (Nozzle Reading Entry)** and **Prompt 6 (Sales Listing & Management)** in one go:

---

### 💡 Lovable Prompt: Implement Nozzle Reading Entry + Sales Dashboard

We are building a multi-tenant fuel station management system (FuelSync Hub) using React + Vite + TypeScript. The backend is fully functional and ready to integrate via REST APIs.

#### 🎯 Goal:

Build the **nozzle reading entry system** with auto-sale generation, and a **sales listing dashboard** for all roles (Owner, Manager).

---

### 🧱 PART 1 – Nozzle Reading Entry Page

**Route:** `/dashboard/readings/new`

**Features:**

* User selects:

  * `Station` ➝ `Pump` ➝ `Nozzle` (cascading dropdowns)
* Enters:

  * `Current Reading` (cumulative value, number)
  * `Recorded At` (datetime, default to now)
  * `Payment Method` (cash, card, upi, credit)
  * `Credit Party` (optional, only if payment method = credit)

**Validations:**

* Reading must be **greater than or equal to** last known reading
* Required fields cannot be empty

**On Submit:**

Make API call to:

```http
POST /v1/nozzle-readings
```

```json
{
  "nozzleId": "uuid",
  "reading": 12000,
  "recordedAt": "2025-06-22T18:00:00Z",
  "paymentMethod": "credit",
  "creditorId": "optional-uuid"
}
```

🚀 Backend will auto-calculate delta and fuel price → auto-generate a sale.

---

### 🧱 PART 2 – Sales Listing Page

**Route:** `/dashboard/sales`

**Features:**

* Filter by:

  * Date range
  * Station
  * Payment method
* Table view with columns:

  * Date/Time
  * Station
  * Nozzle
  * Volume (litres)
  * Fuel Type
  * Fuel Price
  * Total Amount (₹)
  * Payment Method
  * Status (draft / posted)

**Data Source:**

```http
GET /v1/sales?stationId={id}&fromDate=2025-06-01&toDate=2025-06-22
```

---

### 🔧 Required Components

| Component              | Description                        |
| ---------------------- | ---------------------------------- |
| `ReadingEntryForm.tsx` | Controlled form for nozzle reading |
| `useReadings.ts`       | React Query hook for readings      |
| `SalesTable.tsx`       | Paginated table view of sales      |
| `useSales.ts`          | React Query hook for sales list    |

---

### 📌 Notes for Lovable:

* Use Tailwind + shadcn/ui for form layout
* Add success notification and redirect to `/dashboard/sales` after successful reading entry
* Handle error states (invalid delta, nozzle not found, etc.)
* Add loading skeletons for both pages

---

✅ The backend APIs are stable. Continue building based on this contract. Let me know once done so we can proceed to reconciliation and reporting flows.


Here is the **combined Lovable prompt for Prompt 7 (Creditors List & Payment Flow)** and **Prompt 8 (Fuel Price Management)**—designed for stability, minimal iterations, and complete backend integration.

---

### 💡 Lovable Prompt: Implement Creditors Management + Fuel Price Configuration

We are building a role-based multi-tenant ERP system for fuel stations (FuelSync Hub) with React + Vite + TypeScript. Please implement the following two modules:

---

## 🧾 PART 1 – Creditors Page + Payment Entry

**Routes:**

* `/dashboard/creditors`
* `/dashboard/creditors/[id]/payments`

### 🔍 Creditors List Page

Display a table of creditors for the logged-in tenant/station.

**Fields:**

* Party Name
* Credit Limit
* Current Outstanding (calculated from sales & payments)
* Action: View Payments

### ➕ Add New Creditor Form

**Form Fields:**

* Party Name (required)
* Credit Limit (number, optional)

```http
POST /v1/creditors
Headers: { x-tenant-id }
Body:
{
  "partyName": "ABC Traders",
  "creditLimit": 50000
}
```

---

### 💰 Payments Page – `/dashboard/creditors/[id]/payments`

Display history of payments made to this creditor.

**Form to Add New Payment:**

* Amount (number)
* Payment Method (dropdown: cash, bank\_transfer, check)
* Reference Number (optional)
* Notes (optional)

```http
POST /v1/credit-payments
Headers: { x-tenant-id }
Body:
{
  "creditorId": "uuid",
  "amount": 10000,
  "paymentMethod": "bank_transfer",
  "referenceNumber": "BANKTX9982",
  "notes": "Settled for June 20"
}
```

Fetch data from:

```http
GET /v1/creditors
GET /v1/credit-payments?creditorId={id}
```

---

## ⛽ PART 2 – Fuel Price Configuration

**Route:** `/dashboard/fuel-prices`

This page allows Owners/Managers to view and configure fuel prices (per station).

### 📋 Table View

Columns:

* Fuel Type (petrol / diesel)
* Price Per Litre
* Valid From
* Action: Edit / Update

### ➕ Add/Update Price Form

**Form Fields:**

* Fuel Type (dropdown)
* Price (number)
* Valid From (datetime)
* Station (dropdown or auto-filled for owners)

```http
POST /v1/fuel-prices
Headers: { x-tenant-id }
Body:
{
  "stationId": "uuid",
  "fuelType": "petrol",
  "price": 102.5
}
```

```http
GET /v1/fuel-prices
Headers: { x-tenant-id }
```

---

### 🧩 Required Components

| Component            | Description                            |
| -------------------- | -------------------------------------- |
| `CreditorList.tsx`   | List and search creditors              |
| `CreditorForm.tsx`   | Form for adding a new creditor         |
| `PaymentHistory.tsx` | List of previous payments              |
| `PaymentForm.tsx`    | Form to log a new payment              |
| `FuelPriceTable.tsx` | Shows fuel prices by station/fuel type |
| `FuelPriceForm.tsx`  | Controlled form to add/update price    |

---

### 📌 Notes for Lovable

* Use Tailwind + shadcn/ui with React Router
* Display proper toast/success feedback
* Add loading states and handle empty list scenarios
* Fuel prices are per station and can change frequently — do not cache aggressively

✅ Backend endpoints are stable. Let us know when ready to move to reconciliation and dashboard summary charts.
