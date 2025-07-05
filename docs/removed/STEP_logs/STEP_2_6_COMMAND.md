# STEP\_2\_6\_COMMAND.md — Creditors and Credit Sales Management

## ✅ Project Context Summary

FuelSync Hub supports issuing fuel on credit to registered creditors. Sales must validate against credit limits, and payments must be tracked.

## 📌 Prior Steps Implemented

* ✅ `STEP_2_5`: Fuel pricing management
* ✅ `STEP_2_4`: Nozzle readings with auto sales
* ✅ `STEP_2_3`: Stations, pumps, nozzles
* ✅ `STEP_2_2`: User and role setup
* ✅ `STEP_2_1`: Auth and middleware
* ✅ Phase 1: `creditors`, `credit_payments` tables

## 🚧 What to Build Now

### 1. CRUD for Creditors

* `POST /api/creditors`: Create new creditor (name, contact, credit limit)
* `GET /api/creditors`: List all for tenant
* `PUT /api/creditors/:id`: Update contact details, limit
* `DELETE /api/creditors/:id`: Soft delete only (mark inactive)

### 2. Credit Sales Support

* `credit_party_id` allowed in sale payload (from readings or manual entries)
* Enforce:

  * Creditor must exist
  * Sale total must not exceed available credit (credit\_limit - balance)

### 3. Credit Payments API

* `POST /api/credit-payments`

  * Fields: `creditor_id`, `amount`, `payment_method`, `reference_number`
  * Updates creditor balance
* `GET /api/credit-payments`: Payment history per creditor

## 📁 File Paths

```
src/
├── controllers/creditor.controller.ts
├── services/creditor.service.ts
├── routes/creditor.route.ts
├── validators/creditor.validator.ts
```

## 🧠 Why This Step

Supports fuel on credit with enforcement and tracking. Also sets up repayment tracking logic per tenant.

## 🧾 Docs To Update

* `CHANGELOG.md`: Feature — creditors + credit sales APIs
* `PHASE_2_SUMMARY.md`: Mark step complete
* `IMPLEMENTATION_INDEX.md`: Add STEP\_2\_6
* `BUSINESS_RULES.md`: Credit sale validation rules

---

> After saving this command file, proceed to implement all endpoints and validations, then update documentation accordingly.
