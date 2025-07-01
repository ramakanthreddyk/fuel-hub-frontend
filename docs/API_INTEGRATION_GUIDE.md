# API Integration Guide

This guide explains how to use the API integration in the FuelSync Hub frontend.

## Overview

The FuelSync Hub frontend uses a centralized API integration approach with three layers:

1. **API Context** - Low-level API access
2. **API Hook** - Simplified API operations with React Query
3. **Component Templates** - Ready-to-use patterns for components

## Quick Start

For most components, use the `useApiHook`:

```tsx
import { useApiHook } from '@/hooks/useApiHook';

function MyComponent() {
  const { fetchData, createMutation, endpoints } = useApiHook();
  
  // Fetch data
  const { data, isLoading } = fetchData(
    endpoints.someEndpoint,
    ['query-key'],
    { enabled: true }
  );
  
  // Create mutation
  const mutation = createMutation(
    endpoints.someEndpoint,
    {
      invalidateQueries: [['query-key']],
      onSuccess: (data) => console.log('Success:', data)
    }
  );
  
  // Use the mutation
  const handleSubmit = (data) => mutation.mutate(data);
}
```

## Component Template

Use the template in `src/templates/ComponentTemplate.tsx` as a starting point for new components.

## API Context vs API Hook

- **API Context** (`useApi`): Low-level access to API functions
- **API Hook** (`useApiHook`): High-level operations with React Query integration

## Migrating Existing Components

1. Import the API hook:
   ```tsx
   import { useApiHook } from '@/hooks/useApiHook';
   ```

2. Use the hook in your component:
   ```tsx
   const { fetchData, createMutation, endpoints } = useApiHook();
   ```

3. Replace direct API calls:
   ```tsx
   // Before
   const { data } = useQuery({
     queryKey: ['data'],
     queryFn: () => fetchApi('/endpoint')
   });
   
   // After
   const { data } = fetchData(
     endpoints.someEndpoint,
     ['data']
   );
   ```

4. Replace mutations:
   ```tsx
   // Before
   const mutation = useMutation({
     mutationFn: (data) => fetchApi('/endpoint', {
       method: 'POST',
       body: JSON.stringify(data)
     })
   });
   
   // After
   const mutation = createMutation(
     endpoints.someEndpoint,
     {
       invalidateQueries: [['data']]
     }
   );
   ```

## Best Practices

1. Always use typed interfaces for API responses
2. Group related API calls in domain-specific hooks
3. Use the endpoints from the hook instead of hardcoding URLs
4. Handle loading and error states consistently
5. Use the API hook for all new components

## Further Reading

See the full API Context documentation in `docs/API_CONTEXT.md`.