# FRONTEND_API_USAGE.md — Frontend API Mapping

This document lists each API module used by the React frontend and confirms its corresponding backend endpoint path. The list was generated after reviewing all hooks and pages. Only major resources are shown.

| Module / Hook | Backend Endpoint | Status |
|---------------|-----------------|--------|
| `stationsApi` via `useStations`, `useCreateStation` | `/api/v1/stations` | ✅ matches |
| `pumpsService` via `usePumps`, `useCreatePump` | `/api/v1/pumps` | ✅ matches |
| `nozzlesService` via `useNozzles`, `useCreateNozzle` | `/api/v1/nozzles` | ✅ matches |
| `readingsService` via `useReadings`, `useCreateReading` | `/api/v1/nozzle-readings` | ✅ matches |
| `fuelPricesService` via `useFuelPrices` | `/api/v1/fuel-prices` | ✅ matches |
| `dashboardApi` via `useDashboard` | `/api/v1/dashboard/*` | ✅ matches |
| `reportsApi` via `useReports` | `/api/v1/reports/*` | ✅ matches |
| `creditorsApi` via hooks in `useCreditors` | `/api/v1/creditors` | ✅ matches |
| `usersApi` via hooks in `useAttendant` and user pages | `/api/v1/users` | ✅ matches |
| `superadminApi` via admin pages | `/api/v1/admin/*` | ✅ matches |

For a full endpoint-by-page audit see `src/api/ENDPOINT_VALIDATION_CHECKLIST.md`.
