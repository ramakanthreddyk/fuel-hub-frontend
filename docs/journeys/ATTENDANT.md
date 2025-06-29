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

All require `Authorization` header and `x-tenant-id` matching the JWT claim.

Attendants have read‑only access to most data and cannot modify stations or users.
JWTs expire in 1h; refresh via `/api/v1/auth/refresh`.

## Typical Flow
1. Login and fetch assigned station list.
2. Record nozzle readings during shift.
3. Submit daily cash totals via cash report endpoint.
4. Acknowledge any alerts.

