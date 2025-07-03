# API Integration Optimization Checklist

## Overview

This checklist helps ensure that all API integrations follow the optimized patterns and best practices established in the FuelSync frontend architecture.

## Core Requirements

- [ ] Uses the centralized `apiClient` for all API calls
- [ ] Implements proper TypeScript types for requests and responses
- [ ] Uses the service layer pattern for API endpoints
- [ ] Implements React Query hooks for data fetching
- [ ] Uses the centralized error handling system
- [ ] Applies appropriate caching strategies

## Service Layer Checklist

- [ ] Service is in the correct directory (`src/api/services/`)
- [ ] Service has proper JSDoc documentation with references
- [ ] Service exports TypeScript interfaces for all models
- [ ] Service uses `extractData` and `extractArray` helpers
- [ ] Service implements proper error handling
- [ ] Service follows naming conventions

## Hook Layer Checklist

- [ ] Hook is in the correct directory (`src/hooks/api/`)
- [ ] Hook has proper JSDoc documentation with references
- [ ] Hook uses the centralized error handler
- [ ] Hook applies appropriate caching strategy from `useQueryConfig`
- [ ] Hook implements proper invalidation for mutations
- [ ] Hook follows naming conventions

## Component Integration Checklist

- [ ] Component uses the hook layer (not direct service calls)
- [ ] Component handles loading states properly
- [ ] Component handles error states properly
- [ ] Component uses TypeScript types from the service layer
- [ ] Component implements proper form validation
- [ ] Component follows accessibility guidelines

## Performance Optimization

- [ ] Uses appropriate stale time for the data type
- [ ] Implements proper cache invalidation
- [ ] Avoids unnecessary refetching
- [ ] Batches related mutations when possible
- [ ] Uses optimistic updates for better UX
- [ ] Implements proper retry strategies

## Error Handling

- [ ] Uses the centralized error handler
- [ ] Provides user-friendly error messages
- [ ] Implements proper error recovery mechanisms
- [ ] Logs errors appropriately
- [ ] Handles network errors gracefully
- [ ] Implements proper authentication error handling

## Documentation

- [ ] Includes JSDoc comments with references
- [ ] Documents any non-standard behavior
- [ ] Updates relevant documentation when changing behavior
- [ ] Follows the documentation reference system

## Testing

- [ ] Implements unit tests for critical functionality
- [ ] Tests error handling paths
- [ ] Tests loading states
- [ ] Tests edge cases
- [ ] Tests accessibility

## Reviewer Notes

- Look for any direct API calls that bypass the service layer
- Check for proper error handling in all API calls
- Ensure appropriate caching strategies are applied
- Verify that mutations properly invalidate related queries
- Check for proper loading and error states in components