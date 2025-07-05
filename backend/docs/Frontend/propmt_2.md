Prompt #2 — Pump + Nozzle Management + All User Logins
Build out the Pumps and Nozzles management interface, ensuring full hierarchy awareness and secure scoped navigation. Also implement login handling for all user roles.

📁 Pages & Routes to Create
🔐 Login Pages (Role-aware)
/login

Form inputs: email, password

On submit → call POST /v1/auth/login

On success → decode JWT role and redirect:

superadmin → /superadmin

owner → /dashboard

manager or attendant → /dashboard

Handle 401 error gracefully

🛠️ Pump and Nozzle Management (Scoped by Station)
/dashboard/stations/[stationId]/pumps

Fetch pumps via GET /v1/pumps?stationId=...

Show pump list (name, serial number)

Button: “Add Pump” opens modal

Fields: name, serialNumber

Call: POST /v1/pumps

Payload:

json
Copy
Edit
{
  "stationId": "<stationId>",
  "name": "...",
  "serialNumber": "..."
}
/dashboard/stations/[stationId]/pumps/[pumpId]/nozzles

Fetch nozzles via GET /v1/nozzles?pumpId=...

Show nozzle table: nozzleNumber, fuelType, status

Add Nozzle Form:

Fields: nozzleNumber (number), fuelType (dropdown: petrol, diesel)

Call: POST /v1/nozzles

Payload:

json
Copy
Edit
{
  "pumpId": "<pumpId>",
  "nozzleNumber": 1,
  "fuelType": "diesel"
}
🔒 Access Control Logic (Client-side)
Use Auth Context to:

Protect all dashboard routes

Guard each route based on role (owner, manager, attendant)

Redirect if role is invalid or JWT expired

💡 Notes for Lovable
Persist JWT in localStorage or cookie

Attach x-tenant-id and Authorization header (Bearer <token>) to all requests

Use React Query for data fetching

Ensure components (form, table) are reusable and styled using shadcn/ui or Tailwind

Don’t allow adding nozzles if pump is inactive

✅ Backend Endpoints to Use
Purpose	Method	Endpoint	Headers & Body Schema
Login	POST	/v1/auth/login	{ email, password }
List Pumps	GET	/v1/pumps?stationId=...	x-tenant-id, Authorization
Create Pump	POST	/v1/pumps	{ stationId, name, serialNumber }
List Nozzles	GET	/v1/nozzles?pumpId=...	x-tenant-id, Authorization
Create Nozzle	POST	/v1/nozzles	{ pumpId, nozzleNumber, fuelType }

