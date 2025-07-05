# API Differences Between Frontend Expectations and Backend Implementation

The canonical API specification resides in `docs/openapi.yaml`.
The legacy `frontend/docs/openapi-v1.yaml` remains for historical reference. The backend currently serves endpoints under `/api/v1`. The table below captures the remaining gaps.
| API Endpoint (Frontend) | Frontend Expects | Backend Provides | Status |
|-------------------------|-----------------|------------------|-------|
| **POST /v1/auth/login** | `{ email, password } → { token, user }` | `POST /api/v1/auth/login` same payload | 🔧 Path prefix mismatch |
| **POST /v1/auth/logout** | no body → `200` | `POST /api/v1/auth/logout` | 🔧 Path prefix mismatch |
| **POST /v1/auth/refresh** | none → `{ token, user }` | `POST /api/v1/auth/refresh` | 🔧 Path prefix mismatch |
| **GET /v1/alerts** | `Alert[]` | `GET /api/v1/alerts` | ✅ Implemented |
| **PATCH /v1/alerts/{id}/read** | mark alert read | `PATCH /api/v1/alerts/{id}/read` | ✅ Implemented |
| **GET /v1/analytics/station-comparison** | `StationComparison[]` | `GET /api/v1/analytics/station-comparison` | ✅ Implemented |
| **GET /v1/fuel-inventory** | `FuelInventory[]` | `GET /api/v1/fuel-inventory` | ✅ Implemented |
| **POST /v1/fuel-prices** | create price | `POST /api/v1/fuel-prices` | 🔧 Path prefix mismatch |
| **PUT /v1/fuel-prices/{id}** | update price | `PUT /api/v1/fuel-prices/{id}` | ✅ Implemented |
| **GET /v1/stations** | list stations (`includeMetrics` param) | `GET /api/v1/stations` (param supported) | 🔧 Path prefix mismatch |
| **GET /v1/stations/{id}** | station details | `GET /api/v1/stations/{id}` | 🔧 Path prefix mismatch |
| **GET /v1/nozzle-readings** | readings filtered by `nozzleId` | `GET /api/v1/nozzle-readings` | 🔧 Path prefix mismatch |
| **POST /v1/reports/sales** | CSV export, summary | `POST /api/v1/reports/sales` | ✅ Implemented |
| **GET /v1/sales** | list with filters | `GET /api/v1/sales` | 🔧 Path prefix mismatch |
| **GET /v1/users** | user list | `GET /api/v1/users` | 🔧 Path prefix mismatch |
| **POST /v1/users** | create user | `POST /api/v1/users` | 🔧 Path prefix mismatch |

`❌ Missing` denotes endpoints defined in `openapi-v1.yaml` that are not present in `docs/openapi.yaml` or backend routes. `🔧 Path prefix mismatch` indicates functionality exists but under `/api/v1/*` rather than `/v1/*`.
