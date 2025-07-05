---
title: Role API Implementation Matrix
lastUpdated: 2025-07-05
category: backend
---

# Role API Implementation Matrix

This table links frontend pages and hooks to backend endpoints for each user role.
Sources inspected: `src/pages`, `src/hooks`, `src/api` services and `docs/openapi-spec.yaml`.

| Role | Key Pages (`src/pages`) | Hooks / Services | Backend Endpoints |
|------|------------------------|-----------------|------------------|
| **SuperAdmin** | `superadmin/OverviewPage.tsx`, `TenantsPage.tsx`, `CreateTenantPage.tsx`, `PlansPage.tsx`, `UsersPage.tsx`, `TenantSettingsPage.tsx`, `AnalyticsPage.tsx` | `superAdminApi` (in `src/api/superadmin.ts`), hooks from `useAnalytics` | `/admin/auth/login`, `/admin/tenants`, `/admin/plans`, `/admin/users`, `/analytics/superadmin` |
| **Owner** | `dashboard/*` (Stations, Pumps, Nozzles, FuelPrices, Users, Reports, Inventory, Alerts, Summary) | `stationsService` & `useStations`, `pumpsService` & `usePumps`, `nozzlesService` & `useNozzles`, `fuelPricesService` & `useFuelPrices`, `usersService` & `useUsers`, `dashboardService` & `useDashboard`, `inventoryService` & `useInventory`, `alertsApi` & `useAlerts` | CRUD under `/stations`, `/pumps`, `/nozzles`, `/fuel-prices`, `/users`, dashboard metrics under `/dashboard/*`, `/inventory`, `/alerts` |
| **Manager** | `dashboard/PumpsPage.tsx`, `NozzlesPage.tsx`, `NewReadingPage.tsx`, `FuelPricesPage.tsx`, `AlertsPage.tsx`, `ReportsPage.tsx` | `manager` hooks using `pumpsService`, `nozzlesService`, `readingsService`, `fuelPricesService`, `alertsApi`, `reportsService` | `/pumps`, `/nozzles`, `/nozzle-readings`, `/fuel-prices`, `/alerts`, `/reports/sales` |
| **Attendant** | `AttendantDashboardPage.tsx`, `CashReportPage.tsx`, `CashReportsListPage.tsx`, `AlertsPage.tsx`, `NewReadingPage.tsx` | `useAttendantStations`, `useAttendantPumps`, `useAttendantNozzles`, `useCreateCashReport`, `useCashReports`, `useAttendantAlerts` from `src/hooks/useAttendant.ts` | `/attendant/stations`, `/attendant/pumps`, `/attendant/nozzles`, `/attendant/cash-report`, `/attendant/cash-reports`, `/attendant/alerts`, `/nozzle-readings` |

All pages are wrapped with `RequireAuth` which enforces role guards via the `allowedRoles` prop.
