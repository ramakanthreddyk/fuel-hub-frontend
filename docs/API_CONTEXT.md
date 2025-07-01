# API Context Documentation

## Overview

The API Context provides a centralized way to interact with the FuelSync API. It handles authentication, request formatting, and response parsing, ensuring consistent API interactions across the application.

## Features

- Centralized API configuration
- Standardized authentication header management
- Consistent error handling
- Response format normalization
- TypeScript support for API responses

## Usage

### Setting Up

The API Context is provided at the application root level in `App.tsx`:

```tsx
function App() {
  return (
    <ThemeProvider>
      <Router>
        <ApiProvider>
          <AuthProvider>
            {/* Application routes */}
          </AuthProvider>
        </ApiProvider>
      </Router>
    </ThemeProvider>
  );
}
```

### Using the API Hook in Components (Recommended)

```tsx
import { useApiHook } from '@/hooks/useApiHook';

function MyComponent() {
  const { fetchData, createMutation, endpoints } = useApiHook();
  
  // Example: Fetch data
  const { data } = fetchData(
    endpoints.someEndpoint,
    ['my-data'],
    { enabled: true }
  );
  
  // Example: Create mutation
  const mutation = createMutation(
    endpoints.someEndpoint,
    {
      invalidateQueries: [['my-data']],
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error)
    }
  );
  
  return (
    // Component JSX
  );
}
```

### Using the API Context Directly (Advanced)

```tsx
import { useApi, API_CONFIG } from '@/contexts/ApiContext';

function MyComponent() {
  const { fetchApi } = useApi();
  
  // Example: Fetch data
  const { data } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => fetchApi(`${API_CONFIG.endpoints.someEndpoint}`)
  });
  
  // Example: Post data
  const mutation = useMutation({
    mutationFn: (data) => fetchApi(API_CONFIG.endpoints.someEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  });
  
  return (
    // Component JSX
  );
}
```

## API Reference

### `useApiHook()`

High-level hook for API operations.

Returns:
- `fetchData(endpoint, queryKey, options)`: Function to fetch data with React Query
- `createMutation(endpoint, options)`: Function to create a mutation with React Query
- `endpoints`: Object containing API endpoints

### `useApi()`

Low-level hook to access the API context.

Returns:
- `getAuthHeaders()`: Function that returns authentication headers
- `fetchApi(endpoint, options)`: Function to make API requests
- `getFullUrl(endpoint)`: Function to get the full URL for an endpoint

### `API_CONFIG`

Object containing API configuration:

```tsx
{
  baseUrl: 'https://api.example.com',
  endpoints: {
    nozzles: '/api/v1/nozzles',
    pumps: '/api/v1/pumps',
    // other endpoints...
  }
}
```

## Best Practices

1. **Use the useApiHook** for most components instead of direct API context
2. **Use the template** in `src/templates/ComponentTemplate.tsx` for new components
3. **Handle errors appropriately** in your components
4. **Type your API responses** for better TypeScript support
5. **Use the endpoints from the hook** instead of hardcoding URLs
6. **Group related API calls** in custom domain-specific hooks

## Error Handling

The `fetchApi` function handles basic error cases, but you should handle specific error scenarios in your components:

```tsx
try {
  const data = await fetchApi('/some-endpoint');
  // Handle success
} catch (error) {
  // Handle specific error cases
  if (error.message.includes('404')) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

## Response Format Handling

The API context automatically handles different response formats:

1. `{ success: true, data: { ... } }` → Returns the `data` property
2. Direct response object → Returns the object as-is

## Extending

To add new endpoints, update the `API_CONFIG` object in `ApiContext.tsx`:

```tsx
export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  endpoints: {
    // Existing endpoints...
    newEndpoint: '/api/v1/new-endpoint'
  }
};
```