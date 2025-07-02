
# FuelSync Hub - Frontend Brain 🧠

## Contract-First Architecture

This document serves as the **single authoritative guide** for all frontend development in FuelSync Hub. Everything flows from the **OpenAPI specification** (`docs/openapi-spec.yaml`) as the single source of truth.

## Architecture Overview

```
OpenAPI Spec (docs/openapi-spec.yaml)
    ↓
API Contract (src/api/api-contract.ts)
    ↓
Contract Services (src/api/contract/*.service.ts)
    ↓
React Hooks (src/hooks/useContract*.ts)
    ↓
UI Components (src/components/*)
    ↓
Pages (src/pages/*)
```

## ⚠️ CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION

### 1. Schema Mismatches Found
- **Pump Fields**: OpenAPI uses different field names than current frontend implementation
- **Nozzle Fuel Types**: OpenAPI doesn't include `kerosene`, frontend using invalid enum
- **User Properties**: Inconsistent naming between OpenAPI and frontend types

### 2. Large Files Needing Refactoring
The `src/api/api-contract.ts` file has grown to over 583 lines and needs refactoring. After completing the current migration phase, it should be split into focused modules:

```
src/api/contract/
├── auth.types.ts
├── stations.types.ts  
├── users.types.ts
├── analytics.types.ts
├── reports.types.ts
└── index.ts (re-exports all)
```

---

## Persona Journey Mapping

### 🔧 SuperAdmin Journey
**OpenAPI Prefix**: `/admin/*`  
**Auth**: No tenant context required  
**Journey Doc**: `docs/journeys/SUPERADMIN.md`

| Feature | Component | Hook | Service | Status |
|---------|-----------|------|---------|---------|
| Login | `LoginPage.tsx` | `useContractAuth` | `authService.adminLogin()` | ✅ |
| Dashboard | `superadmin/OverviewPage.tsx` | `useSuperAdminDashboard` | `superAdminService.getDashboard()` | ✅ |
| Manage Tenants | `superadmin/TenantsPage.tsx` | `useTenants` | `superAdminService.getTenants()` | ✅ |
| Manage Plans | `superadmin/PlansPage.tsx` | `usePlans` | `superAdminService.getPlans()` | ✅ |

### 👔 Owner Journey
**OpenAPI Prefix**: `/stations`, `/users`, `/dashboard`  
**Auth**: Requires `x-tenant-id` header  
**Journey Doc**: `docs/journeys/OWNER.md`

| Feature | Component | Hook | Service | Status |
|---------|-----------|------|---------|---------|
| Login | `LoginPage.tsx` | `useContractAuth` | `authService.login()` | ✅ |
| Dashboard | `dashboard/SummaryPage.tsx` | `useDashboard` | `dashboardService.getSummary()` | ⚠️ |
| Stations | `dashboard/StationsPage.tsx` | `useContractStations` | `stationsService.getStations()` | ✅ |
| Users | `dashboard/UsersPage.tsx` | `useUsers` | `usersService.getUsers()` | ⚠️ |
| Reports | `dashboard/ReportsPage.tsx` | `useReports` | `reportsService.getSales()` | ⚠️ |

### 👨‍💼 Manager Journey
**OpenAPI Prefix**: `/pumps`, `/nozzles`, `/readings`, `/fuel-prices`  
**Auth**: Requires `x-tenant-id` header  
**Journey Doc**: `docs/journeys/MANAGER.md`

| Feature | Component | Hook | Service | Status |
|---------|-----------|------|---------|---------|
| Pumps | `dashboard/PumpsPage.tsx` | `usePumps` | `pumpsService.getPumps()` | ⚠️ |
| Nozzles | `dashboard/NozzlesPage.tsx` | `useNozzles` | `nozzlesService.getNozzles()` | ⚠️ |
| Readings | `dashboard/NewReadingPage.tsx` | `useReadings` | `readingsService.create()` | ⚠️ |
| Fuel Prices | `dashboard/FuelPricesPage.tsx` | `useFuelPrices` | `fuelPricesService.create()` | ⚠️ |

### 👷 Attendant Journey
**OpenAPI Prefix**: `/attendant/*`  
**Auth**: Requires `x-tenant-id` header  
**Journey Doc**: `docs/journeys/ATTENDANT.md`

| Feature | Component | Hook | Service | Status |
|---------|-----------|------|---------|---------|
| Stations | `dashboard/StationsPage.tsx` | `useAttendantStations` | `attendantService.getStations()` | ✅ |
| Cash Reports | Custom Component | `useCashReports` | `attendantService.createCashReport()` | ✅ |
| Alerts | `dashboard/AlertsPage.tsx` | `useAttendantAlerts` | `attendantService.getAlerts()` | ✅ |

---

## Contract-First Development Process

### 1. OpenAPI as Source of Truth
- All API changes must be reflected in `docs/openapi-spec.yaml` first
- Frontend types are generated from OpenAPI spec
- No manual type creation - everything flows from the spec

### 2. Type Generation Workflow
```bash
# When OpenAPI spec changes, regenerate types
npm run generate-types  # (to be implemented)
```

### 3. Service Implementation Pattern
```typescript
// All services follow this pattern
export class ExampleService {
  async getItems(): Promise<Item[]> {
    return contractClient.getArray<Item>('/items', 'items');
  }
  
  async createItem(data: CreateItemRequest): Promise<Item> {
    return contractClient.post<Item>('/items', data);
  }
}
```

### 4. Hook Implementation Pattern
```typescript
// All hooks follow React Query + contract service pattern
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => itemsService.getItems(),
  });
};
```

---

## File Organization

### ✅ Current Structure (Keep)
```
src/
├── api/
│   ├── api-contract.ts           # Single contract file (NEEDS REFACTORING)
│   ├── contract-client.ts        # Contract-compliant client
│   └── contract/
│       ├── auth.service.ts       # ✅ Implemented
│       ├── stations.service.ts   # ✅ Implemented
│       ├── attendant.service.ts  # ✅ Implemented
│       ├── superadmin.service.ts # ✅ Implemented
│       ├── manager.service.ts    # ✅ Implemented
│       ├── owner.service.ts      # ✅ Implemented
│       └── [other].service.ts    # ⚠️ To implement
├── hooks/
│   ├── useContractAuth.ts        # ✅ Implemented
│   ├── useContractStations.ts    # ✅ Implemented
│   └── useContract[Entity].ts    # ⚠️ To implement
└── pages/
    ├── LoginPage.tsx             # ✅ Contract-aligned
    ├── dashboard/                # ⚠️ Needs migration
    └── superadmin/               # ✅ Contract-aligned
```

### 🗑️ Files to Remove (Redundant)
```
src/api/
├── auth.ts                      # Replace with contract/auth.service.ts
├── stations.ts                  # Replace with contract/stations.service.ts
├── pumps.ts                     # Replace with contract/pumps.service.ts
├── nozzles.ts                   # Replace with contract/nozzles.service.ts
├── [legacy api files]           # Replace with contract services
└── client.ts                    # Keep as base, but contract-client.ts is primary
```

---

## Migration Checklist

### Phase 1: Core Services (Completed)
- [x] AuthService - Contract aligned
- [x] StationsService - Contract aligned
- [x] SuperAdminService - Contract aligned
- [x] AttendantService - Contract aligned
- [x] ManagerService - Contract aligned
- [x] OwnerService - Contract aligned

### Phase 2: Feature Services (In Progress)
- [ ] DashboardService - Needs migration
- [ ] UsersService - Needs migration
- [ ] PumpsService - From legacy to contract
- [ ] NozzlesService - From legacy to contract
- [ ] ReadingsService - From legacy to contract
- [ ] FuelPricesService - From legacy to contract
- [ ] CreditorsService - From legacy to contract
- [ ] ReportsService - From legacy to contract

### Phase 3: Hook Migration (Pending)
- [ ] Migrate all `use*` hooks to use contract services
- [ ] Remove dependencies on legacy API files
- [ ] Update all components to use contract hooks

### Phase 4: Component Updates (Pending)
- [ ] Update all forms to handle optional fields per OpenAPI spec
- [ ] Add proper loading states and error handling
- [ ] Implement contract-compliant validation

### Phase 5: Refactoring (Critical)
- [ ] Split `api-contract.ts` into focused type modules
- [ ] Implement automated type generation from OpenAPI spec
- [ ] Remove legacy API files after migration
- [ ] Clean up redundant type aliases

---

## Development Guidelines

### 1. Never Modify OpenAPI Spec in Frontend
- OpenAPI spec is owned by backend team
- Frontend requests changes via backend team
- Document mismatches in `docs/FRONTEND_BACKEND_MISMATCHES.md`

### 2. Contract-First Development
- Always implement from OpenAPI spec down
- No manual type definitions
- All services must use `contractClient`

### 3. Error Handling Standards
```typescript
// All contract services use standardized error handling
try {
  const data = await contractClient.get<T>('/endpoint');
  return data;
} catch (error) {
  // Contract client handles error transformation
  throw error;
}
```

### 4. Authentication & Tenant Context
```typescript
// Regular users (owner, manager, attendant)
headers: {
  'Authorization': 'Bearer <token>',
  'x-tenant-id': '<tenant-uuid>'
}

// SuperAdmin
headers: {
  'Authorization': 'Bearer <token>'
  // No tenant header
}
```

---

## Maintenance Workflow

### When OpenAPI Spec Changes
1. Backend team updates `docs/openapi-spec.yaml`
2. Frontend team runs type generation (when implemented)
3. Update affected contract services
4. Update affected hooks and components
5. Test all persona journeys

### When Frontend Needs New API
1. Frontend team documents requirement
2. Backend team updates OpenAPI spec
3. Frontend implements from updated spec
4. No manual type creation

### Regular Maintenance
- Review `docs/FRONTEND_BACKEND_MISMATCHES.md` monthly
- Ensure all legacy API files are migrated
- Monitor contract compliance across all services
- Update this brain document when architecture changes

---

## Contract Compliance Status

### ✅ Fully Compliant
- Authentication (login/logout)
- SuperAdmin operations
- Station management
- Attendant operations
- Manager operations (new)
- Owner operations (new)

### ⚠️ Partially Compliant
- Dashboard operations (uses legacy API)
- User management (uses legacy API)
- Reports (uses legacy API)

### ❌ Not Compliant (CRITICAL)
- **Pump management** - Schema mismatch (field names), legacy API only
- **Nozzle management** - Schema mismatch (fuel types), legacy API only  
- **Reading operations** - No contract service, legacy API only
- **Fuel price management** - No contract service, legacy API only
- **Mixed API Usage** - Components using both contract and legacy APIs

---

## Key References

- **OpenAPI Spec**: `docs/openapi-spec.yaml` (Backend owned)
- **API Contract**: `src/api/api-contract.ts` (Generated from OpenAPI)
- **Contract Client**: `src/api/contract-client.ts` (HTTP wrapper)
- **Journey Docs**: `docs/journeys/*.md` (Persona requirements)
- **Mismatch Log**: `docs/FRONTEND_BACKEND_MISMATCHES.md` (Issues tracking)

---

## Next Steps (PRIORITIZED)

### 🔥 URGENT (This Sprint)
1. **Fix Schema Mismatches**: Align Pump/Nozzle schemas with OpenAPI spec
2. **Refactor api-contract.ts**: Split into focused type modules (CRITICAL - 583+ lines)
3. **Complete Core Service Migration**: Finish Pumps, Nozzles, Readings services

### 📋 HIGH PRIORITY (Next Sprint)  
4. **Implement Type Generation**: Add automated type generation from OpenAPI spec
5. **Update All Hooks**: Migrate remaining hooks to use contract services
6. **Component Audit**: Update all forms for contract compliance

### 🎯 MEDIUM PRIORITY (Following Sprint)
7. **E2E Testing**: Validate all persona journeys work end-to-end
8. **Performance Optimization**: Implement caching strategies
9. **Documentation**: Complete migration of all docs to contract-first approach

**Last Updated**: Contract alignment phase - Type compatibility fixes  
**Next Review**: After completing service migration and api-contract refactoring

---

*This document is the single source of truth for frontend architecture. All development decisions should reference this guide.*
