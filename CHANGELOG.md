
# Changelog

All notable changes to this project will be documented in this file.

## [2025-07-03] - Colorful UI Redesign and Component System

### Added
- **UI Component System**: Created reusable design components
  - `ColorfulCard` component with gradient backgrounds and hover effects
  - `StatusBadge` component with status-specific colors and icons
  - `FuelBadge` component with fuel-type-specific styling
  - Consistent color palette and animation system

- **Design Guidelines**: Created comprehensive UI design documentation
  - `/docs/ui-design-guidelines.md` with color palettes, component patterns, and responsive guidelines
  - Status-based and fuel-type-based color coding system
  - Responsive breakpoint standards and mobile-first approach

### Enhanced
- **PumpCard Component**: Complete redesign with colorful, responsive layout
  - Gradient backgrounds based on pump status
  - Improved mobile layout with stacked elements
  - Enhanced stats display with backdrop blur effects
  - Better button visibility across all screen sizes
  - Status-based color coding for visual clarity

- **NozzleCard Component**: Redesigned with fuel-type-based styling
  - Color-coded cards based on fuel type (petrol=green, diesel=orange, premium=purple)
  - Improved information hierarchy with clear visual sections
  - Better mobile responsiveness with compact layouts
  - Enhanced action button layout and visibility

### Improved
- **Visual Consistency**: Unified design language across all entity cards
  - Consistent use of gradients, shadows, and rounded corners
  - Standardized icon usage and sizing
  - Uniform spacing and typography scales
  - Cohesive color system for status and fuel types

- **Mobile Experience**: Enhanced mobile-first responsive design
  - Better touch targets and button sizing
  - Improved text readability at smaller sizes
  - Optimized card layouts for mobile viewports
  - Consistent responsive breakpoints across components

- **Accessibility**: Improved visual hierarchy and contrast
  - Better color contrast ratios
  - Clear visual distinction between different states
  - Consistent iconography for better recognition
  - Proper hover and focus states

### Technical
- Created modular component architecture for easy maintenance
- Implemented consistent gradient and animation utilities
- Added proper TypeScript types for all new components
- Optimized for performance with CSS transforms and backdrop-blur

## [2025-07-03] - UI/UX Improvements and Mobile Responsiveness

### Fixed
- **Nozzles Page**: Fixed cramped top bar layout with proper flex layouts and spacing
  - Improved mobile responsive design with stacked navigation elements
  - Fixed "Create Nozzle" button API binding and form submission
  - Enhanced nozzle cards with fuel-type specific information display
  - Added proper error handling and success feedback

- **Pumps Page**: Resolved cluttered interface and mobile layout issues
  - Implemented responsive grid layout for pump cards
  - Fixed "Pump Settings" button with tooltip showing "Coming Soon"
  - Improved station selection dropdown with better mobile UX
  - Enhanced create pump form with proper validation

- **New Reading Page**: Completely redesigned reading entry form
  - Added step-by-step sectioned layout for better clarity
  - Implemented previous reading display with visual feedback
  - Fixed form submission reliability with better error handling
  - Enhanced mobile layout with proper field spacing

- **Create Nozzle Page**: Fixed broken form submission
  - Connected form to backend POST endpoint properly
  - Added comprehensive field validation
  - Implemented success/error toast notifications
  - Fixed navigation flow after creation

### Enhanced
- **Mobile Responsiveness**: All pages now use proper responsive layouts
  - Cards use `overflow-hidden` to prevent layout breaks
  - Implemented `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` responsive grids
  - Added proper `gap-*` and `p-*` spacing for mobile devices
  - Button bars use `flex-wrap` and column stacking on mobile

- **Navigation**: Improved back button functionality across all pages
  - Fixed route context preservation using `useLocation`
  - Implemented fallback navigation using `useNavigate(-1)`
  - Enhanced breadcrumb-style navigation flow

### Added
- **UI Components**: Added Tooltip component for enhanced UX
- **Visual Feedback**: Implemented comprehensive loading states and error handling
- **Form Validation**: Added real-time validation with visual indicators

### Technical
- Fixed TypeScript errors related to optional properties
- Improved API integration patterns across all CRUD operations
- Enhanced error boundary implementations
- Optimized component re-rendering patterns

## [2025-12-23] - Numeric Formatting Guards

### Fixed
- Wrapped API values with `Number()` before using `.toFixed()` to prevent runtime errors.
- Updated reconciliation and sales tables as well as reading components to use the new guards.

## [2025-12-24] - Role API Matrix Documentation

### Added
- `ROLE_API_IMPLEMENTATION_MATRIX.md` summarising page and API usage per role.

### Documentation
- Updated `DOCUMENTATION_MAP.md`, `PHASE_3_SUMMARY.md` and `IMPLEMENTATION_INDEX.md`.

## [2025-12-25] - API Alignment Audit

### Added
- `API_IMPLEMENTATION_AUDIT_20251224.md` documenting endpoint usage.

### Documentation
- Updated `PHASE_3_SUMMARY.md` and `IMPLEMENTATION_INDEX.md` with step 3.13.

## [2025-12-26] - Frontend Gap Implementation

### Added
- Pages for station comparison and ranking analytics
- Report export page and inventory update form

### Documentation
- Updated API implementation audit marking endpoints in use
- Logged step 3.14 in phase summary and implementation index

## [2025-12-27] - Nozzle Reading Backend Fixes

### Fixed
- Payment method now stored with each nozzle reading
- `canCreateNozzleReading` response includes `missingPrice`
- Volume calculations use three-decimal precision
- Listing endpoint supports `limit` query for efficient latest lookup
- POST `/nozzle-readings` documented with status code 201

### Documentation
- Updated OpenAPI specs and backend phase summary

## [2025-12-28] - Frontend Nozzle Reading Alignment

### Fixed
- Latest reading hook now uses backend `limit` parameter
- Volumes displayed with three-decimal precision across dashboard pages

### Documentation
- Logged step file `STEP_fix_20251228.md`

## [2025-12-29] - API Contract Cleanup

### Fixed
- Removed deprecated `digital_wallet` payment method from API contract types

### Documentation
- Added `STEP_fix_20251229.md` noting payment_method availability

## [2025-12-30] - Dialog Accessibility Fixes

### Fixed
- Added hidden titles for command palette dialogs
- Provided descriptions for alert and creditor dialogs

### Documentation
- Logged step file `STEP_fix_20251230.md`

## [2025-12-31] - Pending Readings Visibility

### Added
- `usePendingReadings` hook for `no_readings_24h` alerts
- Pending readings card on `ReadingsPage` with anomaly tooltip

### Documentation
- Logged step file `STEP_fix_20251231.md`

## [2026-01-01] - Pending Readings Management

### Added
- Dashboard badge showing real-time pending readings count
- Acknowledge and dismiss buttons for pending reading alerts
- Automatic acknowledgment of `no_readings_24h` alerts after reading creation

### Documentation
- Logged step file `STEP_fix_20260101.md`

## [2026-01-02] - Sales Overview Metrics Fix

### Fixed
- Updated dashboard API types to match backend responses.
- Rewired `SalesOverviewPage` to use aggregated hooks.
- Adjusted charts and summary components for new fields.
- Logged step file `STEP_fix_20260102_COMMAND.md`.
## [2026-01-02] - Dashboard Analytics Fixes

### Fixed
- Owners no longer hit superadmin analytics endpoint
- Inventory page handles missing values gracefully

### Documentation
- Logged step file `STEP_fix_20260102.md`
