---
title: ATTENDANT Role Journey
lastUpdated: 2026-07-25
category: journeys
---

# ATTENDANT Role Journey

Attendants perform basic operations like recording nozzle readings and submitting cash reports. They authenticate via `/api/v1/auth/login` with tenant header.

## Available Endpoints
- `GET /api/v1/attendant/stations`
- `GET /api/v1/attendant/pumps?stationId=...`
- `GET /api/v1/attendant/nozzles?pumpId=...`
- `GET /api/v1/attendant/creditors`
- `POST /api/v1/attendant/cash-report`
- `GET /api/v1/attendant/cash-reports`
- `GET /api/v1/attendant/alerts`
- `PUT /api/v1/attendant/alerts/{id}/acknowledge`
- Create nozzle reading: `POST /api/v1/nozzle-readings`
- Check can create: `GET /api/v1/nozzle-readings/can-create/{nozzleId}`
- (planned) `GET /attendance?date=YYYY-MM-DD` *(not implemented; returns empty array)*
- (planned) `GET /shifts?date=YYYY-MM-DD` *(not implemented; returns empty array)*

> **Note**: Attendants cannot call `GET /fuel-prices` or list existing `nozzle-readings`.
> These routes are restricted to Owner/Manager roles. The frontend now skips these
> requests entirely when an attendant is logged in.

All require `Authorization` header and `x-tenant-id` matching the JWT claim.

Attendants have read‑only access to most data and cannot modify stations or users.
JWTs expire in 1h; refresh via `/api/v1/auth/refresh`.

## Typical Flow
1. Login and fetch assigned station list.
2. Retrieve pumps and nozzles for the selected station.
3. Record nozzle readings during shift.
4. Submit daily cash totals via cash report endpoint.
5. Acknowledge any alerts.
