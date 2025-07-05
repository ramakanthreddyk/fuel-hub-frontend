# STEP\_2\_5\_COMMAND.md — Fuel Pricing Management

## ✅ Project Context Summary

FuelSync Hub calculates sales by multiplying deltas from nozzle readings with historical fuel prices. Pricing must be station-specific and time-aware.

## 📌 Prior Steps Implemented

* ✅ `STEP_2_4`: Nozzle readings + auto sales generation
* ✅ `STEP_2_3`: Station/pump/nozzle APIs
* ✅ `STEP_2_2`: User and role management
* ✅ `STEP_2_1`: Auth & middleware
* ✅ Phase 1: `fuel_prices` table with `effective_from` and `effective_to`

## 🚧 What to Build Now

### 1. Endpoint: `POST /api/fuel-prices`

* Fields: `station_id`, `fuel_type`, `price`, `effective_from`
* Validation:

  * `price > 0`
  * No overlapping time range for the same fuel/station
  * If any existing range is open (`effective_to IS NULL`), set its `effective_to` to `effective_from - 1s`

### 2. Endpoint: `GET /api/fuel-prices`

* Filter by station and fuel\_type
* Show active and historical prices
* Sort descending by `effective_from`

### 3. Internal Query Logic (used by sales)

* Utility: `getPriceAt(station_id, fuel_type, recorded_at)`

## 📁 File Paths

```
src/
├── controllers/fuelPrice.controller.ts
├── routes/fuelPrice.route.ts
├── services/fuelPrice.service.ts
├── validators/fuelPrice.validator.ts
```

## 🧠 Why This Step

Ensures all sales calculations use correct historical prices. Also allows price updates per station and fuel type.

## 🧾 Docs To Update

* `CHANGELOG.md`: Feature — fuel price API with time ranges
* `PHASE_2_SUMMARY.md`: Mark step complete
* `IMPLEMENTATION_INDEX.md`: Add STEP\_2\_5
* `BUSINESS_RULES.md`: Fuel pricing logic section

---

> After saving, implement the endpoints and utility logic. Then update documentation files before proceeding.
