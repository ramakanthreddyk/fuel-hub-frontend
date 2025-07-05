# STEP\_2\_7\_COMMAND.md — Fuel Delivery & Inventory Tracking

## ✅ Project Context Summary

FuelSync Hub tracks physical fuel deliveries and maintains stock levels per station and fuel type. This is required for inventory reconciliation and planning.

## 📌 Prior Steps Implemented

* ✅ `STEP_2_6`: Creditors and credit sales
* ✅ `STEP_2_5`: Fuel pricing
* ✅ `STEP_2_4`: Nozzle readings → sales
* ✅ `STEP_2_3`: Station, pump, nozzle APIs
* ✅ Phase 1 includes `fuel_deliveries` and `fuel_inventory` tables

## 🚧 What to Build Now

### 1. Fuel Deliveries API

* `POST /api/fuel-deliveries`

  * Fields: `station_id`, `fuel_type`, `volume`, `supplier`, `delivery_date`, `document_number`
* `GET /api/fuel-deliveries`

  * List all for tenant (with optional station filter)

### 2. Inventory Sync Logic

* Auto-increment `fuel_inventory.volume` by delivery amount
* Grouped by `station_id + fuel_type`
* Add logic to initialize a new inventory row if not exists

## 📁 File Paths

```
src/
├── controllers/delivery.controller.ts
├── services/delivery.service.ts
├── routes/delivery.route.ts
├── validators/delivery.validator.ts
```

## 🧠 Why This Step

Tracks incoming stock and updates live fuel availability. Enables reconciliation against sales.

## 🧾 Docs To Update

* `CHANGELOG.md`: Feature — fuel delivery APIs
* `PHASE_2_SUMMARY.md`: Mark step complete
* `IMPLEMENTATION_INDEX.md`: Add STEP\_2\_7
* `BUSINESS_RULES.md`: Delivery → inventory update rule

---

> Once implementation is complete, ensure inventory is adjusted with every new delivery and validations enforce positive volume and existing station.
