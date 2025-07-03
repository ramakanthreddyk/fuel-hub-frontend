# Documentation Map

This file serves as a reference for all documentation in the FuelSync frontend codebase.

## Documentation Structure

```
docs/
├── README.md                       # Main entry point and documentation map
├── frontend_brain.md               # Central architecture document
├── API_INTEGRATION_GUIDE.md        # API integration patterns and guidelines
├── DOCUMENTATION_REFERENCE_SYSTEM.md # How documentation works
├── api-optimization-checklist.md   # API optimization best practices
├── journeys/                       # User journey documentation
│   ├── SUPERADMIN.md               # SuperAdmin user journey
│   ├── OWNER.md                    # Owner user journey
│   ├── MANAGER.md                  # Manager user journey
│   └── ATTENDANT.md                # Attendant user journey
└── ... (other documentation)
```

## Documentation References

### Core Files

| File Path | References |
|-----------|------------|
| `src/api/core/apiClient.ts` | `docs/API_INTEGRATION_GUIDE.md` |
| `src/api/core/config.ts` | `docs/API_INTEGRATION_GUIDE.md` |
| `src/hooks/api/useQueryConfig.ts` | `docs/API_INTEGRATION_GUIDE.md` |
| `src/hooks/api/useErrorHandler.ts` | `docs/API_INTEGRATION_GUIDE.md` |

### Service Layer

| File Path | References |
|-----------|------------|
| `src/api/services/stationsService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/api/services/pumpsService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/api/services/nozzlesService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/api/services/readingsService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/api/services/fuelPricesService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/api/services/usersService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/api/services/reportsService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/api/services/dashboardService.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |

### Hook Layer

| File Path | References |
|-----------|------------|
| `src/hooks/api/useStations.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/hooks/api/usePumps.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/hooks/api/useNozzles.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/hooks/api/useReadings.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/hooks/api/useFuelPrices.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/hooks/api/useUsers.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/hooks/api/useReports.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/hooks/api/useDashboard.ts` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |

### Key Components

| File Path | References |
|-----------|------------|
| `src/pages/dashboard/UsersPage.tsx` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/OWNER.md` |
| `src/pages/dashboard/NewReadingPage.tsx` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/components/readings/ReadingEntryForm.tsx` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/pages/dashboard/FuelPricesPage.tsx` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |
| `src/components/fuel-prices/FuelPriceTable.tsx` | `docs/API_INTEGRATION_GUIDE.md`, `docs/journeys/MANAGER.md` |

## How to Use This Map

1. **Find the file you're working on** in the tables above
2. **Check the references** to understand which documentation to consult
3. **Update the map** when adding new files or documentation references

## Maintaining Documentation References

When adding new files or making significant changes:

1. Add JSDoc comments with `@see` tags pointing to relevant documentation
2. Update this map with the new file and its references
3. Ensure the referenced documentation exists and is up to date

Example JSDoc comment:

```typescript
/**
 * @file MyComponent.tsx
 * @description Component for managing stations
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
```

## Last Updated

**Date**: Documentation Consolidation
**Updated By**: Development Team
**Next Review**: Quarterly