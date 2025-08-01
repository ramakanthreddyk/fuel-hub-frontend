/**
 * @file hooks/api/__tests__/useStations.test.ts
 * @description Tests for useStations hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useStations, useCreateStation, useUpdateStation, useDeleteStation } from '../useStations';

// Mock data
const mockStations = [
  {
    id: 'station-1',
    name: 'Main Station',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    status: 'active',
    pumpCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'station-2',
    name: 'Highway Station',
    address: '456 Highway Road',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411001',
    status: 'maintenance',
    pumpCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// MSW server setup
const server = setupServer(
  rest.get('/api/stations', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const search = req.url.searchParams.get('search');
    
    let filteredStations = [...mockStations];
    
    if (status) {
      filteredStations = filteredStations.filter(station => station.status === status);
    }
    
    if (search) {
      filteredStations = filteredStations.filter(station => 
        station.name.toLowerCase().includes(search.toLowerCase()) ||
        station.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res(ctx.json(filteredStations));
  }),
  
  rest.get('/api/stations/:id', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    return res(ctx.json(station));
  }),
  
  rest.post('/api/stations', async (req, res, ctx) => {
    const stationData = await req.json();
    const newStation = {
      id: 'station-3',
      ...stationData,
      status: 'active',
      pumpCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return res(ctx.status(201), ctx.json(newStation));
  }),
  
  rest.put('/api/stations/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = await req.json();
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    const updatedStation = {
      ...station,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    return res(ctx.json(updatedStation));
  }),
  
  rest.delete('/api/stations/:id', (req, res, ctx) => {
    const { id } = req.params;
    const station = mockStations.find(s => s.id === id);
    
    if (!station) {
      return res(ctx.status(404), ctx.json({ error: 'Station not found' }));
    }
    
    return res(ctx.status(204));
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useStations', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  describe('useStations hook', () => {
    it('should fetch stations successfully', async () => {
      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStations);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should filter stations by status', async () => {
      const { result } = renderHook(() => useStations({ status: 'active' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].status).toBe('active');
    });

    it('should search stations by name', async () => {
      const { result } = renderHook(() => useStations({ search: 'main' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].name).toBe('Main Station');
    });

    it('should search stations by city', async () => {
      const { result } = renderHook(() => useStations({ search: 'pune' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].city).toBe('Pune');
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should refetch data when called', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockStations));
        })
      );

      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiSpy).toHaveBeenCalledTimes(1);

      // Trigger refetch
      result.current.refetch();

      await waitFor(() => {
        expect(apiSpy).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle empty results', async () => {
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );

      const { result } = renderHook(() => useStations(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useCreateStation hook', () => {
    it('should create station successfully', async () => {
      const { result } = renderHook(() => useCreateStation(), {
        wrapper: createWrapper(),
      });

      const newStationData = {
        name: 'New Station',
        address: '789 New Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      };

      result.current.mutate(newStationData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        id: 'station-3',
        ...newStationData,
        status: 'active',
        pumpCount: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should handle creation errors', async () => {
      server.use(
        rest.post('/api/stations', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'Validation error' }));
        })
      );

      const { result } = renderHook(() => useCreateStation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCreateStation({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: 'New Station',
        address: '789 New Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(result.current.data);
    });

    it('should call onError callback', async () => {
      server.use(
        rest.post('/api/stations', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: 'Validation error' }));
        })
      );

      const onError = vi.fn();
      const { result } = renderHook(() => useCreateStation({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalledWith(result.current.error);
    });
  });

  describe('useUpdateStation hook', () => {
    it('should update station successfully', async () => {
      const { result } = renderHook(() => useUpdateStation(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        id: 'station-1',
        name: 'Updated Main Station',
        status: 'maintenance',
      };

      result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Updated Main Station');
      expect(result.current.data?.status).toBe('maintenance');
    });

    it('should handle update errors for non-existent station', async () => {
      const { result } = renderHook(() => useUpdateStation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 'non-existent', name: 'Test' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should invalidate queries after successful update', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: 0 },
          mutations: { retry: false },
        },
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useUpdateStation(), { wrapper });

      result.current.mutate({
        id: 'station-1',
        name: 'Updated Station',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith(['stations']);
    });
  });

  describe('useDeleteStation hook', () => {
    it('should delete station successfully', async () => {
      const { result } = renderHook(() => useDeleteStation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('station-1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle deletion errors for non-existent station', async () => {
      const { result } = renderHook(() => useDeleteStation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('non-existent');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should call onSuccess callback after deletion', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useDeleteStation({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('station-1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should invalidate queries after successful deletion', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: 0 },
          mutations: { retry: false },
        },
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useDeleteStation(), { wrapper });

      result.current.mutate('station-1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith(['stations']);
    });
  });

  describe('caching and optimization', () => {
    it('should cache query results', async () => {
      const apiSpy = vi.fn();
      server.use(
        rest.get('/api/stations', (req, res, ctx) => {
          apiSpy();
          return res(ctx.json(mockStations));
        })
      );

      const wrapper = createWrapper();

      // First hook instance
      const { result: result1 } = renderHook(() => useStations(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second hook instance should use cached data
      const { result: result2 } = renderHook(() => useStations(), { wrapper });
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Should only make one API call due to caching
      expect(apiSpy).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache after mutations', async () => {
      const wrapper = createWrapper();

      // Fetch initial data
      const { result: queryResult } = renderHook(() => useStations(), { wrapper });
      await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

      // Create new station
      const { result: mutationResult } = renderHook(() => useCreateStation(), { wrapper });
      mutationResult.current.mutate({
        name: 'New Station',
        address: '789 New Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
      });

      await waitFor(() => expect(mutationResult.current.isSuccess).toBe(true));

      // Query should be invalidated and refetched
      await waitFor(() => {
        expect(queryResult.current.isFetching).toBe(true);
      });
    });
  });
});
