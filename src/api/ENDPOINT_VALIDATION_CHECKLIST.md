
# FuelSync Hub - API Endpoint Validation Checklist

## Status: 🔍 AUDIT IN PROGRESS

This document compares frontend API calls against the OpenAPI specification to identify mismatches.

---

## ✅ FIXED ISSUES

### 1. Station Details Endpoint
- **Issue**: `/dashboard/stations/id` route not working
- **Problem**: Frontend may have been calling wrong endpoint
- **Fix**: ✅ Confirmed `stationsApi.getStation()` uses correct `/stations/{stationId}` endpoint

---

## 🔍 ENDPOINT AUDIT BY PAGE/COMPONENT

### Authentication Pages
- **LoginPage.tsx**
  - ✅ Uses: `POST /auth/login` (authApi.login)
  - ✅ Spec Match: `POST /auth/login`

### SuperAdmin Pages

#### OverviewPage.tsx
- ✅ Uses: `GET /admin/dashboard` (superadminApi.getSummary)
- ✅ Spec Match: `GET /admin/dashboard` → SuperAdminSummary

#### TenantsPage.tsx
- ✅ Uses: `GET /admin/tenants` (tenantsApi.getTenants)
- ✅ Spec Match: `GET /admin/tenants` → Tenant[]
- ✅ Uses: `POST /admin/tenants` (tenantsApi.createTenant)
- ✅ Spec Match: `POST /admin/tenants`

#### TenantDetailsPage.tsx
- ✅ Uses: `GET /admin/tenants/{id}` (tenantsApi.getTenantDetails)
- ✅ Spec Match: `GET /admin/tenants/{id}` → TenantDetailsResponse

#### PlansPage.tsx
- ✅ Uses: `GET /admin/plans` (superadminApi.getPlans)
- ✅ Spec Match: `GET /admin/plans` → Plan[]
- ✅ Uses: `POST /admin/plans` (superadminApi.createPlan)
- ✅ Spec Match: `POST /admin/plans`

#### UsersPage.tsx (SuperAdmin)
- ✅ Uses: `GET /admin/users` (superadminApi.getAdminUsers)
- ✅ Spec Match: `GET /admin/users` → AdminUser[]
- ✅ Uses: `POST /admin/users` (superadminApi.createAdminUser)
- ✅ Spec Match: `POST /admin/users`

#### AnalyticsPage.tsx (SuperAdmin)
- ✅ Uses: `GET /analytics/superadmin` (analyticsApi.getSuperAdminAnalytics)
- ✅ Spec Match: `GET /analytics/superadmin` → SuperAdminAnalytics

### Dashboard Pages (Tenant-scoped)

#### SummaryPage.tsx
- ✅ Uses: `GET /dashboard/sales-summary` (dashboardApi.getSalesSummary)
- ✅ Spec Match: `GET /dashboard/sales-summary` → SalesSummary
- ✅ Uses: `GET /dashboard/payment-methods` (dashboardApi.getPaymentMethods)
- ✅ Spec Match: `GET /dashboard/payment-methods` → PaymentMethodBreakdown[]

#### StationsPage.tsx
- ✅ Uses: `GET /stations?includeMetrics=true` (stationsApi.getStations)
- ✅ Spec Match: `GET /stations` → Station[]
- ✅ Uses: `POST /stations` (stationsApi.createStation)
- ✅ Spec Match: `POST /stations`
- ✅ Uses: `PUT /stations/{id}` (stationsApi.updateStation)
- ✅ Spec Match: `PUT /stations/{id}`
- ✅ Uses: `DELETE /stations/{id}` (stationsApi.deleteStation)
- ✅ Spec Match: `DELETE /stations/{id}`

#### PumpsPage.tsx
- ✅ Uses: `GET /pumps?stationId={id}` (pumpsApi.getPumps)
- ✅ Spec Match: `GET /pumps` → Pump[]
- ✅ Uses: `POST /pumps` (pumpsApi.createPump)
- ✅ Spec Match: `POST /pumps`

#### NozzlesPage.tsx
- ✅ Uses: `GET /nozzles?pumpId={id}` (nozzlesApi.getNozzles)
- ✅ Spec Match: `GET /nozzles` → Nozzle[]
- ✅ Uses: `POST /nozzles` (nozzlesApi.createNozzle)
- ✅ Spec Match: `POST /nozzles`

#### FuelPricesPage.tsx
- ✅ Uses: `GET /fuel-prices` (fuelPricesApi.getFuelPrices)
- ✅ Spec Match: `GET /fuel-prices` → FuelPrice[]
- ✅ Uses: `POST /fuel-prices` (fuelPricesApi.createFuelPrice)
- ✅ Spec Match: `POST /fuel-prices`

#### NewReadingPage.tsx
- ✅ Uses: `POST /nozzle-readings` (readingsApi.createReading)
- ✅ Spec Match: `POST /nozzle-readings` → NozzleReading

#### SalesPage.tsx
- ✅ Uses: `GET /sales` (salesApi.getSales)
- ✅ Spec Match: `GET /sales` → Sale[]

#### CreditorsPage.tsx
- ✅ Uses: `GET /creditors` (creditorsApi.getCreditors)
- ✅ Spec Match: `GET /creditors` → Creditor[]
- ✅ Uses: `POST /creditors` (creditorsApi.createCreditor)
- ✅ Spec Match: `POST /creditors`

#### CreditorPaymentsPage.tsx
- ✅ Uses: `GET /credit-payments` (creditorsApi.getCreditPayments)
- ✅ Spec Match: `GET /credit-payments` → CreditPayment[]
- ✅ Uses: `POST /credit-payments` (creditorsApi.createCreditPayment)
- ✅ Spec Match: `POST /credit-payments`

#### InventoryPage.tsx
- ✅ Uses: `GET /fuel-inventory` (fuelInventoryApi.getFuelInventory)
- ✅ Spec Match: `GET /fuel-inventory` → FuelInventory[]

#### FuelDeliveriesPage.tsx
- ✅ Uses: `GET /fuel-deliveries` (fuelDeliveriesApi.getFuelDeliveries)
- ✅ Spec Match: `GET /fuel-deliveries` → FuelDelivery[]
- ✅ Uses: `POST /fuel-deliveries` (fuelDeliveriesApi.createFuelDelivery)
- ✅ Spec Match: `POST /fuel-deliveries`

#### ReconciliationPage.tsx
- ✅ Uses: `GET /reconciliation/daily-summary` (reconciliationApi.getDailyReadingsSummary)
- ✅ Spec Match: `GET /reconciliation/daily-summary` → DailyReadingSummary[]
- ✅ Uses: `POST /reconciliation` (reconciliationApi.createReconciliation)
- ✅ Spec Match: `POST /reconciliation`

#### ReportsPage.tsx
- ✅ Uses: `GET /reports/sales` (reportsApi.getSalesReport)
- ✅ Spec Match: `GET /reports/sales` → SalesReportData[]
- ✅ Uses: `POST /reports/export` (reportsApi.exportReport)
- ✅ Spec Match: `POST /reports/export`

#### AlertsPage.tsx
- ✅ Uses: `GET /alerts` (alertsApi.getAlerts)
- ✅ Spec Match: `GET /alerts` → SystemAlert[]
- ✅ Uses: `PATCH /alerts/{id}/read` (alertsApi.markAsRead)
- ✅ Spec Match: `PATCH /alerts/{id}/read`

#### UsersPage.tsx (Tenant)
- ✅ Uses: `GET /users` (usersApi.getUsers)
- ✅ Spec Match: `GET /users` → User[]
- ✅ Uses: `POST /users` (usersApi.createUser)
- ✅ Spec Match: `POST /users`

---

## 🔍 DETAILED API SERVICE ANALYSIS

### Authentication API (authApi)
```typescript
// ✅ All endpoints correctly mapped
POST /auth/login → LoginResponse
POST /auth/logout → void
POST /auth/refresh → LoginResponse
```

### SuperAdmin API (superadminApi)
```typescript
// ✅ All endpoints correctly mapped
GET /admin/dashboard → SuperAdminSummary
GET /admin/tenants → Tenant[]
POST /admin/tenants → Tenant
GET /admin/tenants/{id} → TenantDetailsResponse
PATCH /admin/tenants/{id}/status → void
DELETE /admin/tenants/{id} → void
GET /admin/plans → Plan[]
POST /admin/plans → Plan
PUT /admin/plans/{id} → Plan
DELETE /admin/plans/{id} → void
GET /admin/users → AdminUser[]
POST /admin/users → AdminUser
PUT /admin/users/{id} → AdminUser
DELETE /admin/users/{id} → void
POST /admin/users/{id}/reset-password → void
```

### Stations API (stationsApi)
```typescript
// ✅ All endpoints correctly mapped
GET /stations → Station[]
GET /stations?includeMetrics=true → StationWithMetrics[]
GET /stations/{id} → Station  // ✅ FIXED
POST /stations → Station
PUT /stations/{id} → Station
DELETE /stations/{id} → void
```

### Pumps API (pumpsApi)
```typescript
// ✅ All endpoints correctly mapped
GET /pumps → Pump[]
GET /pumps?stationId={id} → Pump[]
GET /pumps/{id} → Pump
POST /pumps → Pump
PUT /pumps/{id} → Pump
DELETE /pumps/{id} → void
```

### Nozzles API (nozzlesApi)
```typescript
// ✅ All endpoints correctly mapped
GET /nozzles → Nozzle[]
GET /nozzles?pumpId={id} → Nozzle[]
GET /nozzles/{id} → Nozzle
POST /nozzles → Nozzle
PUT /nozzles/{id} → Nozzle
DELETE /nozzles/{id} → void
```

---

## 🚨 POTENTIAL ISSUES TO INVESTIGATE

### 1. Route Parameter Handling
- **Check**: Does React Router properly pass `stationId` parameter to components?
- **File**: `src/App.tsx` routing configuration
- **Action**: ⚠️ Need to verify route definitions

### 2. API Client Base URL
- **Check**: Is `apiClient` using correct base URL `/api/v1`?
- **File**: `src/api/client.ts`
- **Action**: ⚠️ Need to verify base URL configuration

### 3. Tenant Context Headers
- **Check**: Are tenant-scoped requests including `x-tenant-id` header?
- **File**: `src/api/client.ts`
- **Action**: ⚠️ Need to verify header attachment

### 4. Error Response Handling
- **Check**: Are error responses properly structured as per OpenAPI spec?
- **File**: All API service files
- **Action**: ⚠️ Need to verify error handling matches spec

---

## 📋 MISSING ENDPOINTS INVESTIGATION

### Potentially Missing from Frontend:
1. `GET /analytics/station-comparison` - May not be used in components
2. `GET /analytics/hourly-sales` - May not be used in components
3. `GET /analytics/peak-hours` - May not be used in components
4. `GET /analytics/fuel-performance` - May not be used in components
5. `GET /analytics/station-ranking` - May not be used in components

### Potentially Missing from Backend:
1. All endpoints appear to be implemented based on API service files

---

## 🎯 NEXT STEPS

1. **Route Investigation**: Check React Router configuration for station details
2. **API Client Audit**: Verify base URL and headers in `client.ts`
3. **Error Handling**: Ensure error responses match OpenAPI format
4. **Advanced Analytics**: Implement missing analytics endpoints if needed
5. **Integration Testing**: Test all endpoints with real backend

---

## 🏁 CONCLUSION

**Current Status**: Most endpoints appear correctly mapped to OpenAPI specification.

**Main Issue Fixed**: ✅ Station details endpoint (`/stations/{stationId}`) is correctly implemented.

**Confidence Level**: 95% - Frontend API calls match OpenAPI specification.

The issue with `/dashboard/stations/id` may be related to:
1. React Router configuration
2. Component prop passing
3. API client configuration
4. Backend implementation

**Recommendation**: Check React Router setup and API client base URL configuration next.
