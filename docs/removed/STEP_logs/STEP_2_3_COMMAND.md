# STEP\_2\_3\_COMMAND.md — Station, Pump, and Nozzle Management APIs

## ✅ Project Context Summary

FuelSync Hub enables fuel station operators to manage multi-level infrastructure: stations → pumps → nozzles. We’ve completed authentication and user management in `STEP_2_1` and `STEP_2_2`. This step covers the CRUD logic for configuring station infrastructure.

## 📌 Prior Steps Implemented

* `STEP_2_1`: Auth & role-based JWT middleware
* `STEP_2_2`: SuperAdmin and tenant-level user management
* DB tables ready: `stations`, `pumps`, `nozzles`, `user_stations`

## 🚧 What to Build Now

### 1. Station APIs

* `POST /api/stations`: Create station (tenant context)
* `GET /api/stations`: List stations (owner/manager only)
* `PUT /api/stations/:id`: Update station
* `DELETE /api/stations/:id`: Soft delete

### 2. Pump APIs

* `POST /api/pumps`: Create pump linked to a station
* `GET /api/pumps?stationId=`: List pumps for a station
* `DELETE /api/pumps/:id`: Delete pump (check nozzle presence)

### 3. Nozzle APIs

* `POST /api/nozzles`: Create nozzle linked to a pump
* `GET /api/nozzles?pumpId=`: List nozzles for a pump
* `DELETE /api/nozzles/:id`: Delete nozzle (check sale history)

### 4. Plan Limit Enforcement

* Check tenant plan limits (`maxStations`, `maxPumpsPerStation`, `maxNozzlesPerPump`) using middleware

### 5. Validation Rules

* Station name must be unique per tenant
* Pumps must reference valid station
* Nozzles must reference valid pump

## 📁 File Structure

Update or create:

```
src/
├── controllers/
│   ├── station.controller.ts
│   ├── pump.controller.ts
│   └── nozzle.controller.ts
├── routes/
│   ├── station.route.ts
│   ├── pump.route.ts
│   └── nozzle.route.ts
├── services/
│   ├── station.service.ts
│   ├── pump.service.ts
│   └── nozzle.service.ts
├── middlewares/
│   └── checkPlanLimits.ts
├── validators/
│   ├── station.validator.ts
│   ├── pump.validator.ts
│   └── nozzle.validator.ts
```

## 🧠 Why This Step

Configuring stations, pumps, and nozzles is essential before any readings or sales can be recorded. Proper FK validation and plan limit checks ensure data consistency and business rule enforcement.

## 🧾 Documentation To Update

* `CHANGELOG.md` (Feature: Station/Pump/Nozzle APIs)
* `PHASE_2_SUMMARY.md` (Mark infra config complete)
* `IMPLEMENTATION_INDEX.md` (Log STEP\_2\_3 and files)
* `BUSINESS_RULES.md` (Infra + plan limit enforcement)
* `PLANS.md` (Limit descriptions for station/pump/nozzle)

---

> This prompt must be stored before execution. Codex agents must implement exactly as specified and update all docs before proceeding.
