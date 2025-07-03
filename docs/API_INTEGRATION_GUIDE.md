# FuelSync Frontend API Integration Strategy

## Introduction

This document outlines the standardized approach to API integration in the FuelSync frontend application. The goal is to create a robust, maintainable, and consistent way of interacting with the backend API.

## Problem Statement

The current approach to API integration has several issues:

1. **Inconsistent Implementation**: Multiple approaches to API calls (direct fetch, apiClient, ApiContext)
2. **Fragile Response Handling**: Different components expect different response formats
3. **Duplicate Code**: Similar API call logic repeated across components
4. **Poor Error Handling**: Inconsistent error handling across the application
5. **Missing Type Safety**: Lack of proper TypeScript types for API requests and responses
6. **Tenant Header Issues**: Inconsistent handling of tenant headers

## Solution Architecture

We've implemented a standardized API integration strategy with the following components:

### 1. Core Layer

The core layer provides the foundation for API integration:

- **apiClient.ts**: Centralized axios instance with standardized request/response handling
- **config.ts**: API configuration with endpoint definitions

Key features:

- Consistent authentication header management
- Tenant context handling for all requests
- Standardized error handling
- Helper functions for extracting data from responses

### 2. Service Layer

The service layer implements API endpoints for specific domains:

- **stationsService.ts**: Station-specific API methods
- **pumpsService.ts**: Pump-specific API methods
- **nozzlesService.ts**: Nozzle-specific API methods

Each service:

- Defines types for requests and responses
- Implements API methods using the apiClient
- Handles data transformation

### 3. Hook Layer

The hook layer provides React Query hooks for component integration:

- **useStations.ts**: Hooks for station-related operations
- **usePumps.ts**: Hooks for pump-related operations
- **useNozzles.ts**: Hooks for nozzle-related operations

These hooks provide:

- Data fetching with caching
- Loading and error states
- Automatic refetching
- Mutation handling

## Directory Structure

```
src/
├── api/
│   ├── core/
│   │   ├── apiClient.ts       # Centralized axios instance
│   │   └── config.ts          # API configuration
│   ├── services/
│   │   ├── stationsService.ts # Station-specific API methods
│   │   ├── pumpsService.ts    # Pump-specific API methods
│   │   └── ...                # Other service modules
│   └── types/
│       └── responses.ts       # Common response type definitions
└── hooks/
    └── api/
        ├── useStations.ts     # React Query hooks for stations
        ├── usePumps.ts        # React Query hooks for pumps
        └── ...                # Other API hooks
```

## Best Practices

### 1. Always Use the Service Layer

Never make direct API calls from components. Always use the service layer:

```typescript
// ❌ Bad
const response = await fetch('/api/v1/stations');

// ✅ Good
const stations = await stationsService.getStations();
```

### 2. Handle Response Formats Consistently

Use the extraction helpers to handle different response formats:

```typescript
// ✅ Good
return extractData<Station>(response);
```

### 3. Type Everything

Always define and use proper types for requests and responses:

```typescript
// ✅ Good
export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance';
}
```

### 4. Use React Query for Data Fetching

Always use React Query hooks in components:

```typescript
// ✅ Good
const { data: stations, isLoading } = useStations();
```

### 5. Handle Errors Properly

Always handle errors in components:

```typescript
// ✅ Good
const { data, isLoading, error } = useStations();

if (error) {
  return <ErrorComponent message={error.message} />;
}
```

## Common Response Formats

The API may return responses in different formats:

### Success with Data Object

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Station 1"
  }
}
```

### Success with Data Array

```json
{
  "success": true,
  "data": {
    "stations": [
      { "id": "123", "name": "Station 1" },
      { "id": "456", "name": "Station 2" }
    ]
  }
}
```

### Direct Data

```json
{
  "id": "123",
  "name": "Station 1"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

## Migration Plan

The migration to the new pattern will be done in phases:

### Phase 1: Core Infrastructure (Completed)
- Create the core API client
- Define response types
- Implement service layer for critical APIs
- Create React Query hooks for critical APIs

### Phase 2: Component Migration (In Progress)
- Update existing components to use new pattern
- Implement proper error handling
- Add loading states
- Add retry mechanisms

### Phase 3: Documentation and Training (In Progress)
- Create comprehensive API integration guide
- Document common response formats
- Create code review checklist
- Conduct team training sessions

### Phase 4: Cleanup and Optimization (Planned)
- Remove deprecated API integration code
- Optimize API calls
- Implement caching strategies
- Add performance monitoring

## Code Review Checklist

When reviewing API-related code, ensure:

1. ✅ API calls use the service layer
2. ✅ Types are properly defined and used
3. ✅ React Query hooks are used for data fetching
4. ✅ Errors are properly handled
5. ✅ Response formats are handled consistently
6. ✅ Tenant context is properly managed

## Example Usage

### Basic Example: Fetching Stations

```tsx
import React from 'react';
import { useStations } from '@/hooks/api/useStations';

const StationsList: React.FC = () => {
  const { data: stations, isLoading, error } = useStations();

  if (isLoading) {
    return <div>Loading stations...</div>;
  }

  if (error) {
    return <div>Error loading stations: {error.message}</div>;
  }

  return (
    <div>
      <h1>Stations</h1>
      <ul>
        {stations?.map(station => (
          <li key={station.id}>{station.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Creating a New Resource

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateStation } from '@/hooks/api/useStations';
import { CreateStationRequest } from '@/api/services/stationsService';

const CreateStationForm: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateStationRequest>();
  const createStation = useCreateStation();

  const onSubmit = (data: CreateStationRequest) => {
    createStation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register('name', { required: true })} />
      </div>
      <div>
        <label>Address</label>
        <input {...register('address', { required: true })} />
      </div>
      <button type="submit" disabled={createStation.isPending}>
        {createStation.isPending ? 'Creating...' : 'Create Station'}
      </button>
    </form>
  );
};
```

## Conclusion

By implementing this standardized API integration strategy, we've created a robust, maintainable, and consistent way of interacting with the backend API. This will improve developer productivity, reduce bugs, and make the application more reliable.