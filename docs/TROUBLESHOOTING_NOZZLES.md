# FuelSync Store Integration

## Overview

This document explains the changes made to fix the issue where nozzles were not displaying when routed from the pumps page, as well as the infinite loop issue that was occurring.

## Problems

1. **Nozzles Not Displaying**: When navigating from the pumps page to view nozzles for a specific pump, the nozzles were not being displayed. This was due to:
   - Lack of proper state management between pages
   - Multiple API calls for the same data
   - No consistent caching strategy
   - No proper invalidation of stale data

2. **Infinite Loop**: The maximum update depth exceeded error was occurring due to:
   - Circular dependencies in effect hooks
   - State updates triggering re-renders which triggered more state updates
   - Direct query invalidation in state update functions

## Solution

We implemented a comprehensive solution with the following components:

### 1. Enhanced fuelStore

The `fuelStore.ts` was enhanced to:
- Act as a single source of truth for fuel-related data
- Cache nozzles, pumps, and stations data
- Track staleness of data
- Provide helper methods for data access and invalidation

Key additions:
- `allNozzles` array to cache all nozzles
- Staleness flags (`nozzlesStale`, `pumpsStale`, `stationsStale`)
- Simplified invalidation methods that only mark data as stale without modifying cache
- Helper method `getNozzlesForPump` to get nozzles for a specific pump

### 2. Enhanced useNozzles Hook

The `useNozzles` hook was updated to:
- Check both fuelStore and dataStore for cached data
- Store fetched data in both stores
- Handle staleness flags
- Provide better error handling

### 3. New useFuelStoreSync Hook

A new `useFuelStoreSync` hook was created to:
- Monitor staleness flags and trigger refreshes
- Provide methods to manually refresh data
- Ensure consistent data across the application
- Use `useCallback` to memoize functions and prevent infinite loops
- Separate state updates from query invalidation

### 4. Navigation Helper Utility

A new `navigationHelper.ts` utility was created to:
- Standardize navigation state between pages
- Provide helper functions to check navigation source
- Prevent typos and inconsistencies in state properties

### 5. Improved Effect Management

Effects were improved to:
- Split large effects into smaller, focused ones
- Add proper dependency arrays
- Use timeouts to defer actions that might cause loops
- Add conditional checks to prevent unnecessary state updates

### 6. Improved Error Handling

Error handling was improved throughout the application to:
- Provide better user feedback
- Log errors consistently
- Fallback to cached data when API calls fail

## Usage

To ensure proper data flow:

1. Always use the fuelStore for state management
2. Use the useFuelStoreSync hook in pages that need to refresh data
3. Use the navigationHelper utility when navigating between related pages
4. Split effects into smaller, focused ones with proper dependency arrays
5. Use conditional checks to prevent unnecessary state updates
6. Use timeouts to defer actions that might cause loops

## Benefits

- Reduced API calls
- Consistent user experience
- Better error handling
- Improved performance
- Single source of truth for data
- No infinite loops or maximum update depth errors