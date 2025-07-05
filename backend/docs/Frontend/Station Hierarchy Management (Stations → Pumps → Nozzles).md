🎯 Implement full station hierarchy management pages:

## 🌍 1. STATIONS PAGE — `/dashboard/stations`

**Purpose:** Owners and Managers can view and manage all their stations.

### UI:
- Table of stations with: `Name`, `City`, `Created At`, `Actions (Edit, View Pumps)`
- Add Station Form:
  - `name`, `address`, `city`, `state`, `zip`, `contact_phone`

### API:
```http
GET /v1/stations
Headers: x-tenant-id
→ returns: [{ id, name, city, state, ... }]

POST /v1/stations
Headers: x-tenant-id
Body:
{
  name: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  contact_phone: string
}
🛢️ 2. PUMPS PAGE — /dashboard/stations/[stationId]/pumps
Purpose: Manage all pumps within a selected station

UI:
Display station name and ID

Table of pumps: name, serial_number, installation_date, active

Add Pump Form:

name, serial_number, installation_date

API:
http
Copy
Edit
GET /v1/pumps?stationId={stationId}
Headers: x-tenant-id
→ returns: [{ id, name, serial_number, ... }]

POST /v1/pumps
Headers: x-tenant-id
Body:
{
  stationId: UUID,
  name: string,
  serial_number: string,
  installation_date: string (date)
}
⛽ 3. NOZZLES PAGE — /dashboard/pumps/[pumpId]/nozzles
Purpose: Define fuel dispensing nozzles per pump

UI:
Show pump name

Table of nozzles: fuel_type, nozzle_number, initial_reading

Add Nozzle Form:

fuelType, nozzleNumber, initialReading

API:
http
Copy
Edit
GET /v1/nozzles?pumpId={pumpId}
Headers: x-tenant-id
→ returns: [{ id, nozzleNumber, fuelType, initialReading }]

POST /v1/nozzles
Headers: x-tenant-id
Body:
{
  pumpId: UUID,
  nozzleNumber: integer,
  fuelType: "petrol" | "diesel" | "premium",
  initialReading: number
}
🧭 NAVIGATION:
From Stations → Click “View Pumps”

From Pumps → Click “View Nozzles”

Add breadcrumb or tab-based navigation for better UX

✅ All API endpoints are ready and support x-tenant-id for multi-tenancy
✅ Use Tailwind + shadcn/ui for consistent forms and tables
✅ Ensure proper loading states and error messages
✅ Validate all forms client-side