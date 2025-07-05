# FuelSync Frontend Brain 🧠

## Contract-First Architecture

This document maps the frontend implementation to the **OpenAPI specification** and **journey documents** as the single source of truth.

## API Integration Strategy

We've implemented a standardized API integration strategy with the following components:

### 1. Core Layer
- **apiClient.ts**: Centralized axios instance with standardized request/response handling
- **config.ts**: API configuration with endpoint definitions

### 2. Service Layer
- **stationsService.ts**: Station-specific API methods
- **pumpsService.ts**: Pump-specific API methods
- **nozzlesService.ts**: Nozzle-specific API methods
- **readingsService.ts**: Reading operations
- **fuelPricesService.ts**: Price management
- **usersService.ts**: User management
- **reportsService.ts**: Report generation
- **dashboardService.ts**: Analytics & metrics

### 3. Hook Layer
- **useStations.ts**: Hooks for station-related operations
- **usePumps.ts**: Hooks for pump-related operations
- **useNozzles.ts**: Hooks for nozzle-related operations
- **useReadings.ts**: Hooks for reading operations
- **useFuelPrices.ts**: Hooks for price management
- **useUsers.ts**: Hooks for user management
- **useReports.ts**: Hooks for report generation
- **useDashboard.ts**: Hooks for analytics & metrics

### 4. Optimization Layer
- **useQueryConfig.ts**: Centralized React Query configuration
- **useErrorHandler.ts**: Centralized error handling

## Development Process

To ensure maintainability and accountability, we've established a standardized development process:

1. **Follow the Documentation**: Start with the README and Documentation Map
2. **Use the Accountability Checklist**: Complete all items in the Development Accountability Checklist
3. **Document Changes**: Update documentation and add JSDoc comments
4. **Provide Implementation Summary**: Summarize what was changed and why

For detailed process information, see:
- [Development Accountability Checklist](./DEVELOPMENT_ACCOUNTABILITY_CHECKLIST.md)
- [AI Agent Development Process](./AI_AGENT_DEVELOPMENT_PROCESS.md)

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
| Dashboard | `dashboard/SummaryPage.tsx` | `dashboardService.getSalesSummary()` | ✅ MIGRATED |
| Manage Stations | `dashboard/StationsPage.tsx` | `stationsService.getStations()` | ✅ ALIGNED |
| Create Station | `CreateStationDialog.tsx` | `stationsService.createStation()` | ✅ ALIGNED |
| Manage Users | `dashboard/UsersPage.tsx` | `usersService.getUsers()` | ✅ MIGRATED |
| View Reports | `dashboard/ReportsPage.tsx` | `reportsService.getSalesReport()` | ✅ MIGRATED |

### 👨‍💼 Manager Journey

**Journey File**: `docs/journeys/MANAGER.md`
**OpenAPI Paths**: `/pumps`, `/nozzles`, `/readings`, `/fuel-prices`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.login()` | ✅ ALIGNED |
| Manage Pumps | `dashboard/PumpsPage.tsx` | `pumpsService.getPumps()` | ✅ MIGRATED |
| Manage Nozzles | `dashboard/NozzlesPage.tsx` | `nozzlesService.getNozzles()` | ✅ MIGRATED |
| Record Readings | `dashboard/NewReadingPage.tsx` | `readingsService.createReading()` | ✅ MIGRATED |
| Set Fuel Prices | `dashboard/FuelPricesPage.tsx` | `fuelPricesService.createPrice()` | ✅ MIGRATED |

### 👷 Attendant Journey

**Journey File**: `docs/journeys/ATTENDANT.md`
**OpenAPI Paths**: `/attendant/*`

| Journey Step | Frontend Component | API Service | Contract Status |
|--------------|-------------------|-------------|-----------------|
| Login | `LoginPage.tsx` | `authService.login()` | ✅ ALIGNED |
| View Stations | `dashboard/StationsPage.tsx` | `attendantService.getAssignedStations()` | ✅ ALIGNED |
| Record Readings | `dashboard/NewReadingPage.tsx` | `readingsService.createReading()` | ✅ MIGRATED |
| Submit Cash Report | Custom Component | `attendantService.createCashReport()` | ✅ ALIGNED |
| View Alerts | `dashboard/AlertsPage.tsx` | `attendantService.getAlerts()` | ✅ ALIGNED |

## Migration Status

### Core Services (✅ Implemented)
- `AuthService` - Authentication & token management
- `SuperAdminService` - Platform administration
- `AttendantService` - Attendant-specific operations
- `StationsService` - Station management
- `PumpsService` - Pump management
- `NozzlesService` - Nozzle management
- `ReadingsService` - Reading operations
- `FuelPricesService` - Price management
- `UsersService` - User management
- `ReportsService` - Report generation
- `DashboardService` - Analytics & metrics

### Components (✅ Migrated)
- `UsersPage.tsx` - User management page
- `NewReadingPage.tsx` - Reading entry page
- `ReadingEntryForm.tsx` - Reading entry form
- `FuelPricesPage.tsx` - Fuel prices management page
- `FuelPriceTable.tsx` - Fuel prices table

### Optimization (✅ Implemented)
- Centralized React Query configuration
- Optimized caching strategies
- Centralized error handling
- Enhanced API client with better error handling
- Improved performance with proper timeout settings

### Documentation (✅ Implemented)
- Comprehensive README
- Documentation Map
- Development Accountability Checklist
- AI Agent Development Process
- Updated Documentation Reference System

## Best Practices

1. **Always Use the Service Layer**: Never make direct API calls from components
2. **Handle Response Formats Consistently**: Use the extraction helpers
3. **Type Everything**: Always define and use proper types
4. **Use React Query for Data Fetching**: Always use React Query hooks in components
5. **Handle Errors Properly**: Use the centralized error handler
6. **Ensure Tenant Context**: Always include tenant headers for authenticated requests
7. **Use Appropriate Caching**: Apply the right caching strategy for each data type
8. **Document Changes**: Update documentation and add JSDoc comments
9. **Follow the Accountability Checklist**: Complete all items in the checklist

## Documentation

For detailed information, refer to:
- [README](./README.md) - Main documentation entry point
- [Documentation Map](./DOCUMENTATION_MAP.md) - Code-documentation relationships
- [API Integration Guide](./API_INTEGRATION_GUIDE.md) - API integration patterns
- [Documentation Reference System](./DOCUMENTATION_REFERENCE_SYSTEM.md) - How documentation works
- [Development Accountability Checklist](./DEVELOPMENT_ACCOUNTABILITY_CHECKLIST.md) - Checklist for all changes
- [AI Agent Development Process](./AI_AGENT_DEVELOPMENT_PROCESS.md) - Process for AI agents

## Maintenance

This document is updated when:
- OpenAPI spec changes
- Journey documents are modified  
- New services are implemented
- Contract drift is detected
- Development process changes

**Last Updated**: Documentation and Process Consolidation
**Updated By**: Development Team
**Next Review**: Quarterly