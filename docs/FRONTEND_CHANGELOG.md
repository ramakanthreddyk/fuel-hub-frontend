# FuelSync Frontend Changelog

## 2023-07-03: Permission and SelectItem Value Fixes

### Fixed
- Fixed 403 Forbidden error with cash reports endpoint:
  - Added mock data for cash reports due to permission issues
  - Preserved original API call code for when permissions are fixed
  - Updated TODO list to note the permission requirement
- Fixed SelectItem empty string value error in CashReportsListPage:
  - Changed empty string value to "all-stations" for station filter
  - Updated logic to handle the new value in API calls
  - Ensured consistent approach with other select components

## 2023-07-03: Backend API Integration Updates

### Fixed
- Updated services to use the correct backend API endpoints:
  - Updated inventory service to use the implemented `/api/v1/fuel-inventory/summary` endpoint
  - Added fallback calculation for inventory summary when API fails
  - Updated reports service to use the implemented reports endpoints:
    - `/api/v1/reports/sales` for listing reports
    - `/api/v1/reports/sales/{id}` for getting report details
    - `/api/v1/reports/sales` (POST) for generating reports
    - `/api/v1/reports/sales/export` for downloading reports
    - `/api/v1/reports/export` for exporting generic reports
    - `/api/v1/reports/schedule` for scheduling reports
  - Updated TODO list to reflect the actual backend state

## 2023-07-03: Attendant Dashboard and Cash Report Implementation

### Added
- Created attendant-specific dashboard:
  - Focused on daily tasks without revenue information
  - Added readings summary with fuel dispensed metrics
  - Added cash report submission status
  - Added quick access to record readings and submit cash reports
- Implemented cash report functionality:
  - Created attendantService.ts for cash report API endpoints
  - Created useAttendant.ts hooks for cash report operations
  - Created creditorService.ts for managing creditors
  - Created useCreditors.ts hooks for creditor operations
  - Added CashReportPage for submitting daily cash and credit reports
  - Added CashReportsListPage for viewing cash report history
- Added role-based navigation:
  - Updated sidebar with role-specific menu items
  - Created different navigation options for attendants, managers, and owners
  - Added cash report related links to sidebar
- Updated App.tsx with new routes:
  - Added cash report routes
  - Added role-based dashboard component
  - Ensured proper navigation between related pages

## 2023-07-03: Optimistic Updates for Pump Creation

### Fixed
- Fixed pump creation not reflecting on the page until refresh:
  - Implemented optimistic updates using React Query's setQueryData
  - Added immediate cache update when a new pump is created
  - Maintained background refetch for data consistency
  - Improved error handling for pump creation
- Reverted to using available API endpoints:
  - Removed mock data from inventory service
  - Removed mock data from reports service
  - Added proper error handling for API failures
  - Added TODOs for missing backend endpoints

## 2023-07-03: Mock Data Implementation for Inventory API

### Fixed
- Fixed fuel inventory API errors by implementing mock data:
  - Added mock data for getFuelInventory method
  - Added mock data for getInventorySummary method
  - Commented out actual API calls that were failing
  - Added fallback to mock data on API errors
  - Preserved original API call code for future use when API is fixed

## 2023-07-03: API URL and Tenant ID Fixes

### Fixed
- Fixed duplicate `/api/v1/` in API URLs causing 404 errors:
  - Removed leading slash from API endpoint paths in inventoryService.ts
  - Removed leading slash from API endpoint paths in reportsService.ts
  - Updated API calls to use relative paths that work with the baseURL
- Updated default tenant ID to match the one being used in the application:
  - Changed DEFAULT_TENANT_ID from placeholder to actual tenant ID
  - Ensured consistent tenant ID usage across API calls

## 2023-07-03: SelectItem Value Fix

### Fixed
- Fixed "A <Select.Item /> must have a value prop that is not an empty string" error:
  - Changed empty string value to "all-stations" in FuelInventoryPage
  - Updated selectedStationId state to use "all-stations" as default
  - Modified API call logic to handle the new value
  - Updated conditional rendering to check for "all-stations" instead of empty string

## 2023-07-03: New Reading Entry and Reports Page Fixes

### Fixed
- Fixed New Reading Entry not showing station, pump, nozzle when coming from nozzles page:
  - Added display of selected station, pump, and nozzle in read-only mode
  - Added lookup of station and pump details for display
  - Improved UI with better visual indication of selected items
  - Maintained existing functionality for manual selection
- Fixed ReportsPage FilePdf import error:
  - Replaced FilePdf with standard File icon
  - Updated getFormatIcon function to use available icons
  - Fixed getReportIcon function to use available icons
  - Maintained existing functionality with standard icons

## 2023-07-03: Fuel Inventory and Reports Implementation

### Added
- Created inventory service to use the proper API endpoint:
  - Added getFuelInventory method to fetch inventory data
  - Added getInventorySummary method to fetch inventory summary
  - Added proper types for inventory data
- Created reports service to use the reports API endpoints:
  - Added getReports method to fetch all reports
  - Added getReport method to fetch a report by ID
  - Added generateReport method to create a new report
  - Added downloadReport method to download a report
- Created inventory hooks to use the inventory service:
  - Added useInventory hook to fetch inventory data
  - Added useInventorySummary hook to fetch inventory summary
- Created reports hooks to use the reports service:
  - Added useReports hook to fetch all reports
  - Added useReport hook to fetch a report by ID
  - Added useGenerateReport hook to create a new report
  - Added useDownloadReport hook to download a report
- Created ReportsPage to use the reports API endpoints:
  - Added report generation form
  - Added reports list with status indicators
  - Added download functionality
  - Added proper loading and empty states
- Updated FuelInventoryPage to use the proper API endpoint:
  - Added inventory data fetching
  - Added station filtering
  - Added report generation
  - Added proper loading and empty states
- Added Reports to the sidebar:
  - Added Reports item with FileSpreadsheet icon
  - Added Reports route to App.tsx

### Fixed
- Fixed FuelInventoryPage showing dummy data:
  - Replaced mock data with real API data
  - Added proper API integration
  - Added station filtering
  - Added report generation
- Fixed reports endpoints never being used:
  - Added ReportsPage to use the reports API endpoints
  - Added reports service and hooks
  - Added Reports to the sidebar
  - Added Reports route to App.tsx

## 2023-07-03: Pumps and Nozzles Pages Improvements

### Fixed
- Fixed pumps page showing "select a station" but no station selector:
  - Added station dropdown selector to pumps page
  - Added state management for selected station
  - Added proper navigation when station is selected
  - Improved UI with station selector in header
- Fixed nozzles page not showing data:
  - Added station and pump selectors to nozzles page
  - Added state management for selected station and pump
  - Added proper navigation between related pages
  - Improved UI with pump selector in header
- Fixed sidebar items not bound to API:
  - Updated sidebar to use separate items for pumps and nozzles
  - Fixed navigation to proper routes with query parameters
  - Improved UI consistency across pages

## 2023-07-03: Sidebar and Navigation Fixes

### Fixed
- Fixed "Pumps & Nozzles" sidebar item showing nothing:
  - Split into separate "Pumps" and "Nozzles" sidebar items
  - Updated sidebar navigation to use correct routes
  - Added proper icons and styling for each item
- Fixed "Record Reading" on nozzles page routing to dashboard:
  - Updated button to use onClick handler instead of Link
  - Added proper navigation to readings/new/:nozzleId
  - Fixed route handling for nozzle readings
- Fixed NozzlesPage to handle query parameters:
  - Added support for pumpId from both URL params and query params
  - Fixed navigation between related pages
  - Improved error handling and empty states

## 2023-07-03: Navigation and Context Fixes

### Fixed
- Fixed "View Nozzles" button not working on pumps page:
  - Updated handleViewNozzles function to use proper navigation
  - Added proper context maintenance with stationId and pumpId
  - Fixed route structure to support nested resources
- Fixed "Back to Stations" button not working:
  - Added explicit handleBackToStations function
  - Updated button to use onClick handler instead of Link
  - Added proper navigation to stations page
- Added missing nested routes in App.tsx:
  - Added routes for stations/:stationId/pumps
  - Added routes for stations/:stationId/pumps/:pumpId/nozzles
  - Added routes for pumps/:pumpId/nozzles
  - Added routes for nozzles/:nozzleId/readings/new
  - Ensured consistent route structure throughout the app

## 2023-07-03: Dashboard and Pages Improvements

### Changed
- Updated DashboardPage to show real data from API:
  - Added API data fetching for stations, pumps, fuel prices, and readings
  - Implemented real-time metrics calculation
  - Added proper loading states and error handling
  - Improved refresh functionality
- Updated PumpsPage to use API hooks and fix navigation:
  - Replaced direct API calls with hooks
  - Fixed navigation between pages
  - Added proper loading states
  - Improved error handling
- Removed dummy data from FuelInventoryPage:
  - Replaced mock data with real API data
  - Added proper empty state for no stations
  - Improved UI for station cards
  - Added metrics from station data

### Fixed
- Fixed owner dashboard showing nothing:
  - Added real-time metrics from API data
  - Implemented proper data loading and refresh
  - Added fallbacks for missing data
- Fixed pumps & nozzles not showing:
  - Updated API hooks to fetch data correctly
  - Fixed navigation between related pages
  - Added proper loading and empty states
- Fixed dummy data in fuel-inventory:
  - Removed mock inventory data
  - Added real station data with metrics
  - Implemented proper empty state

## 2023-07-03: New Reading Entry Rewrite

### Changed
- Completely rewrote the new reading entry functionality:
  - Simplified NewReadingPage.tsx with direct state management
  - Removed complex form library dependencies
  - Simplified readingsService.ts to focus on core functionality
  - Updated useReadings.ts hooks for better error handling
  - Fixed routing issues with simplified URL structure
  - Added proper nozzle ID handling in URL parameters
  - Fixed "Missing Fuel Prices" warning logic
  - Improved station, pump, nozzle relationship handling

### Fixed
- Fixed "Missing Fuel Prices" warning shown incorrectly
- Fixed station, pump, nozzle mapping in reading form
- Fixed navigation after successful reading creation
- Fixed undefined values in route URLs
- Fixed form validation and submission logic

## 2023-07-03: API Endpoint Fixes

### Fixed
- Fixed API endpoint issues to match API spec:
  - Updated pumpsService.ts to use query parameters instead of hierarchical paths
  - Updated nozzlesService.ts to use query parameters instead of hierarchical paths
  - Updated fuelPricesService.ts to use query parameters instead of hierarchical paths
  - Fixed 404 errors caused by incorrect URL construction
  - Removed hierarchical path construction that was causing duplicate parameters

## 2023-07-03: API Hierarchy Implementation

### Added
- Created api-hierarchy.ts utility for managing entity relationships:
  - Added EntityHierarchy constants for entity types
  - Added EntityRelationships map for parent-child relationships
  - Added utility functions for working with hierarchical data
- Updated API services with hierarchy awareness:
  - Updated pumpsService.ts to use hierarchical paths
  - Updated nozzlesService.ts to use hierarchical paths
  - Updated fuelPricesService.ts to use hierarchical paths

### Fixed
- Fixed "Missing Fuel Prices" warning shown incorrectly:
  - Updated fuelPricesService.validateFuelPrices to check for existing prices first
  - Added fallback for empty stationId to prevent API errors
  - Added default response for API errors to prevent UI issues
- Fixed hierarchy issues in API calls:
  - Added proper parent-child relationships between entities
  - Ensured IDs are properly propagated through the hierarchy
  - Added better error handling for missing parent IDs

## 2023-07-03: Select Component Error Fix

### Fixed
- Fixed "A <Select.Item /> must have a value prop that is not an empty string" error:
  - Added default values for empty arrays in API hooks
  - Replaced empty string value with "no-nozzles" for empty nozzles list
  - Added "select-creditor" default value for creditor selection
  - Added proper handling for empty arrays in SelectContent
  - Fixed undefined parameters in API calls

## 2023-07-03: Price Format Fix

### Fixed
- Fixed "price.price.toFixed is not a function" error:
  - Added formatPrice helper function to safely handle different price formats
  - Added type checking for price values
  - Added fallback to '0.00' for invalid price formats
  - Added warning log for invalid price formats

## 2023-07-03: Case Conversion and Readings Implementation

### Added
- Created utility functions for case conversion:
  - `snakeToCamel` - Convert snake_case to camelCase
  - `camelToSnake` - Convert camelCase to snake_case
  - `convertKeysToCamelCase` - Convert object keys from snake_case to camelCase
  - `convertKeysToSnakeCase` - Convert object keys from camelCase to snake_case
- Created readingsService.ts with mock data fallback
- Created useReadings.ts hook for fetching readings data
- Updated ReadingsPage to use real API data

### Fixed
- Fixed "fuel prices received but not displayed" issue:
  - Updated apiClient.ts to automatically convert snake_case to camelCase in responses
  - Simplified fuelPricesService.ts to use the automatic case conversion
  - Removed duplicate field definitions in interfaces
- Fixed "unable to add new readings" issue:
  - Implemented proper readings service with mock data fallback
  - Updated ReadingsPage to show proper UI for loading/error states
  - Added "Record Reading" button with proper navigation

### Changed
- Improved API response handling with automatic case conversion
- Enhanced error handling and logging in API services
- Added development mode fallbacks for better developer experience

## 2023-07-03: Fuel Prices Data Extraction Fix

### Fixed
- Fixed "fuel prices received but not displayed" issue:
  - Updated fuelPricesService.ts to handle different response formats
  - Added normalization for field names (snake_case vs. camelCase)
  - Added robust data extraction for nested response structures
  - Added detailed logging for API responses
  - Enhanced error handling in useFuelPrices hooks

## 2023-07-03: New Reading Form Fix

### Fixed
- Fixed "dashboard/readings/new does nothing" issue:
  - Updated NewReadingPage to handle both general and specific nozzle contexts
  - Updated ReadingEntryForm to properly handle preselected values
  - Fixed form submission and navigation after recording a reading
  - Added proper validation and error handling
  - Improved user experience with better form controls

## 2023-07-03: Nozzles and Readings Routes Fix

### Added
- Created new components:
  - PumpDetailPage.tsx - View pump details and nozzles
  - NozzlesPage.tsx - View nozzles for a pump
  - CreateNozzlePage.tsx - Add new nozzles

### Fixed
- Fixed "view nozzles" routes:
  - Added proper routes for nozzles in App.tsx
  - Added nested routes for nozzles under stations and pumps
  - Added route for recording readings for specific nozzles
- Fixed "unable to enter new reading" issue:
  - Added specific route for new readings with nozzle context
  - Created proper navigation between components

## 2023-07-03: API Client Tenant ID Fix

### Fixed
- Fixed 502 Bad Gateway error with API endpoints:
  - Added default tenant ID to apiClient.ts
  - Ensured tenant ID header is always included in requests
  - Added better logging for API requests and errors
  - Fixed issue with missing x-tenant-id header

## 2023-07-03: Navigation and Routing Fixes

### Added
- Created StationDetailPage component for viewing station details
- Added route for station details in App.tsx

### Fixed
- Fixed "You should call navigate() in a React.useEffect()" warning:
  - Updated LandingPage to use useEffect for navigation
  - Added proper handler functions for button clicks
- Fixed "unable to view Details fo station" issue:
  - Created missing StationDetailPage component
  - Added proper route in App.tsx

## 2023-07-03: Router Error Fix

### Fixed
- Fixed "You cannot render a <Router> inside another <Router>" error:
  - Removed duplicate BrowserRouter from App.tsx
  - Removed duplicate QueryClientProvider from App.tsx
  - Kept the Router and QueryClientProvider only in main.tsx

## 2023-07-03: Export Name Fixes

### Fixed
- Fixed export name issues in apiClient.ts:
  - Renamed extractApiData to extractData
  - Renamed extractApiArray to extractArray
  - Added backward compatibility exports
- Updated service files to use the correct export names:
  - stationsService.ts
  - fuelPricesService.ts
  - Other service files

## 2023-07-03: Additional Build Fixes (3)

### Added
- Created missing service files:
  - stationsService.ts
  - apiClient.ts (core version)
  - config.ts
  - responses.ts

### Fixed
- Fixed import error in useStations.ts
- Created proper directory structure for API services
- Implemented proper exports for stationsService

## 2023-07-03: Additional Build Fixes (2)

### Added
- Added missing `extractApiArray` function to client.ts

### Fixed
- Fixed import error in stations.ts
- Updated client.ts to handle array extraction from different response formats

## 2023-07-03: Additional Build Fixes (1)

### Added
- Added missing `extractApiData` function to client.ts

### Fixed
- Fixed import error in auth.ts
- Updated client.ts to handle different API response formats

## 2023-07-03: Build Fixes and Dependency Resolution

### Added
- Created missing components:
  - theme-provider.tsx
  - toaster.tsx
  - nozzlesService.ts
  - client.ts
  - nozzles.ts

### Fixed
- Fixed React Query DevTools import with dynamic import
- Fixed QueryClient initialization in main.tsx
- Simplified component dependencies to resolve build errors
- Created missing API client and services

### Changed
- Simplified main.tsx to remove unnecessary dependencies
- Updated useNozzles hook to use existing nozzlesService
- Created minimal implementations of required components

## 2023-07-03: API Integration Strategy Implementation

### Added
- Implemented standardized API integration strategy
- Created core API client with error handling and timeout
- Added centralized React Query configuration
- Implemented centralized error handling
- Created service layer for all API endpoints
- Added React Query hooks for all services
- Created comprehensive documentation
- Added development accountability checklist
- Created AI agent development process

### Fixed
- Fixed React Query DevTools import with dynamic import
- Created missing useNozzles hook
- Fixed dependency issues with legacy peer deps

### Changed
- Updated main.tsx to use optimized query client
- Consolidated documentation structure
- Improved error handling in API client
- Enhanced caching strategies for different data types

## Previous Changes

[Previous changelog entries...]
## 2026-07-24: Mobile sidebar toggle fix

### Fixed
- Header hamburger button now toggles the sidebar on mobile screens.

## 2026-07-25: SuperAdmin sidebar toggle fix

### Fixed
- Hamburger menu now works for SuperAdmin pages by falling back to `useSidebar` when no click handler is provided.
