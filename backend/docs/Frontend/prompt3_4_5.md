Great — let’s revisit **Prompt 3** and finalize it properly for Lovable AI, ensuring clear data structure, UX, and backend alignment.

---

## ✅ **Prompt 3: Station → Pump → Nozzle Hierarchy Navigation**

> 🎯 Purpose: Let users view all stations they manage, drill into pumps, and then into nozzles.
> 📍 Routes:
>
> * `/dashboard/stations` – list stations
> * `/dashboard/stations/[stationId]/pumps` – list pumps in a station
> * `/dashboard/stations/[stationId]/pumps/[pumpId]/nozzles` – list nozzles under a pump

---

### 🔐 Access Control

| Role       | Access                               |
| ---------- | ------------------------------------ |
| SuperAdmin | ❌ No (handled in separate dashboard) |
| Owner      | ✅ All stations in their account      |
| Manager    | ✅ Stations they manage               |
| Attendant  | ✅ Stations assigned to them          |

---

### 🧱 UI Structure

#### ✅ `/dashboard/stations`

* Card/grid view of stations
* Show: `Station name`, `Location`, `# of pumps`
* Button: “View Pumps” → route to `/stations/[id]/pumps`

📥 **GET `/v1/stations`**

---

#### ✅ `/dashboard/stations/[stationId]/pumps`

* List view or card view of pumps
* Show: `Pump name`, `Serial number`, `Installation date`
* Button: “View Nozzles” → `/stations/[stationId]/pumps/[pumpId]/nozzles`

📥 **GET `/v1/pumps?stationId=...`**

📤 **POST `/v1/pumps`**

```json
{
  "stationId": "UUID",
  "name": "Pump 1"
}
```

---

#### ✅ `/dashboard/stations/[stationId]/pumps/[pumpId]/nozzles`

* Table or card list of nozzles under the selected pump
* Show: `Nozzle number`, `Fuel type`, `Initial reading`, `Active status`
* Button: “Edit” or “Record Reading”

📥 **GET `/v1/nozzles?pumpId=...`**

📤 **POST `/v1/nozzles`**

```json
{
  "pumpId": "UUID",
  "nozzleNumber": 1,
  "fuelType": "petrol"
}
```

---

### 🧠 UX Enhancements for Lovable

* Use breadcrumb: Stations → Pumps → Nozzles
* Display fuel type badges (petrol, diesel icons)
* Allow toggling nozzle active/inactive (editable only by owner/manager)
* Add “Add Pump” and “Add Nozzle” buttons with modals or inline forms

---

### 📦 Component Suggestions for Lovable

| Component            | Path/Usage              |
| -------------------- | ----------------------- |
| `StationCard.tsx`    | Display station info    |
| `PumpList.tsx`       | Render pump list        |
| `NozzleList.tsx`     | Render nozzles per pump |
| `FuelTypeBadge.tsx`  | Icon for fuel type      |
| `AddPumpModal.tsx`   | New pump form           |
| `AddNozzleModal.tsx` | New nozzle form         |

---

Let me know if we proceed to **Prompt 4: Fuel Price Entry** or if you'd like to add something to this one first.


Here is **Prompt 4** for Lovable — covering the **Fuel Prices** feature, tailored to your backend API contract and UX expectations:

---

## ✅ **Prompt 4: Manage Fuel Prices per Station**

> 🎯 Purpose: Let managers/owners view, add, or update fuel prices (petrol, diesel, premium, etc.) for their station.
> 📍 Route: `/dashboard/stations/[stationId]/fuel-prices`

---

### 🔐 Access Control

| Role       | Access        |
| ---------- | ------------- |
| Owner      | ✅ Full access |
| Manager    | ✅ Full access |
| Attendant  | ❌ No access   |
| SuperAdmin | ❌ No access   |

---

### 🧱 UI Structure

#### ✅ View Mode

* Display a list or table of current and past fuel prices
* Show:

  * `Fuel Type` (badge: petrol, diesel, etc.)
  * `Price Per Unit`
  * `Effective From` (timestamp)
  * `Effective To` (if present)
* Optional: Allow filtering by fuel type or date

#### ✅ Add/Edit Mode

* Show modal or inline form for entering a new price entry

**Form Inputs:**

* `Fuel Type`: select (petrol, diesel, etc.)
* `Price`: number (min 0, with 2 decimals)
* `Effective From`: datetime picker (default: now)
* (Optional) `Effective To`: datetime picker

---

### 🔁 API Integration

📥 **GET `/v1/fuel-prices`**
Parameters:

```http
Header: x-tenant-id
Query: stationId
```

📤 **POST `/v1/fuel-prices`**

```json
{
  "stationId": "UUID",
  "fuelType": "petrol",
  "price": 115.5
}
```

📋 Expected Response:

* Status `201 Created`
* New entry is appended to the list with updated timestamp

---

### 🎨 UX Enhancements for Lovable

* Use distinct color-coded badges for each fuel type (petrol: green, diesel: blue, premium: gold)
* On price update, highlight “Effective From” field with clock/calendar icon
* Smooth validation for numeric price input with currency formatting
* Group entries by fuel type for better scanning

---

### 🧩 Component Suggestions

| Component            | Purpose                      |
| -------------------- | ---------------------------- |
| `FuelPriceTable.tsx` | Displays historical prices   |
| `FuelPriceForm.tsx`  | Add/Edit fuel price entry    |
| `FuelTypeBadge.tsx`  | Reusable badge for fuel type |
| `StationHeader.tsx`  | Station-level title/details  |

---

Let me know if you’re ready to move to **Prompt 5: Record Nozzle Reading & Auto-Sale**, or if you want to add role-specific restrictions here.

Here is **Prompt 5** for Lovable — covering the **Nozzle Reading Entry + Auto Sale Generation** workflow, as per your backend logic and business rules.

---

## ✅ **Prompt 5: Record Nozzle Reading (Auto-Generate Sale)**

> 🎯 Purpose: Allow attendants to enter current **cumulative reading** for each nozzle, triggering sale calculation based on fuel price + delta logic.
> 📍 Route: `/dashboard/stations/[stationId]/nozzles/[nozzleId]/reading`

---

### 🔐 Access Control

| Role       | Access                |
| ---------- | --------------------- |
| Attendant  | ✅ Can submit reading  |
| Manager    | 🔄 Can review entries |
| Owner      | 🔄 Optional oversight |
| SuperAdmin | ❌ No access           |

---

### 💡 Business Logic Recap

* Attendant enters **today's cumulative reading** (e.g. 10,000).
* System fetches **last known reading** (e.g. 5,000).
* `Delta = New - Previous` → Multiply with current **fuel price** → Generate sale entry
* Cash entered manually by attendant (optional)
* If **difference** exists between expected and declared cash, manager reconciles later

---

### 🧱 UI Structure

#### ✅ Display

* **Fuel Type**: from nozzle config
* **Previous Reading**: show last cumulative value
* **Current Price**: fetch latest price per litre
* **DateTime**: default to now

#### 📝 Entry Form

* `Current Reading`: number (must be ≥ previous)
* `Recorded At`: datetime (default: now)
* `Payment Method`: dropdown (cash, card, upi, credit)
* `Credit Party`: optional, only visible if method is “credit”
* `Cash Received`: optional, for cash collection

---

### 🔁 API Integration

📥 **GET `/v1/nozzles`**
Query: `pumpId` → fetch nozzle & fuelType

📥 **GET `/v1/nozzle-readings?nozzleId=XYZ`**
→ Get latest cumulative reading

📥 **GET `/v1/fuel-prices?stationId=XYZ`**
→ Get current price for nozzle’s fuel type

📤 **POST `/v1/nozzle-readings`**
Request body:

```json
{
  "nozzleId": "UUID",
  "reading": 10000,
  "recordedAt": "2025-06-22T18:00:00Z",
  "paymentMethod": "cash",
  "creditorId": null
}
```

🔁 Backend auto-generates sale based on:

* Delta volume
* Price per litre
* Amount (auto)
* Records attendant + timestamp

---

### 🧩 UX Guidance for Lovable

* Show `Previous Reading` in gray beside input field for context
* Use animated volume calculator: `Delta x Price = Sale Amount`
* Auto-disable submit button if validation fails (e.g. new reading < previous)
* Show success toast: “Reading recorded. Sale auto-generated.”
* Optional: After submit, display quick summary card:
  *Fuel: Diesel • Volume: 5,000L • Amount: ₹575,000*

---

### 🧩 Suggested Components

| Component                 | Role                           |
| ------------------------- | ------------------------------ |
| `NozzleReadingForm.tsx`   | Main input form                |
| `FuelPriceFetcher.ts`     | Utility to get latest price    |
| `PreviousReadingCard.tsx` | Shows last reading info        |
| `SaleSummaryCard.tsx`     | (Optional) Post-submit summary |

---

Let me know if we proceed to **Prompt 6: View + Manage Sales Entries**, or if you want to refine this flow first.
