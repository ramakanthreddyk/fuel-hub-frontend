# Frontend Integration Instructions

The backend now exposes additional endpoints under `/api/v1`. Implement the following React Query hooks or API utilities to consume them.

## Alerts
- **GET `/api/v1/alerts`** – optional query params `stationId`, `unreadOnly=true`
  ```ts
  export function useAlerts(params?: { stationId?: string; unreadOnly?: boolean })
  ```
- **PATCH `/api/v1/alerts/{id}/read`**
  ```ts
  export function useMarkAlertRead(id: string)
  ```

## Station Comparison
- **GET `/api/v1/analytics/station-comparison`** – query params `stationIds` (comma separated) and optional `period`
  ```ts
  export function useStationComparison(opts: { stationIds: string[]; period?: string })
  ```

## Fuel Inventory
- **GET `/api/v1/fuel-inventory`** – optional `stationId`, `fuelType`
  ```ts
  export function useFuelInventory(params?: { stationId?: string; fuelType?: string })
  ```

## Fuel Price Update
- **PUT `/api/v1/fuel-prices/{id}`** – body `{ stationId, fuelType, price, validFrom }`
  ```ts
  export function useUpdateFuelPrice(id: string)
  ```

## Sales Report Export
- **POST `/api/v1/reports/sales`** – body may include `stationId`, `dateFrom`, `dateTo`, `format` (`csv` or `json`)
  ```ts
  export function useExportSalesReport(filters: { stationId?: string; dateFrom?: string; dateTo?: string; format?: string })
  ```

Ensure all requests include the tenant ID header and bearer token as in existing API utilities.
