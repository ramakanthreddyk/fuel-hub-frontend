
# API Endpoints Checklist - Aligned with OpenAPI Spec

## ✅ FIXED ENDPOINTS

### Authentication
- ✅ POST `/auth/login` - Login user
- ✅ POST `/auth/logout` - Logout user
- ✅ POST `/auth/refresh` - Refresh token

### Stations (Tenant-scoped)
- ✅ GET `/stations` - Get all stations
- ✅ GET `/stations?includeMetrics=true` - Get stations with metrics
- ✅ POST `/stations` - Create new station
- ✅ GET `/stations/{id}` - Get station by ID
- ✅ PUT `/stations/{id}` - Update station
- ✅ DELETE `/stations/{id}` - Delete station

### SuperAdmin Routes
- ✅ GET `/admin/dashboard` - Get admin dashboard summary
- ✅ GET `/admin/tenants` - Get all tenants
- ✅ GET `/admin/tenants/{id}` - Get tenant details
- ✅ POST `/admin/tenants` - Create tenant
- ✅ PATCH `/admin/tenants/{id}/status` - Update tenant status
- ✅ DELETE `/admin/tenants/{id}` - Delete tenant
- ✅ GET `/admin/plans` - Get all plans
- ✅ POST `/admin/plans` - Create plan
- ✅ PUT `/admin/plans/{id}` - Update plan
- ✅ DELETE `/admin/plans/{id}` - Delete plan
- ✅ GET `/admin/users` - Get admin users
- ✅ POST `/admin/users` - Create admin user

### Fuel Prices
- ✅ GET `/fuel-prices` - Get all fuel prices
- ✅ POST `/fuel-prices` - Create fuel price
- ✅ PUT `/fuel-prices/{id}` - Update fuel price (generic object)

## 🔍 ENDPOINTS TO VERIFY

### Pumps
- 🔍 GET `/pumps` - Get all pumps
- 🔍 GET `/pumps?stationId={id}` - Get pumps by station
- 🔍 POST `/pumps` - Create pump
- 🔍 GET `/pumps/{id}` - Get pump details
- 🔍 PUT `/pumps/{id}` - Update pump
- 🔍 DELETE `/pumps/{id}` - Delete pump

### Nozzles
- 🔍 GET `/nozzles` - Get all nozzles
- 🔍 GET `/nozzles?pumpId={id}` - Get nozzles by pump
- 🔍 POST `/nozzles` - Create nozzle
- 🔍 PUT `/nozzles/{id}` - Update nozzle
- 🔍 DELETE `/nozzles/{id}` - Delete nozzle

### Readings
- 🔍 GET `/readings` - Get all readings
- 🔍 POST `/readings` - Create reading
- 🔍 GET `/readings/{id}` - Get reading details
- 🔍 PUT `/readings/{id}` - Update reading
- 🔍 DELETE `/readings/{id}` - Delete reading

### Sales
- 🔍 GET `/sales` - Get all sales
- 🔍 GET `/sales?stationId={id}` - Filter by station
- 🔍 GET `/sales?startDate={date}&endDate={date}` - Filter by date range

### Dashboard
- 🔍 GET `/dashboard/sales-summary` - Sales summary
- 🔍 GET `/dashboard/payment-methods` - Payment breakdown
- 🔍 GET `/dashboard/fuel-breakdown` - Fuel type breakdown
- 🔍 GET `/dashboard/top-creditors` - Top creditors
- 🔍 GET `/dashboard/sales-trend` - Sales trend data

### Users (Tenant-scoped)
- 🔍 GET `/users` - Get all users
- 🔍 POST `/users` - Create user
- 🔍 GET `/users/{id}` - Get user details
- 🔍 PUT `/users/{id}` - Update user
- 🔍 DELETE `/users/{id}` - Delete user
- 🔍 POST `/users/{id}/change-password` - Change password
- 🔍 POST `/users/{id}/reset-password` - Reset password

### Creditors
- 🔍 GET `/creditors` - Get all creditors
- 🔍 POST `/creditors` - Create creditor
- 🔍 GET `/creditors/{id}` - Get creditor details
- 🔍 PUT `/creditors/{id}` - Update creditor
- 🔍 DELETE `/creditors/{id}` - Delete creditor
- 🔍 GET `/creditors/{id}/payments` - Get payments
- 🔍 POST `/creditors/{id}/payments` - Create payment

## ❌ PROBLEMATIC PATTERNS FIXED

### Before (Wrong):
- ❌ `/admin/organizations` → ✅ `/admin/tenants`
- ❌ `/admin/tenants/{id}/users` → ✅ `/admin/tenants/{id}` (users included)
- ❌ Generic UpdateFuelPriceRequest → ✅ Generic object for PUT

### Data Mapping Issues Fixed:
- ✅ Dashboard: `tenantCount` → `totalTenants`
- ✅ Dashboard: `activeTenantCount` → `activeTenants`
- ✅ Dashboard: `planCount` → `totalPlans`
- ✅ Dashboard: `adminCount` → `totalAdminUsers`

## NEXT STEPS
1. Test station creation with the fixed `/stations` endpoint
2. Verify all SuperAdmin routes work correctly
3. Test dashboard data mapping
4. Check remaining endpoints marked with 🔍
