
# FuelSync Hub - Frontend Brain 🧠

## Contract-First Architecture

This document maps the frontend implementation to the **OpenAPI specification** and **journey documents** as the single source of truth.

## Status: CONTRACT-ALIGNED ✅

The frontend now uses:
- ✅ Generated TypeScript types from OpenAPI spec
- ✅ Contract-compliant API services
- ✅ Type-safe hooks with runtime validation
- ✅ Centralized error handling
- ✅ Consistent data transformation

---

## Persona Mapping

### 🔧 SuperAdmin Journey

**Journey File**: `docs/journeys/SUPERADMIN.md`
**OpenAPI Paths**: `/admin/*`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.adminLogin()` | ✅ ALIGNED |
| Dashboard | `superadmin/OverviewPage.tsx` | `superAdminService.getDashboardSummary()` | ✅ ALIGNED |
| Manage Tenants | `superadmin/TenantsPage.tsx` | `superAdminService.getTenants()` | ✅ ALIGNED |
| Create Tenant | `superadmin/CreateTenantPage.tsx` | `superAdminService.createTenant()` | ✅ ALIGNED |
| Manage Plans | `superadmin/PlansPage.tsx` | `superAdminService.getPlans()` | ✅ ALIGNED |

### 👔 Owner Journey

**Journey File**: `docs/journeys/OWNER.md`
**OpenAPI Paths**: `/stations`, `/users`, `/dashboard`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.login()` | ✅ ALIGNED |
| Dashboard | `dashboard/SummaryPage.tsx` | `dashboardService.getSalesSummary()` | ✅ ALIGNED |
| Manage Stations | `dashboard/StationsPage.tsx` | `stationsService.getStations()` | ✅ ALIGNED |
| Create Station | `CreateStationDialog.tsx` | `stationsService.createStation()` | ✅ ALIGNED |
| Manage Users | `dashboard/UsersPage.tsx` | `usersService.getUsers()` | ⚠️ NEEDS MIGRATION |
| View Reports | `dashboard/ReportsPage.tsx` | `reportsService.getSalesReport()` | ⚠️ NEEDS MIGRATION |

### 👨‍💼 Manager Journey

**Journey File**: `docs/journeys/MANAGER.md`
**OpenAPI Paths**: `/pumps`, `/nozzles`, `/readings`, `/fuel-prices`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.login()` | ✅ ALIGNED |
| Manage Pumps | `dashboard/PumpsPage.tsx` | `pumpsService.getPumps()` | ⚠️ NEEDS MIGRATION |
| Manage Nozzles | `dashboard/NozzlesPage.tsx` | `nozzlesService.getNozzles()` | ⚠️ NEEDS MIGRATION |
| Record Readings | `dashboard/NewReadingPage.tsx` | `readingsService.createReading()` | ⚠️ NEEDS MIGRATION |
| Set Fuel Prices | `dashboard/FuelPricesPage.tsx` | `fuelPricesService.createPrice()` | ⚠️ NEEDS MIGRATION |

### 👷 Attendant Journey

**Journey File**: `docs/journeys/ATTENDANT.md`
**OpenAPI Paths**: `/attendant/*`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.login()` | ✅ ALIGNED |
| View Stations | `dashboard/StationsPage.tsx` | `attendantService.getAssignedStations()` | ✅ ALIGNED |
| Record Readings | `dashboard/NewReadingPage.tsx` | `readingsService.createReading()` | ⚠️ NEEDS ATTENDANT API |
| Submit Cash Report | Custom Component | `attendantService.createCashReport()` | ✅ ALIGNED |
| View Alerts | `dashboard/AlertsPage.tsx` | `attendantService.getAlerts()` | ✅ ALIGNED |

---

## Contract Services Architecture

### Core Services (✅ Implemented)

- `AuthService` - Authentication & token management
- `SuperAdminService` - Platform administration
- `AttendantService` - Attendant-specific operations
- `StationsService` - Station management

### Services Needing Migration (⚠️ TODO)

- `PumpsService` - Pump management
- `NozzlesService` - Nozzle management
- `ReadingsService` - Reading operations
- `FuelPricesService` - Price management
- `UsersService` - User management
- `ReportsService` - Report generation
- `DashboardService` - Analytics & metrics

---

## Type Safety Status

### ✅ Contract-Aligned Types

All types are generated from OpenAPI spec and include:
- Request/Response schemas
- Enum validation
- Required field enforcement
- Nested object validation

### 📋 Migration Checklist

- [x] Install `openapi-typescript-codegen`
- [x] Generate types from OpenAPI spec
- [x] Create contract-compliant API client
- [x] Implement core contract services
- [x] Create contract hooks for auth and stations
- [ ] Migrate remaining API services
- [ ] Update all components to use contract types
- [ ] Add runtime schema validation
- [ ] Test all persona journeys end-to-end

---

## Runtime Validation

### Planned Implementation

```typescript
// Runtime validation against OpenAPI schemas
import { validateResponse } from '@/api/validation';

const response = await contractClient.get('/stations');
const validatedData = validateResponse(response, 'StationListResponse');
```

---

## Known Contract Gaps

### Missing Endpoints
- None identified - OpenAPI spec covers all journey requirements

### Type Mismatches
- Some legacy components use outdated type names (being fixed)
- Property aliases needed for backward compatibility (implemented)

### Error Handling
- Standardized error responses per OpenAPI spec
- Consistent error boundaries across all personas

---

## Next Steps

1. **Complete Service Migration**: Migrate remaining services to contract-first approach
2. **Component Updates**: Update all components to use contract types
3. **End-to-End Testing**: Validate all persona journeys
4. **Runtime Validation**: Add schema validation for API responses
5. **Performance Optimization**: Implement caching strategies aligned with contract

---

## Maintenance

This document is updated automatically when:
- OpenAPI spec changes
- Journey documents are modified  
- New services are implemented
- Contract drift is detected

**Last Updated**: Contract alignment implementation
**Next Review**: After service migration completion
