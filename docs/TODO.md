# FuelSync Frontend TODO List

## Backend API Status

1. **Attendant API**
   - ✅ `/api/v1/attendant/cash-report` POST endpoint is implemented with attendant role access
   - ✅ `/api/v1/attendant/cash-reports` GET endpoint is implemented with attendant role access
   - ✅ Frontend updated to match API spec exactly (removed unsupported parameters)
   - ✅ Removed unnecessary x-user-role header to avoid CORS preflight issues

2. **Creditor API**
   - ✅ `/api/v1/creditors` GET endpoint is implemented
   - ✅ `/api/v1/creditors/{id}` GET endpoint is implemented

3. **Fuel Inventory API**
   - ⚠️ `/api/v1/fuel-inventory` endpoint is implemented but returns 500 error (likely due to tenant context or missing table)
   - ✅ `/api/v1/fuel-inventory/summary` endpoint is implemented
   - ✅ Frontend updated to use the summary endpoint with fallback calculation

4. **Reports API**
   - ✅ `/api/v1/reports/sales` endpoint is implemented
   - ✅ `/api/v1/reports/export` endpoint is implemented
   - ✅ `/api/v1/reports/schedule` endpoint is implemented
   - ✅ Frontend updated to use these endpoints

5. **Pumps API**
   - ✅ `/api/v1/pumps` GET endpoint works
   - ✅ `/api/v1/pumps` POST endpoint works
   - ✅ `/api/v1/pumps/{id}` GET endpoint works
   - ✅ Optimistic updates implemented for better UX

6. **Nozzles API**
   - ✅ `/api/v1/nozzles` GET endpoint works
   - ✅ `/api/v1/nozzles` POST endpoint works
   - ✅ `/api/v1/nozzles/{id}` GET endpoint works

7. **Stations API**
   - ✅ `/api/v1/stations` GET endpoint works
   - ✅ `/api/v1/stations` POST endpoint works
   - ✅ `/api/v1/stations/{id}` GET endpoint works

8. **Readings API**
   - ✅ `/api/v1/readings` GET endpoint works
   - ✅ `/api/v1/readings` POST endpoint works
   - ✅ `/api/v1/readings/latest/{nozzleId}` GET endpoint works

9. **Fuel Prices API**
   - ✅ `/api/v1/fuel-prices` GET endpoint works
   - ✅ `/api/v1/fuel-prices` POST endpoint works

## Frontend Tasks

1. **API Integration Updates**
   - ✅ Update inventory service to use the implemented `/api/v1/fuel-inventory/summary` endpoint
   - ✅ Update reports service to use the implemented reports endpoints
   - ✅ Fix SelectItem empty string value in CashReportsListPage
   - ✅ Update attendant service to match API spec exactly
   - ✅ Add automatic token refresh to fix authentication issues
   - ✅ Remove unnecessary custom headers to avoid CORS issues
   - ⚠️ Investigate and fix the 500 error with `/api/v1/fuel-inventory` (check tenant context)

2. **Role-Based Features**
   - ✅ Implemented attendant-specific dashboard
   - ✅ Implemented role-based sidebar navigation
   - ✅ Added cash report functionality for attendants
   - ✅ Added token refresh to fix authentication issues
   - ❌ Implement manager-specific features
   - ❌ Implement owner-specific features

3. **Optimistic Updates**
   - ✅ Implement optimistic updates for pump creation
   - ❌ Implement optimistic updates for nozzle creation
   - ❌ Implement optimistic updates for station creation
   - ❌ Implement optimistic updates for reading creation
   - ❌ Implement optimistic updates for cash report submission

4. **Error Handling**
   - ✅ Basic error handling for API calls
   - ✅ Added automatic token refresh for 401 errors
   - ❌ Comprehensive error handling with retry mechanisms
   - ❌ Offline support with local storage

5. **Performance**
   - ❌ Implement pagination for large data sets
   - ❌ Implement virtualization for long lists
   - ❌ Optimize bundle size

6. **Testing**
   - ❌ Unit tests for components
   - ❌ Integration tests for API calls
   - ❌ End-to-end tests for user flows

7. **Accessibility**
   - ❌ Audit and fix accessibility issues
   - ❌ Implement keyboard navigation
   - ❌ Add screen reader support

8. **Documentation**
   - ✅ Code comments
   - ✅ Changelog
   - ✅ TODO list
   - ❌ User documentation
   - ❌ API documentation

## Known Issues

1. **API Issues**
   - `/api/v1/fuel-inventory` returns 500 error (likely due to tenant context or missing table)
   - Some API endpoints have duplicate `/api/v1/` in the URL

2. **UI Issues**
   - When a pump is added, it does not reflect on the page until complete refresh (FIXED)
   - SelectItem value cannot be an empty string (FIXED)
   - New Reading Entry does not show station, pump, nozzle when coming from nozzles page (FIXED)
   - ReportsPage has FilePdf import error (FIXED)

## Next Steps

1. Fix API integration issues:
   - Work with backend team to fix the tenant context issue causing 500 error with fuel inventory
   - Test token refresh functionality to ensure it resolves authentication issues
   - Add more comprehensive error handling for API failures

2. Fix remaining UI issues:
   - Implement optimistic updates for all creation operations
   - Improve error handling for API calls
   - Add loading states for all operations

3. Improve performance:
   - Implement pagination for large data sets
   - Optimize bundle size
   - Add caching for frequently accessed data

4. Enhance user experience:
   - Add confirmation dialogs for important actions
   - Implement better form validation
   - Add more visual feedback for user actions
